import React from 'react';

const SearchBar = ({
  input,
  setInput,
  suggestions = [],
  fetchSuggestions,
  handleSearch,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSearch(input);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="form-control"
        value={input}
        placeholder="Type userName to search..."
        onChange={(e) => {
          setInput(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <ul
          className="list-group positio-absolute w-100 shadow"
          style={{ zIndex: 1 }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="list-group-item list-group-item-action d-flex align-items-center"
              onClick={() => handleSearch(suggestion.login)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={suggestion.avatar_url}
                alt="avatar"
                className="me-2 rounded-circle"
                width="30"
              />
              {suggestion.login}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
