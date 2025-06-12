import React from 'react';

const Footer = () => {
  return (
    <div
      style={{
        position: 'fixed',
        marginTop: 'auto',
        bottom: '0',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: '50px',
        color: '#fff',
        padding: '10px',
      }}
    >
      <p>&copy;2025</p>
      <p>Group Task</p>
    </div>
  );
};

export default Footer;
