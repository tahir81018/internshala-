const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  orderId: String,
  amount: Number,
  currency: String,
  paymentId: String,
  razorpaySignature: String,
  paymentStatus: {
    type: String,
    enum: ["initiated", "pending", "success", "failed"],
    default: "initiated",
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

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
