const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Chef', ChefSchema);
