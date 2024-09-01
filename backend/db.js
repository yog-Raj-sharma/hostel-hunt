const mongoose = require('mongoose');

// Replace the connection string with your MongoDB URI
mongoose.connect('mongodb://127.0.0.1:27017/hostel-hunt')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

module.exports = mongoose;
