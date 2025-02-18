const express = require("express");
const TestGroup = require("../models/TestGroup");

const router = express.Router();

// Get all test groups
router.get("/", async (req, res) => {
  console.log("GET TEST GROUP");
  try {
    const testGroups = await TestGroup.find().populate({
      path: "tests",
      populate: {
        path: "scenarios",
        populate: {
          path: "results",
        },
      },
    });

    res.json(testGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create a test group
router.post("/", async (req, res) => {
  try {
    const testGroup = new TestGroup(req.body);
    await testGroup.save();
    res.status(201).json(testGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a test group
router.patch("/:id", async (req, res) => {
  try {
    const updatedTestGroup = await TestGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedTestGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a test group
router.delete("/:id", async (req, res) => {
  try {
    await TestGroup.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
