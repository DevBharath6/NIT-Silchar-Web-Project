const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Speaker = require("../models/Speaker");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ order: 1 });
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch speakers", details: err.message });
  }
});

const getNextOrderNumber = async () => {
  const lastSpeaker = await Speaker.findOne().sort({ order: -1 }); // highest order
  return lastSpeaker ? lastSpeaker.order + 1 : 1;
};

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, title, bio, blog, blogVisible, order } = req.body;

    if (!name || !title || !bio) {
      return res.status(400).json({ error: "Name, title & bio are required" });
    }
    let speakerOrder = parseInt(order);
    if (speakerOrder) {
      const exists = await Speaker.findOne({ order: speakerOrder });
      if (exists) return res.status(400).json({ error: `Order ${speakerOrder} already exists!` });
    } else {
      speakerOrder = await getNextOrderNumber();
    }

    let imageUrl = "/default.jpg";
    let imagePublicId = null;

    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "speakers" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }).end(req.file.buffer);
      });

      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const newSpeaker = new Speaker({
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      blog: blog?.trim() || "",
      blogVisible: blogVisible !== undefined ? blogVisible : true,
      order: speakerOrder,
      imageUrl,
      imagePublicId
    });

    const saved = await newSpeaker.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create speaker", details: err.message });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, title, bio, blog, blogVisible, order } = req.body;

    let speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ error: "Speaker not found" });

    if (order !== undefined) {
      const existing = await Speaker.findOne({ order, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ error: `Order ${order} is already taken!` });
      }
      speaker.order = parseInt(order);
    }

    if (name !== undefined) speaker.name = name.trim();
    if (title !== undefined) speaker.title = title.trim();
    if (bio !== undefined) speaker.bio = bio.trim();
    if (blog !== undefined) speaker.blog = blog.trim();
    if (blogVisible !== undefined) speaker.blogVisible = blogVisible;

    if (req.file) {
      if (speaker.imagePublicId) {
        await cloudinary.uploader.destroy(speaker.imagePublicId);
      }

      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "speakers" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }).end(req.file.buffer);
      });

      speaker.imageUrl = uploaded.secure_url;
      speaker.imagePublicId = uploaded.public_id;
    }

    const updated = await speaker.save();
    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update speaker", details: err.message });
  }
});

router.patch("/:id/toggle-blog", async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ error: "Speaker not found" });

    speaker.blogVisible = !speaker.blogVisible;
    await speaker.save();

    res.json({ message: `Blog visibility set to ${speaker.blogVisible}`, speaker });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle blog visibility", details: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ error: "Speaker not found" });
    if (speaker.imagePublicId) {
      await cloudinary.uploader.destroy(speaker.imagePublicId);
    }

    await speaker.deleteOne();
    res.json({ message: "Speaker deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete speaker", details: err.message });
  }
});

module.exports = router;
