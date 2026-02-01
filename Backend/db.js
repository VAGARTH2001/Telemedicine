const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set – auth/payment features will not work. Set it in .env to enable.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.warn('Server will keep running. Register/Login will not work until MongoDB is available.');
  }
};

// Prevent Mongoose from throwing unhandled rejections that could crash the process
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

module.exports = connectDB;
