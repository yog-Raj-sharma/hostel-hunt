import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage'; // Import the LoginPage component
import SignUpPage from './components/SignUpPage';
import YourProfile from './components/YourProfile';
function App() {
  return (
    <Router>
      <Routes>
        {/* Set LoginPage as the default route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Route for the NavBar after login */}
        <Route path="/navbar" element={<NavBar />} />
         <Route path="/profile" element={<YourProfile/>} />
      </Routes>
    </Router> );
}

export default App;
