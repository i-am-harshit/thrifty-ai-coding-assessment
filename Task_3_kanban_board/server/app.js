const express = require("express");
const helmet = require("helmet");
const app = express();

const boardRoutes = require("./routes/board");
const listRoutes = require("./routes/list");
const cardRoutes = require("./routes/card");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");
const setHeaders = require("./middleware/headers");
const sendErrorResponse = require("./controllers/error");

// Express middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(setHeaders);

// Routes
app.use("/auth", authRoutes);
app.use("/board", boardRoutes);
app.use("/list", listRoutes);
app.use("/card", cardRoutes);

// Error handler
app.use(sendErrorResponse);

// Export app so tests can import without starting the server or connecting to DB
module.exports = app;
