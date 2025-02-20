const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const Item = require('../models/Item');
const router = express.Router();

const storage = new Storage({
  projectId: 'hostel-hunt-444515',
  keyFilename: process.env.storagekey 
});

const bucket = storage.bucket('items16'); 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
});

router.post('/items', upload.single('image'), async (req, res) => {
  const { name, price, contact, userId } = req.body;
  const file = req.file;
  const blob = bucket.file(`${Date.now()}-${file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype
    }
  });

  blobStream.on('error', (error) => {
    console.error('Something is wrong! Unable to upload at the moment.', error);
    res.status(500).json({ error: 'Failed to upload the file' });
  });

  blobStream.on('finish', async () => {

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    try {
      const newItem = new Item({ userId, name, image: publicUrl, price, contact });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Failed to save item:', error);
      res.status(500).json({ error: 'Failed to save item' });
    }
  });

  blobStream.end(req.file.buffer);
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
