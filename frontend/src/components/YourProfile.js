import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export default function YourProfile() {
  const [userInfo, setUserInfo] = useState({ name: '', year: '' });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      fetchUserInfo(userId);
      fetchUserItems(userId);
    } else {
      console.error('No token found');
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/profile/${userId}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchUserItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user-items/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleMarkAsSold = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      await axios.delete(`http://localhost:3001/api/items/${itemId}`, { data: { userId } });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to mark item as sold:', error);
    }
  };

  function getYearSuffix(year) { 
  if (year === '1') return 'st';
  if (year === '2') return 'nd';
  if (year === '3') return 'rd';
  if (year === '4') return 'th';
  
}
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-4">Your Profile</h1>
          <div className="card p-3 mb-4 shadow-sm">
            <div className="card-body">
              <p className="card-text"><strong>Name:</strong> {userInfo.name}</p>
              <p className="card-text"><strong>Current Year:</strong> {userInfo.year}{getYearSuffix(userInfo.year)}</p>
              <p className="card-text"><strong>Gender:</strong> {userInfo.gender}</p>
              </div>
          </div>
          <h2 className="mb-4">Your Activity</h2>
          {items.length > 0 ? (
            <div className="row">
              {items.map(item => (
                <div key={item._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-success">INR {item.price}</p>
                      <button className="btn btn-danger" onClick={() => handleMarkAsSold(item._id)}>
                        Mark as Sold
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">You have no items listed for sale.</p>
          )}
        </div>
      </div>
    </div>
  );
}
