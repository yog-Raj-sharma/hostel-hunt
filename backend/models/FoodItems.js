const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const outletSchema = new mongoose.Schema({
  outlet: { type: String, required: true, unique: true },
  foodItems: [foodItemSchema],
});

const FoodItems = mongoose.model('FoodItems', outletSchema);

module.exports = FoodItems;
