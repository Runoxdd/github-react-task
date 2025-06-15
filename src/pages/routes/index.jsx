import SearchBar from '../../components/SearchBar';
import MainLayout from '../../Layout/MainLayout';
import Home from '../Home/Home';

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
        path: '/searchbar',
        element: <SearchBar />,
      },
    ],
  },
];
