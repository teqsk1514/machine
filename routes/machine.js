const express = require("express");
const router = express.Router();
const axios = require("axios");
const brain = require("brain.js");

const Machine = require("../model/Machine");

// @route   GET api/machine/test
// @desc    Tests machine route
// @access  Public
router.get("/test", (req, res, next) => {
  res.json({
    msg: "machine works"
  });
});

// @route   GET api/machine/train
// @desc    machine train  route
// @access  Public
router.get("/train", async (req, res, next) => {
  var net = new brain.NeuralNetwork();

  net.train([
    { input: [50, 1, 1], output: [0] },
    { input: [50, 1, 2], output: [0] },
    { input: [50, 1, 3], output: [1] },
    { input: [50, 1, 4], output: [1] },
    { input: [50, 1, 5], output: [1] },
    { input: [25, 1, 1], output: [1] },
    { input: [25, 1, 2], output: [1] },
    { input: [25, 1, 3], output: [0] },
    { input: [25, 1, 4], output: [0] },
    { input: [25, 1, 5], output: [0] }
  ]);

  var data = null;

  try {
    const response = await axios.get(
      "https://api.thingspeak.com/channels/738084/feeds.json?api_key=NIRWAFXN7ZGB86RQ&results=1"
    );

    data = response.data.feeds[0];

    // get all the required data
    const temperature = data.field1;
    const body_ph = data.field2;
    const food_ph = data.field3.split("\r")[0];

    var output = net.run([data.field1, 1, data.field3.split("\r")[0]]);

    const predicted_value = output[0];

    const machineData = {
      temperature,
      body_ph,
      food_ph,
      predicted_value
    };

    const machine = new Machine(machineData);
    const createdMachine = await machine.save();

    return res.json({
      status: "success",
      //   machineData
      createdMachine
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @route   GET api/machine/data
// @desc    machine train  route
// @access  Public
router.get("/data", async (req, res) => {
  try {
    const allData = await Machine.find();
    return res.json({
      status: "success",
      data: allData
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
