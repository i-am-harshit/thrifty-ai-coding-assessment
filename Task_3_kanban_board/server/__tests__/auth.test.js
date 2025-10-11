const request = require("supertest");
const app = require("../app");
const mockingoose = require("mockingoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

describe("Auth API", () => {
  beforeEach(() => mockingoose.resetAll());

  it("should signup a new user and return userId", async () => {
    // mock that findOne returns null (no existing user) and save returns a user doc
    mockingoose(User).toReturn(null, "findOne");
    mockingoose(User).toReturn(
      { _id: "507f1f77bcf86cd799439011", firstName: "Test" },
      "save"
    );

    const res = await request(app).post("/auth/signup").send({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      username: "test_user",
      password: "secret",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  it("should login with correct credentials and receive a token", async () => {
    const hashed = await bcrypt.hash("mypassword", 12);
    const userDoc = {
      _id: "507f1f77bcf86cd799439012",
      email: "login@example.com",
      firstName: "Login",
      password: hashed,
    };
    mockingoose(User).toReturn(userDoc, "findOne");

    const res = await request(app).post("/auth/login").send({
      email: "login@example.com",
      password: "mypassword",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });
});
