const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place a new order
router.post('/', async (req, res) => {
  const { items, userSessionId } = req.body;
  try {
    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) return res.status(400).json({ message: 'Invalid menu item' });
      totalPrice += menuItem.price * item.quantity;
    }
    const order = new Order({ items, userSessionId, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Get all orders (optionally filter by userSessionId)
router.get('/', async (req, res) => {
  const { userSessionId } = req.query;
  try {
    const filter = userSessionId ? { userSessionId } : {};
    const orders = await Order.find(filter).populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
