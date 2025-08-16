const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const newAnnouncement = new Announcement({ message });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.put('/:id', async (req, res) => {
  const { message } = req.body;

  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Announcement not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
