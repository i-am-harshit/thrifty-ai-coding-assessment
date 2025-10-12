import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || ``;

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server started on port ${process.env.PORT || 8080}`);
    })
  )
  .catch((err) => console.error("Failed to connect to MongoDB", err));
