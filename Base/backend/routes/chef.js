const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');
const bcrypt = require('bcryptjs');

// Chef login
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const chef = await Chef.findOne({ userId });
    if (!chef) return res.status(401).json({ message: 'Invalid user ID or password' });

    const isMatch = await bcrypt.compare(password, chef.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid user ID or password' });

    // For simplicity, just return chef info (no JWT/session for now)
    res.json({ message: 'Login successful', chef: { userId: chef.userId, name: chef.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Chef registration (for initial setup, can be removed later)
router.post('/register', async (req, res) => {
  const { userId, password, name } = req.body;
  try {
    const existing = await Chef.findOne({ userId });
    if (existing) return res.status(400).json({ message: 'User ID already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const chef = new Chef({ userId, password: hashed, name });
    await chef.save();
    res.status(201).json({ message: 'Chef registered', chef: { userId, name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
