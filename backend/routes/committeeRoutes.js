const express = require("express");
const Committee = require("../models/Committee.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCommittee = new Committee(req.body);
    const savedCommittee = await newCommittee.save();
    res.status(201).json(savedCommittee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const committees = await Committee.find();
    res.json(committees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) return res.status(404).json({ message: "Committee section not found" });
    res.json(committee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCommittee = await Committee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCommittee) return res.status(404).json({ message: "Committee section not found" });
    res.json(updatedCommittee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Committee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Committee section not found" });
    res.json({ message: "Committee section deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports =  router;
