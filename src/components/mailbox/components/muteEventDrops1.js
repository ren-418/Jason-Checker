import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { doc, writeBatch } from "firebase/firestore";
import { db, getCurrentUserEmail } from "../../../firebase";
import { DialogActions, DialogContentText, Button } from "@mui/material";
import {
  handleAddUrl,
  handleRemoveUrl,
} from "../../HomePage/handlers/urlManipulation";
import { useEventContext } from "../../HomePage/UserDataContext";

const MuteButton = ({
  eventId,
  user,
  mainUser,
  totalEarly,
  early,
  eventUrl,
}) => {
  const userContext = useEventContext();
  const { mutedEvents, urls, TotalUrls } = userContext;
  const mutedTime = mutedEvents[eventId];
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [EventRemoved, setEventRemoved] = useState(false);

  useEffect(() => {
    if (
      !urls.some(
        (url) => decodeURIComponent(url) === decodeURIComponent(eventUrl)
      )
    ) {
      setEventRemoved(true);
    } else {
      setEventRemoved(false);
    }
  }, [urls, eventUrl]);

  const handleClick = (event) => {
    if (EventRemoved) {
      handleAddUrl("", [eventUrl], urls, TotalUrls, undefined, mainUser, db);
    } else if (user !== mainUser) {
      setConfirmDeleteOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
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
          emailAddress: user,
          eventId: eventId,
        },
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
          backgroundColor: EventRemoved
            ? "green"
            : user === mainUser && isMuted
            ? "grey"
            : "#930900",
          color: "white",
          height: "30px",
          marginTop: "10px",
          borderRadius: "10px",
          paddingBottom: "0px",
          paddingTop: "0px",
          marginLeft: "auto",
          width: "15%",
          fontFamily: "'Inter', sans-serif",
          whiteSpace: "nowrap", // Prevent text wrapping
          overflow: "hidden", // Hide overflow
          userSelect: "none",
        }}
      >
        {EventRemoved
          ? "Re-add Event"
          : user === mainUser
          ? isMuted
            ? "Disabled"
            : "Disable/Remove"
          : "Remove Event"}
      </button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isMuted
          ? [
              <MenuItem onClick={() => handleMuteOptionClick("unmute")}>
                Re-enable
              </MenuItem>,
            ]
          : [
              <MenuItem onClick={() => handleMuteOptionClick("1h")}>
                Disable for 1 hour
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("8h")}>
                Disable for 8 hours
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("1d")}>
                Disable for 1 day
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("1w")}>
                Disable for 1 week
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("2w")}>
                Disable for 2 weeks
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("1m")}>
                Disable for 1 month
              </MenuItem>,
              <MenuItem onClick={() => handleMuteOptionClick("always")}>
                Always Disabled
              </MenuItem>,
              <MenuItem onClick={() => setConfirmDeleteOpen(true)}>
                Remove Event
              </MenuItem>,
            ]}
        <Dialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
        >
          <DialogTitle>Confirm Removing Event</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "black" }}>
              Are you sure you want to remove this event?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleRemoveUrl(eventUrl, mainUser, db, totalEarly, early);
                setConfirmDeleteOpen(false);
              }}
              color="secondary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Menu>
    </>
  );
};

export default MuteButton;
