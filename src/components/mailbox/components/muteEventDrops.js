import React, { useState } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { doc, writeBatch } from "firebase/firestore";
import { db, getCurrentUserEmail } from "../../../firebase";

const MuteButton = ({ eventId, user, mutedTime }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMuteOptionClick = async (duration) => {
    handleClose();
    let muteEndTime;
    if (duration === "unmute") {
      muteEndTime = null;
    } else {
      muteEndTime = new Date();
      switch (duration) {
        case "1h":
          muteEndTime.setHours(muteEndTime.getHours() + 1);
          break;
        case "8h":
          muteEndTime.setHours(muteEndTime.getHours() + 8);
          break;
        case "1d":
          muteEndTime.setDate(muteEndTime.getDate() + 1);
          break;
        case "1w":
          muteEndTime.setDate(muteEndTime.getDate() + 7);
          break;
        case "2w":
          muteEndTime.setDate(muteEndTime.getDate() + 14);
          break;
        case "1m":
          muteEndTime.setMonth(muteEndTime.getMonth() + 1);
          break;
        case "always":
          muteEndTime = "always";
          break;
        default:
          muteEndTime = null;
      }
    }

    const batch = writeBatch(db);
    const userDocRef = doc(db, "users", user);

    const docId = `${user}-${eventId}`;
    const logRef = doc(db, "UrlLogs", docId);

    batch.set(
      userDocRef,
      {
        mutedEvents: {
          [eventId]: muteEndTime,
        },
      },
      { merge: true }
    );

    batch.set(
      logRef,
      {
        urlDisables: {
          [new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
          })]: {
            event_id: eventId,
            mutedTime: muteEndTime,
            u: getCurrentUserEmail(),
          },
        },
        emailAddress: user,
        eventId: eventId,
      },
      { merge: true }
    );

    await batch.commit();
  };

  let isMuted;

  if (mutedTime === "always") {
    isMuted = true;
  } else {
    isMuted =
      (mutedTime &&
        (mutedTime instanceof Date || mutedTime.toDate instanceof Function) &&
        new Date(mutedTime.toDate ? mutedTime.toDate() : mutedTime) >
          new Date()) ||
      mutedTime === "always";
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          padding: "4px 8px",
          marginLeft: "10px",
          border: "1px solid",
          borderColor: isMuted ? "#5B5B5B" : "#5B5B5B",
          backgroundColor: isMuted ? "#5B5B5B" : "#5B5B5B",
          color: isMuted ? "#FFF" : "#FFF",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          fontSize: "13px",
          borderRadius: "16px",
        }}
      >
        {isMuted ? "Disabled" : "Disable"}
      </button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isMuted
          ? [
              <MenuItem
                key="unmute"
                onClick={() => handleMuteOptionClick("unmute")}
              >
                Re-enable
              </MenuItem>,
            ]
          : [
              <MenuItem key="1h" onClick={() => handleMuteOptionClick("1h")}>
                Disable for 1 hour
              </MenuItem>,
              <MenuItem key="8h" onClick={() => handleMuteOptionClick("8h")}>
                Disable for 8 hours
              </MenuItem>,
              <MenuItem key="1d" onClick={() => handleMuteOptionClick("1d")}>
                Disable for 1 day
              </MenuItem>,
              <MenuItem key="1w" onClick={() => handleMuteOptionClick("1w")}>
                Disable for 1 week
              </MenuItem>,
              <MenuItem key="2w" onClick={() => handleMuteOptionClick("2w")}>
                Disable for 2 week
              </MenuItem>,
              <MenuItem key="1m" onClick={() => handleMuteOptionClick("1m")}>
                Disable for 1 month
              </MenuItem>,
              <MenuItem
                key="always"
                onClick={() => handleMuteOptionClick("always")}
              >
                Always Disabled
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
};

export default MuteButton;
