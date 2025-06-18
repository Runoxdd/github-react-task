import React from 'react';
import MainLayout from '../src/Layout/MainLayout';
import Home from '../src/pages/Home/Home';
import User from '../src/pages/User';
import Footer from '../src/pages/Footer/Footer';
import About from '../src/components/About';
import Profile from '../src/pages/Profile/Profile';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/user',
        element: <User />,
      },
      {
        path: 'profile/:username',
        element: <Profile />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/footer',
        element: <Footer />,
      },
    ],
  },
];
