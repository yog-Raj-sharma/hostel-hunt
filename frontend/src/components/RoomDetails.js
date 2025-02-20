import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from 'jwt-decode'; 

function RoomDetails({ roomDetails = { comments: [] }, setRoomDetails, roomNumber, handleSearch, onCommentSubmit }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [userNames, setUserNames] = useState({});
 
  const handleClose = () => {
    setIsVisible(false);
  };

  const fetchUserName = useCallback(async (userId) => {
    if (userNames[userId]) {
      return userNames[userId]; 
    }

    try {
      const response = await fetch(`https://hostel-hunt-1.onrender.com/api/profile/${userId}`);
      if (!response.ok) {
        console.error('Failed to fetch user name:', response.statusText);
        return 'Unknown User';
      }

      const data = await response.json();
      const userName = data.name;

      setUserNames((prevNames) => ({
        ...prevNames,
        [userId]: userName, 
      }));

      return userName;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Unknown User';
    }
  }, [userNames]); 


  useEffect(() => {
    const fetchAllUserNames = async () => {
      const uniqueUserIds = [...new Set(roomDetails.comments.map((comment) => comment.userId))];
      for (const userId of uniqueUserIds) {
        await fetchUserName(userId); 
      }
    };

    fetchAllUserNames();
  }, [roomDetails.comments, fetchUserName]); 

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

  const handleFileChange = (e) => {
    setSelectedImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
  };

  const handleCommentSubmit = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) return;

      const formData = new FormData();
      formData.append('text', commentText);
      formData.append('userId', userId);
      selectedImages.forEach((image) => {
       formData.append('images', image);
      });

      const response = await fetch(`https://hostel-hunt-1.onrender.com/api/rooms/${roomDetails.hostel}/${roomDetails.roomNumber}/comments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to post comment:', text);
        return;
      }
      setCommentText('');
      setSelectedImages([]);

      handleSearch(roomDetails.hostel); 
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleImageClick = (imageSrc) => {
    setCurrentImage(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    isVisible && roomDetails && (
      <div 
        className="mt-4 p-4 position-relative" 
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          height: '500px', 
          overflowY: 'auto' 
        }}
      >

        <button 
          onClick={handleClose} 
          style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            backgroundColor: '#FF6F61',  
            border: 'none', 
            borderRadius: '50%',  
            width: '40px',  
            height: '40px',  
            fontSize: '16px',  
            color: '#FFF',  
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',  
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',  
          }} 
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FF4C4C'} 
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6F61'}  
        >
          &times;
        </button>
        <h5 style={{ color: 'black' }}>{`${roomDetails.hostel} - Room ${roomDetails.roomNumber}`}</h5>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Enter your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          
          <div>
            <input
              type="file"
              className="form-control mt-2"
              multiple
              onChange={handleFileChange}
            />

            <div className="mt-2">
              {selectedImages.length > 0 && (
                <ul>
                  {selectedImages.map((file, index) => (
                    <li key={index} style={{ color: 'black' }}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>Post</button>
        </div>
        <div>
          <div className="card p-3 mb-3 shadow-sm bg-light text-dark">
             {roomDetails.comments?.map((comment, index) => (
  <div key={index} className="mb-4 p-3 bg-light border border-secondary rounded">
    <p style={{ color: 'black' }}>
      <strong>{userNames[comment.userId] || 'Loading...'}</strong> 
       <span style={{ marginLeft: '10px', color: 'gray', fontSize: '12px' }}>
      Posted on:  {new Date(comment.timestamp).toLocaleDateString()} 
      </span>

    </p>
    <p style={{ color: 'black' }}>{comment.text}</p>
    {comment.images.map((image, idx) => (
      <img
        key={idx}
        src={`https://hostel-hunt-1.onrender.com/${image}`}
        alt={`Uploaded by ${userNames[comment.userId] || 'User'}`}
        style={{ width: '100px', marginRight: '10px', cursor: 'pointer' }}
        onClick={() => handleImageClick(`https://hostel-hunt-1.onrender.com/${image}`)}
        loading='lazy'
      />
    ))}
  </div>
))}

          </div>
        </div>
        {showModal && (
          <div 
            style={{ 
              position: 'fixed', 
              top: '0', 
              left: '0', 
              width: '100%', 
              height: '100%', 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              zIndex: '1050' 
            }}
            onClick={handleCloseModal}
          >
            <img 
              src={currentImage} 
              alt="Zoomed" 
              loading='lazy'
              style={{ 
                maxWidth: '90%', 
                maxHeight: '90%', 
                cursor: 'pointer' 
              }}
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}
      </div>
    )
  );
}

export default RoomDetails;
