const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MachineSchema = new Schema(
  {
    temperature: { type: Number },
    body_ph: { type: Number },
    food_ph: { type: Number },
    predicted_value: { type: Number }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("machine", MachineSchema);
