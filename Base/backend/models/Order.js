const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: { type: String, default: 'pending' },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  userSessionId: String
});

module.exports = mongoose.model('Order', OrderSchema);
