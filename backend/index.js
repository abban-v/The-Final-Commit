require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Canteen backend is running!');
});

// Chef authentication routes
const chefRoutes = require('./routes/chef');
app.use('/api/chef', chefRoutes);
// Dish request routes
const dishRequestRoutes = require('./routes/dishRequest');
app.use('/api/dish-request', dishRequestRoutes);
// Order placement routes
const orderRoutes = require('./routes/order');
app.use('/api/order', orderRoutes);
// Menu management routes
const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canteen')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
