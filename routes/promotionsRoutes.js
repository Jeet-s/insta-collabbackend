const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const RateCard = mongoose.model("RateCard");

module.exports = (app) => {
  // Create new rate card
  app.post("/rate_card", requireLogin, async (req, res) => {
    try {
      const { type, rate, description } = req.body;
      // Ensure the user is passed in the rate card creation
      const userId = req.user._id; // Corrected to use `_id`

      const rateCard = new RateCard({
        type,
        rate,
        description,
        user: userId, // Associate rate card with the logged-in user
      });

      await rateCard.save();
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Update an existing rate card
  app.put("/rate_card", requireLogin, async (req, res) => {
    try {
      const { _id, type, rate, description } = req.body;
      const userId = req.user._id; // Corrected to use `_id`

      const rateCard = await RateCard.findOneAndUpdate(
        { _id, user: userId }, // Make sure we update only the user's rate card
        { type, rate, description },
        { new: true } // Return the updated document
      );

      if (!rateCard) {
        return res
          .status(404)
          .send({ error: "Rate card not found or you are not authorized" });
      }

      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Retrieve all rate cards for the logged-in user
  app.get("/rate_card/all", requireLogin, async (req, res) => {
    try {
      const userId = req.user._id; // Corrected to use `_id`

      // Find all rate cards for the logged-in user
      const rateCards = await RateCard.find({ user: userId });

      if (!rateCards || rateCards.length === 0) {
        return res
          .status(404)
          .send({ error: "No rate cards found for this user" });
      }

      res.send(rateCards);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // Retrieve a single rate card by ID for the logged-in user
  app.get("/rate_card/:id", requireLogin, async (req, res) => {
    try {
      const rateCardId = req.params.id;
      const userId = req.user._id; // Corrected to use `_id`

      // Find the rate card by ID and ensure it belongs to the logged-in user
      const rateCard = await RateCard.findOne({
        _id: rateCardId,
        user: userId,
      });

      if (!rateCard) {
        return res
          .status(404)
          .send({ error: "Rate card not found or you are not authorized" });
      }

      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
