import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTheme } from '../Context/ThemeContext';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navbarStyle = {
    backgroundColor: isDarkMode ? '#fff' : '#fcb041', // matches your MainLayout
    color: isDarkMode ? '#c9d1d9' : '#000000',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'center',
    padding: '1rem 2rem',
    transition: 'all 0.3s ease-in-out',
  };

  const linkStyle = {
    color: isDarkMode ? '#c9d1d9' : '#000000',
    textTransform: 'uppercase',
    textDecoration: 'none',
    marginLeft: '15px',
    fontWeight: 'bold',
  };

  return (
    <div style={navbarStyle}>
      <img
        src={logo}
        alt="Logo"
        width="200px"
        height="60px"
        style={{ objectFit: 'cover' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/user" style={linkStyle}>
            Users
          </Link>
          <Link to="/about" style={linkStyle}>
            About Us
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: isDarkMode ? '' : '#161b22',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {isDarkMode ? '☀ ' : '🌙 '}
        </button>
        <button className="menu-toggle" onClick={toggleMenu}>
          <RxHamburgerMenu />
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <IoMdClose />
          </button>
          <Link to="/" onClick={() => setIsOpen(false)} style={linkStyle}>
            Home
          </Link>
          <Link to="/user" onClick={() => setIsOpen(false)} style={linkStyle}>
            Users
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} style={linkStyle}>
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
