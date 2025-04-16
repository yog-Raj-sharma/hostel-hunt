import React, { useContext, useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {jwtDecode} from 'jwt-decode';
import PageStateContext from '../contexts/PageStateContext';
import FoodItems from './FoodItems';

const OUTLETS = [
  'Wrapchick', 'Sips & Bite', 'Dessert Club', 'Bombay Munchurry', 'Pizza Nation', 
  'Chai Nagari', 'Kabir Store', 'Stationary', "Men's Salon", "Women's Salon",
  'Airtel', 'NesCafe', 'Aahar(Uncle)', 'Aahar(Auntty)', 'Old Aahar', 
  'G-block Cafeteria', "Jaggi's Coffee Shop", "Jaggi's Juice Shop", 'Hostel H Canteen'
];

export default function Outlets() {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [showFoodItems, setShowFoodItems] = useState({});
  const [roomDetails, setRoomDetails] = useState({});
  const [commentText, setCommentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchedRooms, setSearchedRooms] = useS
  const { outletsState, setOutletsState } = useContext(PageStateContext);
  
  const [averageRatings, setAverageRatings] = useState(outletsState.averageRatings || {});
  const [userRatings, setUserRatings] = useState(outletsState.userRatings || {});

  useEffect(() => {
    setOutletsState(prev => ({
      ...prev,
      averageRatings: averageRatings,
    }));
  }, [averageRatings, setOutletsState]);

  useEffect(() => {
    setOutletsState(prev => ({
      ...prev,
      userRatings: userRatings,
    }));
  }, [userRatings, setOutletsState]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return null;
    }
    try {
      const decodedToken = jwtDecode(token);
      const expiry = decodedToken.exp * 1000;
      if (Date.now() > expiry) {
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

  const fetchAverageRatings = useCallback(async () => {
    try {
      const requests = OUTLETS.map(async (outlet) => {
        try {
          const response = await fetch(
            `https://hostel-hunt-1.onrender.com/api/outlet/${encodeURIComponent(outlet)}/average-rating`
          );
          if (!response.ok) {
            const text = await response.text();
            console.error(`Failed to fetch average rating for ${outlet}: ${text}`);
            return { outlet, rating: 0 };
          }
          const data = await response.json();
          return { outlet, rating: data.averageRating || 0 };
        } catch (error) {
          console.error(`Error fetching average rating for ${outlet}:`, error);
          return { outlet, rating: 0 };
        }
      });
      const results = await Promise.all(requests);
      const newAvgRatings = results.reduce((acc, { outlet, rating }) => {
        acc[outlet] = rating;
        return acc;
      }, {});
      setAverageRatings(newAvgRatings);
    } catch (error) {
      console.error('Failed to fetch average ratings:', error);
    }
  }, []);

  const fetchUserRatings = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
    try {
      const requests = OUTLETS.map(async (outlet) => {
        try {
          const response = await fetch(
            `https://hostel-hunt-1.onrender.com/api/outlet/${encodeURIComponent(outlet)}/user-rating/${userId}`
          );
          if (!response.ok) {
            const text = await response.text();
            console.error(`Failed to fetch user rating for ${outlet}: ${text}`);
            return { outlet, rating: 0 };
          }
          const data = await response.json();
          return { outlet, rating: data.rating || 0 };
        } catch (error) {
          console.error(`Error fetching user rating for ${outlet}:`, error);
          return { outlet, rating: 0 };
        }
      });
      const results = await Promise.all(requests);
      const newUserRatings = results.reduce((acc, { outlet, rating }) => {
        acc[outlet] = rating;
        return acc;
      }, {});
      setUserRatings(newUserRatings);
    } catch (error) {
      console.error('Failed to fetch user ratings:', error);
    }
  }, []);

  useEffect(() => {
    fetchAverageRatings();
    fetchUserRatings();
  }, [fetchAverageRatings, fetchUserRatings]);

  const handleExpandClick = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const toggleFoodItems = (outlet) => {
    setShowFoodItems(prev => ({ ...prev, [outlet]: !prev[outlet] }));
  };

  const handleStarClick = (outlet, rating) => {
    setSelectedRatings(prev => ({ ...prev, [outlet]: rating }));
  };

  const handleRateSubmit = async (outlet) => {
    const rating = selectedRatings[outlet];
    if (!rating) return;
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('Failed to get user ID from token');
      return;
    }
    try {
      console.log('Sending rating data:', { outlet, user: userId, rating });
      const response = await fetch('https://hostel-hunt-1.onrender.com/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlet, user: userId, rating }),
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

  const handleSearch = async (outlet) => {
    const roomNumber = searchedRooms[outlet]?.trim();
    if (!roomNumber) {
      setRoomDetails(prevDetails => ({ ...prevDetails, [outlet]: null }));
      return;
    }
    try {
      const response = await fetch('https://hostel-hunt-1.onrender.com/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlet, roomNumber }),
      });
      if (!response.ok) {
        console.error('Failed to search room:', response.statusText);
        return;
      }
      const roomData = await response.json();
      if (roomData.comments && Array.isArray(roomData.comments)) {
        roomData.comments.reverse();
      }
      setRoomDetails(prevDetails => ({ ...prevDetails, [outlet]: roomData }));
    } catch (error) {
      console.error('Failed to search room:', error);
    }
  };

  const renderExtraContent = (outlet) => (
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
          {[...Array(5)].map((_, idx) => (
            <span
              key={idx}
              className="text-warning"
              style={{ cursor: 'pointer' }}
              onClick={() => handleStarClick(outlet, idx + 1)}
            >
              {idx < (selectedRatings[outlet] || userRatings[outlet] || 0)
                ? '\u2605'
                : '\u2606'}
            </span>
          ))}
          <button className="btn btn-secondary ms-2" onClick={() => handleRateSubmit(outlet)}>
            Rate
          </button>
        </div>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-success d-flex align-items-center"
            style={{ padding: '5px 10px' }}
            onClick={() => toggleFoodItems(outlet)}
          >
            Food Items
          </button>
        </div>
      </div>
      {showFoodItems[outlet] && <FoodItems outlet={outlet} />}
    </div>
  );

  const renderRatingStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    return (
      <>
        {[...Array(fullStars)].map((_, idx) => (
          <span key={idx} className="text-warning">
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
            <span className="text-warning">{'\u2606'}</span>
          </span>
        )}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, idx) => (
          <span key={idx} className="text-warning">
            {'\u2606'}
          </span>
        ))}
      </>
    );
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {OUTLETS.map((outlet, index) => (
        <div
          key={index}
          className="s"
          data-bs-theme="dark"
          style={{
            backgroundColor: 'rgba(33, 37, 41, 0.8)',
            padding: '16px',
            border: expandedIndex === index ? 'none' : '1px solid white',
            borderBottom: expandedIndex === index ? 'none' : '1px solid white',
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            onClick={() => handleExpandClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ color: '#c0c0c0' }}>{outlet}</span>
            <div className="d-flex align-items-center">
              {renderRatingStars(averageRatings[outlet] || 0)}
              <span
                className="ms-2"
                style={{
                  border: 'solid white',
                  borderWidth: '0 2px 2px 0',
                  display: 'inline-block',
                  padding: '3px',
                  transform: expandedIndex === index ? 'rotate(225deg)' : 'rotate(45deg)',
                }}
              />
            </div>
          </div>
          {expandedIndex === index && renderExtraContent(outlet)}
        </div>
      ))}
    </div>
  );
}
