const express = require("express");
const Test = require("../models/Test");
const TestGroup = require("../models/TestGroup");

const router = express.Router();

// Get all tests
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find().populate("scenarios");
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a test
router.post("/", async (req, res) => {
  try {
    const { testGroupId, testData } = req.body;
    const newTest = new Test(testData);
    const savedTest = await newTest.save();

    // Update the TestGroup
    const testGroup = await TestGroup.findById(testGroupId);
    testGroup.tests.push(savedTest._id);
    await testGroup.save();

    res.status(201).json(savedTest);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating test", error: err.message });
  }
});

// Update a test
router.patch("/:id", async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a test
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the test
    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update the TestGroup
    const testGroup = await TestGroup.findOne({ tests: id });
    if (testGroup) {
      testGroup.tests.pull(id);
      await testGroup.save();
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting test", error: err.message });
  }
});

module.exports = router;
