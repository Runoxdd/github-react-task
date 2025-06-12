import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [globalInput, setGlobalInput] = useState('');
  const [globalResults, setGlobalResults] = useState([]);

  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Fetch suggestions
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
        setSuggestions(response.data.items.slice(0, 20));
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [input]);

  // Global search
  const handleGlobalSearch = async () => {
    if (globalInput.length < 2) return;
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${globalInput}`
      );
      setGlobalResults(response.data.items.slice(0, 20));
    } catch (err) {
      console.error(err);
      setGlobalResults([]);
    }
  };

  // Fetch user data and repos with language
  const fetchUserData = async (username) => {
    setLoading(true);
    setError('');
    setUserData(null);
    setRepos([]);
    setSuggestions([]);
    setGlobalResults([]);

    try {
      const userRes = await axios.get(`https://api.github.com/users/${username}`);
      const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);

      const reposWithLang = await Promise.all(
        repoRes.data.map(async (repo) => {
          try {
            const langRes = await axios.get(
              `https://api.github.com/repos/${username}/${repo.name}/languages`
            );
            const languages = langRes.data;
            const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0];
            return { ...repo, topLanguage: topLang || 'N/A' };
          } catch {
            return { ...repo, topLanguage: 'N/A' };
          }
        })
      );

      setUserData(userRes.data);
      setRepos(reposWithLang);
      
      setCurrentPage(1);
      setLoading(false);
      setInput('');
    } catch (err) {
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

      {/* Input 1: Suggestion + profile */}
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

      {/* Input 2: Global search */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Global Search GitHub users"
          value={globalInput}
          onChange={(e) => setGlobalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
        />
        <button className="btn btn-secondary" onClick={handleGlobalSearch}>
          Search
        </button>
      </div>

      {globalResults.length > 0 && (
        <div className="mb-4">
          <h5>Global Search Results</h5>
          <ul className="list-group">
            {globalResults.map((user) => (
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
        </div>
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
        <div>
          <h4>Repositories</h4>
          {paginatedRepos.map((repo) => (
            <div
              key={repo.id}
              className={`card p-3 mb-2 ${
                repo.id === mostStarredRepo.id ? 'bg-warning-subtle' : ''
              }`}
            >
              <h5>
                {repo.name}{' '}
                {repo.id === mostStarredRepo.id && (
                  <span className="badge bg-warning">⭐ Most Popular</span>
                )}
              </h5>
              <p>{repo.description}</p>
              <span className="badge bg-secondary">
                {repo.topLanguage}
              </span>
              <br />
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
