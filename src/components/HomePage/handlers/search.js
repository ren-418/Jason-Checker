import {
    getDataAccountId,
    getLinkId,
    getSiteId,
    getTicketCode,
  } from "./urlManipulation";

  function searchResults(sortedUrls, eventsInfo, searchTerm) {
    searchTerm = searchTerm.trimStart();
    return sortedUrls.filter((url) => {
      let eventId = new URL(url).pathname.split("/").pop();
      if (url.includes("axs.com") || url.includes("axs.co.uk")) {
        const match = url.match(/e=([0-9]+)/);
        if (match) {
          eventId = match[1];
        }
      }

      if (url.includes("mlb.tickets.com") || url.includes("mpv.tickets.com")) {
        let urlObj = new URL(url.toLowerCase());
        let searchParams = new URLSearchParams(urlObj.search);

        let pid = searchParams.get("pid");
        let event_id = searchParams.get("eventId");

        if (pid) {
          eventId = pid;
        } else if (event_id) {
          eventId = event_id;
        }
      }

      if (url.includes("evenue.net") && url.includes("SEGetEventInfo")) {
        const siteId = getSiteId(url);
        const dataAccId = getDataAccountId(url);
        const linkId = getLinkId(url);
        const ticketCode = getTicketCode(url);

        eventId = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
      } else if (url.includes("evenue.net") && url.includes("/event/")) {
        let urlObj = new URL(url);

        eventId = urlObj.pathname.split("/").slice(-2).join("-");
      }

      const eventInfo = eventsInfo[eventId] || {
        name: "loading",
        venue: "loading",
        date: "loading",
      };

      let searchEventId = null;
      try {
        if (searchTerm !== "") {
          searchEventId = new URL(searchTerm).pathname.split("/").pop();

          if (searchTerm.includes("axs.com") || url.includes("axs.co.uk")) {
            const match = searchTerm.match(/e=([0-9]+)/);
            if (match) {
              searchEventId = match[1];
            }
          }

          if (
            searchTerm.includes("mlb.tickets.com") ||
            searchTerm.includes("mpv.tickets.com")
          ) {
            let urlObj = new URL(searchTerm);
            let searchParams = new URLSearchParams(urlObj.search);

            let pid = searchParams.get("pid");
            let event_id = searchParams.get("eventId");

            if (pid) {
              searchEventId = pid;
            } else if (event_id) {
              searchEventId = event_id;
            }
          }

          if (
            searchTerm.includes("evenue.net") &&
            searchTerm.includes("SEGetEventInfo")
          ) {
            const siteId = getSiteId(searchTerm);
            const dataAccId = getDataAccountId(searchTerm);
            const linkId = getLinkId(searchTerm);
            const ticketCode = getTicketCode(searchTerm);

            searchEventId = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
          } else if (
            searchTerm.includes("evenue.net") &&
            searchTerm.includes("/event/")
          ) {
            let urlObj = new URL(searchTerm);

            searchEventId = urlObj.pathname.split("/").slice(-2).join("-");
          }
        }
      } catch (e) {}

      return (
        Object.values(eventInfo).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchEventId?.toLowerCase().includes(eventId.toLowerCase())
      );
    });
  }

  function handleInputChange(
    e,
    eventsInfo,
    setSearchTerm,
    setSuggestions,
    setWordIndex,
    setSuggestionIndex
  ) {
    const inputValue = e.target.value.trimStart();
    setSearchTerm(inputValue);

    const filteredSuggestions = Object.values(eventsInfo)
      .filter((event) =>
        event.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((event) => event.name);

    setSuggestions(filteredSuggestions);

    if (inputValue.trim() === "") {
      setWordIndex(0);
      setSuggestions([]);
      setSuggestionIndex(0);
    }
  }

  function handleKeyDown(
    e,
    suggestions,
    setSearchTerm,
    setWordIndex,
    setSuggestionIndex,
    wordIndex,
    suggestionIndex
  ) {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();

      const firstSuggestionWords = suggestions[suggestionIndex].split(" ");
      const nextWordIndex = wordIndex % firstSuggestionWords.length;

      let newSearchTerm = "";
      for (let i = 0; i <= nextWordIndex; i++) {
        newSearchTerm += firstSuggestionWords[i] + " ";
      }

      setSearchTerm(newSearchTerm.trim());
      setWordIndex(nextWordIndex + 1);

      if (nextWordIndex === firstSuggestionWords.length - 1) {
        setSuggestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  }

  export { searchResults, handleInputChange, handleKeyDown };
