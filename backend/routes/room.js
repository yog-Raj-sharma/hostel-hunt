const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const User = require('../models/User');

const storage = new Storage({
  projectId: 'hostel-hunt-444515',
  keyFilename: process.env.storagekey,  
});

const bucket = storage.bucket('rooms1612');

const uploadHandler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/:hostel/:roomNumber/comments', uploadHandler.array('images'), async (req, res) => {
  const { hostel, roomNumber } = req.params;
  const { text, userId } = req.body;

  const images = await Promise.all(req.files.map(file => new Promise((resolve, reject) => {
    const blob = bucket.file(`${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: file.mimetype }
    });

    blobStream.on('error', err => reject(err));

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  })));

  try {
    const room = await Room.findOneAndUpdate(
      { hostel, roomNumber },
      {
        $push: {
          comments: {
            userId,
            text,
            images,
            timestamp: new Date() 
          }
        }
      },
      { new: true } 
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const newComment = room.comments[room.comments.length - 1];
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment', details: error });
  }
});

router.get('/api/rooms/:hostel/:roomNumber', async (req, res) => {
  const { hostel, roomNumber } = req.params;

  try {
    const room = await Room.findOne({ hostel, roomNumber });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const commentsWithUserDetails = await Promise.all(room.comments.map(async (comment) => {
      const user = await User.findById(comment.userId);
      if (!user) {
        return {
          ...comment.toObject(),
          userName: 'Unknown',
          userGender: 'Unknown',
          userYear: 'Unknown'
        };
      }
      return {
          ...comment.toObject(),
          userName: user.name,
          userGender: user.gender,
          userYear: user.year
      };
    }));

    res.json({ ...room.toObject(), comments: commentsWithUserDetails });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/search', async (req, res) => {
  const { hostel, roomNumber } = req.body;

  try {
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
