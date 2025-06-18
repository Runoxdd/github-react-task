import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../pages/Footer/Footer';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <div
      className="nav d-flex mx-auto mb-2 text-align "
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px auto',
      }}
    >
      <img
        src={logo}
        alt=""
        width="200px"
        height="60px"
        style={{ objectFit: 'cover' }}
      />
      <div style={{ display: 'flex', gap: '10px', marginRight: '10px' }}>
        <Link to="/">
          <p style={{ color: '#000', textTransform: 'uppercase' }}>Home</p>
        </Link>
        <Link to="/user">
          <p style={{ color: '#000', textTransform: 'uppercase' }}>Users</p>
        </Link>
        <Link to="/about">
          <p style={{ color: '#000', textTransform: 'uppercase' }}>About Us</p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
