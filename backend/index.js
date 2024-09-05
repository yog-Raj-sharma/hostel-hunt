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

// CORS configuration to allow requests only from your frontend
app.use(cors({
  origin: 'https://hostel-hunt-4.onrender.com',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],    
  credentials: true                              
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', rateRoutes);
app.use('/api', itemRoutes); 
app.use('/api/rooms', roomRoutes); 
app.use('/api/food-items', foodItemsRoutes); 
app.use('/api/', profileroutes);
app.use('/uploads', express.static('uploads')); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
