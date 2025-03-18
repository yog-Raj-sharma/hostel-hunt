const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const upload = multer({
  dest: 'uploads/', 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

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

router.get('/api/rooms/:hostel/:roomNumber', async (req, res) => {
  try {
    const { hostel, roomNumber } = req.params;

    console.log(`Fetching room for hostel: ${hostel}, roomNumber: ${roomNumber}`);

    const room = await Room.findOne({ hostel, roomNumber });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    console.log('Room found:', room);

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
      { new: true, upsert: false }  // Return the updated document
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get the last comment (the one just added)
    const newComment = room.comments[room.comments.length - 1];

    // Return the new comment
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});


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