const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const cookieParser = require("cookie-parser");
const port = 5000;

// const corsOptions = {
//   origin: process.env.CLIENT_BASE_URL,
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// app.use((req, res, next) => {
//   req.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello This is My backend");
});

connect();

app.listen(port, () => {
  console.log("server is running on port " + port);
});
