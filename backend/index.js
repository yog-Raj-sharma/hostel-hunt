const express = require('express');
const mongoose = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const rateRoutes = require('./routes/rate');
const itemRoutes = require('./routes/item'); // <-- Add this line
const roomRoutes = require('./routes/room');
const foodItemsRoutes = require('./routes/foodItemsRoutes');
const profileroutes = require('./routes/YourProfileRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', rateRoutes);
app.use('/api', itemRoutes); // <-- Add this line
app.use('/api/rooms', roomRoutes); 
app.use('/api/food-items', foodItemsRoutes); 
app.use('/api/',profileroutes);
// Static folder for image uploads
app.use('/uploads', express.static('uploads')); // <-- Add this line

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
