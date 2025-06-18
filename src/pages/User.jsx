import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FindUsers from './Search/FindUsers';

function User() {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      // First fetch: Get the list of users
      const res = await axios.get('https://api.github.com/users');
      const basicUsers = res.data;

      // Second fetch: Get full details for each user
      const detailedUserRequests = basicUsers.map((user) =>
        axios.get(`https://api.github.com/users/${user.login}`)
      );

      const userResponses = await Promise.all(detailedUserRequests);
      const fullUsers = userResponses.map((res) => res.data);

      setUsers(fullUsers);
    } catch (err) {
      console.log('Fetching user failed', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <FindUsers />
      <h2>GitHub Users</h2>
      <table
        border="5"
        cellPadding="10"
        style={{ width: '100%', textAlign: 'left' }}
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
          {users?.map((user) => (
            <tr key={user.id}>
              <td>
                <img src={user.avatar_url} alt="avatar" width="50" />
              </td>
              <td>{user.name || user.login}</td>
              <td>{user.bio || '—'}</td>
              <td>{user.public_repos}</td>
              <td>{user.followers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
