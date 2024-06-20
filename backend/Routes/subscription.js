const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Model/Payment");
const router = express.Router();
var jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { createInvoice } = require("../utils/invoice");
const { sendInvoice } = require("../utils/mailer");

router.post("/check-out", async (req, res) => {
  const { amount, currency, plan } = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRETE,
  });

  const options = {
    amount: amount * 100,
    currency: currency,
  };

  try {
    const response = await razorpay.orders.create(options);

    let subscription;
    if (plan === "bronze") {
      subscription = {
        plan: plan,
        price: amount,
        currency: currency,
        appLeft: 3,
      };
    } else if (plan === "silver") {
      subscription = {
        plan: plan,
        price: amount,
        currency: currency,
        appLeft: 5,
      };
    } else if (plan === "gold") {
      subscription = {
        plan: plan,
        price: amount,
        currency: currency,
        appLeft: 1000000,
      };
    } else {
      subscription = {
        plan: plan,
        price: amount,
        currency: currency,
        appLeft: 1,
      };
    }

    const newPayment = new Payment({
      orderId: response.id,
      amount: response.amount / 100,
      currency: response.currency,
      subscription: subscription,
    });

    await newPayment.save();

    res.send({
      paymentDetails: {
        orderId: response.id,
        currency: response.currency,
        amount: response.amount,
      },
      success: true,
      message: "Payment initiated",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Unable initiate your payment. Please try again!",
    });
  }
});

router.post("/varification", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const decodedUser = jwt.verify(accessToken, process.env.SECRETE);

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRETE)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature == razorpay_signature) {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
      },
      {
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "success",
        createAt: Date.now(),
      },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      decodedUser._id,
      {
        subscription: updatedPayment.subscription,
      },
      { new: true }
    );
    const now = Date.now();
    const path = `${__dirname}/../public/invoices/${now}.pdf`;
    const invoice = {
      invoiceNum: Date.now(),
      paid: updatedPayment.amount,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
    createInvoice(invoice, path);

    const invoiceFile = {
      filename: `${now}.pdf`,
      path: path,
    };
    sendInvoice(user.email, invoiceFile);

    res.send({ success: true, message: "Payment Success" });
  } else {
    Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
      },
      {
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "failed",
        createAt: Date.now(),
      }
    );

    res.status(400).send({ success: false, message: "Payment Failed" });
  }
});

module.exports = router;
