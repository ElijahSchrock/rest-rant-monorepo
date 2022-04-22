// Modules and Globals
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const defineCurrentUser = require("./middleware/defineCurrentUser");

// Express Settings
app.use(
  cookieSession({
    name: "session",
    // sameSite: "strict", //used to prevent Cross-Site Request Forgery || keeps the browser from automatically attaching cookies to requests from other sources || 'phish'
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 Hours
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(defineCurrentUser);

// Controllers & Routes

app.use(express.urlencoded({ extended: true }));

app.use("/places", require("./controllers/places"));
app.use("/users", require("./controllers/users"));

app.use("/places", require("./controllers/places"));
app.use("/users", require("./controllers/users"));
app.use("/authentication", require("./controllers/authentication"));

// Listen for Connections
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
