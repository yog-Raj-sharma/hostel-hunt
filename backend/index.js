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
const allowedOrigins = [
  'https://hostel-hunt-4.onrender.com',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
