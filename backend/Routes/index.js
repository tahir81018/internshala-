const express = require("express");
const router = express.Router();
const ApplicationRoute = require("./ApplicationRoute");
const intern = require("./internshipRout");
const job = require("./jobRoute");
const admin = require("./admin");
const auth = require("./auth");
const subscription = require("./subscription");
const resume = require("./resume");
const mail = require("./mail");
const cors = require("cors");

router.get("/", (req, res) => {
  res.send("the is backend");
});
router.use(cors());
router.use("/application", ApplicationRoute);
router.use("/internship", intern);
router.use("/job", job);
router.use("/admin", admin);
router.use("/auth", auth);
router.use("/subscription", subscription);
router.use("/resume", resume);
router.use("/mail", mail);

module.exports = router;
