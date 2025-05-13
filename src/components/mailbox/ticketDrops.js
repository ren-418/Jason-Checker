import React, { useState, useMemo, useCallback } from "react";
import {
  List,
  Dialog,
  DialogContent,
  Button,
  // DialogTitle,
  IconButton,
  // DialogContentText,
  // DialogActions,
} from "@material-ui/core";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import EmailContent from "./components/generateHtml";
// import CloseIcon from "@material-ui/icons/Close";

import Pagination from "./components/pagination";
import EmailItem from "./components/emailItem";

import FilterForm from "../filters/index";

import CircularProgress from "@material-ui/core/CircularProgress";
import updateUserData from "./handlers/saveEmailData";

import { useTableEffects } from "./handlers/Effect";
import { useTableState } from "./handlers/State";
import useStyles from "./handlers/Styles";

import TicketQuantityFilter from "./components/TicketQuantityFilter";
import { useEventContext } from "../HomePage/UserDataContext";
import SearchBar from "../HomePage/components/searchBar1";
// import MuteButton from "./components/muteEventDrops";
// import { handleRemoveUrl } from "../HomePage/handlers/urlManipulation";
import NotesModal from "../notes/notes";
import { Link } from "react-router-dom";
import { handleSignOut } from "../HomePage/handlers/user";
import { debounce } from "lodash";
// import FilterFormOld from "../filtersOld";
import NotAllowed from "../NotAllowed";
import EventDetailCard from "./components/EventDetailCard";
// import { auth } from "../../firebase";
// import SvgPaths from "../filters/map/SvgPaths";
// import SvgLabelList from "../filters/map/SvgLabelList";
import ScrollPauseNotification from "./components/scrollNotification";

