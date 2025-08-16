const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, required: true, min: 1 },
  visible: { type: Boolean, default: true },
});

const NavbarElementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, required: true, min: 1 },
  visible: { type: Boolean, default: true },
  children: [ChildSchema],
});

module.exports = mongoose.model('NavbarElement', NavbarElementSchema);
