const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

router.get('/', async (req, res) => {
  try {
    const { date, track } = req.query;
    let query = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (track && track !== 'all') {
      query.track = track;
    }

    const meetings = await Meeting.find(query).sort({ date: 1, startTime: 1 });
    res.json(meetings);
  } catch (err) {
    console.error('Error fetching meetings:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (err) {
    console.error('Error fetching meeting by ID:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    speaker,
    track,
    type,
    reminder,
    capacity,
  } = req.body;

  try {
    const newMeeting = new Meeting({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      speaker,
      track,
      type,
      reminder,
      capacity,
    });

    const meeting = await newMeeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    console.error('Error creating meeting:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    Object.assign(meeting, req.body);

    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error('Error updating meeting:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await Meeting.deleteOne({ _id: req.params.id });
    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    console.error('Error deleting meeting:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;