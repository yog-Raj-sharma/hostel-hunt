import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageStateContext from '../contexts/PageStateContext';
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


const API_BASE_URL = 'https://hostel-hunt-1.onrender.com';

const parseToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export default function Sell() {
  const { sellState, setSellState } = useContext(PageStateContext);
  const [items, setItems] = useState(sellState.items || []);
  const [newItem, setNewItem] = useState(
    sellState.newItem || { name: '', image: null, price: '', contact: '' }
  );
  const [showForm, setShowForm] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setSellState((prev) => ({
      ...prev,
      items: items,
      newItem: newItem,
    }));
  }, [items, newItem, setSellState]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Unable to get items from backend:', error);
    }
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) {
      fetchItems();
    }
  }, [fetchItems, items]);

  const handleAddItemClick = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    setNewItem((prev) => ({ ...prev, image: file }));
  }, []);

const compressAndUploadImage = async (file) => {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  });

  const storageRef = ref(storage, `items/${uuidv4()}-${compressed.name}`);
  await uploadBytes(storageRef, compressed);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};


 const handleSubmit = useCallback(async () => {
  const token = localStorage.getItem('authToken');
  const parsedToken = parseToken(token);
  const userId = parsedToken ? parsedToken.userId : null;
  if (!userId) return;

  try {
    const imageUrl = await compressAndUploadImage(newItem.image); 

    const payload = {
      name: newItem.name,
      price: newItem.price,
      contact: newItem.contact,
      image: imageUrl,      
      userId: userId
    };

    await axios.post(`${API_BASE_URL}/api/items`, payload);
    setNewItem({ name: '', image: null, price: '', contact: '' });
    setShowForm(false);
    fetchItems();
  } catch (error) {
    console.error('Failed to save item:', error);
  }
}, [newItem, fetchItems]);


  const handleImageClick = useCallback((src) => {
    setImageSrc(src);
    setShowImage(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowImage(false);
  }, []);

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Sell</span>
          <button className="btn btn-outline-light" onClick={handleAddItemClick}>
            + Add an Item
          </button>
        </div>
      </nav>

      {showForm && (
        <nav
          className="navbar"
          style={{
            backgroundColor: 'rgba(52, 58, 64, 0.6)',
            borderTop: '1px solid white',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Item Name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              style={{ width: '18%' }}
            />
            <div className="me-2" style={{ width: '18%' }}>
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="imageUpload"
                className="btn w-100 text-dark"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ced4da',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>+</span>
                {newItem.image ? newItem.image.name : 'Add Item Image'}
              </label>
            </div>
            <div className="input-group input-group-sm me-2" style={{ width: '18%' }}>
              <span className="input-group-text">INR</span>
              <input
                type="number"
                className="form-control"
                placeholder="Item Price"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Contact Info"
              name="contact"
              value={newItem.contact}
              onChange={handleInputChange}
              style={{ width: '18%' }}
            />
            <button className="btn btn-success btn-sm" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </nav>
      )}

      {items.map((item) => (
        <nav
          className="navbar navbar-dark bg-dark"
          key={item._id}
          style={{ marginTop: '1rem', padding: '1rem' }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <span
              className="text-white"
              style={{
                flexBasis: '25%',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.name}
            </span>
            <div style={{ flexBasis: '10%', display: 'flex', justifyContent: 'center' }}>
              <img
                src={`${API_BASE_URL}/${item.image}`}
                alt={item.name}
                style={{ width: '50px', height: '50px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => handleImageClick(`${API_BASE_URL}/${item.image}`)}
                loading="lazy"
              />
            </div>
            <span
              className="text-white"
              style={{ flexBasis: '15%', textAlign: 'center', whiteSpace: 'nowrap' }}
            >
              INR {item.price}
            </span>
            <span
              className="text-white"
              style={{
                flexBasis: '25%',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.contact}
            </span>
          </div>
        </nav>
      ))}

      {showImage && (
        <div
          className="modal show"
          style={{
            display: 'block',
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '80%',
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item Image</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body d-flex justify-content-center">
                <img
                  src={imageSrc}
                  alt="Enlarged Item"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
