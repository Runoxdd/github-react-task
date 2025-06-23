// Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const token = import.meta.env.VITE_GITHUB_TOKEN;


const headers ={
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
}


const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRes = await axios.get(
          `https://api.github.com/users/${username}`, {headers}
        );
        const repoRes = await axios.get(
          `https://api.github.com/users/${username}/repos`, {headers}
        );

        const reposWithLang = await Promise.all(
          repoRes.data.map(async (repo) => {
            try {
              const langRes = await axios.get(
                `https://api.github.com/repos/${username}/${repo.name}/languages`, {headers}
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

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
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
      {repos.map((repo) => (
        <div key={repo.id} className="card p-3 mb-2">
          <h5>{repo.name}</h5>
          <p>{repo.description}</p>
          <span className="badge bg-secondary">{repo.topLanguage}</span>
          <br />
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      ))}
    </div>
  );
};

export default Profile;
