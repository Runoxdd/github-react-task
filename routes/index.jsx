import React from 'react';
import MainLayout from '../src/Layout/MainLayout';
import Home from '../src/pages/Home/Home';

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
];
