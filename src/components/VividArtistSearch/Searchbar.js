import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebase";

function SearchBar({ darkMode, performSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true); // New state to control fetching
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const containerRef = useRef(null);

  const inputStyle = {
    padding: "7.5px 10px",
    fontSize: "17px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "calc(100% - 50px)",
    boxSizing: "border-box",
    color: darkMode ? "#fff" : "#000",
    backgroundColor: darkMode ? "#1a1a1a" : "#fff",
    paddingRight: "50px",
    outline: "none",
  };

  const containerStyle = {
    width: "685px",
    position: "relative",
    margin: "0 0 16px",
    userSelect: "none",
    flexShrink: 0,
  };

  const iconStyle = {
    position: "absolute",
    top: "50%",
    right: "10px",
    width: "38px",
    height: "40px",
    backgroundColor: "#670004",
    backgroundRepeat: "no-repeat",
    backgroundSize: "50%",
    backgroundPosition: "center",
    borderRadius: "10px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 100,
  };

  const suggestionStyle = {
    position: "absolute",
    backgroundColor: darkMode ? "#1a1a1a" : "#fff",
    color: darkMode ? "#fff" : "#000",
    marginTop: "5px",
    padding: "5px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 101,
    width: "100%",
  };

  const suggestionItemStyle = (index) => ({
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor:
      index === focusedIndex ? (darkMode ? "#333" : "#f0f0f0") : "transparent",
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length >= 1 && shouldFetch) {
        try {
          const response = await fetch(
            "https://mg.phantomcheckerapi.com/api/vivid/search-artist-suggestion",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
              },
              body: JSON.stringify({ searchTerm: searchTerm }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          setSuggestions(data.slice(0, 4));
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, shouldFetch]);

  const uniqueSuggestions = useMemo(
    () => [...new Map(suggestions.map((item) => [item.name, item])).values()],
    [suggestions]
  );

  useEffect(() => {
    setFocusedIndex(-1);
    setShowSuggestions(uniqueSuggestions.length > 0 && shouldFetch);
  }, [searchTerm, uniqueSuggestions, shouldFetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setShouldFetch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < uniqueSuggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < uniqueSuggestions.length) {
          handleSearchWithValue(uniqueSuggestions[focusedIndex]);
        } else if (searchTerm.trim()) {
          performSearch({ name: searchTerm });
        }
        setShowSuggestions(false);
        setShouldFetch(false);
        break;
      case "Tab":
        e.preventDefault();
        if (uniqueSuggestions.length > 0) {
          const newValue =
            focusedIndex >= 0
              ? uniqueSuggestions[focusedIndex].name
              : uniqueSuggestions[0].name;
          setSearchTerm(newValue);
          handleInputChange({ target: { value: newValue } });
          setFocusedIndex(0);
        }
        setShowSuggestions(false);
        setShouldFetch(false); // Prevent fetching after selection
        break;
      case "Escape":
        setShowSuggestions(false);
        setShouldFetch(false); // Prevent fetching after escape
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShouldFetch(true); // Re-enable fetching when input changes
  };

  const handleSearchWithValue = (suggestionObject) => {
    if (!suggestionObject.name.trim()) return;
    setSearchTerm(suggestionObject.name);
    performSearch(suggestionObject);
  };

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion.name.trim()) return;
    handleSearchWithValue(suggestion);
    setShowSuggestions(false);
    setShouldFetch(false);
  };

  return (
    <>
      <style>
        {`
        .search-input:focus {
          outline: none !important;
          border: 1px solid #670004 !important;
        }
        .suggestion-item:focus {
          outline: none;
          background-color: ${darkMode ? "#333" : "#f0f0f0"};
        }
      `}
      </style>
      <div style={containerStyle} ref={containerRef}>
        <div className="input-container" style={{ position: "relative" }}>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchTerm}
            style={inputStyle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setShouldFetch(true); // Re-enable fetching on focus
              setShowSuggestions(uniqueSuggestions.length > 0);
            }}
          />
          <div
            className="search-icon-clickable"
            style={iconStyle}
            onClick={() => {
              if (!searchTerm.trim()) return;
              performSearch({ name: searchTerm });
              setShowSuggestions(false);
              setShouldFetch(false);
            }}
          >
            <img
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                filter: "brightness(0) invert(1)",
              }}
              src="/search2.png"
              alt="search"
            />
          </div>
          {showSuggestions && uniqueSuggestions.length > 0 && (
            <div ref={suggestionsRef} style={suggestionStyle}>
              {uniqueSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion.name}
                  className="suggestion-item"
                  style={suggestionItemStyle(index)}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  tabIndex={-1}
                  role="option"
                  aria-selected={index === focusedIndex}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

SearchBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  performSearch: PropTypes.func.isRequired,
};

export default SearchBar;
