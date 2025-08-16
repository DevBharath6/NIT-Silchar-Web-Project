const mongoose = require("mongoose");
const importantDateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, default: "" },
    dateRange: [{ type: String }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("ImportantDate", importantDateSchema);
