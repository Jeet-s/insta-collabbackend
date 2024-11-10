const mongoose = require("mongoose");
const { Schema } = mongoose;

const rateCardSchema = new Schema({
  type: {
    type: String,
    enum: ["story", "reel", "post"],
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

mongoose.model("RateCard", rateCardSchema);
