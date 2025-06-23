import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../pages/Footer/Footer';
import { useTheme } from '../Context/ThemeContext';

const MainLayout = () => {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#0d1117' : '#fcb041';
  const textColor = isDarkMode ? '#c9d1d9' : '#000000';

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        minHeight: '100vh',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
