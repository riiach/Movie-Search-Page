import React from "react";
import Spinner from "./Spinner.jsx";

const Search = ({ searchTerm, setSearchTerm, isLoading = false }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="" aria-hidden="true" />

        <input
          type="search"
          aria-label="Search movies"
          aria-busy={isLoading}
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <div className="search-loading"><Spinner /></div>}
      </div>
    </div>
  );
};
export default Search;
