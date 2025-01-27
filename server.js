const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION.Shutting down.....");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful");
});

const app = require("./app");
const PORT = 3000 || process.env.PORT;

console.log(`Environment : ${app.get("env")}`);

//START SERVER

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION.Shutting down.....");
  server.close(() => {
    process.exit(1);
  });
});
