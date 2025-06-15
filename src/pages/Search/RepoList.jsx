import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const RepoList = ({ repos, mostStarred, page, totalPages, setPage }) => {
  return (
    <div>
      <h3 className="mt-4">Repositories</h3>
      {repos.map((repo) => (
        <div
          key={repo.id}
          className={`card p-3 mb-2 ${
            repo.id === mostStarred.id ? 'bg-warning-subtle' : ''
          }`}
          //The code handles the most starred
        >
          <h5>
            {repo.name}
            {repo.id === mostStarred.id && (
              <span className="badge bg-warning ms-2"> Most Starred ⭐</span>
            )}
          </h5>
          <p>{repo.description}</p>
          <span className="badge bg-secondary me-2">
            {repo.language || 'N/A'}
          </span>
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            View Repo
          </a>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <FiArrowLeft /> Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default RepoList;
