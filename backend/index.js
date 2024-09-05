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


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', rateRoutes);
app.use('/api', itemRoutes); 
app.use('/api/rooms', roomRoutes); 
app.use('/api/food-items', foodItemsRoutes); 
app.use('/api/',profileroutes);
app.use('/uploads', express.static('uploads')); 


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//mongodb+srv://yograjsharma:<db_password>@cluster0.7o0rg75.mongodb.net/?//