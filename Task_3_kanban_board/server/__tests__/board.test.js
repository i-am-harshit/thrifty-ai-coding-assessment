const request = require("supertest");
const app = require("../app");
const mockingoose = require("mockingoose");
const User = require("../models/user");
const Board = require("../models/board");
const jwt = require("jsonwebtoken");

describe("Board API", () => {
  let token;
  let userId;

  beforeEach(() => {
    mockingoose.resetAll();
    const userIdStr = "507f1f77bcf86cd799439013";
    const userDoc = {
      _id: userIdStr,
      email: "board@example.com",
      firstName: "Board",
    };
    mockingoose(User).toReturn(userDoc, "save");
    mockingoose(User).toReturn(userDoc, "findOne");
    mockingoose(Board).toReturn(
      { _id: "507f1f77bcf86cd799439014", title: "New Board" },
      "save"
    );
    userId = userIdStr;
    token = jwt.sign(
      { email: "board@example.com", userId: userIdStr },
      "secret",
      {
        expiresIn: "1h",
      }
    );
  });

  it("should create a new board when authenticated", async () => {
    const res = await request(app)
      .post("/board/")
      .set("Authorization", `Bearer ${token}`)
      .send({ boardTitle: "New Board" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id");
  });

  it("should not allow creating board without token", async () => {
    const res = await request(app).post("/board/").send({ boardTitle: "X" });
    expect(res.statusCode).toBe(401);
  });
});
