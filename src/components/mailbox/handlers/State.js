import { useRef, useState } from "react";
import { useTheme } from "../../../ThemeContext";

export const useTableState = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [sortOptions, setSortOptions] = useState({});

  const [showFilter, setShowFilter] = useState(false);
  const [currentFilterUrl, setCurrentFilterUrl] = useState("");
  const lastVisible = useRef([]);

  const firstRender = useRef(true);

  const lastSearchDoc = useRef(null);
  const firstSearchDoc = useRef(null);
  const dialogSize = useRef("md");

  const { darkMode } = useTheme();

  const [firstEventIds, setFirstEventIds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterTicketQuantity, setFilterTicketQuantity] = useState(undefined);

  const soundUrls = useRef([]);

  const soundSettings = useRef({});

  const lastDocs = useRef({});

  return {
    emails,
    setEmails,
    selectedEmail,
    setSelectedEmail,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    suggestionIndex,
    setSuggestionIndex,
    notesModalOpen,
    setNotesModalOpen,
    currentEventId,
    setCurrentEventId,
    confirmDeleteOpen,
    soundUrls,
    soundSettings,
    setConfirmDeleteOpen,
    showFilter,
    setShowFilter,
    currentFilterUrl,
    setCurrentFilterUrl,
    lastVisible,
    firstRender,
    lastSearchDoc,
    firstSearchDoc,
    dialogSize,
    darkMode,
    firstEventIds,
    setFirstEventIds,
    loading,
    setLoading,
    lastDocs,
    filterTicketQuantity,
    setFilterTicketQuantity,
    sortOptions,
    setSortOptions,
  };
};
