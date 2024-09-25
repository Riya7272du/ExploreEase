const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./../../Models/tours");
const Review = require("./../../Models/reviewModel");
const User = require("./../../Models/users");

dotenv.config({ path: "./config.env" });

const DB = process.env.Mongo_url;

mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful");
});
//READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

//IMPORT DATA TO THE DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log("Data Successfully loaded");
  } catch (err) {
    console.log(err);
  }
};

//DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
};

deleteData().then(() => importData().then(() => process.exit()));
