import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const token = import.meta.env.VITE_GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
};

const FindUsers = ({ autoLoadLastUser = false }) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://api.github.com/search/users?q=${searchInput}`,
          { headers }
        );
        setSuggestions(res.data.items.slice(0, 15));
      } catch (err) {
        console.error('FindUsers: Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchInput]);

  const fetchUserData = useCallback(async (username) => {
    setError('');
    setUserData(null);
    setRepos([]);
    setSuggestions([]);
    setSearchInput(''); // Clear search input immediately

    // ⭐ IMPORTANT: Add an early exit if username is empty
    if (!username) {
      console.log(
        'FindUsers: fetchUserData called with empty username. Aborting.'
      );
      setError('Please enter a username to search.');
      return; // Exit early
    }

    console.log(`FindUsers: Attempting to fetch data for user: "${username}"`);

    try {
      const userRes = await axios.get(
        `https://api.github.com/users/${username}`,
        { headers }
      );
      console.log(`FindUsers: Successfully fetched user data for ${username}`); // NEW LOG

      const repoRes = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        { headers }
      );
      console.log(`FindUsers: Successfully fetched repo data for ${username}`); // NEW LOG

      const reposWithLang = await Promise.all(
        repoRes.data.map(async (repo) => {
          try {
            const langRes = await axios.get(
              `https://api.github.com/repos/${username}/${repo.name}/languages`,
              { headers }
            );
            const languages = langRes.data;
            const topLang = Object.entries(languages).sort(
              (a, b) => b[1] - a[1]
            )[0]?.[0];
            return { ...repo, topLanguage: topLang || 'N/A' };
          } catch (langError) {
            // Capture specific language error
            console.warn(
              `FindUsers: Could not fetch languages for ${repo.name}:`,
              langError
            ); // WARN, not error, as it's not critical
            return { ...repo, topLanguage: 'N/A' };
          }
        })
      );
      console.log(`FindUsers: Processed repos with languages for ${username}`); // NEW LOG

      setUserData(userRes.data);
      setRepos(reposWithLang);
      setCurrentPage(1);

      // --- CRITICAL PART FOR LOCAL STORAGE & EVENT ---
      const storedSearches = JSON.parse(
        localStorage.getItem('recentSearches') || '[]'
      );

      const updated = [
        username,
        ...storedSearches.filter((name) => name !== username),
      ];
      const trimmed = updated.slice(0, 5);

      localStorage.setItem('recentSearches', JSON.stringify(trimmed));
      console.log(
        'FindUsers: localStorage recentSearches updated to:',
        trimmed
      );

      // 👇 Dispatch event AFTER localStorage is updated
      console.log('FindUsers: Dispatching userSearched event...');
      window.dispatchEvent(new Event('userSearched'));
      // --- END CRITICAL PART ---
    } catch (err) {
      // This catch block will execute if any of the axios.get calls fail.
      console.error(
        'FindUsers: !!! FATAL ERROR during user data fetch or localStorage update !!!',
        err
      ); // Make this stand out!
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          'FindUsers: API Response Error Status:',
          err.response.status
        );
        console.error('FindUsers: API Response Error Data:', err.response.data);
        if (err.response.status === 404) {
          setError(`User "${username}" not found.`);
        } else if (err.response.status === 403) {
          setError(
            'API Rate Limit Exceeded or Invalid Token. Please try again later.'
          );
        } else {
          setError(
            `An error occurred: ${err.response.status} - ${err.response.statusText}`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('FindUsers: No response received from API:', err.request);
        setError('Network error: Could not connect to GitHub API.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('FindUsers: Request setup error:', err.message);
        setError('An unexpected error occurred.');
      }
    }
  }, []);

  useEffect(() => {
    console.log(
      'FindUsers: Component mounted/updated, checking autoLoadLastUser.'
    );
    if (autoLoadLastUser) {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        const recent = JSON.parse(stored);
        if (recent.length > 0) {
          console.log('FindUsers: Auto-loading last searched user:', recent[0]);
          fetchUserData(recent[0]);
        }
      }
    }
  }, [fetchUserData, autoLoadLastUser]);

  const handleUserClick = (username) => {
    // When a suggestion is clicked, we want to fetch its data and navigate
    console.log(`FindUsers: Suggestion clicked: ${username}`); // NEW LOG
    fetchUserData(username); // Fetch data and update recent searches
    navigate(`/profile/${username}`); // Navigate to profile page
  };

  const handleSearchButtonClick = () => {
    if (suggestions.length > 0) {
      console.log(
        `FindUsers: Search button clicked for: ${suggestions[0].login}`
      ); // NEW LOG
      fetchUserData(suggestions[0].login);
    } else {
      // If there are no suggestions, but user typed something and clicked search
      console.log(
        `FindUsers: Search button clicked with no suggestions. Searching for: ${searchInput}`
      ); // NEW LOG
      fetchUserData(searchInput); // Attempt to search the raw input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(
        `FindUsers: Enter key pressed. Current searchInput: "${searchInput}", suggestions count: ${suggestions.length}`
      ); // NEW LOG
      if (suggestions.length === 1) {
        fetchUserData(suggestions[0].login);
      } else if (searchInput) {
        fetchUserData(searchInput); // Search for the raw input
      } else {
        setError('Please enter a username.');
      }
    }
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
    <div className="container mt-4" style={{ paddingBottom: '100px' }}>
      {/* Search bar */}
      <div className="input-group mb-3 position-relative">
        <input
          type="text"
          className="form-control"
          placeholder="Search users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-primary custom-purple-btn-override"
          onClick={handleSearchButtonClick} // Use the new handler
          disabled={!searchInput && suggestions.length === 0} // Disable if nothing to search
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 2, top: '100%' }}
          >
            {suggestions.map((user) => (
              <li
                key={user.id}
                className="list-group-item d-flex align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => handleUserClick(user.login)}
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
      </div>

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
                  <span className="badge bg-warning">⭐ Most Starred</span>
                )}
              </h5>
              <p>{repo.description}</p>
              <span className="badge bg-secondary">{repo.topLanguage}</span>
              <br />
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
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

export default FindUsers;
