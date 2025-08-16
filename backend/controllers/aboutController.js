const AboutSection = require("../models/AboutSection");
const cloudinary = require("../utils/cloudinary");

const uploadImageIfNeeded = async (paragraph) => {
  if (paragraph.imageFile) {
    const uploadRes = await cloudinary.uploader.upload(paragraph.imageFile, {
      folder: "about_sections",
    });
    paragraph.imageUrl = uploadRes.secure_url;
    paragraph.imagePublicId = uploadRes.public_id;
    delete paragraph.imageFile;
  }
  return paragraph;
};

exports.getAllAboutSections = async (req, res) => {
  try {
    const sections = await AboutSection.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAboutSection = async (req, res) => {
  try {
    const { title, subtitle, order, paragraphs } = req.body;

    let processedParagraphs = [];
    if (paragraphs && paragraphs.length > 0) {
      for (const p of paragraphs) {
        processedParagraphs.push(await uploadImageIfNeeded(p));
      }
    }

    const newSection = new AboutSection({
      title,
      subtitle,
      order,
      paragraphs: processedParagraphs,
    });

    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAboutSection = async (req, res) => {
  try {
    const { title, subtitle, order, paragraphs } = req.body;

    let processedParagraphs = [];
    if (paragraphs && paragraphs.length > 0) {
      for (const p of paragraphs) {
        if (p.imageFile) {
          if (p.imagePublicId) await cloudinary.uploader.destroy(p.imagePublicId);

          const uploadRes = await cloudinary.uploader.upload(p.imageFile, {
            folder: "about_sections",
          });
          p.imageUrl = uploadRes.secure_url;
          p.imagePublicId = uploadRes.public_id;
          delete p.imageFile;
        }
        processedParagraphs.push(p);
      }
    }

    const updated = await AboutSection.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        order,
        paragraphs: processedParagraphs,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAboutSection = async (req, res) => {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: "Not found" });

    for (const p of section.paragraphs) {
      if (p.imagePublicId) {
        await cloudinary.uploader.destroy(p.imagePublicId);
      }
    }

    await section.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
