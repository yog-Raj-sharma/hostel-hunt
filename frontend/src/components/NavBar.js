import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Hostel from './Hostel';
import Outlets from './Outlets';
import Sell from './Sell&Purchase';
import YourProfile from './YourProfile'; 

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#4a4d53';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleComponent = (component) => {
    setActiveComponent(prevComponent => prevComponent === component ? null : component);
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/LoginPage'); 
  };

  const handleContactUs = () => {
    window.location.href = "mailto:linkitallnow@gmail.com";
  };

  const navbarStyle = {
    backgroundColor: darkMode ? '#2c2f33' : '#F2F2F2',
    color: darkMode ? '#ffffff' : '#000000',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: '1000',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={navbarStyle}>
        <div className="container-fluid">
          <div className="dropdown">
            <button
              className="btn"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ padding: '6px 12px', color: navbarStyle.color }}
            >
              <span
                className="navbar-toggler-icon"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'><path stroke='${encodeURIComponent(navbarStyle.color)}' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/></svg>")`
                }}
              ></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
  <button 
    className="dropdown-item" 
    onClick={() => toggleComponent('profile')} 
    style={{ background: 'none', border: 'none',  padding: '5px 15px', color: 'black', textDecoration: 'none', cursor: 'pointer' }}>
    Your Profile
  </button>
</li> 
<li>
  <button 
    className="dropdown-item" 
    onClick={handleSignOut} 
    style={{ background: 'none', border: 'none',  padding: '5px 15px',  color: 'black', textDecoration: 'none', cursor: 'pointer' }}>
    Sign Out
  </button>
</li>
<li>
  <button 
    className="dropdown-item" 
    onClick={handleContactUs} 
    style={{ background: 'none', border: 'none',  padding: '5px 15px',  color: 'black', textDecoration: 'none', cursor: 'pointer' }}>
    Contact Us
  </button>
</li>
            </ul>
          </div>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span
              className="navbar-toggler-icon"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'><path stroke='${encodeURIComponent(navbarStyle.color)}' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/></svg>")`
              }}
            ></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
  <button 
    className="nav-link" 
    onClick={() => toggleComponent('hostels')} 
    style={{ background: 'none', border: 'none', padding: '0 10px', color: navbarStyle.color, textDecoration: 'none', cursor: 'pointer' }}>
    Hostel
  </button>
</li>
<li className="nav-item">
  <button 
    className="nav-link" 
    onClick={() => toggleComponent('outlets')} 
    style={{ background: 'none', border: 'none', padding: '0 10px', color: navbarStyle.color, textDecoration: 'none', cursor: 'pointer' }}>
    Outlet/Store
  </button>
</li>
<li className="nav-item">
  <button 
    className="nav-link" 
    onClick={() => toggleComponent('sell')} 
    style={{ background: 'none', border: 'none', padding: '0 10px', color: navbarStyle.color, textDecoration: 'none', cursor: 'pointer' }}>
    Sell/Purchase
  </button>
</li>
            </ul>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="darkModeToggle"
                checked={darkMode}
                onChange={handleToggleDarkMode}
                style={{ cursor: 'pointer' }}
              />
              <label className="form-check-label" htmlFor="darkModeToggle" style={{ color: navbarStyle.color }}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </label>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: '60px' }}>
        {activeComponent === 'hostels' && <Hostel />}
        {activeComponent === 'outlets' && <Outlets />}
        {activeComponent === 'sell' && <Sell />}
        {activeComponent === 'profile' && <YourProfile />} 
      </div>
    </>
  );
}  
