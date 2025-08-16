const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    logo: {
      url: { type: String, default: "" },        
      publicId: { type: String, default: "" },   
      textPrimary: { type: String, default: "" }, 
      textSecondary: { type: String, default: "" } 
    },

    description: { type: String, default: "" },

    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },

    
    contactEmail: { type: String, default: "" },
    copyright: { type: String, default: "" }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Footer", footerSchema);
