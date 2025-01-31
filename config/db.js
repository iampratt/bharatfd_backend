const dotenc = require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
  console.log('MongoDB Connected');
});
