const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  fees: [
    {
      category: { type: String, required: true },
      fee: { type: String, required: true }
    }
  ],
  guidelines: [String],
  importantNote: String,
  payment: {
    indianAuthorsLink: String,
    foreignAuthors: {
      accountName: String,
      bank: String,
      address: String,
      accountNo: String,
      ifsc: String,
      micr: String,
      adCode: String,
      branch: String,
      swiftCode: String
    }
  },
  steps: [String],
  googleFormLink: String,
  googleFormNote: String
});

module.exports = mongoose.model("RegistrationModel", registrationSchema);
