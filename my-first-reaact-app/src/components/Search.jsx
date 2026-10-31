import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" aria-hidden="true" />

        <input
          type="search"
          aria-label="Search movies"
          placeholder="What are you in the mood for?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
export default Search;
