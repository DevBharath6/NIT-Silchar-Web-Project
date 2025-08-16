const PaperSection = require("../models/PaperSection");
const cloudinary = require("../utils/cloudinary");

const uploadImageIfNeeded = async (paragraph) => {
  if (paragraph.imageFile) {
    if (paragraph.imagePublicId) {
      await cloudinary.uploader.destroy(paragraph.imagePublicId);
    }

    const uploadRes = await cloudinary.uploader.upload(paragraph.imageFile, {
      folder: "paper_sections",
    });

    paragraph.imageUrl = uploadRes.secure_url;
    paragraph.imagePublicId = uploadRes.public_id;

    delete paragraph.imageFile;
  }
  return paragraph;
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await PaperSection.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    console.error(" Error fetching sections:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const section = await PaperSection.findById(req.params.id);
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { title, subtitle, order, paragraphs } = req.body;

    let processedParagraphs = [];
    if (paragraphs && paragraphs.length > 0) {
      for (const p of paragraphs) {
        processedParagraphs.push(await uploadImageIfNeeded(p));
      }
    }

    const newSection = new PaperSection({
      title,
      subtitle,
      order,
      paragraphs: processedParagraphs,
    });

    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating section:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { title, subtitle, order, paragraphs } = req.body;

    let processedParagraphs = [];
    if (paragraphs && paragraphs.length > 0) {
      for (const p of paragraphs) {
        processedParagraphs.push(await uploadImageIfNeeded(p));
      }
    }

    const updated = await PaperSection.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, order, paragraphs: processedParagraphs },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Section not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating section:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await PaperSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: "Not found" });

    for (const p of section.paragraphs) {
      if (p.imagePublicId) {
        await cloudinary.uploader.destroy(p.imagePublicId);
      }
    }

    await section.deleteOne();
    res.json({ message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
