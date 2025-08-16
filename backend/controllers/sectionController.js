const Section = require("../models/Section");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const uploadImageToCloudinary = async (filePath, folder = "sections") => {
  const uploaded = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlinkSync(filePath); // cleanup local temp
  return {
    imageUrl: uploaded.secure_url,
    imagePublicId: uploaded.public_id
  };
};

exports.getSectionsByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const sections = await Section.find({ page }).sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { page, title, subtitle, order, paragraphs = [] } = req.body;

    const section = new Section({
      page,
      title,
      subtitle,
      order: order || 0,
      paragraphs
    });

    await section.save();
    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create section" });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, order, paragraphs } = req.body;

    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { title, subtitle, order, paragraphs },
      { new: true }
    );

    if (!updatedSection) return res.status(404).json({ message: "Section not found" });
    res.json(updatedSection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update section" });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);

    if (!section) return res.status(404).json({ message: "Section not found" });

    // Delete all images from Cloudinary
    for (const paragraph of section.paragraphs) {
      if (paragraph.imagePublicId) {
        await cloudinary.uploader.destroy(paragraph.imagePublicId);
      }
    }

    await section.deleteOne();
    res.json({ message: "Section deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete section" });
  }
};

exports.addParagraph = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { order, text, bullets = [], links = [], buttons = [] } = req.body;

    let imageData = {};
    if (req.file) {
      imageData = await uploadImageToCloudinary(req.file.path);
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    const newParagraph = {
      order,
      text,
      bullets,
      links,
      buttons,
      ...imageData
    };

    section.paragraphs.push(newParagraph);
    await section.save();

    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add paragraph" });
  }
};

exports.updateParagraph = async (req, res) => {
  try {
    const { sectionId, paragraphIndex } = req.params;
    const { order, text, bullets, links, buttons } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    let paragraph = section.paragraphs[paragraphIndex];
    if (!paragraph) return res.status(404).json({ message: "Paragraph not found" });

    if (req.file) {
      // Delete old image
      if (paragraph.imagePublicId) {
        await cloudinary.uploader.destroy(paragraph.imagePublicId);
      }
      const imageData = await uploadImageToCloudinary(req.file.path);
      paragraph.imageUrl = imageData.imageUrl;
      paragraph.imagePublicId = imageData.imagePublicId;
    }

    paragraph.order = order ?? paragraph.order;
    paragraph.text = text ?? paragraph.text;
    paragraph.bullets = bullets ?? paragraph.bullets;
    paragraph.links = links ?? paragraph.links;
    paragraph.buttons = buttons ?? paragraph.buttons;

    await section.save();
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update paragraph" });
  }
};

exports.deleteParagraph = async (req, res) => {
  try {
    const { sectionId, paragraphIndex } = req.params;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    const paragraph = section.paragraphs[paragraphIndex];
    if (!paragraph) return res.status(404).json({ message: "Paragraph not found" });

    if (paragraph.imagePublicId) {
      await cloudinary.uploader.destroy(paragraph.imagePublicId);
    }

    section.paragraphs.splice(paragraphIndex, 1);
    await section.save();

    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete paragraph" });
  }
};

exports.uploadParagraphImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imageData = await uploadImageToCloudinary(req.file.path);
    res.json(imageData); // { imageUrl, imagePublicId }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};

exports.reorderSections = async (req, res) => {
  try {
    const { orderUpdates } = req.body; 
    // Example: [{ sectionId: "123", order: 1 }, { sectionId: "456", order: 2 }]
    
    const bulkOps = orderUpdates.map(update => ({
      updateOne: {
        filter: { _id: update.sectionId },
        update: { order: update.order }
      }
    }));
    await Section.bulkWrite(bulkOps);
    res.json({ message: "Sections reordered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reorder sections" });
  }
};
