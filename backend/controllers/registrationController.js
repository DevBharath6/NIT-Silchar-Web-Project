const RegistrationModel = require("../models/RegistrationModel");

const getRegistrationData = async (req, res) => {
  try {
    const data = await RegistrationModel.findOne(); // assuming only one document
    res.json(data || {}); 
  } catch (err) {
    console.error("❌ Failed to fetch registration data", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRegistrationData = async (req, res) => {
  try {
    const update = req.body;

    const data = await RegistrationModel.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    });

    res.json({ message: "Registration data updated", data });
  } catch (err) {
    console.error("Failed to update registration data", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRegistrationData, updateRegistrationData };
