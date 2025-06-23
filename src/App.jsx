import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from '../routes';
import { ThemeProvider } from './Context/ThemeContext';

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider>
      {routing}
    </ThemeProvider>
  );
}

export default App;
