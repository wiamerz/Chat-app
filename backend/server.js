require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/Auth');

const app = express();

// Middlewares
app.use(cors()); 
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/authentification';
mongoose.connect(mongoURI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => {
    console.error(' MongoDB connection error:', err);
    process.exit(1); 
  });

// Routes
app.use('/api/auth', authRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found'});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);


});