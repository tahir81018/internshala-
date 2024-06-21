const mongoose = require("mongoose");
require("dotenv").config();
const url =
  "mongodb+srv://admin:admin@cluster0.j7lxibh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
module.exports.connect = () => {
  try {
    mongoose.connect(url, console.log("Database is connected"));
  } catch (err) {
    console.error(err);
    console.log("Unable to connect with database");
  }
};
