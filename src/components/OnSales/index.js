import React, { useState, useEffect } from "react";

import { Container, Tabs, Tab, makeStyles } from "@material-ui/core";
import "../../css/HomePage.css";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
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
}));

export const convertDatesToLocalTimezone = (data) => {
  const userTimezone = moment.tz.guess();

  Object.keys(data).forEach((timeSlot) => {
    data[timeSlot].forEach((event) => {
      if (event.d && event.d !== "TBD") {
        const utcDate = moment.tz(event.d, "ddd, MMMM D, YYYY h:mm A", "UTC");

        const localDate = utcDate.clone().tz(userTimezone);

        event.d = localDate.format("ddd, MMMM D, YYYY h:mm A");
      }
    });
  });

  return data;
};

export const convertDatesToLocalTimezone2 = (data) => {
  const userTimezone = moment.tz.guess();

  Object.keys(data).forEach((timeSlot) => {
    // change the date to local timezone
    const originalTime = moment.tz(timeSlot, "HH:mm", "UTC");
    const userTime = originalTime.clone().tz(userTimezone);
    let formattedTime = userTime.format("h:mm");

    data[formattedTime] = data[timeSlot];
    delete data[timeSlot];

    data[formattedTime].forEach((event) => {
      if (event.d && event.d !== "TBD") {
        const utcDate = moment.tz(event.d, "ddd, MMMM D, YYYY h:mm A", "UTC");

        const localDate = utcDate.clone().tz(userTimezone);

        event.d = localDate.format("ddd, MMMM D, YYYY h:mm A");
      }
    });
  });

  return data;
};

export const sortDataByTime = (data) => {
  const sortedTimes = Object.keys(data).sort((a, b) => {
    const [hoursA, minutesA] = a.split(":").map(Number);
    const [hoursB, minutesB] = b.split(":").map(Number);

    if (hoursA !== hoursB) {
      return hoursA - hoursB;
    }
    return minutesA - minutesB;
  });

  const sortedData = {};
  sortedTimes.forEach((time) => {
    if (data[time] && data[time].length > 0) {
      sortedData[time] = data[time].sort((a, b) => {
        if (a.n !== b.n) {
          return a.n.localeCompare(b.n);
        }
        return a.d.localeCompare(b.d);
      });
    }
  });

  return sortedData;
};

const generateTimeSlots = (data) => {
  const userTimezone = moment.tz.guess();

  const timeSlots = Object.keys(data).map((time) => {
    const originalTime = moment.tz(time, "HH:mm", "UTC");
    const userTime = originalTime.clone().tz(userTimezone);
    let formattedTime = userTime.format("h:mm A");

    return {
      original: time,
      formatted: formattedTime,
      timestamp: userTime.toISOString(),
    };
  });

  const sortedTimeSlots = timeSlots.sort((a, b) => {
    const timeA = moment(a.formatted, "h:mm A");
    const timeB = moment(b.formatted, "h:mm A");
    return timeA.valueOf() - timeB.valueOf();
  });

  return sortedTimeSlots;
};

