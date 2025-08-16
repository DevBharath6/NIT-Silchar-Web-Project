const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '1h';


router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });

    user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username already exists' });

    user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/me', verifyToken, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('-password');
    if (!me) return res.status(404).json({ message: 'User not found' });
    res.json(me);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/users', verifyToken, requireRole('admin'), async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
