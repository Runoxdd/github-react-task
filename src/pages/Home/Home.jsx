import React, { useEffect, useState } from 'react';
import SearchBar from '../Search/SearchBar';
import axios from 'axios';
import RepoList from '../Search/RepoList';

const Home = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${input}`
        );
        setSuggestions(response.data.items.slice(0, 10));
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [input]);

  const fetchUserData = async (username) => {
    setLoading(true);
    setError('');
    setUserData(null);
    setRepos([]);
    setSuggestions([]);
    try {
      const userRes = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const repoRes = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      setUserData(userRes.data);
      setRepos(repoRes.data);
      setLoading(false);
      setInput('');
    } catch {
      setError('User not found or something went wrong.');
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        fetchUserData(suggestions[0].login);
      } else {
        fetchUserData(input);
      }
    }
  };

  const handleSuggestionClick = (username) => {
    fetchUserData(username);
  };

  const mostStarredRepo = repos.reduce(
    (max, repo) =>
      repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max,
    {}
  );

  const paginatedRepos = repos.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(repos.length / perPage);

  return (
    <div className="container mt-4">
      <h2>GitHub User Search</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search GitHub users"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-primary"
          onClick={() => fetchUserData(input)}
        >
          Enter
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="list-group mb-3">
          {suggestions.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSuggestionClick(user.login)}
            >
              <img
                src={user.avatar_url}
                alt="avatar"
                className="rounded-circle me-2"
                width={30}
                height={30}
              />
              {user.login}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {userData && (
        <div className="card mb-4 p-3">
          <img
            src={userData.avatar_url}
            alt="avatar"
            className="rounded-circle mb-2"
            width="100"
          />
          <h3>{userData.name || userData.login}</h3>
          <p>{userData.bio}</p>
          <p>
            Repos: {userData.public_repos} | Followers: {userData.followers}
          </p>
        </div>
      )}
      {paginatedRepos.length > 0 && (
        <RepoList
          repos={paginatedRepos}
          mostStarred={mostStarredRepo}
          page={currentPage}
          totalPages={totalPages}
          setPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Home;
