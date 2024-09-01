const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
});

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ratings: [ratingSchema],
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
