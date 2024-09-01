// RoomDetails.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

function RoomDetails({ roomDetails, setRoomDetails, roomNumber }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleClose = () => {
    setIsVisible(false);
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

  const handleCommentSubmit = async (hostel) => {
    try {
      const userId = getUserIdFromToken();

      if (!userId) return;

      const formData = new FormData();
      formData.append('text', commentText);
      formData.append('userId', userId);
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`http://localhost:3001/api/rooms/${roomDetails.hostel}/${roomDetails.roomNumber}/comments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to post comment:', text);
        return;
      }

      const updatedRoom = await response.json();

      setRoomDetails((prevDetails) => ({
        ...prevDetails,
        [roomNumber]: updatedRoom,
      }));

      setCommentText('');
      setSelectedImages([]);
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
        {/* Close button */}
        <button 
          onClick={handleClose} 
          style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            backgroundColor: '#FF6F61',  // Stylish coral color
            border: 'none', 
            borderRadius: '50%',  // Circular button
            width: '40px',  // Same size
            height: '40px',  // Same size
            fontSize: '16px',  // Slightly smaller font
            color: '#FFF',  // White text
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',  // Shadow for depth
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',  // Smooth transitions
          }} 
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FF4C4C'} // Hover effect
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6F61'}  // Revert on mouse out
        >
          &times;
        </button>

        {/* Room number and hostel name */}
        <h5 style={{ color: 'black' }}>{`${roomDetails.hostel} - Room ${roomDetails.roomNumber}`}</h5>

        {/* Comment input and file upload section */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Enter your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <input
            type="file"
            className="form-control mt-2"
            multiple
            onChange={(e) => setSelectedImages([...e.target.files])}
          />
          <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>Post</button>
        </div>

        {/* Display existing comments */}
         <div className="card p-3 mb-3 shadow-sm bg-light text-dark">
  {roomDetails.comments.map((comment, index) => (
    <div key={index} className="mb-4 p-3 bg-light border border-secondary rounded">
      {/* Username */}
      <strong style={{ color: 'black' }}>
        {comment.userName}
      </strong>

      {/* Gender */}
      <p style={{ color: 'gray' }}>
        {comment.userGender}
      </p>

      {/* Comment text */}
      <p style={{ color: 'black' }}>{comment.text}</p>

      {/* Images */}
      {comment.images.map((image, idx) => (
        <img
          key={idx}
          src={`http://localhost:3001/${image}`}
          alt={`Uploaded by ${comment.userName}`}
          style={{ width: '100px', marginRight: '10px', cursor: 'pointer' }}
          onClick={() => handleImageClick(`http://localhost:3001/${image}`)}
        />
      ))}
    </div>
  ))}
</div>




        {/* Custom Modal for image zoom */}
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
              style={{ 
                maxWidth: '90%', 
                maxHeight: '90%', 
                cursor: 'pointer' 
              }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking on the image
            />
          </div>
        )}
      </div>
    )
  );
}

export default RoomDetails;
