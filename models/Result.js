const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  response: { type: String, required: true },
  latency: { type: Number, required: true },
  model: { type: String, enum: ["gpt4o", "gpt3.5", "llama"], required: true },
  cost: { type: Number, required: true },
});

module.exports = mongoose.model("Result", resultSchema);
