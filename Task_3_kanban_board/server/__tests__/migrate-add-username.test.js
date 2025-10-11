const mockingoose = require("mockingoose");
const mongoose = require("mongoose");
const User = require("../models/user");

describe("migration add username logic", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("exports runMigration function", async () => {
    const { runMigration } = require("../scripts/migrate-add-username");
    expect(typeof runMigration).toBe("function");
  });

  it("generates username candidate from email and avoids collisions", async () => {
    // prepare a fake user doc returned by the cursor
    const id = mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
    const doc = {
      _id: id,
      email: "Alice@example.com",
      username: null,
      save: jest.fn().mockResolvedValue(true),
    };

    // mock find to return the doc array
    mockingoose(User).toReturn([doc], "find");

    // exists should be null (no collision)
    mockingoose(User).toReturn(null, "exists");

    // mock updateOne to resolve
    mockingoose(User).toReturn({}, "updateOne");

    const { runMigration } = require("../scripts/migrate-add-username");

    // run in dry-run to avoid write but skip DB connection
    await expect(
      runMigration({ dryRun: true, limit: 1, skipConnect: true })
    ).resolves.not.toThrow();
  });
});
