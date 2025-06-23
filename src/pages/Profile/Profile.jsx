// Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const token = import.meta.env.VITE_GITHUB_TOKEN;

<<<<<<< HEAD
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
};
=======

const headers ={
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
}

>>>>>>> 12136838d69bc89796f8dd542b9ea5d78e2e02d0

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRes = await axios.get(
<<<<<<< HEAD
          `https://api.github.com/users/${username}`,
          { headers }
        );
        const repoRes = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          { headers }
=======
          `https://api.github.com/users/${username}`, {headers}
        );
        const repoRes = await axios.get(
          `https://api.github.com/users/${username}/repos`, {headers}
>>>>>>> 12136838d69bc89796f8dd542b9ea5d78e2e02d0
        );

        const reposWithLang = await Promise.all(
          repoRes.data.map(async (repo) => {
            try {
              const langRes = await axios.get(
<<<<<<< HEAD
                `https://api.github.com/repos/${username}/${repo.name}/languages`,
                { headers }
=======
                `https://api.github.com/repos/${username}/${repo.name}/languages`, {headers}
>>>>>>> 12136838d69bc89796f8dd542b9ea5d78e2e02d0
              );
              const topLang = Object.entries(langRes.data).sort(
                (a, b) => b[1] - a[1]
              )[0]?.[0];
              return { ...repo, topLanguage: topLang || 'N/A' };
            } catch {
              return { ...repo, topLanguage: 'N/A' };
            }
          })
        );

        setUserData(userRes.data);
        setRepos(reposWithLang);
      } catch {
        setError('Something went wrong while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);
  const mostStarredRepo = repos.reduce(
    (max, repo) =>
      repo.stargazers_count > (max?.stargazers_count || 0) ? repo : max,
    {}
  );

  const totalPages = Math.ceil(repos.length / perPage);
  const paginatedRepos = repos.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4" style={{ paddingBottom: '100px' }}>
      <h2>{userData.name || userData.login}</h2>
      <img
        src={userData.avatar_url}
        alt="avatar"
        width={100}
        className="rounded-circle"
      />
      <p>{userData.bio}</p>
      <p>
        Repos: {userData.public_repos} | Followers: {userData.followers}
      </p>

      <h4 className="mt-4">Repositories</h4>
      <div className="row">
        {paginatedRepos.map((repo) => (
          <div key={repo.id} className="col-md-6 mb-3">
            <div
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
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {repos.length > perPage && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
