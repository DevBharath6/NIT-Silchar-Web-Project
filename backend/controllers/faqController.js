const Faq = require("../models/Faq");

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, link, linkText } = req.body;

    const newFaq = new Faq({
      question,
      answer,
      link: link || "",
      linkText: linkText || "",
    });

    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, link, linkText } = req.body;

    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, link, linkText },
      { new: true }
    );

    if (!updatedFaq) return res.status(404).json({ message: "FAQ not found" });

    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error });
  }
};
