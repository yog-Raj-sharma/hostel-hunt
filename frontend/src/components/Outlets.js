import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {jwtDecode} from 'jwt-decode';
import FoodItems from './FoodItems';

export default function Hostel() {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [showFoodItems, setShowFoodItems] = useState({}); 
  const [userRatings, setUserRatings] = useState({});
  useEffect(() => {
    fetchAverageRatings();
    fetchUserRatings();
  }, []);

  const fetchUserRatings = async () => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const ratings = {};

    for (const hostel of [
    'Wrapchick', 'Sips & Bite', 'Dessert Club', 'Bombay Munchurry', 'Pizza Nation', 
    'Chai Nagari', 'Kabir Store', 'Stationary', "Men's Salon", "Women's Salon",
    'Airtel', 'NesCafe', 'Aahar(Uncle)', 'Aahar(Auntty)', 'Old Aahar', 
    'G-block Cafeteria', "Jaggi's Coffee Shop", "Jaggi's Juice Shop", 'Hostel H Canteen'
    ]) {
      const response = await fetch(`http://localhost:3001/api/hostel/${encodeURIComponent(hostel)}/user-rating/${userId}`);
      if (!response.ok) {
        const text = await response.text();
        console.error(`Failed to fetch user rating for ${hostel}: ${text}`);
        continue;
      }

      const data = await response.json();
      ratings[hostel] = data.rating || 0;
    }

    setUserRatings(ratings);
  } catch (error) {
    console.error('Failed to fetch user ratings:', error);
  }
};

  const fetchAverageRatings = async () => {
    try {
      const hostels = [
        'Wrapchick', 'Sips & Bite', 'Dessert Club', 'Bombay Munchurry', 'Pizza Nation', 
    'Chai Nagari', 'Kabir Store', 'Stationary', "Men's Salon", "Women's Salon",
    'Airtel', 'NesCafe', 'Aahar(Uncle)', 'Aahar(Auntty)', 'Old Aahar', 
    'G-block Cafeteria', "Jaggi's Coffee Shop", "Jaggi's Juice Shop", 'Hostel H Canteen'
      ];

      const avgRatings = {};

      for (const hostel of hostels) {
        const response = await fetch(`http://localhost:3001/api/hostel/${encodeURIComponent(hostel)}/average-rating`);

        if (!response.ok) {
          const text = await response.text();
          console.error(`Failed to fetch average rating for ${hostel}: ${text}`);
          continue; 
        }

        const data = await response.json();
        avgRatings[hostel] = data.averageRating || 0;
      }

      setAverageRatings(avgRatings);
    } catch (error) {
      console.error('Failed to fetch average ratings:', error);
    }
  };

   const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  const toggleFoodItems = (hostel) => {
    setShowFoodItems((prevShowFoodItems) => ({
      ...prevShowFoodItems,
      [hostel]: !prevShowFoodItems[hostel],
    }));
  };

  const handleStarClick = (hostel, rating) => {
    setSelectedRatings((prevRatings) => ({
      ...prevRatings,
      [hostel]: rating,
    }));
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return null;
    }

    try {
      const decodedToken = jwtDecode(token);
      const expiry = decodedToken.exp * 1000; 
      const now = Date.now();

      if (now > expiry) {
        console.error('Token has expired');
        localStorage.removeItem('authToken'); 
        return null;
      }

      return decodedToken.userId;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const handleRateSubmit = async (hostel) => {
    const rating = selectedRatings[hostel];
    if (!rating) return;

    try {
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error('Failed to get user ID from token');
        return;
      }
       console.log('Sending rating data:', { hostel, user: userId, rating });
      const response = await fetch('http://localhost:3001/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostel, user: userId, rating }),
      });

      if (!response.ok) {
        const text = await response.text(); 
        console.error('Failed to submit rating:', text);
        return;
      }

      await fetchAverageRatings(); 
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

const renderExtraContent = (hostel) => (
    <div
      style={{
        backgroundColor: 'rgba(52, 58, 64, 0.8)', 
        padding: '10px',
        borderTop: 'none', 
        borderBottom: '2px solid white', 
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
            
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className="text-warning"
            style={{ cursor: 'pointer' }}
            onClick={() => handleStarClick(hostel, index + 1)}
          >
            {index < (selectedRatings[hostel] || userRatings[hostel] || 0) ? '\u2605' : '\u2606'}
          </span>
        ))}
        <button className="btn btn-secondary ms-2" onClick={() => handleRateSubmit(hostel)}>Rate</button>
      </div>

        <div className="d-flex align-items-center">
          <button 
            className="btn btn-success d-flex align-items-center" 
            style={{ padding: '5px 10px' }} 
            onClick={() => toggleFoodItems(hostel)} 
          >
            Food Items
          </button>
        </div>
      </div>

      {showFoodItems[hostel] && <FoodItems outlet={hostel} />}
    </div>
  );

  const renderRatingStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;

    return (
<>
  {[...Array(fullStars)].map((_, index) => (
    <span key={index} className="text-warning">
      {'\u2605'} 
    </span>
  ))}

  {halfStar && (
   <span style={{ position: 'relative', display: 'inline-block', width: '1em' }}>

      <span
        style={{
          position: 'absolute',
          overflow: 'hidden',
          width: '40%',
          top: 0,
          left: 0,
          color: '#FFD700',
        }}
      >
        {'\u2605'}
      </span>

      <span className="text-warning">
        {'\u2606'}
      </span>
    </span>
  )}

  {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
    <span key={index} className="text-warning">
      {'\u2606'}
    </span>
  ))}
</>

    );
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {[
        'Wrapchick', 'Sips & Bite', 'Dessert Club', 'Bombay Munchurry', 'Pizza Nation', 
    'Chai Nagari', 'Kabir Store', 'Stationary', "Men's Salon", "Women's Salon",
    'Airtel', 'NesCafe', 'Aahar(Uncle)', 'Aahar(Auntty)', 'Old Aahar', 
    'G-block Cafeteria', "Jaggi's Coffee Shop", "Jaggi's Juice Shop", 'Hostel H Canteen'
      ].map((hostel, index) => (
        <div key={index}>
          
          <nav
            className="navbar navbar-expand-lg bg-body-tertiary"
            data-bs-theme="dark"
            style={{
              border: expandedIndex === index ? 'none' : '1px solid white', 
              borderBottom: expandedIndex === index ? 'none' : '1px solid white' 
            }}
          >
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id={`navbarSupportedContent-${index}`}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="#"> {hostel} </a>
                  </li>
                </ul>

                <div className="d-flex align-items-center ms-auto">
                  {renderRatingStars(averageRatings[hostel] || 0)}
                </div>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => handleExpandClick(index)}
                >
                   {expandedIndex === index ? '\u25B2' : '\u25BC'} 
                </button>
              </div>
            </div>
          </nav>
          {expandedIndex === index && renderExtraContent(hostel)}
        </div>
      ))}
    </div>
  );
}
