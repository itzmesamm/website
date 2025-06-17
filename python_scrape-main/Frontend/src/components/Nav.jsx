// src/components/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; // Import the CSS file


const Nav = () => {
  return (
    <nav className="nav">
      <div className="nav-logo"><i className="bi bi-bar-chart-fill"></i>Track</div>
      <ul className="nav-links">
        <li><Link to="/wishlist" className="nav-link">Wishlist</Link></li>
        <li><Link to="/login" className="nav-link">Login</Link></li>
        <li><Link to="/signup" className="nav-link">Signup</Link></li>
      </ul>
    </nav>
    
  );
};

export default Nav;
