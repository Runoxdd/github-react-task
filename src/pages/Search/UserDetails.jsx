import React from 'react';

const UserDetails = ({ user }) => {
  return (
    <div className="card p-3 mb text-center">
      <img
        src={User.avatar_url}
        alt="avatar"
        className="rounded-circle mx-auto mb-2"
        width="100"
      />
      <h3>{User.name}</h3>
      <p>{User.bio}</p>
      <p>
        Repos: {User.public_repos} | Followers: {user.followers}
      </p>
    </div>
  );
};

export default UserDetails;
