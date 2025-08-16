const ImportantDate = require("../models/ImportantDates");

exports.getImportantDates = async (req, res) => {
  try {
    const dates = await ImportantDate.find().sort({ createdAt: 1 });
    res.json(dates);
  } catch (err) {
    console.error("Error fetching important dates:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createImportantDate = async (req, res) => {
  try {
    const { title, date, dateRange } = req.body;

    const newDate = new ImportantDate({
      title,
      date,
      dateRange: dateRange?.length ? dateRange : undefined,
    });

    await newDate.save();
    res.status(201).json({ message: "Important date created", data: newDate });
  } catch (err) {
    console.error("Error creating important date:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateImportantDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, dateRange } = req.body;

    const updated = await ImportantDate.findByIdAndUpdate(
      id,
      {
        title,
        date,
        dateRange: dateRange?.length ? dateRange : undefined,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Important date updated", data: updated });
  } catch (err) {
    console.error("Error updating date:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteImportantDate = async (req, res) => {
  try {
    const { id } = req.params;
    await ImportantDate.findByIdAndDelete(id);
    res.json({ message: "Important date deleted" });
  } catch (err) {
    console.error("Error deleting date:", err);
    res.status(500).json({ message: "Server error" });
  }
};
