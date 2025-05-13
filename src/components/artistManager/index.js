import React, { useState, useEffect } from "react";

import { Dialog, DialogContent, Box } from "@material-ui/core";
import "../../css/HomePage.css";

import { useEventContext } from "../HomePage/UserDataContext";
import { useTheme } from "../../ThemeContext";
import XIcon from "../filters/_components/icons/XIcon";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../../firebase";
import ArtistSearchBar from "./Searchbar";

const ArtistManager = () => {
  const { darkMode } = useTheme();

  const userContext = useEventContext();
  const { artistUrls, eventsInfo, TotalUrls, urls, mainUser } = userContext;

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleAddArtist = async (newArtistUrl) => {
    if (newArtistUrl === undefined || newArtistUrl === null || !newArtistUrl)
      return;
    if (!newArtistUrl.trim()) return;

    if (
      !newArtistUrl.includes("ticketmaster.c") ||
      !newArtistUrl.includes("/artist/")
    ) {
      console.error("Invalid artist URL - must be a Ticketmaster artist page");
      return;
    }

    if (
      TotalUrls !== undefined &&
      urls.length + 10 + artistUrls.length * 10 > TotalUrls
    ) {
      alert("You have reached the maximum number of URLs");
      return;
    }

    // Parse out artist ID
    const artistIdMatch = newArtistUrl.match(/\/artist\/([^/]+)/);
    if (!artistIdMatch) {
      console.error("Could not parse artist ID from URL");
      return;
    }
    let artistId = artistIdMatch[1];

    artistId = artistId.split("?")[0];

    const url = `https://ticketmaster.com/artist/${artistId}`;

    if (artistUrls.includes(url)) {
      alert("Artist already added");
      return;
    }

    fetch("https://mg.phantomcheckerapi.com/api/ticketmaster/artist-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({
        url: url,
        email: mainUser,
      }),
    });

    try {
      const userEmail = mainUser;
      const userDocRef = doc(db, "users", userEmail);

      await updateDoc(userDocRef, {
        artistUrls: arrayUnion(url),
      });
    } catch (error) {
      console.error("Error adding artist URL:", error);
    } finally {
    }
  };

  const handleRemoveArtist = async (urlToRemove) => {
    try {
      const userEmail = mainUser;
      const userDocRef = doc(db, "users", userEmail);

      await updateDoc(userDocRef, {
        artistUrls: arrayRemove(urlToRemove),
      });
    } catch (error) {
      console.error("Error removing artist URL:", error);
    }
  };

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
          Artist Added Date Monitor
        </button>

        <Dialog
          id="templateManagerDialog"
          open={open}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth="md"
        >
          <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
            <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
              <div className="flex flex-grow text-center">
                <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                  Artist Added Date Monitor
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
              <Box className={darkMode ? "dark" : ""}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "24px",
                    gap: "8px",
                  }}
                >
                  <ArtistSearchBar
                    darkMode={darkMode}
                    performSearch={handleAddArtist}
                  />
                </div>

                <div>
                  <table
                    className={
                      darkMode ? "url-list dark-mode" : "url-list light-mode"
                    }
                    style={{
                      width: "100%",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            borderTopLeftRadius: "16px",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Artist ID
                        </th>
                        <th
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            borderTopRightRadius: "16px",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {artistUrls && artistUrls.length > 0 ? (
                        artistUrls.map((url, index) => {
                          const artistIdMatch = url.match(/\/artist\/([^/]+)/);
                          const artistId = artistIdMatch
                            ? artistIdMatch[1]
                            : null;

                          const eventInfoData = eventsInfo[artistId] || {};

                          return (
                            <tr
                              style={{ fontFamily: "'Inter', sans-serif" }}
                              key={index}
                            >
                              <td
                                style={{
                                  textAlign: "center",
                                  userSelect: "text",
                                  color: darkMode ? "white" : "#3C3C3C",
                                }}
                              >
                                {eventInfoData.name || "loading"}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  userSelect: "text",
                                }}
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: darkMode ? "#fff" : "#000",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {artistId}
                                </a>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  className="remove-button"
                                  onClick={() => handleRemoveArtist(url)}
                                  style={{
                                    backgroundColor: "#670004",
                                    fontSize: "13px",
                                    borderRadius: "16px",
                                    fontFamily: "'Inter', sans-serif",
                                    color: "white",
                                    width: "70px",
                                    height: "30px",
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              textAlign: "center",
                              padding: "16px",
                              fontFamily: "'Inter', sans-serif",
                              color: darkMode ? "white" : "#3C3C3C",
                            }}
                          >
                            No artist URLs added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Box>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ArtistManager;
