const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true // Set to true if you want to make it required
  },
  gender: { 
    type: String,
    required: true // Set to true if you want to make it required
  },
  year: { 
    type: String,
    required: true // Set to true if you want to make it required
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    match: /@thapar\.edu$/ // Ensure the email matches the required domain
  },
  password: { 
    type: String,
    required: true
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
