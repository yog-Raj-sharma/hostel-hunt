import React, { useState, useEffect, useCallback } from 'react';

export default function FoodItems({ outlet }) {
  const [foodItems, setFoodItems] = useState([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [showAddBox, setShowAddBox] = useState(false);
  const [error, setError] = useState(null); 

  // UseCallback to memoize the fetch function
  const fetchFoodItems = useCallback(async () => {
    try {
      const response = await fetch(`https://hostel-hunt-1.onrender.com/api/hostel/api/food-items/${encodeURIComponent(outlet)}`);

      if (!response.ok) {
        const text = await response.text();
        console.error(`Failed to fetch food items for ${outlet}: ${text}`);
        setFoodItems([]); 
        return;
      }

      const data = await response.json();
      setFoodItems(data.foodItems || []);
    } catch (error) {
      console.error('Failed to fetch food items:', error);
    }
  }, [outlet]); // `outlet` dependency is required

  // Call fetchFoodItems when component mounts or outlet changes
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  // Function to handle adding a new food item
  const handleAddFoodItem = async () => {
    if (!newFoodName.trim()) {
      setError('Food item name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`https://hostel-hunt-1.onrender.com/api/hostel/api/food-items/${encodeURIComponent(outlet)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFoodName }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to add food item:', text);
        setError(`Failed to add food item: ${text}`);
        return;
      }

      setNewFoodName(''); // Clear input field after successful submission
      setShowAddBox(false);
      setError(null); // Reset error
      fetchFoodItems(); // Re-fetch food items after adding a new one
    } catch (error) {
      console.error('Failed to add food item:', error);
      setError('An error occurred while adding the food item');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ul
        className="dropdown-menu show"
        style={{
          display: 'block',
          position: 'absolute',
          top: '100%',
          left: '83.5%',
          zIndex: '1000',
          backgroundColor: '#fff',
          border: '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.175)',
          maxHeight: '320px',
          overflowY: 'auto',
          width: '200px',
        }}
      >
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <li key={index} className="dropdown-item">
              {item.name}
            </li>
          ))
        ) : (
          <li className="dropdown-item">No food items found</li>
        )}
        <li>
          <button 
            className="dropdown-item text-success" 
            onClick={() => setShowAddBox(true)}
            aria-label="Add new food item"
          >
            Add Food Item
          </button>
        </li>
      </ul>

      {showAddBox && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter Food Name"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
            style={{ flex: '1' }}
            aria-label="New food name"
          />
          <button 
            className="btn btn-primary ms-2" 
            onClick={handleAddFoodItem}
            aria-label="Submit new food item"
          >
            Submit
          </button>
          <button 
            className="btn btn-secondary ms-2" 
            onClick={() => setShowAddBox(false)}
            aria-label="Cancel adding new food item" 
          >
            Cancel
          </button>
        </div>
      )} 

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}
