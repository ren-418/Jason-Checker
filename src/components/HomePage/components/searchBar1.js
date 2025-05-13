import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";

function SearchBar({
  darkMode,
  searchTerm,
  handleInputChange,
  suggestions,
  performSearch,
  handleSearchClick,
  setInputValue,
}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const containerRef = useRef(null);
  const searchContainerRef = useRef(null);

  const inputStyle = {
    padding: "7.5px 10px",
    fontSize: "17px",
    border: "none",
    outline: "none",
    flex: "1",
    minWidth: "50px",
    background: "transparent",
    color: darkMode ? "#fff" : "#000",
    borderRadius: "8px",
    width: "calc(100% - 50px)",
    boxSizing: "border-box",
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

  const selectedTermStyle = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: darkMode ? "#333" : "#e0e0e0",
    color: darkMode ? "#fff" : "#000",
    padding: "2px 8px",
    margin: "0 4px",
    borderRadius: "12px",
    fontSize: "14px",
  };

  const removeButtonStyle = {
    marginLeft: "6px",
    cursor: "pointer",
    color: darkMode ? "#fff" : "#000",
    border: "none",
    background: "none",
    padding: "0 4px",
  };

  const combinedInputStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "4px 10px",
    minHeight: "38px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: darkMode ? "#1a1a1a" : "#fff",
    position: "relative",
    width: "calc(100% - 50px)",
  };

  const uniqueSuggestions = useMemo(
    () => [...new Set(suggestions)],
    [suggestions]
  );

  useEffect(() => {
    setFocusedIndex(-1);
    setShowSuggestions(uniqueSuggestions.length > 0);
  }, [searchTerm, uniqueSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveTerm = (termToRemove) => {
    const newTerms = selectedTerms.filter((term) => term !== termToRemove);
    setSelectedTerms(newTerms);
    performSearch(newTerms.length > 0 ? newTerms : "");
    // Focus the input after removing a term
    inputRef.current?.focus();
  };

  const handleAddTerm = (term) => {
    if (
      selectedTerms.length < 5 &&
      !selectedTerms.includes(term) &&
      term.trim()
    ) {
      const newTerms = [...selectedTerms, term];
      setSelectedTerms(newTerms);
      setCurrentInput("");
      setInputValue("");
      setShowSuggestions(false);
      performSearch(newTerms);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Backspace":
        if (currentInput === "" && selectedTerms.length > 0) {
          e.preventDefault();
          const newTerms = selectedTerms.slice(0, -1);
          setSelectedTerms(newTerms);
          performSearch(newTerms.length > 0 ? newTerms : "");
        }
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < uniqueSuggestions.length) {
          handleAddTerm(uniqueSuggestions[focusedIndex]);
        } else if (currentInput && !selectedTerms.includes(currentInput)) {
          handleAddTerm(currentInput);
        } else if (selectedTerms.length > 0) {
          performSearch(selectedTerms);
          setShowSuggestions(false);
        }
        break;
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
      case "Tab":
        e.preventDefault();
        if (uniqueSuggestions.length > 0) {
          const newValue =
            focusedIndex >= 0
              ? uniqueSuggestions[focusedIndex]
              : uniqueSuggestions[0];
          handleAddTerm(newValue);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChangeWrapper = (e) => {
    const value = e.target.value;
    setCurrentInput(value);
    handleInputChange(e);
  };

  const handleContainerClick = () => {
    // Focus the input when clicking anywhere in the container
    inputRef.current?.focus();
  };

  return (
    <>
      <style>
        {`
        .search-input:focus {
          outline: none !important;
        }
        .combined-search-container:focus-within {
          border: 1px solid #670004 !important;
        }
        .suggestion-item:focus {
          outline: none;
          background-color: ${darkMode ? "#333" : "#f0f0f0"};
        }
      `}
      </style>
      <div style={containerStyle} ref={containerRef}>
        <div
          className="combined-search-container"
          style={combinedInputStyle}
          onClick={handleContainerClick}
          ref={searchContainerRef}
        >
          {selectedTerms.map((term, index) => (
            <span key={index} style={selectedTermStyle}>
              {term}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTerm(term);
                }}
                style={removeButtonStyle}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder={
              selectedTerms.length >= 5
                ? "Max selections reached"
                : selectedTerms.length === 0
                ? "Search"
                : ""
            }
            value={currentInput}
            style={inputStyle}
            onChange={handleInputChangeWrapper}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(uniqueSuggestions.length > 0)}
            disabled={selectedTerms.length >= 5}
          />
        </div>

        <div
          className="search-icon-clickable"
          style={iconStyle}
          onClick={() => {
            if (selectedTerms.length > 0) {
              performSearch(selectedTerms);
            } else if (currentInput) {
              performSearch(currentInput);
            }
            setShowSuggestions(false);
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
                key={suggestion}
                className="suggestion-item"
                style={suggestionItemStyle(index)}
                onClick={() => handleAddTerm(suggestion)}
                onMouseEnter={() => setFocusedIndex(index)}
                tabIndex={-1}
                role="option"
                aria-selected={index === focusedIndex}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

SearchBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  performSearch: PropTypes.func.isRequired,
  handleSearchClick: PropTypes.func.isRequired,
  setInputValue: PropTypes.func.isRequired,
};

export default SearchBar;
