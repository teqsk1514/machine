const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const machineRoute = require("./routes/machine");

// Set up the express app
const app = express();
// Log requests to the console.
app.use(logger("dev"));
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// require the database config.
const db = require("./config/keys").MONGO_URI;
// checking the routes
app.get("/", (req, res, next) => {
  res.json({ msg: "Hello" });
});


// use routes
app.use("/api/machine", machineRoute);

// initialoze the port.
const PORT = process.env.PORT || 5000;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to mongoDB cluster");
    app.listen(PORT, () => {
      console.log(`The server is Running on ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