const SalesPage = () => {
  const classes = useStyles();

  const [timeSlot, setTimeSlot] = useState(() => {
    const nyTime = moment().tz("America/New_York").set({
      hour: 13,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    if (nyTime.isDST()) {
      nyTime.add(1, "hours");
    }

    return nyTime.format("HH:mm");
  });

  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    moment().tz("America/New_York").toDate()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode } = useTheme();

  const userContext = useEventContext();
  const { urls, TotalUrls, mainUser } = userContext;

  useEffect(() => {
    const fetchData = async () => {
      const targetSalesDay = moment(selectedDate)
        .tz("America/New_York")
        .startOf("day");

      if (targetSalesDay.isDST()) {
        targetSalesDay.add(1, "hours");
      }

      const salesCollection = collection(db, "OnSale2");

      const qTm = query(
        salesCollection,
        where("salesDay", "==", targetSalesDay.toDate()),
        where("eventType", "==", "tm"),
        orderBy("date", "desc"),
        limit(1)
      );

      const qAxs = query(
        salesCollection,
        where("salesDay", "==", targetSalesDay.toDate()),
        where("eventType", "==", "axs"),
        orderBy("date", "desc"),
        limit(1)
      );

      const qSeatGeek = query(
        salesCollection,
        where("salesDay", "==", targetSalesDay.toDate()),
        where("eventType", "==", "seatgeek"),
        orderBy("date", "desc"),
        limit(1)
      );

      const [tmSnapshot, axsSnapshot, seatGeekSnapshot] = await Promise.all([
        getDocs(qTm),
        getDocs(qAxs),
        getDocs(qSeatGeek),
      ]);

      let tmData = null;
      let axsData = null;
      let seatGeekData = null;

      tmSnapshot.forEach((doc) => {
        tmData = doc.data().data;
      });
      axsSnapshot.forEach((doc) => {
        axsData = doc.data().data;
      });

      seatGeekSnapshot.forEach((doc) => {
        seatGeekData = doc.data().data;
      });

      let combinedData = {};

      for (let key in tmData) {
        combinedData[key] = tmData[key];
      }

      for (let key in axsData) {
        if (combinedData[key]) {
          combinedData[key] = [...combinedData[key], ...axsData[key]];
        } else {
          combinedData[key] = axsData[key];
        }
      }

      for (let key in seatGeekData) {
        if (combinedData[key]) {
          combinedData[key] = [...combinedData[key], ...seatGeekData[key]];
        } else {
          combinedData[key] = seatGeekData[key];
        }
      }

      const convertedData = convertDatesToLocalTimezone(combinedData);
      const sortedData = sortDataByTime(convertedData);

      const nyTime = moment().tz("America/New_York").set({
        hour: 13,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      if (nyTime.isDST()) {
        nyTime.add(1, "hours");
      }

      if (!sortedData[timeSlot]) {
        setTimeSlot(generateTimeSlots(sortedData)[0].original);
      } else if (timeSlot !== nyTime.format("HH:mm")) {
        setTimeSlot(nyTime.format("HH:mm"));
      }

      setData(sortedData);
    };

    fetchData();
  }, [selectedDate]);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotChange = (event, newValue) => {
    setTimeSlot(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterEventsForTimeSlot = (events, query) => {
    if (!query) return events;
    return events.filter(
      (event) =>
        event.n.toLowerCase().includes(query.toLowerCase()) ||
        event.v.toLowerCase().includes(query.toLowerCase())
    );
  };

  const timeSlots2 = generateTimeSlots(data);

  const displayEvents = data[timeSlot]
    ? filterEventsForTimeSlot(data[timeSlot], searchQuery)
    : [];

  const searchAcrossAllHours = () => {
    if (!searchQuery) return displayEvents;

    return Object.values(data)
      .flat()
      .filter(
        (event) =>
          event.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.v.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const eventsToDisplay = searchQuery ? searchAcrossAllHours() : displayEvents;

  return (
    <>
      <BetaAcknowledgmentOverlay onAcknowledge={() => {}} />

      <Container className={classes.container}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ marginTop: "10px" }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker"
                label="Sales Day"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                style={{
                  backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                  color: darkMode ? "#ffffff" : "#000000",
                  borderRadius: "4px",
                  marginTop: 0,
                }}
                InputProps={{
                  style: {
                    color: darkMode ? "#ffffff" : "#000000",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: darkMode ? "#ffffff" : "#000000",
                  },
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div>
            <div
              style={{
                width: "100%",
                position: "relative",
                marginTop: "10px",
              }}
            >
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  style={{
                    backgroundColor: darkMode ? "#0d0d0d" : "",
                    width: "100%",
                    padding: "7.5px 10px",
                    fontSize: "17px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>

        <Tabs
          value={timeSlot}
          onChange={handleTimeSlotChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className={classes.tabs}
        >
          {timeSlots2.map((slot) => (
            <Tab
              style={{ color: darkMode ? "#fff" : "#000" }}
              key={slot.original}
              label={slot.formatted}
              value={slot.original}
            />
          ))}
        </Tabs>
        <div
          style={{
            overflowY: "auto",
            height: "100vh",
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
            className={darkMode ? "url-list dark-mode" : "url-list light-mode"}
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
                    width: "15%",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Offer
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Price Range
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
                <th
                  style={{
                    width: "10%",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    borderTopRightRadius: "16px",
                  }}
                >
                  Add Artist
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
                        width: "15%",
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {offers}
                    </td>
                    <td
                      style={{
                        width: "10%",
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      {event.p || "N/A"}
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
                        href={event.u}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: darkMode ? "#fff" : "#000",
                          textDecoration: "underline",
                        }}
                      >
                        {event.e > 20 ? event.e.substring(0, 16) : event.e}
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
                          fontSize: "13px",
                          borderRadius: "16px",
                          fontFamily: "'Inter', sans-serif",
                          color: "white",
                          width: "70px",
                          backgroundColor: "#670004",
                          height: "30px",
                        }}
                        onClick={() => {
                          if (event.a[0] === "") return;
                          handleAddUrl(
                            "",
                            [`https://ticketmaster.com/artist/${event.a[0]}`],
                            urls,
                            TotalUrls,
                            undefined,
                            mainUser,
                            db
                          );
                        }}
                      >
                        Add Artist
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default SalesPage;
