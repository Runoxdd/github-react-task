import React from 'react';
import homeImg from '../../assets/search.png';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div
        className="homepage"
        style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'space-around',
          paddingTop: '20px',
        }}
      >
        <div className="text-box">
          <h1>Easy & fast way to search for github users Egg</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          <Link to="/user">
            <button className="btn btn-primary ">Search</button>
          </Link>
        </div>
        <img src={homeImg} alt="Home" />
      </div>
    </div>
  );
};

export default Home;
