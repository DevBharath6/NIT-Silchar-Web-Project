const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const HeroSection = require("../models/HeroSection");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const getSingletonHero = async () => {
  let hero = await HeroSection.findOne();
  if (!hero) {
    hero = new HeroSection({
      title: "",
      subtitle: "",
      primaryButton: { text: "Submit Paper", link: "/submit-paper" },
      secondaryButton: { text: "Conference Brochure", link: "/brochure" },
    });
    await hero.save();
  }
  return hero;
};

router.get("/", async (req, res) => {
  try {
    const hero = await getSingletonHero();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hero section", details: err.message });
  }
});

router.put(
  "/",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const hero = await getSingletonHero();

      hero.title = req.body.title || hero.title;
      hero.subtitle = req.body.subtitle || hero.subtitle;
      if (req.body.primaryButtonText) hero.primaryButton.text = req.body.primaryButtonText;
      if (req.body.primaryButtonLink) hero.primaryButton.link = req.body.primaryButtonLink;
      if (req.body.secondaryButtonText) hero.secondaryButton.text = req.body.secondaryButtonText;

      if (req.files?.backgroundImage?.[0]) {
        if (hero.backgroundImagePublicId) {
          await cloudinary.uploader.destroy(hero.backgroundImagePublicId);
        }
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "hero-section" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.files.backgroundImage[0].buffer);
        });
        hero.backgroundImageUrl = result.secure_url;
        hero.backgroundImagePublicId = result.public_id;
      }

      if (req.files?.heroImage?.[0]) {
        if (hero.heroImagePublicId) {
          await cloudinary.uploader.destroy(hero.heroImagePublicId);
        }
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "hero-section" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.files.heroImage[0].buffer);
        });
        hero.heroImageUrl = result.secure_url;
        hero.heroImagePublicId = result.public_id;
      }

      if (req.files?.pdf?.[0]) {
        const originalName = req.files.pdf[0].originalname;

        // Delete old PDF if exists
        if (hero.secondaryButton.pdfPublicId) {
          await cloudinary.uploader.destroy(hero.secondaryButton.pdfPublicId, {
            resource_type: "raw",
          });
        }

        const cleanName = originalName.replace(/\.pdf$/i, ""); // remove duplicate .pdf
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "hero-pdfs",
              resource_type: "raw",
              public_id: cleanName,
              overwrite: true,
              format: "pdf",
            },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(req.files.pdf[0].buffer);
        });

        const pdfUrl = result.secure_url.endsWith(".pdf")
          ? result.secure_url
          : `${result.secure_url}.pdf`;

        hero.secondaryButton.pdfUrl = pdfUrl;
        hero.secondaryButton.pdfPublicId = result.public_id;
        hero.secondaryButton.pdfOriginalName = originalName;
      }

      await hero.save();
      res.json(hero);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to update hero section",
        details: err.message,
      });
    }
  }
);

router.get("/pdf/view", async (req, res) => {
  try {
    const hero = await getSingletonHero();
    if (!hero.secondaryButton?.pdfUrl) {
      return res.status(404).json({ error: "No brochure PDF uploaded" });
    }

    return res.redirect(hero.secondaryButton.pdfUrl);
  } catch (err) {
    res.status(500).json({ error: "Failed to preview PDF", details: err.message });
  }
});


router.get("/pdf/download", async (req, res) => {
  try {
    const hero = await getSingletonHero();
    if (!hero.secondaryButton?.pdfUrl) {
      return res.status(404).json({ error: "No brochure PDF uploaded" });
    }

    const filename = hero.secondaryButton.pdfOriginalName || "brochure.pdf";

    const response = await fetch(hero.secondaryButton.pdfUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.endsWith(".pdf") ? filename : filename + ".pdf"}"`
    );

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download PDF", details: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    if (!hero) return res.json({ message: "No hero section exists" });

    if (hero.backgroundImagePublicId)
      await cloudinary.uploader.destroy(hero.backgroundImagePublicId);

    if (hero.heroImagePublicId)
      await cloudinary.uploader.destroy(hero.heroImagePublicId);

    if (hero.secondaryButton?.pdfPublicId)
      await cloudinary.uploader.destroy(hero.secondaryButton.pdfPublicId, {
        resource_type: "raw",
      });

    await HeroSection.deleteMany();
    res.json({ message: "Hero section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hero section", details: err.message });
  }
});

module.exports = router;
