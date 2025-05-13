import React from "react";
import { ListItemText, Typography } from "@material-ui/core";

function QueuePingBanner({ event, darkMode, classes }) {
  return (
    <>
      <ListItemText
        style={{
          paddingLeft: "16px",
          paddingTop: "4px",
        }}
        primary={
          <>
            {`${event.name} - ${event.venue}, ${event.date} `}
            <div
              style={{
                marginTop: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/Queue-logo.png"
                alt="Q-Tickets"
                style={{
                  height: "25px",
                  width: "auto",
                  verticalAlign: "middle",
                  marginRight: "10px",
                  display: "inline-block",
                }}
              />
              <strong>QUEUE OPENED</strong>
              <img
                src="/Queue-logo.png"
                alt="Q-Tickets"
                style={{
                  height: "25px",
                  width: "auto",
                  verticalAlign: "middle",
                  marginLeft: "10px",
                  display: "inline-block",
                }}
              />
            </div>
            <Typography
              component="div"
              style={{
                color: "black",
                fontSize: "inherit",
                fontFamily: "'Inter', sans-serif",
                marginTop: "2px",
                fontWeight: "normal",
              }}
            >
              Release Time: {event.releaseTime}
            </Typography>
          </>
        }
      />
    </>
  );
}

export default QueuePingBanner;
