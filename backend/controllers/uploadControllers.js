const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const bucket = require('../utils/firebase');

const upload = multer({ storage: multer.memoryStorage() });

const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    // Compress the image using sharp
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1024) // max width: 1024px (optional)
      .jpeg({ quality: 70 }) // compress to JPEG at 70% quality
      .toBuffer();

    const fileName = `uploads/${uuidv4()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}.jpeg`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      }
    });

    blobStream.on('error', err => res.status(500).send(err.message));

    blobStream.on('finish', async () => {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).json({ imageUrl: publicUrl });
    });

    blobStream.end(compressedBuffer);

  } catch (error) {
    res.status(500).send('Image compression failed: ' + error.message);
  }
};

module.exports = { upload, uploadImage };
