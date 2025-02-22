const mongoose = require('mongoose');
require('dotenv').config();  

const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://hostel-hunt:${dbPassword}@cluster-1.j4wqe.mongodb.net/hostel-hunt`, {
//mongoose.connect('mongodb+srv://hostel-hunt:${dbPassword}@cluster-1.j4wqe.mongodb.net/hostel-hunt',{ 
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

module.exports = mongoose;
 