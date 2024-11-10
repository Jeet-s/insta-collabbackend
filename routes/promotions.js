const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.post("rate_card", requireLogin, async (req, res) => {
    try {
      let rateCardData = req.body;
      const rateCard = await new RateCard(rateCardData).save();
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.put("rate_card", requireLogin, async (req, res) => {
    try {
      let rateCardData = req.body;
      const rateCard = await RateCard.findOneAndUpdate(
        { id: rateCardData.id },
        rateCardData
      );
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.get("rate_card/:id", requireLogin, async (req, res) => {
    try {
      let rateCardId = req.params.id;
      const rateCard = await RateCard.findOne({ id: rateCardId });
      res.send(rateCard);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
