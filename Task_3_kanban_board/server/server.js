const mongoose = require("mongoose");
const app = require("./app");

const MONGO_URI = process.env.MONGO_URI || ``;

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server started on port ${process.env.PORT || 8080}`);
    })
  )
  .catch((err) => console.error("Failed to connect to MongoDB", err));
