import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FindUsers from './Search/FindUsers'; // Assuming correct path
import './User.css'; // Assuming correct path

const token = import.meta.env.VITE_GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
};

function User() {
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all necessary data
  const fetchData = async () => {
    setLoading(true); // Set loading to true whenever we fetch data
    try {
      // Fetch all GitHub users (initial list)
      const res = await axios.get('https://api.github.com/users', {
        headers,
      });
      const basicUsers = res.data;

      const detailedUserRequests = basicUsers.map((user) =>
        axios.get(`https://api.github.com/users/${user.login}`, { headers })
      );
      const userResponses = await Promise.all(detailedUserRequests);
      const fullUsers = userResponses.map((res) => res.data);

      // Fetch recent searches from localStorage and get their full data
      const storedUsernames = JSON.parse(
        localStorage.getItem('recentSearches') || '[]'
      );
      console.log('Stored Recent Searches in User.jsx:', storedUsernames); // For debugging

      const recentUserRequests = storedUsernames.map(
        (username) =>
          axios
            .get(`https://api.github.com/users/${username}`, { headers })
            .then((res) => res.data)
            .catch(() => null) // Handle cases where a stored user might no longer exist
      );
      const recentResults = await Promise.all(recentUserRequests);
      const validRecentUsers = recentResults.filter(Boolean); // Filter out any nulls

      // Filter out recent users from the main users list to avoid duplicates
      const filteredUsers = fullUsers.filter(
        (user) => !storedUsernames.includes(user.login)
      );
      console.log('Stored Recent Searches in User.jsx:', storedUsernames);
      setRecentUsers(validRecentUsers);
      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch on component mount

    // Event listener to refresh data when a user is searched in FindUsers
    const refreshOnSearch = () => {
      console.log('User searched event received, refreshing data...'); // For debugging
      fetchData();
    };
    window.addEventListener('userSearched', refreshOnSearch);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('userSearched', refreshOnSearch);
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  return (
    <div
      style={{ padding: '1rem', marginBottom: '100px' }}
      className="userPage"
    >
      <FindUsers />

      {/* ✅ Recent Searches */}
      {recentUsers.length > 0 && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem',
            border: '2px solid #fcb041',
            borderRadius: '10px',
            backgroundColor: '#fff8e1',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>Recent Searches</h3>
          {recentUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid #fcb041',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#fff',
              }}
            >
              <img src={user.avatar_url} alt="avatar" width="70" />
              <div>
                <h4 style={{ margin: 0 }}>{user.name || user.login}</h4>
                <p style={{ margin: 0 }}>{user.bio || '—'}</p>
                <p style={{ margin: 0 }}>
                  Repos: {user.public_repos} | Followers: {user.followers}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ All GitHub Users */}
      <h2>GitHub Users</h2>
      <div className="users">
        <table
          border="5"
          cellPadding={10}
          style={{ width: '100%', textAlign: 'left' }}
          className="table"
        >
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Bio</th>
              <th>Public Repos</th>
              <th>Followers</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img src={user.avatar_url} alt="avatar" width="50" />
                  </td>
                  <td>{user.name || user.login}</td>
                  <td>{user.bio || '—'}</td>
                  <td>{user.public_repos}</td>
                  <td>{user.followers}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
