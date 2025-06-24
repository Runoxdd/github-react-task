import React from 'react';
import homeImg from '../../assets/search.png';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="homepage">
        <div className="text-box">
          <h1 className="main-heading">
            Easy & fast way to search for github users
          </h1>
          <p className="welcome-text">
            Find any user on github effortlessly with just a click on the search
            button below.{' '}
          </p>

          <Link to="/user">
            <button className="btn btn-primary custom-purple-btn-override">
              Search
            </button>
          </Link>
        </div>
        <img src={homeImg} alt="Home" className="search-image" />
      </div>
    </div>
  );
};

export default Home;
