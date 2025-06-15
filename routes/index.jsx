import React from 'react';
import MainLayout from '../src/Layout/MainLayout';
import Home from '../src/pages/Home/Home';
import User from '../src/pages/User';
import Footer from '../src/pages/Footer/Footer';
import About from '../src/components/About';

export const routes = [
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path:'/user',
        element: <User/>,
      },
      {
        path:'/about',
        element: <About/>,
      },
      {
        path:'/footer',
        element: <Footer/>,
      },
    ],
  },
];
