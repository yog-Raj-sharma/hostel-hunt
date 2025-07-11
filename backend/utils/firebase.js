// utils/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'hostel-hunt-image-container.appspot.com'  // from Firebase Console
});

const bucket = admin.storage().bucket();

module.exports = bucket;
