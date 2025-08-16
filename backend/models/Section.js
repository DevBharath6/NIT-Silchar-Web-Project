const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
});

const buttonSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
});

const paragraphSchema = new mongoose.Schema({
  order: { type: Number, default: 0 },
  text: { type: String, required: true },
  bullets: [{ type: String }],
  links: [linkSchema],
  buttons: [buttonSchema],
  imageUrl: { type: String },        
  imagePublicId: { type: String }    
});

const sectionSchema = new mongoose.Schema(
  {
    page: { type: String, required: true },  
    title: { type: String, required: true },
    subtitle: { type: String },
    order: { type: Number, default: 0 }, 
    paragraphs: [paragraphSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
