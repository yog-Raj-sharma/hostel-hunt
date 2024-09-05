import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Sell() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', image: null, price: '', contact: '' });
  const [showForm, setShowForm] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleAddItemClick = () => {
    setShowForm(true);
  }; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, image: file });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('price', newItem.price);
    formData.append('contact', newItem.contact);
    formData.append('image', newItem.image);

    const token = localStorage.getItem('authToken');
    const userId = parseToken(token).userId; 
    formData.append('userId', userId);

    try {
      await axios.post('http://localhost:3001/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewItem({ name: '', image: null, price: '', contact: '' });
      setShowForm(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const parseToken = (token) => {
    return JSON.parse(atob(token.split('.')[1]));
  };

  const handleImageClick = (src) => {
    setImageSrc(src);
    setShowImage(true);
  };

  const handleCloseModal = () => {
    setShowImage(false);
  };

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
        style={{ flexBasis: '25%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {item.name}
      </span>
      <div
        style={{ flexBasis: '10%', display: 'flex', justifyContent: 'center' }}
      >
        <img
          src={`http://localhost:3001/${item.image}`}
          alt={item.name}
          style={{ width: '50px', height: '50px', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => handleImageClick(`http://localhost:3001/${item.image}`)}
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
        style={{ flexBasis: '25%', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {item.contact}
      </span>
    </div>
  </nav>
))}
      {showImage && (
        <div className="modal show" style={{ display: 'block', position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%' }}>
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
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
