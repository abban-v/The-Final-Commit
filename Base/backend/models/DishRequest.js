const mongoose = require('mongoose');

const DishRequestSchema = new mongoose.Schema({
  userSessionId: String,
  dishName: { type: String, required: true },
  recipeUrl: String,
  status: { type: String, default: 'pending' },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DishRequest', DishRequestSchema);
