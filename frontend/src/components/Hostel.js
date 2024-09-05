import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { jwtDecode } from 'jwt-decode';
import RoomDetails from './RoomDetails';

export default function Hostel() {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [roomDetails, setRoomDetails] = useState({});

  const [commentText, setCommentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchedRooms, setSearchedRooms] = useState({});
  const [userRatings, setUserRatings] = useState({});

    const fetchAverageRatings = useCallback(async () => {
    try {
      const hostels = [
        'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E',
        'Hostel F', 'Hostel FR-F', 'Hostel FR-G', 'Hostel G', 'Hostel H',
        'Hostel I', 'Hostel J', 'Hostel K', 'Hostel L', 'Hostel M',
        'Hostel N', 'Hostel O', 'Hostel PG', 'Hostel Q'
      ];

      const avgRatings = {};

      for (const hostel of hostels) {
        const response = await fetch(`https://hostel-hunt-1.onrender.com/api/hostel/api/hostel/${encodeURIComponent(hostel)}/average-rating`);

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
  }, []);

    const fetchUserRatings = useCallback(async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) return;

      const ratings = {};

    for (const hostel of [
      'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E',
      'Hostel F', 'Hostel FR-F', 'Hostel FR-G', 'Hostel G', 'Hostel H',
      'Hostel I', 'Hostel J', 'Hostel K', 'Hostel L', 'Hostel M',
      'Hostel N', 'Hostel O', 'Hostel PG', 'Hostel Q'
    ]) {
      const response = await fetch(`https://hostel-hunt-1.onrender.com/api/hostel/api/hostel/${encodeURIComponent(hostel)}/user-rating/${userId}`);
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
  }, []);

   
    useEffect(() => {
    fetchAverageRatings();
    fetchUserRatings();
  }, [fetchAverageRatings, fetchUserRatings]);

   const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
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

      const response = await fetch('https://hostel-hunt-1.onrender.com/api/hostel/api/rate', {
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

  const handleSearch = async (hostel) => {
  const roomNumber = searchedRooms[hostel]?.trim();

  if (!roomNumber) {
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [hostel]: null,
    }));
    return;
  }

  try {
    const response = await fetch('https://hostel-hunt-1.onrender.com/api/hostel/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostel, roomNumber }),
    });

    if (!response.ok) {
      console.error('Failed to search room:', response.statusText);
      return;
    }

    const roomData = await response.json();
    if (roomData.comments && Array.isArray(roomData.comments)) {
      roomData.comments.reverse();
    }
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [hostel]: roomData,
    }));
  } catch (error) {
    console.error('Failed to search room:', error);
  }
};

const renderExtraContent = (hostel) => {
  

  return (
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
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search room"
            aria-label="Search"
            style={{ width: '200px' }}
            value={searchedRooms[hostel] || ''}
            onChange={(e) => {
              const newRoomNumber = e.target.value;
              setSearchedRooms({ ...searchedRooms, [hostel]: newRoomNumber });

              
              if (!newRoomNumber.trim()) {
                setRoomDetails((prevDetails) => ({
                  ...prevDetails,
                  [hostel]: null,
                }));
              }
            }}
          />
          <button
            className="btn btn-outline-success"
            onClick={() => handleSearch(hostel)}
            disabled={!searchedRooms[hostel]?.trim()} 
          >
            Search
          </button>
        </div>
      </div>
      <div>
        {roomDetails[hostel] && roomDetails[hostel] !== null && (
          <RoomDetails
            roomDetails={roomDetails[hostel]}
            commentText={commentText}
            setCommentText={setCommentText}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            handleSearch={handleSearch}
            hostel={hostel}
          />
        )}
      </div>
    </div>
  );
};




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
        'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E',
        'Hostel F', 'Hostel FR-F', 'Hostel FR-G', 'Hostel G', 'Hostel H',
        'Hostel I', 'Hostel J', 'Hostel K', 'Hostel L', 'Hostel M',
        'Hostel N', 'Hostel O', 'Hostel PG', 'Hostel Q'
      ].map((hostel, index) => (
        <div
          key={index}
          className="s"
          data-bs-theme="dark"
          style={{
            backgroundColor: 'rgba(33, 37, 41, 0.8) ',
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
            <span style={{ color: '#c0c0c0' }}>{hostel}</span>
            <div className="d-flex align-items-center">
              {renderRatingStars(averageRatings[hostel] || 0)}
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
          {expandedIndex === index && renderExtraContent(hostel)}
        </div>
      ))}
    </div>
  );
}
