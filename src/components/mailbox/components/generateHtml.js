import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../ThemeContext";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, getCurrentUserEmail } from "../../../firebase";

import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import NotificationDialog from "../../NotifcationManager/Overlay";

import CornerBox from "./miniDataTable";
import { handleEarlyMonitorToggle } from "../../HomePage/handlers/urlManipulation";
import MuteButton from "./muteEventDrops1";
import Notes from "./notes";
import NotesModal from "../../notes/notes";
// import CopyButton from "./copyButton";

function EmailContent({
  event_info,
  quantity,
  map_url,
  groupedTickets,
  eventLink,
  timestamp,
  filterIds,
  handleFilterClick,
  notesDocument,
  userEmail,
  totalSeats,
  stubhub,
  eventId,
  early,
  totalEarly,
  showTable,
  editFilters,
  isLowStock = false,
  vividIds,
  email,
}) {
  if (groupedTickets) {
    groupedTickets.sort((a, b) => a.price - b.price);
  } else {
    groupedTickets = [];
  }
  const { darkMode } = useTheme();

  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);

  const [isChecked, setIsChecked] = useState(early.includes(eventLink));

  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const [stubhubData, setStubhubData] = useState(null);

  // const [presaleData, setPresaleData] = useState(null);

  const [windowWidth, setWindowWidth] = useState(null); // State to store the table width

  const [mapImage, setMapImage] = useState(null);
  const isFetchingRef = useRef(false);

  const changeVF = event_info.faceValueExchange || false;

  // href event link
  let eventLinkHref = eventLink;
  if (eventLink.includes("ticketmaster.com")) {
    eventLinkHref = eventLink.replace(
      "ticketmaster.com",
      "www.ticketmaster.com"
    );
  } else if (eventLink.includes("ticketmaster.ca")) {
    eventLinkHref = eventLink.replace("ticketmaster.ca", "www.ticketmaster.ca");
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    if (!stubhub) return;

    const stubhubDocRef = doc(db, "stubhubData", String(stubhub));
    const stubhubUnsubscribe = onSnapshot(stubhubDocRef, (doc) => {
      if (doc.exists()) {
        setStubhubData(doc.data());
      }
    });

    return () => {
      stubhubUnsubscribe();
    };
  }, [eventId, userEmail, stubhub]);

  // useEffect(() => {
  //   if (!eventId) return;

  //   const presaleDocRef = doc(db, "presaleCodes", String(eventId));
  //   const presaleUnsubscribe = onSnapshot(presaleDocRef, (doc) => {
  //     if (doc.exists()) {
  //       const presaleData = doc.data();
  //       if (presaleData.offers) {
  //         console.log(presaleData.offers);
  //         setPresaleData(presaleData.offers);
  //       }
  //     }
  //   });

  //   return () => {
  //     presaleUnsubscribe();
  //   };
  // }, [eventId, userEmail]);

  useEffect(() => {
    async function fetchMapImage() {
      try {
        if (isFetchingRef.current || mapImage) return;
        if (
          !map_url ||
          (!eventLink.includes("ticketmaster") &&
            !eventLink.includes("livenation")) ||
          !map_url.includes("mapsapi.tmol.io") ||
          !userEmail
        ) {
          setMapImage(false);
          return;
        }
        isFetchingRef.current = true;

        const response = await fetch(
          "https://mg.phantomcheckerapi.com/api/ticketmaster/map-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: map_url,
              email: getCurrentUserEmail(),
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageResponse = await response.text();

        if (imageResponse === null || imageResponse === "null") {
          throw new Error("response null");
        }

        if (imageResponse.includes("error")) {
          throw new Error("error");
        }

        setMapImage(imageResponse.replace(/"/g, ""));
      } catch (error) {
        setMapImage(false);
        console.error(error);
      }
    }

    fetchMapImage();

    return () => {
      if (mapImage) {
        URL.revokeObjectURL(mapImage);
      }
    };
  }, [eventLink, map_url, userEmail, mapImage]);

  // Generate JSX content for each ticket group
  const rows = (groupedTickets || []).map((group, index) => {
    const seatQuantity = group.seatNumbers?.length || 0;
    let groupPrice = undefined;
    if (group.price) {
      groupPrice = `$${group.price}`;
      if (eventLink.includes(".ca")) {
        groupPrice = `CA $${group.price}`;
      }

      if (email.ticketMasterUK) {
        groupPrice = `£${group.price}`;
      }

      if (email.eu) {
        groupPrice = `€${group.price}`;
      }
    }

    let previousGroupPrice = undefined;
    if (group.previousPrice) {
      previousGroupPrice = `$${group.previousPrice}`;
      if (eventLink.includes(".ca")) {
        previousGroupPrice = `CA $${group.previousPrice}`;
      }

      if (email.ticketMasterUK) {
        groupPrice = `£${group.price}`;
      }

      if (email.eu) {
        groupPrice = `€${group.price}`;
      }
    }

    // length of the groupTickets array if its the last element set value to true
    const isLastElement = index === groupedTickets.length - 1;

    let sectionGetIn = "N/A";
    let sectionLevelGetIn = "N/A";
    const sectionLevels = stubhubData?.total_data;

    if (sectionLevels) {
      for (const category in sectionLevels) {
        if (Object.hasOwnProperty.call(sectionLevels, category)) {
          const sections = sectionLevels[category];

          for (const section of sections) {
            const { t, min } = section;

            if (t && t === group.sectionName) {
              sectionGetIn = min;

              const minArray = sections
                .map((section) => {
                  const minValue = parseFloat(section.min.replace(/[$,]/g, ""));
                  return !isNaN(minValue) ? minValue : null;
                })
                .filter((min) => min !== null && min !== 0);

              if (minArray.length > 0) {
                sectionLevelGetIn = `$${Math.min(...minArray)}`;
              } else {
                sectionLevelGetIn = "$0";
              }

              break;
            }
          }
        }
      }
    }

    const hasGroupPrice = groupedTickets.some((group) => group.price);
    const hasGroupName = groupedTickets.some((group) => group.name);

    let groupName = group.name;
    if (changeVF) {
      groupName = group.name.replace("Verified Resale", "Face Value Exchange");
    }

    return (
      <tr key={index}>
        {group.name ? (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderRight: "1px solid black",
              paddingLeft: "16px",
              paddingRight: "16px",
              borderBottom: isLastElement ? "" : "1px solid black",
              color: "white",
              background: "#6a79b0",
              paddingTop: "8px",
              paddingBottom: "8px",
              textAlign: "center",
              borderBottomLeftRadius: isLastElement ? "8px" : "0px",
            }}
          >
            {groupName}
          </td>
        ) : null}
        <td
          style={{
            fontFamily: "'Inter', sans-serif",
            borderLeft: hasGroupName ? "1px solid black" : "",
            borderRight: "1px solid black",
            borderBottom: isLastElement ? "" : "1px solid black",
            borderRadius:
              hasGroupName || !isLastElement
                ? "0px 0px 0px 0px"
                : "0px 0px 0px 6px",
            color: "white",
            background: "#6a79b0",
            paddingTop: "8px",
            paddingBottom: "8px",
            textAlign: "center",
          }}
        >
          {group.sectionName}{" "}
          {group.accessibility?.length > 0 && (
            <span role="img" aria-label="wheelchair">
              ♿
            </span>
          )}
        </td>

        {isLowStock && group.totalAvailableStock && (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderLeft: "1px solid black",
              // borderRight: "1px solid black",
              borderBottom: isLastElement ? "" : "1px solid black",
              color: "white",
              borderRadius: isLastElement
                ? "0px 0px 6px 0px"
                : "0px 0px 0px 0px",
              background: "#6a79b0",
              paddingTop: "8px",
              paddingBottom: "8px",
              textAlign: "center",
            }}
          >
            {group.totalAvailableStock}
          </td>
        )}

        {group.sectionRow?.length > 0 && (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
              borderBottom: isLastElement ? "" : "1px solid black",
              color: "white",
              background: "#6a79b0",
              paddingTop: "8px",
              paddingBottom: "8px",
              textAlign: "center",
            }}
          >
            {group.sectionRow}
          </td>
        )}

        {group.seatNumbers?.length > 0 && (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
              borderBottom: isLastElement ? "" : "1px solid black",
              color: "white",
              background: "#6a79b0",
              paddingTop: "8px",
              paddingBottom: "8px",
              textAlign: "center",
            }}
          >
            {group.seatNumbers.join(", ")} <strong>({seatQuantity})</strong>
          </td>
        )}

        {groupPrice && previousGroupPrice ? (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderLeft: "1px solid black",
              borderBottom: isLastElement ? "" : "1px solid black",
              // borderRight: "1px solid black",
              color: "white",
              background: "#6a79b0",
              paddingTop: "8px",
              paddingBottom: "8px",
              textAlign: "center",
            }}
          >
            <strong>
              <span>
                {previousGroupPrice}➜{groupPrice}
              </span>
            </strong>
          </td>
        ) : groupPrice ? (
          <td
            style={{
              fontFamily: "'Inter', sans-serif",
              borderLeft: "1px solid black",
              paddingLeft: "15px",
              paddingRight: "15px",
              // borderRight: "1px solid black",
              color: "white",
              background: "#6a79b0",
              paddingTop: "8px",
              borderBottom: isLastElement ? "" : "1px solid black",
              paddiBottomop: "8px",
              textAlign: "center",
              borderBottomRightRadius:
                isLastElement && !stubhubData ? "8px" : "0px",
            }}
          >
            <strong>{groupPrice}</strong>
          </td>
        ) : (
          hasGroupPrice && (
            <td
              style={{
                fontFamily: "'Inter', sans-serif",
                borderLeft: "1px solid black",
                paddingLeft: "15px",
                paddingRight: "15px",
                // borderRight: "1px solid black",
                color: "white",
                background: "#6a79b0",
                paddingTop: "8px",
                borderBottom: isLastElement ? "" : "1px solid black",
                paddiBottomop: "8px",
                textAlign: "center",
                borderBottomRightRadius:
                  isLastElement && !stubhubData ? "8px" : "0px",
              }}
            >
              <strong>N/A</strong>
            </td>
          )
        )}

        {stubhubData && !isLowStock && (
          <>
            <td
              style={{
                fontFamily: "'Inter', sans-serif",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                color: "white",
                background: "#515C84",
                paddingTop: "8px",
                paddiBottomop: "8px",
                backgroundColor: "#553A66",
                borderBottom: isLastElement ? "" : "1px solid black",
                textAlign: "center",
              }}
            >
              {sectionGetIn}
            </td>
            <td
              style={{
                fontFamily: "'Inter', sans-serif",
                borderLeft: "1px solid black",
                borderBottom: isLastElement ? "" : "1px solid black",
                color: "white",
                background: "#515C84",
                backgroundColor: "#553A66",
                paddingTop: "8px",
                paddiBottomop: "8px",
                textAlign: "center",
                borderBottomRightRadius: isLastElement ? "8px" : "0px",
              }}
            >
              {sectionLevelGetIn}
            </td>
          </>
        )}
      </tr>
    );
  });

  const hasGroupName = groupedTickets.some((group) => group.name);
  const hasGroupPrice = groupedTickets.some((group) => group.price);
  const hasRow = groupedTickets.some((group) => group.sectionRow);
  const hasSeatNumbers = groupedTickets.some((group) => group.seatNumbers);

  let stubhubMin = Infinity;
  if (stubhubData) {
    for (const sectionName in stubhubData.total_data) {
      const section = stubhubData.total_data[sectionName];
      for (const item of section) {
        if (item.min !== undefined) {
          const minPrice = parseFloat(
            item.min.replace("$", "").replace(",", "")
          );
          if (!isNaN(minPrice) && minPrice < stubhubMin && minPrice !== 0) {
            stubhubMin = minPrice;
          }
        }
      }
    }
  }

  const ticketmaster =
    eventLink.includes("ticketmaster") || eventLink.includes("livenation");

  const isMlb = eventLink.includes("mlb.tickets.com");

  const vividUrl = vividIds[eventId] || "";

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <a
            href={eventLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            draggable="true"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              display: "block",
              width: "90%",
            }}
          >
            <div
              style={{
                borderRadius: "20px 20px 15px 15px",
                background: darkMode ? "#2D2D2D" : "#F5F5F5",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
                padding: "10px 20px",
                margin: "0 0 30px",
                width: "100%",
              }}
            >
              <h1
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: darkMode ? "#E7E7E7" : "black",
                  paddingBottom: "10px",
                }}
              >
                {event_info.name}
              </h1>
              {email.type !== "artist" ? (
                <>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      color: darkMode ? "#E7E7E7" : "black",
                      margin: "0",
                      paddingBottom: "10px",
                    }}
                  >
                    <strong>Date:</strong> {event_info.date}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      color: darkMode ? "#E7E7E7" : "black",
                      margin: "0",
                      paddingBottom: "10px",
                    }}
                  >
                    <strong>Venue:</strong> {event_info.venue}
                  </p>
                </>
              ) : (
                <p>
                  <br />
                  <strong style={{ fontSize: "2rem" }}>
                    ** ARTIST ADDED DATE **
                  </strong>
                </p>
              )}
            </div>
          </a>

          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            {!editFilters &&
            (!email.eventDetails || email.eventDetails.length === 0) ? (
              <button
                style={{
                  backgroundColor: filterIds.includes(eventId)
                    ? "#4287f5"
                    : "#521114",
                  width: "70px",
                  height: "30px",
                  marginLeft: "10px",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                }}
                onClick={() =>
                  handleFilterClick([eventId, eventLink, event_info])
                }
              >
                Filters
              </button>
            ) : !email.eventDetails || email.eventDetails.length === 0 ? (
              <button
                onClick={() => {
                  setNotesModalOpen(true);
                }}
                style={{
                  backgroundColor: Object.keys(notesDocument).includes(eventId)
                    ? "#4287f5"
                    : "#521114",
                  width: "70px",
                  height: "30px",
                  marginLeft: "10px",
                  borderRadius: "10px",
                  color: "white",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Notes
              </button>
            ) : null}

            {ticketmaster &&
            !editFilters &&
            (!email.eventDetails || email.eventDetails.length === 0) ? (
              <button
                style={{
                  backgroundColor: isChecked ? "#febc04" : "#5B5B5B",
                  marginLeft: "10px",
                  color: "white",
                  height: "30px",
                  borderRadius: "10px",
                  width: "120px",
                  fontFamily: "'Inter', sans-serif",
                  // put a disable symbol when you hover over the button and have no early monitor
                  cursor:
                    early.length === 0 && totalEarly === 0
                      ? "not-allowed"
                      : "pointer",
                  opacity: early.length === 0 && totalEarly === 0 ? 0.5 : 1,
                }}
                onClick={(e) => {
                  if (early.length === 0 && totalEarly === 0) {
                    return;
                  }
                  handleEarlyMonitorToggle(
                    eventLink,
                    !isChecked,
                    userEmail,
                    db,
                    totalEarly,
                    early
                  );
                  setIsChecked(!isChecked);
                }}
              >
                Early Monitor
              </button>
            ) : null}
            {stubhub && (
              <a
                href={`https://www.stubhub.com/event/${stubhub}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#3F1D74",
                  borderRadius: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 68,
                  height: 35,
                  marginLeft: "10px",
                }}
              >
                <img
                  src="/stubhubsmall.svg"
                  alt="stubhub-seats-logo"
                  style={{
                    height: 20,
                    width: 19,
                  }}
                />
              </a>
            )}
            {vividUrl && (
              <a
                href={vividUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "black",
                  borderRadius: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 68,
                  height: 35,
                  marginLeft: "10px",
                }}
              >
                <img
                  src="/vividsmall.svg"
                  alt="vivid-seats-logo"
                  style={{
                    height: 17,
                    width: 20,
                  }}
                />
              </a>
            )}
            {(!email.eventDetails || email.eventDetails.length === 0) && (
              <IconButton
                style={{
                  padding: "7px",
                  margin: " 0 10px",
                  color: darkMode ? "white" : "black",
                }}
                onClick={() => {
                  setIsNotificationDialogOpen(true);
                }}
              >
                <VolumeUpIcon />
              </IconButton>
            )}
          </div>

          <p
            style={{
              fontSize: "larger",
              color: darkMode ? "white" : "black",
              paddingTop: "15px",
              paddingLeft: "10px",
            }}
          >
            Total Quantity - <strong> {quantity}</strong>
          </p>
        </div>
        <div style={{ userSelect: "none" }}>
          <div
            style={{
              width: "390px",
            }}
          >
            {email.type === "artist" ? (
              <img
                src={email.eventDetails[0].artistUrl}
                alt="map_image"
                style={{
                  width: "390px",
                  height: "290px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                }}
              />
            ) : isMlb ? (
              <img
                src="/mlb.png"
                alt="map_image"
                style={{
                  width: "390px",
                  height: "290px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            ) : mapImage &&
              typeof mapImage === "string" &&
              mapImage.trim() !== "" ? (
              <img
                src={`data:image/png;base64,${mapImage}`}
                alt="map_image"
                style={{
                  width: "390px",
                  height: "290px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                  e.target.onerror = null;
                  e.target.src =
                    "https://thehcpac.org/wp-content/uploads/2016/11/redticket.png";
                }}
              />
            ) : mapImage !== null ? (
              <img
                src={map_url}
                alt="map_image"
                style={{
                  width: "390px",
                  height: "290px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "10px",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://thehcpac.org/wp-content/uploads/2016/11/redticket.png";
                }}
              />
            ) : (
              <div
                style={{
                  width: "390px",
                  height: "290px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              ></div>
            )}
          </div>
          <CornerBox
            totalSeats={totalSeats}
            priceRange={event_info.priceRange}
            stubhubData={stubhubData}
            stubhubMin={stubhubMin}
            darkMode={darkMode}
            axsData={eventLink.includes("axs.com")}
            seatGeekData={eventLink.includes("seatgeek.com")}
            mlbData={eventLink.includes("mlb.tickets.com")}
            stubhubDropData={eventLink.includes("stubhub.com")}
          />
        </div>
        <NotificationDialog
          open={isNotificationDialogOpen}
          onClose={() => setIsNotificationDialogOpen(false)}
          eventId={eventId}
        />
      </div>
      <a
        href={eventLinkHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: darkMode ? "#E3AD00" : "rgb(0, 123, 255)",
          textDecoration: "underline",
          fontFamily: "'Inter', sans-serif",
          marginLeft: "10px",
          fontSize:
            windowWidth < 860 ? "12px" : windowWidth < 1000 ? "14px" : "18px",
        }}
      >
        {eventLink.includes("tix.axs.com") ? "AXS Link" : eventLink}
      </a>
      {/* {presaleData && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            paddingTop: "10px",
            marginLeft: "10px",
            fontFamily: "'Inter', sans-serif",
            color: darkMode ? "#E7E7E7" : "#333",
            alignItems: "center",
          }}
        >
          <strong style={{ marginRight: "5px" }}>Presale Codes:</strong>
          {"  "}
          {presaleData &&
            presaleData.map((code, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "5px",
                }}
              >
                <CopyButton code={code.c} darkMode={darkMode} />
              </div>
            ))}
        </div>
      )} */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginRight: 12,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              marginTop: "30px",
              width: "fit-content",
            }}
          >
            {stubhubData && !isLowStock && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingRight: 60,
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Inter', sans-serif",
                    color: "rgb(171, 118, 253)",
                    fontWeight: "bold",
                  }}
                >
                  Phantom Data
                </span>
              </div>
            )}

            <table
              style={{
                borderCollapse: "collapse",
                tableLayout: "auto",
                // width: "100%",
              }}
            >
              <thead>
                <tr>
                  {email.type === "artist" && (
                    <>
                      <th
                        style={{
                          background: "#2D2D2D",
                          textAlign: "center",
                          padding: "4px 8px", // Reduced padding
                          borderRadius: "6px 0px 0px 0px",
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          color: "white",
                          whiteSpace: "nowrap", // Prevents text wrapping
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          background: "#2D2D2D",
                          textAlign: "center",
                          padding: "4px 8px", // Reduced padding
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          color: "white",
                          whiteSpace: "nowrap", // Prevents text wrapping
                        }}
                      >
                        Venue
                      </th>
                      <th
                        style={{
                          background: "#2D2D2D",
                          textAlign: "center",
                          padding: "4px 8px", // Reduced padding
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          color: "white",
                          borderRadius: "0px 6px 0px 0px",
                          whiteSpace: "nowrap", // Prevents text wrapping
                        }}
                      >
                        Link
                      </th>
                    </>
                  )}
                  {hasGroupName && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        padding: "4px 8px", // Reduced padding
                        borderRadius: "6px 0px 0px 0px",
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap", // Prevents text wrapping
                      }}
                    >
                      Ticket Type
                    </th>
                  )}
                  {groupedTickets.length > 0 && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        borderRadius: hasGroupName
                          ? "0px 0px 0px 0px"
                          : "6px 0px 0px 0px",
                        padding: "4px 8px", // Reduced padding
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Section
                    </th>
                  )}
                  {isLowStock && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        padding: "4px 8px", // Reduced padding
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap",
                        borderRadius: "0px 6px 0px 0px",
                      }}
                    >
                      Low Stock
                    </th>
                  )}
                  {hasRow && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        padding: "4px 8px", // Reduced padding
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Row
                    </th>
                  )}
                  {hasSeatNumbers && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        padding: "4px 8px", // Reduced padding
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Seats (Qty)
                    </th>
                  )}
                  {hasGroupPrice && (
                    <th
                      style={{
                        background: "#2D2D2D",
                        textAlign: "center",
                        borderRadius: !stubhubData ? "0px 6px 0px 0px" : "",
                        padding: "4px 8px", // Reduced padding
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Price
                    </th>
                  )}

                  {stubhubData && !isLowStock && (
                    <>
                      <th
                        style={{
                          background: "#2D2D2D",
                          textAlign: "center",
                          padding: "4px 8px", // Reduced padding
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          color: "rgb(171, 118, 253)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Sec Price
                      </th>
                      <th
                        style={{
                          background: "#2D2D2D",
                          textAlign: "center",
                          padding: "4px 8px", // Reduced padding
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                          color: "rgb(171, 118, 253)",
                          borderTopRightRadius: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Cheapest In Lvl
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows}
                {email.eventDetails &&
                  email.eventDetails.length > 0 &&
                  email.eventDetails.map((detail, index) => {
                    const isLastElement =
                      index === email.eventDetails.length - 1;

                    const eventURL = detail.eventURL;

                    // get eventId
                    const eventId = eventURL.split("/").pop();

                    return (
                      <tr key={index}>
                        <td
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            borderRight: "1px solid black",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            borderBottom: isLastElement
                              ? ""
                              : "1px solid black",
                            color: "white",
                            background: "#6a79b0",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            textAlign: "center",
                            borderBottomLeftRadius: isLastElement
                              ? "8px"
                              : "0px",
                          }}
                        >
                          {detail.date}
                        </td>
                        <td
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            borderRight: "1px solid black",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            borderBottom: isLastElement
                              ? ""
                              : "1px solid black",
                            color: "white",
                            background: "#6a79b0",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            textAlign: "center",
                          }}
                        >
                          {detail.venue}
                        </td>
                        <td
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            borderBottom: isLastElement
                              ? ""
                              : "1px solid black",
                            color: "white",
                            background: "#6a79b0",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            textAlign: "center",
                            borderBottomRightRadius: isLastElement
                              ? "8px"
                              : "0px",
                          }}
                        >
                          <a
                            href={detail.eventURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "white",
                              textDecoration: "underline",
                            }}
                          >
                            {eventId}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {(!email.eventDetails || email.eventDetails.length === 0) && (
          <Notes
            stubhubData={stubhubData}
            note={notesDocument[eventId] || ""}
            darkMode={darkMode}
          />
        )}
      </div>

      <div style={{ display: "flex" }}>
        <p
          style={{
            marginTop: 18,
            fontFamily: "'Inter', sans-serif",
            color: darkMode ? "white" : "black",
          }}
        >
          <strong
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Release Time:
          </strong>{" "}
          {new Date(timestamp).toLocaleString()}
        </p>

        {!editFilters && !showTable && groupedTickets.length > 0 && (
          <MuteButton
            eventId={eventId}
            user={getCurrentUserEmail()}
            eventUrl={eventLink}
            totalEarly={totalEarly}
            early={early}
            mainUser={userEmail}
          />
        )}
        <NotesModal
          eventId={eventId}
          notesDocument={notesDocument}
          userEmail={userEmail}
          open={notesModalOpen}
          handleClose={() => setNotesModalOpen(false)}
        />
      </div>
    </>
  );
}

export default EmailContent;
