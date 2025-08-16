const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Meeting = require('../models/Meeting');

// Get real stats from database
const getStats = async () => {
  try {
    const totalRegistrations = await User.countDocuments();
    const totalVisitors = totalRegistrations; // Using total registrations as total visitors for now
    return {
      totalVisitors,
      totalRegistrations,
      activeUsers: 0,
      pendingTasks: 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard stats');
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in stats route:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});


router.get('/visitors', async (req, res) => {
  try {
    console.log('Fetching weekly visitor data (based on registrations)');
    const weeklyRegistrations = await User.aggregate([
      {
        $group: {
          _id: { $week: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          name: { $concat: ['Week ', { $toString: '$_id' }] },
          visitors: '$count',
          _id: 0,
        },
      },
    ]);

    if (weeklyRegistrations.length === 0) {
      return res.json([]);
    }

    res.json(weeklyRegistrations);
  } catch (error) {
    console.error('Error fetching weekly visitor data:', error);
    res.status(500).json({ message: 'Error fetching weekly visitor data' });
  }
});

router.get('/registrations', async (req, res) => {
  try {
    console.log('Fetching registration data');
    const registrationCounts = await Meeting.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
    ]);
    res.json(registrationCounts);
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ message: 'Error fetching registration data' });
  }
});

router.get('/activities', async (req, res) => {
  try {
    console.log('Fetching recent activities (meetings and registrations)');

    const recentMeetings = await Meeting.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    const recentUsers = await User.find()
      .sort({ registeredAt: -1 })
      .limit(5)
      .select('username registeredAt');

    const activities = [];

    recentMeetings.forEach((meeting) => {
      activities.push({
        id: meeting._id,
        action: `New meeting scheduled: ${meeting.title}`,
        user: 'System/Admin',
        time: meeting.createdAt.toLocaleString(),
      });
    });

    recentUsers.forEach((user) => {
      activities.push({
        id: user._id,
        action: `New user registered: ${user.username}`,
        user: user.username,
        time: user.registeredAt.toLocaleString(),
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching recent activities' });
  }
});

router.get('/registration-types', async (req, res) => {
  try {
    console.log('Fetching registration types');
    const registrationTypeCounts = await Meeting.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
    ]);
    res.json(registrationTypeCounts);
  } catch (error) {
    console.error('Error fetching registration types:', error);
    res.status(500).json({ message: 'Error fetching registration types' });
  }
});

module.exports = router;
