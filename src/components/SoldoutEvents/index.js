import React, { useState, useEffect } from "react";

import {
  Container,
  Tabs,
  Tab,
  makeStyles,
  Modal,
  Button,
  Dialog,
} from "@material-ui/core";
import "../../css/HomePage.css";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";
import { handleAddUrl } from "../HomePage/handlers/urlManipulation";
import { useEventContext } from "../HomePage/UserDataContext";
import { useTheme } from "../../ThemeContext";
import moment from "moment-timezone";
import BetaAcknowledgmentOverlay from "../VividArtistSearch/Beta";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  },
  header: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  tabs: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, .1)",
  },
  viewSelect: {
    minWidth: 120,
  },
  searchField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxHeight: "90vh",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    overflow: "auto",
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    margin: theme.spacing(2),
    backgroundColor: "#670004",
    color: "white",
    "&:hover": {
      backgroundColor: "#8b0006",
    },
  },
  dialog: {
    "& .MuiDialog-paper": {
      maxWidth: "90vw",
      maxHeight: "90vh",
      backgroundColor: "transparent",
    },
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
}));

const SoldoutEvents = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 100;

  // Add ref for storing last visible documents
  const lastVisible = React.useRef([]);

  const { darkMode } = useTheme();
  const userContext = useEventContext();
  const { urls, TotalUrls, mainUser } = userContext;

  // Move these functions outside useEffect
  async function fetchLastUpdated() {
    try {
      const soldOutEventsQuery = query(
        collection(db, "soldOutEvents"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(soldOutEventsQuery);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          timestamp: data.createdAt,
          totalEvents: data.te || 0,
        };
      }

      return {
        timestamp: null,
        totalEvents: 0,
      };
    } catch (error) {
      console.error("Error fetching last updated time:", error);
      return {
        timestamp: null,
        totalEvents: 0,
      };
    }
  }

  async function fetchEvents(lastUpdated, page) {
    setIsLoading(true);
    try {
      let queryData;

      // Base query
      let baseQuery = query(
        collection(db, "soldOutEvents"),
        where("createdAt", ">=", lastUpdated.timestamp.toDate()),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      // If we're not on the first page and we have a reference point
      if (page > 1 && lastVisible.current[page - 2]) {
        queryData = query(
          collection(db, "soldOutEvents"),
          where("createdAt", ">=", lastUpdated.timestamp.toDate()),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible.current[page - 2]),
          limit(pageSize)
        );
      } else {
        queryData = baseQuery;
      }

      const querySnapshot = await getDocs(queryData);
      const events = [];

      querySnapshot.forEach((doc) => {
        events.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Store the last document for this page
      if (querySnapshot.docs.length > 0) {
        lastVisible.current[page - 1] =
          querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      return {
        events,
        hasMore: events.length === pageSize,
        totalEvents: lastUpdated.totalEvents,
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { events: [], hasMore: false, totalEvents: 0 };
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    const loadInitialData = async () => {
      const lastUpdated = await fetchLastUpdated();
      if (!lastUpdated) return;

      const { events, hasMore } = await fetchEvents(lastUpdated, 1);
      setData(events);
      setCurrentPage(1);
    };

    loadInitialData();
  }, [open]);

  useEffect(() => {
    function onTidioChatApiReady() {
      window.tidioChatApi.display(false);
    }

    if (window.tidioChatApi) {
      window.tidioChatApi.on("ready", onTidioChatApiReady);
    } else {
      document.addEventListener("tidioChat-ready", onTidioChatApiReady);
    }

    return () => {
      if (window.tidioChatApi) {
        window.tidioChatApi.display(true);
      }
    };
  }, []);

  const eventsToDisplay = data || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNextPage = async () => {
    if (isLoading) return;

    const lastUpdated = await fetchLastUpdated();
    if (!lastUpdated) return;

    const nextPage = currentPage + 1;
    const { events, hasMore } = await fetchEvents(lastUpdated, nextPage);

    if (events.length > 0) {
      setData(events);
      setCurrentPage(nextPage);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage <= 1 || isLoading) return;

    const lastUpdated = await fetchLastUpdated();
    if (!lastUpdated) return;

    const prevPage = currentPage - 1;
    const { events } = await fetchEvents(lastUpdated, prevPage);

    if (events.length > 0) {
      setData(events);
      setCurrentPage(prevPage);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          backgroundColor: "#670004",
          borderRadius: "16px",
          fontFamily: "'Inter', sans-serif",
          color: "white",
          height: "30px",
          width: "270px",
          marginLeft: "20px",
          whiteSpace: "nowrap",
          padding: "0 12px",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "300px",
        }}
      >
        Soldout Events (BETA)
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="soldout-events-dialog"
        className={classes.dialog}
        fullWidth
        maxWidth="xl"
      >
        <BetaAcknowledgmentOverlay onAcknowledge={() => {}} />
        <div
          className={classes.dialogContent}
          style={{ backgroundColor: darkMode ? "#1e1e1e" : "#ffffff" }}
        >
          <div
            style={{
              overflowY: "auto",
              backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
              color: darkMode ? "#ffffff" : "#000000",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                margin: 0,
              }}
              className={
                darkMode ? "url-list dark-mode" : "url-list light-mode"
              }
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      borderTopLeftRadius: "16px",
                    }}
                  >
                    Event Name
                  </th>
                  {/* <th
                      style={{
                        width: "15%",
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Presale Code
                    </th> */}
                  <th
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Venue
                  </th>
                  <th
                    style={{
                      width: "15%",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      width: "10%",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    URL
                  </th>
                  <th
                    style={{
                      width: "10%",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Add Event
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventsToDisplay.map((event, index) => {
                  const offers =
                    Array.isArray(event.o) && !event.o[0]?.n
                      ? event.o.join(", ")
                      : event.o.map((o) => o.n).join(", ");

                  return (
                    <tr key={index}>
                      <td
                        style={{
                          width: "15%",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {event.n}
                      </td>
                      {/* <td
                          style={{
                            width: "15%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "center",
                          }}
                        >
                          {event.o
                            .flatMap((o) =>
                              o.c
                                ? o.c.split(", ").map((code) => (
                                    <div key={`${o.n}-${code}`}>
                                      {o.n}: <strong>{code.trim()}</strong>
                                    </div>
                                  ))
                                : null
                            )
                            .filter(Boolean) || "N/A"}
                        </td> */}
                      <td
                        style={{
                          width: "15%",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {`${event.v}, ${event.ci}, ${event.s}`}
                        {event.c ? (
                          <div style={{ fontWeight: "bold" }}>
                            (capacity: {event.c})
                          </div>
                        ) : null}
                      </td>
                      <td
                        style={{
                          width: "15%",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {event.d}
                      </td>
                      <td
                        style={{
                          width: "10%",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        <a
                          href="#"
                          target="_blank"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(event.u, "_blank");
                          }}
                          rel="noopener noreferrer"
                          style={{
                            color: darkMode ? "#fff" : "#000",
                            textDecoration: "underline",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          View Event
                        </a>
                      </td>
                      <td
                        style={{
                          width: "10%",
                          padding: "8px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: urls.includes(event.u)
                              ? "#ccc"
                              : "#670004",
                            fontSize: "12px",
                            borderRadius: "16px",
                            fontFamily: "'Inter', sans-serif",
                            color: "white",
                            width: "70px",
                            height: "30px",
                            cursor: urls.includes(event.u)
                              ? "not-allowed"
                              : "pointer",
                          }}
                          onClick={() =>
                            handleAddUrl(
                              "",
                              [event.u],
                              urls,
                              TotalUrls,
                              undefined,
                              mainUser,
                              db
                            )
                          }
                        >
                          Add Event
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || isLoading}
                style={{
                  backgroundColor: currentPage <= 1 ? "#cccccc" : "#670004",
                  borderRadius: "16px",
                  fontFamily: "'Inter', sans-serif",
                  color: "white",
                  height: "40px",
                  width: "40px",
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: currentPage <= 1 ? "none" : "scale(1.05)",
                  },
                }}
              >
                ←
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  minWidth: "200px",
                }}
              >
                <span
                  style={{
                    color: darkMode ? "#ffffff" : "#000000",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Page {currentPage}
                </span>
                <span
                  style={{
                    color: darkMode ? "#888888" : "#666666",
                    fontSize: "14px",
                  }}
                >
                  {data.length > 0 && data[0]?.te ? (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} -{" "}
                      {Math.min(currentPage * pageSize, data[0].te)} of{" "}
                      {data[0].te} events
                    </>
                  ) : (
                    "Loading events..."
                  )}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={data.length < pageSize || isLoading}
                style={{
                  backgroundColor:
                    data.length < pageSize ? "#cccccc" : "#670004",
                  borderRadius: "16px",
                  fontFamily: "'Inter', sans-serif",
                  color: "white",
                  height: "40px",
                  width: "40px",
                  cursor: data.length < pageSize ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: data.length < pageSize ? "none" : "scale(1.05)",
                  },
                }}
              >
                →
              </button>
            </div>

            {isLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: darkMode ? "#ffffff" : "#000000",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #670004",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span>Loading events...</span>
              </div>
            )}

            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SoldoutEvents;
