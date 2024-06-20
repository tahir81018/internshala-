const express = require("express");
const user = require("../Model/User");
var jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/google-login", async (req, res) => {
  const { email, given_name, family_name, picture, email_varified } = req.body;
  const googleUser = await user.findOne({ email: email }).exec();
  if (googleUser !== null) {
    const token = jwt.sign(googleUser.toObject(), process.env.SECRETE);
    res.cookie("access_token", token);
    res.send({ accessToken: token, success: true, message: "Login Success" });
  } else {
    const newUser = new user({
      firstName: given_name,
      lastName: family_name,
      email: email,
      picture: picture,
      emailVarified: email_varified,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(savedUser.toObject(), process.env.SECRETE);
    res.cookie("access_token", token);
    res.send({ accessToken: token, success: true, message: "Login Success" });
  }
});

router.post("/mobile-login", async (req, res) => {
  const { mobile, password } = req.body;
  const mobileUser = await user
    .findOne({ mobile: mobile, password: password })
    .exec();
  if (mobileUser !== null) {
    const token = jwt.sign(mobileUser.toObject(), process.env.SECRETE);
    res.cookie("access_token", token);
    res.send({ accessToken: token, success: true, message: "Login Success" });
  } else {
    res
      .status(400)
      .send({ success: false, message: "Wrong credentials. Please try again" });
  }
});

router.post("/register", async (req, res) => {
  const { mobile, password, firstName, lastName } = req.body;
  const regex = "^[7-9][0-9]{9}$";
  if (!mobile.match(regex)) {
    res
      .status(400)
      .send({ success: false, message: "Mobile number is not valid" });
    return;
  }
  if (password.length < 6) {
    res.status(400).send({ success: false, message: "Password is too short" });
    return;
  }
  const mobileUser = await user.findOne({ mobile: mobile }).exec();
  if (mobileUser !== null) {
    res.status(400).send({
      success: false,
      message: "You have already registered, Please login",
    });
    return;
  }

  const newUser = new user({
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    password: password,
  });
  const savedUser = await newUser.save();
  const token = jwt.sign(savedUser.toObject(), process.env.SECRETE);
  res.cookie("access_token", token);
  res.send({
    accessToken: token,
    success: true,
    message: "Registered Success",
  });
});

router.post("/access", async (req, res) => {
  const { accessToken } = req.body;
  const decodedUser = jwt.verify(accessToken, process.env.SECRETE);
  const dbUser = await user.findById(decodedUser._id).exec();
  const newToken = jwt.sign(dbUser.toObject(), process.env.SECRETE);
  res.cookie("access_token", newToken);
  res.send({ user: dbUser, success: true, message: "Access Granted" });
});

module.exports = router;
