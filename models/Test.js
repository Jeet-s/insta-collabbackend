const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  variables: {
    type: [String],
  },
  models: {
    type: [String],
    enum: ["gpt4o", "gpt3.5", "llama"],
    required: true,
  },
  scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }],
});

module.exports = mongoose.model("Test", testSchema);
