const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    link: { type: String, default: "" },
    linkText: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", faqSchema);
