const express = require("express");
const router = express.Router();
const application = require("../Model/Application");
var jwt = require("jsonwebtoken");
const User = require("../Model/User");

router.post("/", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const decodedUser = jwt.verify(accessToken, process.env.SECRETE);

  const applicationData = new application({
    coverLetter: req.body.coverLetter,
    user: req.body.user,
    company: req.body.company,
    category: req.body.category,
    body: req.body.body,
    ApplicationId: req.body.ApplicationId,
  });

  try {
    const savedApplication = await applicationData.save();
    const dbUser = await User.findById(decodedUser._id);
    const updatedUser = await User.findByIdAndUpdate(decodedUser._id, {
      subscription: {
        ...dbUser.subscription,
        appLeft: dbUser.subscription.appLeft - 1,
      },
    });
    res.send({
      success: true,
      message: "Applied successfully",
      savedApplication,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Unable to complete your application" });
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await application.find();
    res.json(data).status(200);
  } catch (error) {
    console.log(err);
    res.status(404).json({ error: "Internal server error " });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await application.findById(id);
    if (!data) {
      res.status(404).json({ error: "Application is not found " });
    }
    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Internal server error " });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  let status;

  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    res.status(400).json({ error: "Invalid action" });
    return;
  }

  try {
    const updateApplication = await application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updateApplication) {
      res.status(404).json({ error: "Not able to update the application" });
      return;
    }

    res.status(200).json({ success: true, data: updateApplication });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
