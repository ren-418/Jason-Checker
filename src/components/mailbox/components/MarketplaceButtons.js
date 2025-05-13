import React from "react";
import { Box } from "@material-ui/core";
import { handleVividDragStart, handleStubhubDragStart } from "./helpers";

function MarketplaceButtons({ event, classes, darkMode, isStandard }) {
  return (
    <Box className={classes.buttonContainer} style={isStandard ? { marginTop: "-24px" } : {}}>
      {event.stubhubId && (
        <a
          href={`https://www.stubhub.com/event/${event.stubhubId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.marketplaceButton}
          style={{
            backgroundColor: "#3F1D74",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
          onClick={(e) => e.stopPropagation()}
          draggable="true"
          onDragStart={(e) => handleStubhubDragStart(e, event.stubhubId)}
        >
          <img
            src="/stubhubsmall.svg"
            alt="stubhub-seats-logo"
            width="20px"
            height="19px"
            style={{ pointerEvents: "none" }}
          />
        </a>
      )}

      {event.vividUrl && (
        <a
          href={event.vividUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.marketplaceButton}
          style={{
            backgroundImage: darkMode ? "url(/vivid-blue.svg)" : "none",
            backgroundSize: "cover",
            backgroundColor: darkMode ? "transparent" : "#000000",
            width: "68px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
          onClick={(e) => e.stopPropagation()}
          draggable="true"
          onDragStart={(e) => handleVividDragStart(e, event.vividUrl)}
        >
          <img
            src="/vividsmall.svg"
            alt="vivid-seats-logo"
            width="20px"
            height="17px"
            style={{ pointerEvents: "none" }}
          />
        </a>
      )}
    </Box>
  );
}

export default MarketplaceButtons;
