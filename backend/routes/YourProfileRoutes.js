const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      name: user.name,
      year: user.year,
      gender:user.gender,
    }); 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

router.get('/user-items/:userId', async (req, res) => {
  try {
    const items = await Item.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const item = await Item.findOneAndDelete({ _id: id, userId });
    if (!item) return res.status(404).json({ error: 'Item not found or unauthorized' });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
