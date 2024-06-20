const mongoose = require("mongoose");
require("dotenv").config();
DATABASE = process.env.DATABASEURL;
const url = DATABASE;
module.exports.connect = () => {
  try {
    mongoose.connect(url, console.log("Database is connected"));
  } catch (err) {
    console.error(err);
    console.log("Unable to connect with database");
  }
};
