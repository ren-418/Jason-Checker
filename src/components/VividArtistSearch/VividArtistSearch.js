import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import XIcon from "../filters/_components/icons/XIcon";
import "../../css/HomePage.css";
import { useTheme } from "../../ThemeContext";
import moment from "moment-timezone";
import SearchBar from "./Searchbar";
import { auth } from "../../firebase";
import EventData from "../filters/_components/blocks/EventData";
import BetaAcknowledgmentOverlay from "./Beta";

export default function VividArtistSearch() {
  const [open, setOpen] = useState(false);
  const [vividArtistTabledata, setVividArtistTableData] = useState(null);

  const { darkMode } = useTheme();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setVividArtistTableData(null);
  };

  const handleSearch = async (artistData) => {
    if (!artistData) {
      alert("Please enter an artist name.");
      return;
    }

    let webPath = "";
    if (artistData.organicUrl) {
      webPath = artistData.organicUrl;
    } else if (artistData.webPath) {
      webPath = artistData.webPath;
    }

    try {
      const response = await fetch(
        "https://mg.phantomcheckerapi.com/api/vivid/search-artist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
          body: JSON.stringify({
            searchTerm: artistData.name,
            performerWebPath: webPath,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setVividArtistTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={handleOpenModal}
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
          Phantom Artist Search (BETA)
        </button>

        <Dialog
          id="templateManagerDialog"
          open={open}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth="md"
        >
          <BetaAcknowledgmentOverlay onAcknowledge={() => {}} />
          <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
            <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
              <div className="flex flex-grow text-center">
                <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                  Artist Search
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="bg-black/30 dark:bg-[#595959] rounded-full p-1"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
            <DialogContent>
              <div className="w-full flex flex-col items-center">
                <SearchBar
                  darkMode={darkMode}
                  performSearch={(term) => {
                    handleSearch(term);
                  }}
                />
                <br />
              </div>
              {vividArtistTabledata ? (
                <div
                  style={{
                    position: "relative",
                    height: "calc(100vh - 180px)",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                      marginTop: 0,
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
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                            borderTopLeftRadius: "16px",
                          }}
                        >
                          Venue & City
                        </th>
                        <th
                          style={{
                            width: "15%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            width: "15%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Ticket Quantity
                        </th>
                        <th
                          style={{
                            width: "15%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Get In Price
                        </th>
                        <th
                          style={{
                            width: "10%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Average Price
                        </th>
                        <th
                          style={{
                            width: "10%",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                            borderTopRightRadius: "16px",
                          }}
                        >
                          Phantom Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vividArtistTabledata.map((event, index) => {
                        let date = event.localDate.replace(
                          /T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}/,
                          (match) => {
                            return match.slice(0, match.indexOf("-"));
                          }
                        );

                        date = date.replace(/\[.*?\]/, "");

                        const lastIndexNumber =
                          index === vividArtistTabledata.length - 1;

                        return (
                          <tr key={index}>
                            <td
                              style={{
                                width: "13%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderRight: "1px solid black",
                                borderLeft: "1px solid black",
                                borderBottomLeftRadius: lastIndexNumber
                                  ? "16px"
                                  : null,
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              <a
                                href={`https://www.vividseats.com${event.webPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "underline",
                                }}
                              >
                                {event.venue.name}, {event.venue.city}
                              </a>
                            </td>
                            <td
                              style={{
                                width: "16%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderRight: "1px solid black",
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              {moment(date).format("MMMM DD, YYYY hh:mm A z")}
                            </td>
                            <td
                              style={{
                                width: "10%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderRight: "1px solid black",
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              {event.listingCount}
                            </td>
                            <td
                              style={{
                                width: "15%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderRight: "1px solid black",
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              ${event.minPrice}
                            </td>
                            <td
                              style={{
                                width: "15%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderBottomRightRadius: lastIndexNumber
                                  ? "16px"
                                  : null,
                                borderRight: "1px solid black",
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              ${event.medianPrice}
                            </td>
                            <td
                              style={{
                                width: "15%",
                                padding: "8px",
                                borderBottom: lastIndexNumber
                                  ? "1px solid black"
                                  : "none",
                                borderBottomRightRadius: lastIndexNumber
                                  ? "16px"
                                  : null,
                                borderRight: "1px solid black",
                                textAlign: "center",
                                color: darkMode ? "#fff" : "#000",
                              }}
                            >
                              <EventData
                                vividUrl={`https://www.vividseats.com${event.webPath}`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  style={{
                    height: "calc(100vh - 180px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ color: darkMode ? "#fff" : "#000" }}>
                    No data available
                  </p>
                </div>
              )}
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
