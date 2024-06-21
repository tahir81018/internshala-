const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DATABASEURL;
module.exports.connect = () => {
  try {
    mongoose.connect(url, console.log("Database is connected"));
  } catch (err) {
    console.error(err);
    console.log("Unable to connect with database");
  }
};
