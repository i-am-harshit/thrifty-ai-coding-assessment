#!/usr/bin/env node
/*
  Migration: populate missing `username` for existing users.
  Usage:
    node scripts/migrate-add-username.js --dry-run
    DRY RUN prints what would change without writing.

  Make sure you have a backup before running against production.
*/

const mongoose = require("mongoose");
const User = require("../models/user");
const arg = require("arg");

async function runMigration({
  dryRun = false,
  limit = 0,
  mongoUri,
  skipConnect = false,
} = {}) {
  // Allow passing in options for testability
  const cliMongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  mongoUri = mongoUri || cliMongoUri;
  if (!mongoUri && !skipConnect) throw new Error("MONGO_URI is required");

  if (!skipConnect) {
    console.log(`Connecting to ${mongoUri} ...`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    const query = {
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: "" },
      ],
    };
    const docs = await User.find(query);

    let count = 0;
    for (const doc of docs) {
      if (limit && count >= limit) break;
      const email = (doc.email || "").toLowerCase();
      let base = email.split("@")[0] || `user${doc._id.toString().slice(-6)}`;
      // sanitize: allow only alphanumerics, dash, underscore
      base = base.replace(/[^a-z0-9_-]/gi, "").toLowerCase();
      if (!base) base = `user${doc._id.toString().slice(-6)}`;

      let candidate = base;
      let suffix = 0;
      // ensure uniqueness
      while (await User.exists({ username: candidate })) {
        suffix += 1;
        candidate = `${base}${suffix}`;
      }

      console.log(
        `${dryRun ? "[dry-run]" : "[update]"} ${
          doc._id
        } -> username: ${candidate}`
      );
      if (!dryRun) {
        // Use updateOne to avoid depending on mongoose document save behavior in tests
        await User.updateOne(
          { _id: doc._id },
          { $set: { username: candidate } }
        );
      }
      count += 1;
    }

    console.log(`Processed ${count} user(s).`);
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

// CLI entrypoint
async function main() {
  const args = arg({
    "--dry-run": Boolean,
    "--limit": Number,
  });
  const dryRun = !!args["--dry-run"];
  const limit = args["--limit"] || 0;
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  try {
    await runMigration({ dryRun, limit, mongoUri });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigration };
