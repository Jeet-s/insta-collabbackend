const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

// Get all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a result
router.post("/", async (req, res) => {
  try {
    const { scenarioId, ...resultData } = req.body;
    const newResult = new Result(resultData);
    const savedResult = await newResult.save();

    // Update the Scenario
    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }
    scenario.results.push(savedResult._id);
    await scenario.save();

    res.status(201).json(savedResult);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating result", error: err.message });
  }
});

// Update a result
router.patch("/:id", async (req, res) => {
  try {
    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a result
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the result
    const deletedResult = await Result.findByIdAndDelete(id);
    if (!deletedResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Update the Scenario
    const scenario = await Scenario.findOne({ results: id });
    if (scenario) {
      scenario.results.pull(id);
      await scenario.save();
    }

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting result", error: err.message });
  }
});

module.exports = router;
