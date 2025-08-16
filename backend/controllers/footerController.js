const Footer = require("../models/Footer");
const cloudinary = require("../utils/cloudinary");

exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) return res.status(404).json({ message: "Footer not found" });

    res.json(footer);
  } catch (err) {
    console.error("Error fetching footer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createFooter = async (req, res) => {
  try {
    const existing = await Footer.findOne();
    if (existing) return res.status(400).json({ message: "Footer already exists" });

    const footer = new Footer(req.body);
    await footer.save();

    res.status(201).json({ message: "Footer created", data: footer });
  } catch (err) {
    console.error("Error creating footer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = new Footer();
    }

    footer.logo.textPrimary = req.body.textPrimary || footer.logo.textPrimary;
    footer.logo.textSecondary = req.body.textSecondary || footer.logo.textSecondary;
    footer.description = req.body.description || footer.description;

    footer.socialLinks.facebook = req.body.facebook || footer.socialLinks.facebook;
    footer.socialLinks.twitter = req.body.twitter || footer.socialLinks.twitter;
    footer.socialLinks.linkedin = req.body.linkedin || footer.socialLinks.linkedin;
    footer.socialLinks.instagram = req.body.instagram || footer.socialLinks.instagram;

    footer.contactEmail = req.body.contactEmail || footer.contactEmail;
    footer.copyright = req.body.copyright || footer.copyright;

    if (req.file) {
      if (footer.logo.publicId) {
        await cloudinary.uploader.destroy(footer.logo.publicId);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "footer-logo" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      footer.logo.url = result.secure_url;
      footer.logo.publicId = result.public_id;
    }

    await footer.save();

    res.json({ message: "Footer updated", data: footer });
  } catch (err) {
    console.error("Error updating footer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) return res.json({ message: "No footer found" });

    if (footer.logo?.publicId) {
      await cloudinary.uploader.destroy(footer.logo.publicId);
    }

    await Footer.deleteMany();
    res.json({ message: "Footer deleted successfully" });
  } catch (err) {
    console.error("Error deleting footer:", err);
    res.status(500).json({ message: "Server error" });
  }
};
