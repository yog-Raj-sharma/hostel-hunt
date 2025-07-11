import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import imageCompression from 'browser-image-compression';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function RoomDetails({ roomDetails = { comments: [] }, setRoomDetails, roomNumber, handleSearch }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [userNames, setUserNames] = useState({});

  const handleClose = () => setIsVisible(false);

  const fetchUserName = useCallback(async (userId) => {
    if (userNames[userId]) return userNames[userId];
    try {
      const res = await fetch(`https://hostel-hunt-1.onrender.com/api/profile/${userId}`);
      const data = await res.json();
      setUserNames(prev => ({ ...prev, [userId]: data.name }));
      return data.name;
    } catch {
      return 'Unknown';
    }
  }, [userNames]);

  useEffect(() => {
    const fetchAll = async () => {
      const ids = [...new Set(roomDetails.comments.map(c => c.userId))];
      for (let id of ids) await fetchUserName(id);
    };
    fetchAll();
  }, [roomDetails.comments, fetchUserName]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      if (Date.now() > decoded.exp * 1000) {
        localStorage.removeItem('authToken');
        return null;
      }
      return decoded.userId;
    } catch {
      return null;
    }
  };

  const handleFileChange = (e) => {
    setSelectedImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const compressAndUpload = async (file) => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });
    const fileRef = ref(storage, `uploads/${uuidv4()}-${compressed.name}`);
    await uploadBytes(fileRef, compressed);
    return await getDownloadURL(fileRef);
  };

  const handleCommentSubmit = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const images = [];
    for (const file of selectedImages) {
      const url = await compressAndUpload(file);
      images.push(url);
    }

    const res = await fetch(`https://hostel-hunt-1.onrender.com/api/rooms/${roomDetails.hostel}/${roomDetails.roomNumber}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText, userId, images }),
    });

    if (res.ok) {
      setCommentText('');
      setSelectedImages([]);
      handleSearch(roomDetails.hostel);
    }
  };

  const handleImageClick = (src) => {
    setCurrentImage(src);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return isVisible && (
    <div className="mt-4 p-4 position-relative" style={{ backgroundColor: 'white', borderRadius: '8px', height: '500px', overflowY: 'auto' }}>
      <button onClick={handleClose} style={{
        position: 'absolute', top: '10px', right: '10px', backgroundColor: '#FF6F61', border: 'none',
        borderRadius: '50%', width: '40px', height: '40px', fontSize: '16px', color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer'
      }}>&times;</button>

      <h5 style={{ color: 'black' }}>{`${roomDetails.hostel} - Room ${roomDetails.roomNumber}`}</h5>

      <textarea className="form-control" placeholder="Enter your comment"
        value={commentText} onChange={(e) => setCommentText(e.target.value)} />
      <input type="file" multiple className="form-control mt-2" onChange={handleFileChange} />
      {selectedImages.length > 0 && (
        <ul className="mt-2">{selectedImages.map((f, i) => <li key={i}>{f.name}</li>)}</ul>
      )}
      <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>Post</button>

      <div className="card p-3 mb-3 shadow-sm bg-light text-dark">
        {roomDetails.comments.map((comment, i) => (
          <div key={i} className="mb-4 p-3 bg-light border border-secondary rounded">
            <p style={{ color: 'black' }}>
              <strong>{userNames[comment.userId] || 'Loading...'}</strong>
              <span style={{ marginLeft: '10px', color: 'gray', fontSize: '12px' }}>
                Posted on: {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </p>
            <p style={{ color: 'black' }}>{comment.text}</p>
            {comment.images?.map((img, idx) => (
              <img key={idx} src={img} alt="Uploaded" loading="lazy"
                style={{ width: '100px', marginRight: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(img)} />
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div onClick={handleCloseModal} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: '1050'
        }}>
          <img src={currentImage} alt="Zoomed" style={{
            maxWidth: '90%', maxHeight: '90%', cursor: 'pointer'
          }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
