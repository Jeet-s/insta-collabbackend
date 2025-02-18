const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  variable_values: {
    type: Map,
    of: String, // This defines each value in the map as a string
    required: true,
  },
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
});

module.exports = mongoose.model("Scenario", scenarioSchema);
