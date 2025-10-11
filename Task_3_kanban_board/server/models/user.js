const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  // Some deployments may have an existing unique index on `username`.
  // Persist a username to avoid duplicate-null unique index errors.
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
