const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  hostel: String,
  roomNumber: String,
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, required: true },
      text: String,
      images: [String],
      timestamp: { type: Date, default: Date.now } // Add this field
    }
  ]
});
module.exports = mongoose.model('Room', roomSchema);
