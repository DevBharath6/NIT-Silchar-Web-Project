const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const HeaderBrand = require("../models/HeaderBrand");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const getSingleton = async () => {
  let brand = await HeaderBrand.findOne();
  if (!brand) {
    brand = new HeaderBrand();
    await brand.save();
  }
  return brand;
};

router.get("/", async (req, res) => {
  try {
    const brand = await getSingleton();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch header brand", details: err.message });
  }
});

router.put("/titles", async (req, res) => {
  try {
    const brand = await getSingleton();
    brand.titlePrimary = req.body.titlePrimary || brand.titlePrimary;
    brand.titleSecondary = req.body.titleSecondary || brand.titleSecondary;
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update titles", details: err.message });
  }
});

router.post("/icons", upload.single("icon"), async (req, res) => {
  try {
    if (!req.file || !req.body.link) {
      return res.status(400).json({ error: "Icon file & link required" });
    }

    const brand = await getSingleton();

    
    const stream = cloudinary.uploader.upload_stream(
      { folder: "header-icons" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Cloudinary upload failed", details: error });
        }

        const newIcon = {
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          link: req.body.link.trim(),
          order: req.body.order || 0
        };

        brand.icons.push(newIcon);
        await brand.save();

        res.status(201).json(brand);
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to add icon", details: err.message });
  }
});

router.put("/icons/:iconId", async (req, res) => {
  try {
    const brand = await getSingleton();
    const icon = brand.icons.id(req.params.iconId);
    if (!icon) return res.status(404).json({ error: "Icon not found" });

    if (req.body.link !== undefined) icon.link = req.body.link;
    if (req.body.order !== undefined) icon.order = req.body.order;

    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update icon", details: err.message });
  }
});

router.delete("/icons/:iconId", async (req, res) => {
  try {
    const brand = await getSingleton();
    const icon = brand.icons.id(req.params.iconId);
    if (!icon) return res.status(404).json({ error: "Icon not found" });
    await cloudinary.uploader.destroy(icon.imagePublicId);
    brand.icons.pull(req.params.iconId);
    await brand.save();

    res.json({ message: "Icon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete icon", details: err.message });
  }
});

module.exports = router;
