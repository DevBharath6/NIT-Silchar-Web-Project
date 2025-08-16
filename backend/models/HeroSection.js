const mongoose = require("mongoose");

const HeroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    backgroundImageUrl: { type: String, default: "" },
    backgroundImagePublicId: { type: String, default: "" },

    heroImageUrl: { type: String, default: "" },
    heroImagePublicId: { type: String, default: "" },

    primaryButton: {
      text: { type: String, default: "Submit Paper" },
      link: { type: String, default: "" },
    },

    secondaryButton: {
      text: { type: String, default: "Conference Brochure" },
      pdfUrl: { type: String, default: "" },        
      pdfPublicId: { type: String, default: "" },   
      pdfOriginalName: { type: String, default: "" } 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSection", HeroSectionSchema);