const TicketDrops = () => {
  const classes = useStyles();
  const userContext = useEventContext();
  const {
    eventsInfo,
    user,
    notesDocument,
    early,
    totalEarly,
    // mutedEvents,
    editFilters,
    showTable,
    mainUser,
    eventInfoRef,
    qEvents,
    vividIds,
    phantomAllowed,
    OnSaleData,
    urls,
    filterIds,
  } = userContext;

  const stubhub = userContext.stubHubInfo;

  const {
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
    // confirmDeleteOpen,
    // setConfirmDeleteOpen,
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
    soundSettings,
    soundUrls,
    sortOptions,
    setSortOptions,
  } = useTableState();

  const [viewMode, setViewMode] = useState("list");
  // const [overlayState, setOverlayState] = useState({
  //   isOpen: false,
  //   eventId: null,
  // });

  const matchingEventIds = Object.entries(eventsInfo).reduce(
    (ids, [eventId, eventInfo]) => {
      // console.log(searchQuery);

      const searchTerms = Array.isArray(searchQuery)
        ? searchQuery
        : [searchQuery];

      searchTerms.forEach((term) => {
        if (eventId === term) ids.push(eventId);

        if (
          eventInfo.name.toLowerCase().includes(term.toLowerCase()) ||
          eventInfo.venue.toLowerCase().includes(term.toLowerCase()) ||
          (eventInfo.date instanceof Date
            ? eventInfo.date.toLocaleDateString()
            : eventInfo.date?.toString() || ""
          )
            .toLowerCase()
            .includes(term.toLowerCase())
        ) {
          ids.push(eventId);
        }
      });
      return ids;
    },
    []
  );

  useTableEffects(
    user,
    mainUser,
    setLoading,
    firstRender,
    setEmails,
    searchQuery,
    lastVisible,
    currentPage,
    firstEventIds,
    lastDocs,
    matchingEventIds,
    setCurrentPage,
    setFirstEventIds,
    filterTicketQuantity,
    eventInfoRef,
    soundUrls,
    soundSettings,
    sortOptions,
    urls,
    OnSaleData,
    setViewMode
  );

  const [siteFilter, setSiteFilter] = useState("");

  const { processedEvents } = useMemo(() => {
    if (!eventsInfo || typeof eventsInfo !== "object") {
      return { processedEvents: [], searchIndex: new Map() };
    }

    const processedEvents = Object.entries(eventsInfo).map(
      ([eventId, event]) => ({
        ...event,
        searchString: `${event.name.toLowerCase()} ${eventId.toLowerCase()}`,
      })
    );

    const searchIndex = new Map();
    processedEvents.forEach((event) => {
      const words = event.searchString.split(/\s+/);
      words.forEach((word) => {
        if (!searchIndex.has(word)) {
          searchIndex.set(word, new Set());
        }
        searchIndex.get(word).add(event);
      });
    });

    return { searchIndex, processedEvents };
  }, [eventsInfo]);

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFilterClick = (url) => {
    setCurrentFilterUrl(url);
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const eventsInfoLower = Object.keys(eventsInfo).reduce((acc, key) => {
    const decode = decodeURIComponent(key);

    const encode = encodeURIComponent(decode);

    acc[encode] = eventsInfo[key];
    return acc;
  }, {});

  const [scrollPosition, setScrollPosition] = useState(0);

  const handleClick = async (email) => {
    setScrollPosition(window.pageYOffset);

    const decode = decodeURIComponent(email.eventId);

    const eventId = encodeURIComponent(decode);

    let event_info = eventsInfoLower[eventId];

    if (!event_info) {
      event_info = {
        name: "Unknown Event",
        venue: "Unknown Venue",
        date: "Unknown Date",
      };
    }

    const quantity = email.quantity;
    const subject = `${event_info.name} - ${event_info.venue}, ${event_info.date} (${quantity} tickets found)`;

    const html = (
      <EmailContent
        event_info={event_info}
        quantity={quantity}
        map_url={email.map_url}
        groupedTickets={email.groupTickets}
        eventLink={email.eventUrl}
        timestamp={email.timestamp}
        totalSeats={email.totalSeats}
        filterIds={filterIds}
        handleFilterClick={handleFilterClick}
        notesDocument={notesDocument}
        setCurrentEventId={setCurrentEventId}
        setNotesModalOpen={setNotesModalOpen}
        userEmail={mainUser}
        stubhub={stubhub[email.eventId]}
        eventId={email.eventId}
        totalEarly={totalEarly}
        early={early}
        editFilters={editFilters}
        email={email}
        priceDrops={email.priceDrop}
        isLowStock={email.lowStock}
        showTable={showTable}
        vividIds={vividIds}
      />
    );
    setSelectedEmail({ email, subject, html });
    dialogSize.current = "md";

    if (email.groupTickets) {
      for (let i = 0; i < email.groupTickets.length; i++) {
        const group = email.groupTickets[i];

        if (group.name && group.name.length > 30) {
          dialogSize.current = "lg";
        }

        if (group.seatNumbers && group.seatNumbers.length > 8) {
          dialogSize.current = "lg";
        }
      }
    }

    if (!email.opened) {
      email.opened = true;
      const emailDocRef = doc(db, "emails2", mainUser, "emails", email.uuid);
      await setDoc(emailDocRef, { ...email, opened: true });
      setEmails((prev) =>
        prev.map((prevEmail) => {
          if (prevEmail.uuid === email.uuid) {
            return { ...prevEmail, opened: true };
          } else {
            return prevEmail;
          }
        })
      );
    }

    await updateUserData(user);
  };

  const handleClose = () => {
    setSelectedEmail(null);
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleNext = () => {
    if (displayedEmails.length > (currentPage + 1) * 10) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleReadAll = async () => {
    try {
      const endpoint = `https://us-central1-phantomchecker.cloudfunctions.net/Read-mailbox`;

      setLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mainUser }),
      });

      if (!response.ok) {
        console.error("Failed to read mailbox.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calculateRelevance = (event, searchTokens) => {
    return searchTokens.reduce((relevance, token) => {
      if (event.name.toLowerCase().includes(token)) return relevance + 3;
      return relevance;
    }, 0);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const searchTokens = value
          .split(/\s+/)
          .filter((token) => token.length > 0);

        let matchingEvents = processedEvents;

        if (searchTokens.length > 0) {
          matchingEvents = matchingEvents.filter((event) =>
            searchTokens.some((token) => event.searchString.includes(token))
          );
        }

        const filteredSuggestions = matchingEvents
          .map((event) => ({
            name: event.name,
            relevance: calculateRelevance(event, searchTokens),
          }))
          .sort((a, b) => b.relevance - a.relevance)
          .map((event) => event.name)
          .slice(0, 10);

        setSuggestions(filteredSuggestions);
      }, 50),
    [processedEvents, setSuggestions]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value.trim()) {
      setSuggestions([]);
      // setSuggestionIndex(0);
      return;
    }

    debouncedSearch(value.toLowerCase());
  };

  const performSearch = (value) => {
    setSearchQuery(Array.isArray(value) ? value : "");
    setSuggestions([]);
    lastSearchDoc.current = null;
    firstSearchDoc.current = null;
  };

  const handleSearchClick = () => {
    setInputValue(suggestions[suggestionIndex]);
    setSuggestions([]);
  };

  // const handleOverlayOpen = useCallback((eventId) => {
  //   setOverlayState({
  //     isOpen: true,
  //     eventId: eventId,
  //   });
  // }, []);

  // const handleOverlayClose = useCallback(() => {
  //   setOverlayState({
  //     isOpen: false,
  //     eventId: null,
  //   });
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     setOverlayState({ isOpen: false, eventId: null });
  //   };
  // }, []);

  const [isPaused, setIsPaused] = useState(false);
  const [pausedEmails, setPausedEmails] = useState([]);

  const handlePause = useCallback(
    (sortedEmails) => {
      if (sortedEmails) {
        // Apply the consistent grouping even for pre-sorted emails
        // Group emails by eventId and timestamp to handle identical events
        const groupedEmails = new Map();

        // Process all emails
        sortedEmails.forEach((email) => {
          const key = `${email.eventId}-${email.timestamp}`;
          if (!groupedEmails.has(key)) {
            groupedEmails.set(key, []);
          }
          groupedEmails.get(key).push(email);
        });

        // Flatten and sort groups
        const consistentlySortedEmails = [];

        // Sort by timestamp first (newest first)
        Array.from(groupedEmails.keys())
          .sort((a, b) => {
            // Get timestamps directly from an email in each group
            const groupA = groupedEmails.get(a)[0];
            const groupB = groupedEmails.get(b)[0];
            const timestampA = new Date(groupA.timestamp);
            const timestampB = new Date(groupB.timestamp);
            return timestampB - timestampA;
          })
          .forEach((key) => {
            // Sort within each timestamp group by UUID to ensure consistent order
            const group = groupedEmails.get(key);
            group.sort((a, b) => a.uuid.localeCompare(b.uuid));
            consistentlySortedEmails.push(...group);
          });

        setPausedEmails(consistentlySortedEmails);
      } else {
        // Apply the same consistent grouping logic to the emails
        // Group emails by eventId and timestamp to handle identical events
        const groupedEmails = new Map();

        // Process all emails
        emails.forEach((email) => {
          const key = `${email.eventId}-${email.timestamp}`;
          if (!groupedEmails.has(key)) {
            groupedEmails.set(key, []);
          }
          groupedEmails.get(key).push(email);
        });

        // Flatten and sort groups
        const consistentlySortedEmails = [];

        // Sort by timestamp first (newest first)
        Array.from(groupedEmails.keys())
          .sort((a, b) => {
            // Get timestamps directly from an email in each group
            const groupA = groupedEmails.get(a)[0];
            const groupB = groupedEmails.get(b)[0];
            const timestampA = new Date(groupA.timestamp);
            const timestampB = new Date(groupB.timestamp);
            return timestampB - timestampA;
          })
          .forEach((key) => {
            // Sort within each timestamp group by UUID to ensure consistent order
            const group = groupedEmails.get(key);
            group.sort((a, b) => a.uuid.localeCompare(b.uuid));
            consistentlySortedEmails.push(...group);
          });

        setPausedEmails(consistentlySortedEmails);
      }
    },
    [emails]
  );

  const handleResume = useCallback(() => {
    setIsPaused(false);
    setPausedEmails([]);
  }, []);

  const displayedEmails = useMemo(() => {
    const emailsToUse = isPaused ? pausedEmails : emails;

    // Group emails by eventId and timestamp to handle identical events
    const groupedEmails = new Map();

    // Process all emails
    emailsToUse.forEach((email) => {
      const key = `${email.eventId}-${email.timestamp}`;
      if (!groupedEmails.has(key)) {
        groupedEmails.set(key, []);
      }
      groupedEmails.get(key).push(email);
    });

    // Flatten and sort groups
    const sortedEmails = [];

    // Sort by timestamp first (newest first)
    Array.from(groupedEmails.keys())
      .sort((a, b) => {
        // Get timestamps directly from an email in each group
        const groupA = groupedEmails.get(a)[0];
        const groupB = groupedEmails.get(b)[0];
        const timestampA = new Date(groupA.timestamp);
        const timestampB = new Date(groupB.timestamp);
        return timestampB - timestampA;
      })
      .forEach((key) => {
        // Sort within each timestamp group by UUID to ensure consistent order
        const group = groupedEmails.get(key);
        group.sort((a, b) => a.uuid.localeCompare(b.uuid));
        sortedEmails.push(...group);
      });

    return sortedEmails;
  }, [isPaused, pausedEmails, emails]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (phantomAllowed === false) {
    return <NotAllowed />;
  }

  return (
    <>
      <div className={classes.root}>
        <IconButton
          color="inherit"
          disableRipple
          className={classes.iconButton}
          style={{
            position: "absolute",
            left: "10px",
            top: "70px",
            backgroundColor: "#121212",
            width: "45px",
            zIndex: 1,
          }}
        >
          <Link onClick={handleSignOut(db, user)} className={classes.link}>
            <img
              src="/logout.png"
              alt="logout"
              className={classes.logoutIcon}
            />
          </Link>
        </IconButton>

        <div className={classes.searchContainer}>
          <TicketQuantityFilter
            onApply={({ ticketQuantity, selectedOption }) => {
              setFilterTicketQuantity(ticketQuantity);
              setSortOptions(selectedOption);
            }}
            darkMode={darkMode}
            sitesFiltered={siteFilter}
            setSiteFilter={setSiteFilter}
          />
          <SearchBar
            darkMode={darkMode}
            searchTerm={inputValue}
            handleInputChange={handleSearchChange}
            handleSearchClick={handleSearchClick}
            suggestions={suggestions}
            suggestionIndex={suggestionIndex}
            setSuggestionIndex={setSuggestionIndex}
            setInputValue={setInputValue}
            inputValue={inputValue}
            performSearch={performSearch}
          />

          <Button
            onClick={async () => {
              const userDoc = doc(db, "userSounds2", user.email);

              await setDoc(
                userDoc,
                {
                  mailBoxView: viewMode === "list" ? "detail" : "list",
                },
                { merge: true }
              );

              localStorage.setItem("mailBoxView", viewMode);

              setViewMode(viewMode === "list" ? "detail" : "list");
            }}
            style={{
              backgroundColor: "#670004",
              color: "#fff",
              height: "40px",
              width: "150px",
              borderRadius: "9px",
              padding: "0px 10px",
              border: "1px solid #521113",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              marginLeft: "-18px",
              marginTop: "-15px",
            }}
          >
            {viewMode === "list" ? "Expanded View" : "Compact View"}
          </Button>
        </div>

        <Button
          className={classes.Readall}
          onClick={handleReadAll}
          style={{
            backgroundColor: "#670004",
            color: "#fff",
            height: "30px",
            width: "90px",
            borderRadius: "9px",
            padding: "0px 10px",
            border: "1px solid #521113",
            textTransform: "none",
            fontFamily: "'Inter', sans-serif",
            position: "absolute",
            right: "10px",
            top: "70px",
          }}
        >
          Read All
        </Button>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <ScrollPauseNotification
              pausedEmails={emails}
              onResume={handleResume}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              isDetailView={Boolean(viewMode !== "list")}
              onPause={handlePause}
            >
              {viewMode === "list" ? (
                <>
                  <List>
                    {displayedEmails.map((email, index) => {
                      const decode = decodeURIComponent(email.eventId);

                      if (
                        siteFilter !== "" &&
                        !email.eventUrl.includes(siteFilter)
                      )
                        return null;

                      const eventId = encodeURIComponent(decode);

                      return (
                        <EmailItem
                          key={`${email.eventId}-${email.uuid}-${index}`}
                          email={email}
                          handleClick={handleClick}
                          OnSaleData={OnSaleData[eventId]}
                          event_info={eventsInfoLower[eventId]}
                          updateUserData={async () => {
                            await updateUserData(user);
                          }}
                          qEvent={qEvents.includes(email.eventId)}
                        />
                      );
                    })}
                  </List>
                  <div className={classes.formPaginationWrapper}>
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      onNext={handleNext}
                      onPrev={handlePrev}
                      hasNextPage={true}
                      hasPrevPage={currentPage > 0}
                    />
                  </div>
                </>
              ) : (
                <div>
                  {displayedEmails
                    .slice(currentPage * 10, (currentPage + 1) * 10)
                    .map((email, index) => {
                      const decode = decodeURIComponent(email.eventId);
                      const eventId = encodeURIComponent(decode);
                      const event_info = eventsInfoLower[eventId];

                      const uniqueKey = `${email.eventId}-${email.uuid}-${
                        email.timestamp
                      }-${email.qPing ? "queue" : "normal"}-${
                        email.early ? "early" : "regular"
                      }-${email.lowStock ? "low" : "normal"}`;

                      if (!event_info) {
                        return null;
                      }
                      return (
                        <EventDetailCard
                          key={uniqueKey}
                          darkMode={darkMode}
                          isLowStock={email.lowStock}
                          handleClick={handleClick}
                          email={email}
                          event={{
                            uniqueId: uniqueKey,
                            id: email.eventId,
                            name: event_info.name,
                            venue: event_info.venue,
                            date: event_info.date,
                            early: email.early,
                            groupTickets: email.groupTickets,
                            releaseTime: new Date(
                              email.timestamp
                            ).toLocaleString(),
                            map_url: email.map_url,
                            eventLink: email.eventUrl,
                            stubhubId: stubhub[eventId],
                            vividUrl: vividIds[eventId],
                            priceDrop: email.priceDrop === true,
                            priceIncrease: email.priceDrop === false,
                            previousPrice: email.previousPrice,
                            price: email.price,
                            qPing: email.qPing,
                            ticketMasterUK: email.ticketMasterUK,
                            faceValueExchange: event_info.faceValueExchange,
                            timestamp: email.timestamp,
                            quantity: email.quantity,
                            totalSeats: email.totalSeats,
                            priceRange: event_info.priceRange,
                          }}
                        />
                      );
                    })}
                  <div className={classes.formPaginationWrapper}>
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      onNext={handleNext}
                      onPrev={handlePrev}
                      hasNextPage={
                        displayedEmails.length > (currentPage + 1) * 10
                      }
                      hasPrevPage={currentPage > 0}
                    />
                  </div>
                </div>
              )}
              {showFilter && !editFilters ? (
                <>
                  <FilterForm
                    eventId={currentFilterUrl[0]}
                    handleClose={handleFilterClose}
                    email={mainUser}
                    fullURL={currentFilterUrl[1]}
                    eventInfo={currentFilterUrl[2]}
                    stubhubId={stubhub[currentFilterUrl[0]]}
                    mailBox={true}
                  />
                </>
              ) : (
                <Dialog
                  open={Boolean(selectedEmail)}
                  onClose={handleClose}
                  scroll="paper"
                  fullWidth
                  maxWidth={dialogSize.current}
                  PaperProps={{
                    style: {
                      maxHeight: "100%",
                      width: "90%",
                      borderRadius: "20px",
                      backgroundColor: darkMode ? "#222222" : "",
                      color: darkMode ? "white" : "",
                    },
                  }}
                >
                  <>
                    <DialogContent
                      dividers
                      style={{
                        backgroundColor: darkMode ? "#222222" : "white",
                      }}
                    >
                      {selectedEmail && <>{selectedEmail.html}</>}
                    </DialogContent>

                    <NotesModal
                      open={notesModalOpen}
                      handleClose={() => setNotesModalOpen(false)}
                      userEmail={mainUser}
                      eventId={currentEventId}
                      notesDocument={notesDocument}
                    />
                  </>
                </Dialog>
              )}
            </ScrollPauseNotification>
          </>
        )}
      </div>
    </>
  );
};

export default TicketDrops;
