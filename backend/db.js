const mongoose = require("mongoose");
require("dotenv").config();
module.exports.connect = () => {
  try {
    mongoose.connect(
      process.env.DATABASEURL,
      console.log("Database is connected")
    );
  } catch (err) {
    console.error(err);
    console.log("Unable to connect with database");
  }
};
