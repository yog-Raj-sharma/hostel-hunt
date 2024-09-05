const mongoose = require('mongoose');
require('dotenv').config();  // Ensure this line is included to load environment variables

const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://yograjsharma:${dbPassword}@cluster0.7o0rg75.mongodb.net/hostel-hunt`, {
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

module.exports = mongoose;
