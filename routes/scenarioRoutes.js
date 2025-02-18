const express = require("express");
const Scenario = require("../models/Scenario");
const Test = require("../models/Test");

const router = express.Router();

// Get all scenarios
router.get("/", async (req, res) => {
  try {
    const scenarios = await Scenario.find().populate("results");
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a scenario
router.post("/", async (req, res) => {
  try {
    const { testId, scenarioData } = req.body;
    const newScenario = new Scenario(scenarioData);
    const savedScenario = await newScenario.save();

    // Update the Test
    const test = await Test.findById(testId);
    test.scenarios.push(savedScenario._id);
    await test.save();

    res.status(201).json(savedScenario);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating scenario", error: err.message });
  }
});

// Update a scenario
router.patch("/:id", async (req, res) => {
  try {
    const updatedScenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedScenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a scenario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the scenario
    const deletedScenario = await Scenario.findByIdAndDelete(id);

    if (!deletedScenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    // Update the Test
    const test = await Test.findOne({ scenarios: id });
    if (test) {
      test.scenarios.pull(id);
      await test.save();
    }

    res.status(200).json({ message: "Scenario deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting scenario", error: err.message });
  }
});

module.exports = router;
