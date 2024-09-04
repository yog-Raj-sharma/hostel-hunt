const express = require('express');
const multer = require('multer');
const Item = require('../models/Item');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/items', upload.single('image'), async (req, res) => {
  const { name, price, contact, userId } = req.body;
  const image = req.file.path;

  try {
    const newItem = new Item({ userId, name, image, price, contact });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save item' });
  }
});

router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;
