const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
});

const paragraphSchema = new mongoose.Schema({
  order: { type: Number, default: 1 },
  text: { type: String, required: true },
  bullets: [{ type: String }],
  links: [linkSchema],
  buttonText: { type: String },
  buttonLink: { type: String }, 
  imageUrl: { type: String },
  imagePublicId: { type: String }
});

const paperSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    order: { type: Number, default: 1 },
    paragraphs: [paragraphSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaperSection", paperSectionSchema);