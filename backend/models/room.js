const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
  hostel: { type: String, required: true, index: true },
  roomNumber: { type: String, required: true, index: true },
  comments: [{
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true, minlength: 1, maxlength: 500 },
    images: [String],
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  versionKey: false 
});

module.exports = mongoose.model('Room', roomSchema);
