import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="new-navbar">
      <div className="navbar-left">
        {/* Placeholder for logo - will be added later */}
        <div className="navbar-logo">
          <div className="logo-circle">
            <span>S</span>
          </div>
        </div>
        
        <Link to="/" className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
          Home
        </Link>
        
        <Link to="/movies" className={location.pathname === '/movies' ? 'nav-item active' : 'nav-item'}>
          Movies
        </Link>
        
        <Link to="/concerts" className={location.pathname === '/concerts' ? 'nav-item active' : 'nav-item'}>
          Concerts
        </Link>
        
        <Link to="/comedy" className={location.pathname === '/comedy' ? 'nav-item active' : 'nav-item'}>
          Comedy
        </Link>
      </div>
      
      <div className="navbar-right">
        <div className="auth-button">
          <span>Sign In</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 