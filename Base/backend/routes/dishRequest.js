const express = require('express');
const router = express.Router();
const DishRequest = require('../models/DishRequest');
const Chef = require('../models/Chef');

// Create a new dish request
router.post('/', async (req, res) => {
  const { userSessionId, dishName, recipeUrl } = req.body;
  try {
    const request = new DishRequest({ userSessionId, dishName, recipeUrl });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Get all dish requests (optionally filter by status)
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const filter = status ? { status } : {};
    const requests = await DishRequest.find(filter).populate('chef');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject a dish request (by chef)
router.put('/:id', async (req, res) => {
  const { status, chefId } = req.body; // status: 'approved' or 'rejected'
  try {
    const chef = await Chef.findById(chefId);
    if (!chef) return res.status(400).json({ message: 'Invalid chef' });
    const request = await DishRequest.findByIdAndUpdate(
      req.params.id,
      { status, chef: chef._id },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Dish request not found' });
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

module.exports = router;
