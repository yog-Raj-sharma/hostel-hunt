const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');

// Route to submit a rating
router.post('/rate', async (req, res) => {
  console.log('Rate route hit');
  try {
    const { hostel, user, rating } = req.body;
    
    if (!hostel || !user || rating === undefined) {
      return res.status(400).json({ error: 'Hostel, user, and rating are required' });
    }
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 0 and 5' });
    }

    let hostelDoc = await Hostel.findOne({ name: hostel });
    if (!hostelDoc) {
      hostelDoc = new Hostel({ name: hostel, ratings: [] });
    }

    const userId = user.toString();
    const existingRating = hostelDoc.ratings.find(r => r.user.toString() === userId);

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      hostelDoc.ratings.push({ user: userId, rating });
    }

    await hostelDoc.save();
    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Failed to submit rating', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Route to fetch a user's rating for a specific hostel
router.get('/hostel/:hostel/user-rating/:userId', async (req, res) => {
  try {
    const { hostel, userId } = req.params;

    if (!hostel || !userId) {
      return res.status(400).json({ error: 'Hostel and user ID are required' });
    }

    const hostelDoc = await Hostel.findOne({ name: hostel });
    if (!hostelDoc) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    const userRating = hostelDoc.ratings.find(r => r.user.toString() === userId);
    const rating = userRating ? userRating.rating : 0;

    res.status(200).json({ rating });
  } catch (error) {
    console.error('Failed to fetch user rating', error);
    res.status(500).json({ error: 'Failed to fetch user rating' });
  }
});


// Route to fetch average ratings
router.get('/hostel/:hostel/average-rating', async (req, res) => {
  try {
    const hostelName = req.params.hostel;

    if (!hostelName) {
      return res.status(400).json({ error: 'Hostel name is required' });
    }

    const hostelDoc = await Hostel.findOne({ name: hostelName });
    if (!hostelDoc) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    const totalRatings = hostelDoc.ratings.length;
    const sumRatings = hostelDoc.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings === 0 ? 0 : sumRatings / totalRatings;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Failed to fetch average rating', error);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
});

module.exports = router;
