// backend/models/Room.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  hostel: String,
  roomNumber: String,
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, required: true },
      text: String,
      images: [String]
    }
  ]
});

module.exports = mongoose.model('Room', roomSchema);
