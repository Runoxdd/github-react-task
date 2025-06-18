import React from 'react';

const UserDetails = ({ user }) => {
  return (
    <div className="card p-3 mb text-center">
      <img
        src={user.avatar_url}
        alt="avatar"
        className="rounded-circle mx-auto mb-2"
        width="100"
      />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
      <p>
        Repos: {user.public_repos} | Followers: {user.followers}
      </p>
    </div>
  );
};

export default UserDetails;
