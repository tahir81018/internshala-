const multer = require("multer");
var jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const { access_token } = req.cookies;
    const jwtPayload = jwt.verify(access_token, process.env.SECRETE);

    cb(null, jwtPayload._id + ".jpg");
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
