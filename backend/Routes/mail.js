const express = require("express");
const user = require("../Model/User");
const sendOtp = require("../utils/mailer");
const router = express.Router();
var jwt = require("jsonwebtoken");

router.get("/send-otp", async (req, res) => {
  const { access_token } = req.cookies;
  const jwtPayload = jwt.verify(access_token, process.env.SECRETE);

  const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  // const updatedUser = await user.findByIdAndUpdate(
  //   jwtPayload._id,
  //   { otp: { code: otp.toString } },
  //   { new: true }
  // );
  await sendOtp(otp, jwtPayload.email);
  res.send({
    success: true,
    message: "OTP has been sent to registered mail",
    otp: otp,
  });
});

module.exports = router;
