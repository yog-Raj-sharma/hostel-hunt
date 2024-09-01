const express = require('express');
const router = express.Router();
const FoodItems = require('../models/FoodItems'); // Assuming this is a Mongoose model

// Fetch food items for an outlet
router.get('/:outlet', async (req, res) => {
  try {
    const { outlet } = req.params;

    // Find the document for the specific outlet
    let outletData = await FoodItems.findOne({ outlet });

    // If the outlet does not exist, create a new document with an empty foodItems array
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

// Add food item to an outlet
router.post('/:outlet', async (req, res) => {
  try {
    const { outlet } = req.params;
    const { name } = req.body;

    // Validate the food item name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).send('Valid food item name is required');
    }

    // Find the document for the specific outlet
    let outletData = await FoodItems.findOne({ outlet });

    // If the outlet does not exist, create a new document and add the food item
    if (!outletData) {
      outletData = new FoodItems({ outlet, foodItems: [{ name }] });
    } else {
      // Check if the food item already exists in the array
      const foodItemExists = outletData.foodItems.some(item => item.name.toLowerCase() === name.toLowerCase());

      if (foodItemExists) {
        return res.status(400).send('Food item already exists in the list');
      }

      // Add the new food item to the existing foodItems array
      outletData.foodItems.push({ name });
    }

    // Save the document back to the database
    await outletData.save();
    res.json(outletData); // Send the updated document as a response
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
