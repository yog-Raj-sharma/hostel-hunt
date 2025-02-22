const mongoose = require('mongoose');
require('dotenv').config();  

const dbPassword = process.env.DB_PASSWORD;

//mongoose.connect(`mongodb+srv://yograjsharma:${dbPassword}@cluster0.7o0rg75.mongodb.net/hostel-hunt`, {
mongoose.connect('mongodb+srv://hostel-hunt:atlassian@cluster-1.j4wqe.mongodb.net/',{ 
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

module.exports = mongoose;
 