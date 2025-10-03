const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new menu item
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl, available } = req.body;
  try {
    const item = new MenuItem({ name, description, price, imageUrl, available });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update a menu item
router.put('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
