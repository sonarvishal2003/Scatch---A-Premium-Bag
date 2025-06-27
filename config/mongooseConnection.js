const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// Middleware and routes...
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log(' MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
