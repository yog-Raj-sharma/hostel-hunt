const express = require('express');
const mongoose = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const rateRoutes = require('./routes/rate');
const itemRoutes = require('./routes/item'); 
const roomRoutes = require('./routes/room');
const foodItemsRoutes = require('./routes/foodItemsRoutes');
const profileroutes = require('./routes/YourProfileRoutes');

const app = express();

const allowedOrigins = ['https://hostel-hunt-4.onrender.com', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', rateRoutes);
app.use('/api/items', itemRoutes); 
app.use('/api/rooms', roomRoutes); 
app.use('/api/food-items', foodItemsRoutes); 
app.use('/api/', profileroutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
