const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");

const RateCard = mongoose.model("RateCard");
module.exports = (app) => {
  // Create new rate card
  app.post("/rate_card", requireLogin, async (req, res) => {
    try {
      const rateCardData = req.body;
      console.log(rateCardData);
      const rateCard = await new RateCard(rateCardData).save();
      console.log(rateCard);
      res.send(rateCard);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

  // Update existing rate card
  app.put("/rate_card", requireLogin, async (req, res) => {
    try {
      const rateCardData = req.body;
      const rateCard = await RateCard.findOneAndUpdate(
        { _id: rateCardData._id }, // assuming `_id` is the unique identifier
        rateCardData,
        { new: true } // Return the updated document
      );
      if (!rateCard) {
        return res.status(404).send({ error: "Rate card not found" });
      }
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Retrieve rate card by ID
  app.get("/rate_card/:id", requireLogin, async (req, res) => {
    try {
      const rateCardId = req.params.id;
      const rateCard = await RateCard.findOne({ _id: rateCardId });
      if (!rateCard) {
        return res.status(404).send({ error: "Rate card not found" });
      }
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Delete rate card by ID
  app.delete("/rate_card/:id", requireLogin, async (req, res) => {
    try {
      const rateCardId = req.params.id;
      const rateCard = await RateCard.findByIdAndDelete(rateCardId);
      if (!rateCard) {
        return res.status(404).send({ error: "Rate card not found" });
      }
      res.send({ message: "Rate card deleted successfully" });
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
