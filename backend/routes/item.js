const express = require('express');
const Item = require('../models/Item');
const router = express.Router();


router.post('/', async (req, res) => {
  const { name, price, contact, userId, image } = req.body; 

  if (!image) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const newItem = new Item({ userId, name, image, price, contact });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ error: 'Failed to save item' });
  }
});


router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;
