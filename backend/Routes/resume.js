const express = require("express");
const User = require("../Model/User");
const router = express.Router();
var jwt = require("jsonwebtoken");
const upload = require("../utils/upload");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Model/Payment");
const { createInvoice } = require("../utils/invoice");

// const upload = multer({ dest: "uploads/" });

router.post("/save", upload.single("image"), async (req, res) => {
  let { resumePayload } = req.body;
  resumePayload = JSON.parse(resumePayload);

  const { access_token } = req.cookies;
  const jwtPayload = jwt.verify(access_token, process.env.SECRETE);

  const user = await User.findByIdAndUpdate(
    jwtPayload._id,
    { resume: resumePayload },
    { new: true }
  );
  res.send({ user: user, success: true, message: "Resume Created" });
});

router.post("/check-out", async (req, res) => {
  const { amount, currency } = req.body;
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

    const newPayment = new Payment({
      orderId: response.id,
      amount: response.amount / 100,
      currency: response.currency,
      subscription: null,
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
      message: "Unable to initiate your payment. Please try again!",
    });
  }
});

router.post("/varification", upload.single("image"), async (req, res) => {
  let { razorpayResponse, resumePayload } = req.body;
  resumePayload = JSON.parse(resumePayload);
  razorpayResponse = JSON.parse(razorpayResponse);

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    razorpayResponse;

  const { access_token } = req.cookies;
  const jwtPayload = jwt.verify(access_token, process.env.SECRETE);

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
      jwtPayload._id,
      { resume: resumePayload },
      { new: true }
    );

    const now = Date.now();
    const path = `${__dirname}/../public/invoices${now}.pdf`;
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

    res.send({
      success: true,
      message: "Payment Success. Your resume has been created",
    });
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

    res.send({
      success: false,
      message: "Payment Failed. Your resume has not been created",
    });
  }
});

module.exports = router;
