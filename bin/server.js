const app = require("../app");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const { DB_HOST } = process.env;

const mongoose = require("mongoose");

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connection error");
    process.exit(1);
  });
