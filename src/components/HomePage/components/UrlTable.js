import React from "react";
import { FaTimes } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination from "@mui/material/TablePagination";
import MuteButton from "../../mailbox/components/muteEventDrops";
import { getCurrentUserEmail } from "../../../firebase";

import Stubhub from "../../../assets/stubhub2.svg";
import {
  getDataAccountId,
  getLinkId,
  getSiteId,
  getTicketCode,
} from "../handlers/urlManipulation";

function UrlTable({
  darkMode,
  searchResults,
  eventsInfo,
  handleRemoveUrl,
  sortConfig,
  handleSort,
  handleFilterClick,
  filterIds,
  handleEarlyMonitorToggle,
  early,
  totalEarly,
  stubhubIds,
  editFilters,
  vividIds,
  mutedEvents,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", userSelect: "none" }}>
      <table
        className={darkMode ? "url-list dark-mode" : "url-list light-mode"}
      >
        <thead>
          <tr>
            <th
              style={{
                fontFamily: "'Inter', sans-serif",
                borderTopLeftRadius: "16px",
              }}
            >
              Remove
            </th>
            <th style={{ fontFamily: "'Inter', sans-serif" }}>Price Range</th>
            <th
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="sortable"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {sortConfig.key === "date"
                ? sortConfig.direction === "ascending"
                  ? "↓"
                  : "↑"
                : ""}
            </th>
            <th
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="sortable"
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortConfig.key === "name"
                ? sortConfig.direction === "ascending"
                  ? "↓"
                  : "↑"
                : ""}
            </th>
            <th
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="sortable"
              onClick={() => handleSort("venue")}
            >
              Venue{" "}
              {sortConfig.key === "venue"
                ? sortConfig.direction === "ascending"
                  ? "↓"
                  : "↑"
                : ""}
            </th>
            <th style={{ fontFamily: "'Inter', sans-serif" }}>Stubhub Link</th>
            <th style={{ fontFamily: "'Inter', sans-serif" }}>Vivid Link</th>

            <th
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="sortable"
              onClick={() => handleSort("eventId")}
            >
              Event ID{" "}
              {sortConfig.key === "eventId"
                ? sortConfig.direction === "ascending"
                  ? "↓"
                  : "↑"
                : ""}
            </th>
            <th
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="sortable"
              onClick={() => handleSort("early")}
            >
              Early Monitor{" "}
            </th>
            {!editFilters && (
              <th
                style={{
                  borderTopRightRadius: mutedEvents ? "0px" : "16px",
                }}
              >
                Filters
              </th>
            )}
            {/* <th>Notes</th> */}
            {mutedEvents && (
              <th style={{ borderTopRightRadius: "16px" }}>Disable</th>
            )}
          </tr>
        </thead>
        <tbody>
          {searchResults
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((url, index) => {
              let eventId = new URL(url).pathname.split("/").pop();
              if (url.includes("axs.com") || url.includes("axs.co.uk")) {
                const match = url.match(/e=([0-9]+)/);
                if (match) {
                  const eParam = match[1];
                  eventId = eParam;
                }
              }

              if (
                url.includes("mlb.tickets.com") ||
                url.includes("mpv.tickets.com")
              ) {
                let urlObj = new URL(url);
                let searchParams = new URLSearchParams(urlObj.search);
                // eventId = searchParams.get("pid");

                let pId = searchParams.get("pid");

                let event_id = searchParams.get("eventId");

                if (pId) {
                  eventId = pId;
                } else if (event_id) {
                  eventId = event_id;
                }
              }

              if (
                url.includes("evenue.net") &&
                url.includes("SEGetEventInfo")
              ) {
                const siteId = getSiteId(url);
                const dataAccId = getDataAccountId(url);
                const linkId = getLinkId(url);
                const ticketCode = getTicketCode(url);

                eventId = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
              } else if (
                url.includes("evenue.net") &&
                url.includes("/event/")
              ) {
                let urlObj = new URL(url);

                eventId = urlObj.pathname.split("/").slice(-2).join("-");
              }

              const eventInfo = eventsInfo[eventId] || {};
              const isChecked = early.includes(url);
              const stubhubId = stubhubIds[eventId] || "";

              const vividUrl = vividIds[eventId] || "";

              const ticketmaster =
                url.includes("ticketmaster") || url.includes("livenation");

              return (
                <tr style={{ fontFamily: "'Inter', sans-serif" }} key={index}>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveUrl(url)}
                      style={{ marginLeft: "10px" }}
                    >
                      <FaTimes className="remove-icon" />
                    </button>
                  </td>
                  <td style={{ textAlign: "center", userSelect: "text" }}>
                    {eventInfo.priceRange || "loading"}
                  </td>
                  <td style={{ textAlign: "center", userSelect: "text" }}>
                    {eventInfo.date || "loading"}
                  </td>
                  <td style={{ textAlign: "center", userSelect: "text" }}>
                    {eventInfo.name || "loading"}
                  </td>
                  <td style={{ textAlign: "center", userSelect: "text" }}>
                    {eventInfo.venue || "loading"}
                  </td>
                  <td style={{ width: "120px" }}>
                    {stubhubId && (
                      <a
                        href={`https://www.stubhub.com/event/${stubhubId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={Stubhub}
                          alt="stubhub-logo"
                          style={{
                            height: "100px",
                            width: "120px",
                            verticalAlign: "middle",
                          }}
                        />
                      </a>
                    )}
                  </td>
                  <td>
                    {vividUrl && (
                      <a
                        href={vividUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/vivid.jpg"
                          alt="vivid-seats-logo"
                          style={{
                            height: "50px",
                            verticalAlign: "middle",
                            width: "200px",
                          }}
                        />
                      </a>
                    )}
                  </td>
                  <td style={{ userSelect: "text" }}>
                    <a
                      href="#"
                      target="_blank"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(url, "_blank");
                      }}
                      rel="noopener noreferrer"
                      style={{
                        color: darkMode ? "#fff" : "#000",
                        textDecoration: "underline",
                      }}
                    >
                      {eventId.length > 20 ? eventId.substring(0, 16) : eventId}

                      {/* {isQEvent ? (
                        <img
                          src="/Queue-logo.png"
                          alt="Q-Tickets"
                          style={{
                            height: "50px",
                            width: "auto",
                            verticalAlign: "middle",
                            marginLeft: "10px",
                          }}
                        />
                      ) : isAxs ? (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Axs_logo.svg"
                          alt="axs-logo"
                          style={{
                            height: "50px",
                            verticalAlign: "middle",
                            marginLeft: "10px",
                            width: "50px",
                          }}
                        />
                      ) : (
                        <img
                          src="/ticketmaster.svg"
                          alt="ticketmaster-logo"
                          style={{
                            height: "50px",
                            width: "auto",
                            verticalAlign: "middle",
                            marginLeft: "10px",
                          }}
                        />
                      )} */}
                    </a>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <FormControlLabel
                      style={{
                        position: "relative",
                        cursor:
                          early.length === 0 && totalEarly === 0
                            ? "not-allowed"
                            : "",
                      }}
                      control={
                        <>
                          <Checkbox
                            checked={isChecked}
                            disabled={
                              !ticketmaster ||
                              (early.length === 0 && totalEarly === 0)
                            }
                            style={{ marginLeft: "30px" }}
                            onChange={(e) =>
                              handleEarlyMonitorToggle([url, e.target.checked])
                            }
                            sx={{
                              "&.Mui-checked": {
                                color: darkMode ? "white" : "black",
                                "& .MuiSvgIcon-root": {
                                  backgroundColor: "transparent",
                                },
                              },
                            }}
                          />
                          {early.length === 0 && totalEarly === 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "30px",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  width: "150%",
                                  height: "1.5px",
                                  backgroundColor: "#670004", // Subtle grey color
                                  transform: "rotate(45deg)",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  width: "150%",
                                  height: "1.5px",
                                  backgroundColor: "#670004", // Subtle grey color
                                  transform: "rotate(-45deg)",
                                }}
                              />
                            </div>
                          )}
                        </>
                      }
                      label=""
                    />
                  </td>
                  {!editFilters ? (
                    <td>
                      <button
                        style={{
                          backgroundColor: filterIds.includes(eventId)
                            ? "#4287f5"
                            : "#670004",
                          fontSize: "13px",
                          borderRadius: "16px",
                          fontFamily: "'Inter', sans-serif",
                          color: "white",

                          width: "70px",
                          height: "30px",
                        }}
                        onClick={() =>
                          handleFilterClick([eventId, url, eventInfo])
                        }
                      >
                        Filters
                      </button>
                    </td>
                  ) : null}
                  {mutedEvents && (
                    <td>
                      <MuteButton
                        mutedTime={mutedEvents[eventId]}
                        eventId={eventId}
                        user={getCurrentUserEmail()}
                        isMuteButton={true}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <TablePagination
          component="div"
          count={searchResults.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(
              event.target.value === "-1"
                ? searchResults.length
                : parseInt(event.target.value, 10)
            );
          }}
          rowsPerPageOptions={[50, 100, 200, { label: "All", value: -1 }]}
        />
      </div>
      <br />
    </div>
  );
}

export default UrlTable;
