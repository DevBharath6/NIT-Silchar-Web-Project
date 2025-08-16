const express = require("express");
const multer = require("multer");
const CarouselItem = require("../models/CarouselItem");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image file is required" });

    const stream = cloudinary.uploader.upload_stream(
      { folder: "carousel" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Cloudinary upload failed", details: error });

        const newItem = new CarouselItem({
          title: req.body.title?.trim(),
          description: req.body.description?.trim() || "",
          link: req.body.link?.trim() || "",
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        });

        const saved = await newItem.save();
        res.status(201).json(saved);
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await CarouselItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await CarouselItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.title = req.body.title?.trim() || item.title;
    item.description = req.body.description?.trim() || item.description;
    item.link = req.body.link?.trim() || item.link;

    if (req.file) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }

      const stream = cloudinary.uploader.upload_stream(
        { folder: "carousel" },
        async (error, result) => {
          if (error) return res.status(500).json({ error: "Image upload failed", details: error });

          item.imageUrl = result.secure_url;
          item.imagePublicId = result.public_id;

          const saved = await item.save();
          res.json(saved);
        }
      );

      stream.end(req.file.buffer);
    } else {
      const saved = await item.save();
      res.json(saved);
    }
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await CarouselItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

module.exports = router;
