const express = require('express');
const router = express.Router();
const FoodItems = require('../models/FoodItems'); 


router.get('/:outlet', async (req, res) => {
  try {
    const { outlet } = req.params;


    let outletData = await FoodItems.findOne({ outlet });

    if (!outletData) {
      outletData = new FoodItems({ outlet, foodItems: [] });
      await outletData.save();
    }

    res.json(outletData);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).send('Server error');
  }
});

router.post('/:outlet', async (req, res) => {
  try {
    const { outlet } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).send('Valid food item name is required');
    }

    let outletData = await FoodItems.findOne({ outlet });

    if (!outletData) {
      outletData = new FoodItems({ outlet, foodItems: [{ name }] });
    } else {
      
      const foodItemExists = outletData.foodItems.some(item => item.name.toLowerCase() === name.toLowerCase());

      if (foodItemExists) {
        return res.status(400).send('Food item already exists in the list');
      }
      outletData.foodItems.push({ name });
    }

    await outletData.save();
    res.json(outletData); 
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
