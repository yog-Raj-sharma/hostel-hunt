const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },
  gender: { 
    type: String,
    required: true 
  },
  year: { 
    type: String,
    required: true 
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    match: /@thapar\.edu$/ 
  },
  password: { 
    type: String,
    required: true
  }
}, { timestamps: true }); 

const User = mongoose.model('User', userSchema);
module.exports = User;
