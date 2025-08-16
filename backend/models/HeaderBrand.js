const mongoose = require("mongoose");

const IconSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const HeaderBrandSchema = new mongoose.Schema({
  titlePrimary: { type: String, required: true },
  titleSecondary: { type: String, required: true },
  icons: [IconSchema]
});

module.exports = mongoose.model("HeaderBrand", HeaderBrandSchema);
