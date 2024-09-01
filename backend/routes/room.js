// backend/routes/room.js
const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const upload = multer({
  dest: 'uploads/', // Set your upload directory
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Create or find room
router.post('/', async (req, res) => {
  try {
    const { hostel, roomNumber } = req.body;
    let room = await Room.findOne({ hostel, roomNumber });

    if (!room) {
      room = new Room({ hostel, roomNumber, comments: [] });
      await room.save();
      return res.status(201).json(room);
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create or find room' });
  }
});

// Get room details (with hostel)
// backend/routes/room.js
// Get room details (with hostel)
router.get('/api/rooms/:hostel/:roomNumber', async (req, res) => {
  try {
    const { hostel, roomNumber } = req.params;

    // Log request parameters
    console.log(`Fetching room for hostel: ${hostel}, roomNumber: ${roomNumber}`);

    // Find the room
    const room = await Room.findOne({ hostel, roomNumber });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Log room details
    console.log('Room found:', room);

    // Manually fetch user details for each comment
    const commentsWithUserDetails = await Promise.all(room.comments.map(async (comment) => {
      try {
        const user = await User.findById(comment.userId);
        return {
          ...comment.toObject(),
          userName: user ? user.name : 'Unknown',
          userGender: user ? user.gender : 'Unknown',
          userYear: user ? user.year : 'Unknown'
        };
      } catch (error) {
        console.error(`Error fetching user for comment ${comment._id}:`, error);
        return {
          ...comment.toObject(),
          userName: 'Unknown',
          userGender: 'Unknown',
          userYear: 'Unknown'
        };
      }
    }));
    res.json({ ...room.toObject(), comments: commentsWithUserDetails });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post comment
router.post('/:hostel/:roomNumber/comments', upload.array('images'), async (req, res) => {
  try {
    const { hostel, roomNumber } = req.params;
    const { text, userId } = req.body;
    const images = req.files.map(file => file.path);

    const room = await Room.findOneAndUpdate(
      { hostel, roomNumber },
      {
        $push: {
          comments: {
            userId,
            text,
            images
          }
        }
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// Search for a specific room in a hostel
router.post('/search', async (req, res) => {
  try {
    const { hostel, roomNumber } = req.body;
    const room = await Room.findOne({ hostel, roomNumber });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
