const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  email: String,
  password: String,
  picture: String,
  emailVarified: Boolean,
  resume: Object,
  otp: {
    code: String,
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  subscription: {
    plan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },
    price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    expireAt: { type: Date, default: Date.now() + 30 * 24 * 3600 * 1000 },
    appLeft: { type: Number, default: 1 },
  },
});

module.exports = mongoose.model("User", userSchema);
