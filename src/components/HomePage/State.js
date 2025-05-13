import { useState } from "react";
import { useTheme } from "../../ThemeContext";

export const useTableState = () => {
  const [newUrls, setNewUrls] = useState([]);

  const [currentEventId, setCurrentEventId] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [currentFilterUrl, setCurrentFilterUrl] = useState("");

  const [sortConfig, setSortConfig] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { darkMode } = useTheme();

  return {
    newUrls,
    setNewUrls,
    currentEventId,
    setCurrentEventId,
    showFilter,
    setShowFilter,
    currentFilterUrl,
    setCurrentFilterUrl,
    sortConfig,
    setSortConfig,
    searchTerm,
    setSearchTerm,
    notesModalOpen,
    setNotesModalOpen,
    suggestions,
    setSuggestions,
    wordIndex,
    setWordIndex,
    suggestionIndex,
    setSuggestionIndex,
    modalOpen,
    setModalOpen,
    modalMessage,
    setModalMessage,
    darkMode,
  };
};
