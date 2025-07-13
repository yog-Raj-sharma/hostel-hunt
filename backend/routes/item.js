const express = require('express');
const Item = require('../models/Item');
const router = express.Router();
const bucket = require('../firebase'); 
const admin = require('../firebaseAdmin'); 
const { getStorage } = require('firebase-admin/storage');
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

router.delete('/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item || item.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized or item not found' });
    }

    const storage = getStorage();
    const bucket = storage.bucket();
    const imagePath = item.image.split('/o/')[1]?.split('?')[0]; 
    await bucket.file(decodeURIComponent(imagePath)).delete();

    await item.deleteOne();
    res.status(200).json({ message: 'Item and image deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error while deleting item' });
  }
});

module.exports = router;
