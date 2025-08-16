const mongoose = require("mongoose");

const SpeakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    blog: {
      type: String,
      trim: true,
      default: "",
    },
    blogVisible: {
      type: Boolean,
      default: true,
    },


    imageUrl: {
      type: String,
      required: true, 
    },
    imagePublicId: {
      type: String,
      default: null,
    },

    order: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Speaker", SpeakerSchema);
