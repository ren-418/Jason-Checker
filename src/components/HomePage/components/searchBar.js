import React from "react";

function SearchBar({
  darkMode,
  searchTerm,
  handleInputChange,
  handleKeyDown,
  suggestions,
  suggestionIndex,
  wordIndex,
}) {
  return (
    <>
      <style>
        {`
          .search-input:focus {
            outline: none !important;
            border-color: #007bff !important; /* Change this to your preferred focus color */
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25) !important; /* Optional: adds a subtle glow */
          }
        `}
      </style>
      <div
        className={darkMode ? "search-bar-dark-mode" : "search-bar"}
        style={{
          userSelect: "none",
        }}
      >
        <div className="input-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            style={{
              backgroundColor: darkMode ? "#0d0d0d" : "",
              width: "100%",
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {suggestions.length > 0 && (
            <div className={darkMode ? "suggestion-dark-mode" : "suggestion"}>
              {suggestions[suggestionIndex].split(" ")[wordIndex]}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
