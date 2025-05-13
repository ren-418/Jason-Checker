import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "../../../ThemeContext";
import moment from "moment";
import DropLogo from "./dropLogo";

const useStyles = makeStyles((theme) => ({
  listItem: {
    cursor: "pointer",
  },
  listItemLight: {
    cursor: "pointer",
    position: "relative",
    display: "flex",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  earlyBackground: {
    backgroundImage: "linear-gradient(to left, #FFAA00, #FFDE9C)",
    "&:hover": {
      backgroundImage: "linear-gradient(to left, #ffeb3b, #ffeb8e)",
    },
  },
  earlyBeta: {
    backgroundColor: "#ff80ab",
    "&:hover": {
      backgroundColor: "#ff4081",
    },
  },
  axs: {
    backgroundImage: "linear-gradient(to left, #0052CC, #7BA9FF)",
    "&:hover": {
      backgroundImage: "linear-gradient(to left, #003D99, #4B89FF)",
    },
  },
  eventButton: {
    textTransform: "none",
    height: "100%",
    minWidth: "80px",
    marginLeft: theme.spacing(1.5),
    backgroundColor: "#4caf50",
    margin: 0,
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  secondaryTextDarkMode: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  earlyDarkMode: {
    color: "black",
  },
  lowStockBackground: {
    backgroundImage: "linear-gradient(to left, #b85ec8, #e9ceea)",
  },
  mlbBackground: {
    backgroundImage: "linear-gradient(to left, #0044cc, #7aa3e6)",
  },
  qPing: {
    backgroundImage: "linear-gradient(to right, #d7aefb, #8e44ad)",
  },
  qPingDarkMode: {
    color: "black",
    backgroundImage: "linear-gradient(to right, #d7aefb, #8e44ad)",
  },
  seatgeekBackground: {
    backgroundImage: "linear-gradient(to left, #FF5B49, #ff6e5e)",
  },
  listItemBorder: {
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  artistBackground: {
    backgroundImage: "linear-gradient(to left, #4caf50, #c9f1cf)",
  },
  listItemBorderDarkMode: {
    "&:hover": {
      backgroundColor: "#333333", // This is a dark grey color
    },
  },
}));

function getClosestPastEvent(events) {
  const estCurrentTime = moment().tz("America/New_York");

  let closestEvent = null;
  let closestTimeDifference = Infinity;

  if (!events || events.length === 0) return closestEvent;

  events.forEach((event) => {
    const timeMatch = event.time.match(/^(\d{1,2}):(\d{2})$/);

    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);

      const eventTime = moment
        .tz(estCurrentTime.format("YYYY-MM-DD"), "America/New_York")
        .set("hour", hour)
        .set("minute", minute)
        .set("second", 0)
        .set("millisecond", 0);

      const eventTimeWithGrace = eventTime.clone().subtract(15, "minutes");

      const timeDifference = estCurrentTime.diff(eventTimeWithGrace);

      if (timeDifference > 0 && timeDifference < closestTimeDifference) {
        closestTimeDifference = timeDifference;
        closestEvent = event;
      }
    }
  });

  return closestEvent;
}

const EmailItem = ({
  email = {},
  handleClick,
  event_info = {},
  updateUserData,
  qEvent,
  OnSaleData,
}) => {
  const classes = useStyles();

  let {
    opened,
    eventUrl,
    timestamp = Date.now(),
    quantity = 0,
    priceDrop,
    qPing,
    lowStock,
    stubhub,
    evenue,
  } = email;

  let eventLinkHref = eventUrl;
  if (eventUrl.includes("ticketmaster.com")) {
    eventLinkHref = eventUrl.replace(
      "ticketmaster.com",
      "www.ticketmaster.com"
    );
  } else if (eventUrl.includes("ticketmaster.ca")) {
    eventLinkHref = eventUrl.replace("ticketmaster.ca", "www.ticketmaster.ca");
  }

  const onSaleEvent = getClosestPastEvent(OnSaleData);

  let presale = false;
  let onsale = false;

  if (onSaleEvent) {
    for (let i = 0; i < onSaleEvent.offer.length; i++) {
      const sale = onSaleEvent.offer[i].n;

      if (sale.includes("On Sale")) {
        onsale = true;
        break;
      }
    }

    if (!onsale) {
      if (onSaleEvent.offer.length > 0) {
        presale = true;
      }
    }
  }

  const { darkMode } = useTheme();

  const {
    name = "Unknown Name",
    venue = "Unknown Venue",
    date = "Unknown Date",
  } = event_info;

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/uri-list", eventLinkHref);
    event.dataTransfer.setData("text/plain", eventLinkHref);
  };

  const handleDragEnd = (event) => {
    const droppedTarget = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    if (droppedTarget) {
      window.open(eventLinkHref, "_blank");
    }
  };

  return (
    <React.Fragment>
      <ListItem
        button
        className={`${darkMode ? classes.listItem : classes.listItemLight}`}
        onClick={() => {
          if (!qPing) {
            handleClick(email);
          } else {
            window.open(eventLinkHref, "_blank");
          }
        }}
        disableRipple
        style={{ backgroundColor: darkMode ? "#121212" : "white" }}
      >
        {!opened && !qPing && priceDrop === undefined ? (
          <div
            style={{
              backgroundColor: darkMode
                ? email.early
                  ? "#950006"
                  : "#ffc001"
                : "Blue",
              borderRadius: "50%",
              width: "11px",
              height: "11px",
              marginRight: "10px",
              alignSelf: "center",
              position: "absolute",
              top: 20,
              right: "145px",
            }}
          ></div>
        ) : null}
        {presale ? (
          <>
            {priceDrop === true ? (
              <div
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0, 255, 56, 0.12) 0%, rgba(0, 125, 28, 0.12) 100%)",
                  borderRadius: "10px 0px 0px 0px",
                  padding: "5px 10px",
                  alignSelf: "center",
                  position: "absolute",
                  border: "1px solid #00AC26",
                  bottom: "47px",
                  right: "149px",
                  color: "#3BE400",
                  transition: "all 0.5s ease-in-out",
                  fontFamily: "Inter",
                  fontSize: "14px",
                }}
              >
                price drop
              </div>
            ) : null}

            {priceDrop === false ? (
              <div
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255, 170, 0, 0.12) 0%, rgba(151, 101, 0, 0.12) 82.84%, rgba(129, 86, 0, 0.12) 100%)",
                  borderRadius: "10px 0px 0px 0px",
                  padding: "5px 10px",
                  alignSelf: "center",
                  position: "absolute",
                  border: "1px solid #AE7400B2",
                  bottom: "47px",
                  right: "149px",
                  color: "#E09500",
                  transition: "all 0.5s ease-in-out",
                  fontFamily: "Inter",
                  fontSize: "14px",
                }}
              >
                price increase
              </div>
            ) : null}
            <div
              style={{
                backgroundColor: "#005A9A",
                borderRadius: "10px 0px 6px 0px",
                padding: "5px 10px",
                alignSelf: "center",
                position: "absolute",
                bottom: "15px",
                right: "149px",
                color: "white",
                transition: "all 0.5s ease-in-out",
                fontFamily: "Inter",
                fontSize: "14px",
              }}
            >
              presale
            </div>
          </>
        ) : null}
        {onsale ? (
          <>
            {priceDrop === true ? (
              <div
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0, 255, 56, 0.12) 0%, rgba(0, 125, 28, 0.12) 100%)",
                  borderRadius: "10px 0px 0px 0px",
                  padding: "5px 10px",
                  alignSelf: "center",
                  position: "absolute",
                  border: "1px solid #00AC26",
                  bottom: "47px",
                  right: "149px",
                  color: "#3BE400",
                  transition: "all 0.5s ease-in-out",
                  fontFamily: "Inter",
                  fontSize: "14px",
                }}
              >
                price drop
              </div>
            ) : null}

            {priceDrop === false ? (
              <div
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255, 170, 0, 0.12) 0%, rgba(151, 101, 0, 0.12) 82.84%, rgba(129, 86, 0, 0.12) 100%)",
                  borderRadius: "10px 0px 0px 0px",
                  padding: "5px 10px",
                  alignSelf: "center",
                  position: "absolute",
                  border: "1px solid #AE7400B2",
                  bottom: "47px",
                  right: "149px",
                  color: "#E09500",
                  transition: "all 0.5s ease-in-out",
                  fontFamily: "Inter",
                  fontSize: "14px",
                }}
              >
                price increase
              </div>
            ) : null}
            <div
              style={{
                backgroundColor: "#006A17",
                borderRadius: "10px 0px 6px 0px",
                padding: "5px 10px",
                alignSelf: "center",
                position: "absolute",
                bottom: "15px",
                right: "149px",
                color: "white",
                transition: "all 0.5s ease-in-out",
                fontFamily: "Inter",
                fontSize: "14px",
              }}
            >
              onsale
            </div>
          </>
        ) : null}
        {priceDrop === true && !onsale && !presale ? (
          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 255, 56, 0.12) 0%, rgba(0, 125, 28, 0.12) 100%)",
              borderRadius: "10px 0px 6px 0px",
              padding: "5px 10px",
              alignSelf: "center",
              position: "absolute",
              border: "1px solid #00AC26",
              bottom: "15px",
              right: "149px",
              color: "#3BE400",
              transition: "all 0.5s ease-in-out",
              fontFamily: "Inter",
              fontSize: "14px",
            }}
          >
            price drop
          </div>
        ) : null}
        {priceDrop === false && !onsale && !presale ? (
          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 170, 0, 0.12) 0%, rgba(151, 101, 0, 0.12) 82.84%, rgba(129, 86, 0, 0.12) 100%)",
              borderRadius: "10px 0px 6px 0px",
              padding: "5px 10px",
              alignSelf: "center",
              position: "absolute",
              border: "1px solid #AE7400B2",
              bottom: "15px",
              right: "149px",
              color: "#E09500",
              transition: "all 0.5s ease-in-out",
              fontFamily: "Inter",
              fontSize: "14px",
            }}
          >
            price increase
          </div>
        ) : null}

        <ListItemText
          className={`${
            qPing
              ? darkMode
                ? classes.qPingDarkMode
                : classes.qPing
              : email.earlyBeta
              ? classes.earlyBeta
              : email.early
              ? classes.earlyBackground
              : email.type === "artist"
              ? classes.artistBackground
              : lowStock
              ? classes.lowStockBackground
              : darkMode
              ? classes.listItemBorderDarkMode
              : classes.listItemBorder
          }`}
          primary={
            qPing ? (
              <>
                {`${name} - ${venue}, ${date} `}

                <br />
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
              </>
            ) : qEvent ? (
              <>
                {`${name} - ${venue}, ${date} `}
                <strong>({quantity} tickets found)</strong>
                <img
                  src="/Queue-logo.png"
                  alt="Q-Tickets"
                  style={{
                    height: "25px",
                    width: "auto",
                    verticalAlign: "middle",
                    marginLeft: "10px",
                    filter: darkMode && !email.early ? "invert(1)" : "",
                    display: "inline-block",
                  }}
                />
              </>
            ) : email.type === "artist" ? (
              email.eventDetails && email.eventDetails.length === 1 ? (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: darkMode ? (lowStock ? "black" : "") : "",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <strong>**Added Date**</strong>
                  </div>
                  {` ${name} `}
                  {` - `}
                  <strong>{email.eventDetails[0].venue}</strong>
                  {` - `}
                  <strong>{email.eventDetails[0].date}</strong>
                  {` `}
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: darkMode ? (lowStock ? "black" : "") : "",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <strong>**Multiple Dates Added**</strong>
                  </div>
                  <div style={{ textAlign: "center" }}>{` ${name} `}</div>
                </span>
              )
            ) : (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: darkMode ? (lowStock ? "black" : "") : "",
                }}
              >
                {`${name}${venue ? ` - ${venue}` : ""}${
                  date ? `, ${date}` : ""
                } `}
                <strong>
                  {`(`}
                  {quantity} {` tickets found)`}
                </strong>
              </span>
            )
          }
          secondary={
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                color: qPing
                  ? "black"
                  : darkMode
                  ? lowStock
                    ? "black"
                    : stubhub
                    ? "white"
                    : ""
                  : stubhub
                  ? "black"
                  : evenue
                  ? "black"
                  : "",

                display: email.type === "artist" ? "flex" : "block",
                justifyContent:
                  email.type === "artist" ? "center" : "flex-start",
              }}
            >{`Release Time: ${new Date(timestamp).toLocaleString()}`}</span>
          }
          classes={{
            secondary: `${darkMode ? classes.secondaryTextDarkMode : ""} ${
              email.early ? classes.earlyDarkMode : ""
            }`,
            primary: email.early && darkMode ? classes.earlyDarkMode : "",
          }}
          style={{
            border: "1px solid #7E7E7E",
            padding: "5px 30px 5px 10px",
            poition: "relative",
            borderRadius: "8px",
            width: "75%",
            minHeight: "85px",
          }}
        />
        {eventLinkHref && (
          <a
            href={eventLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={(event) => {
              updateUserData();
              event.stopPropagation();
            }}
          >
            <DropLogo
              eventUrl={eventLinkHref}
              artistUrl={
                email.type === "artist" && email.eventDetails
                  ? email.eventDetails[0].artistUrl
                  : null
              }
            />
          </a>
        )}
      </ListItem>
    </React.Fragment>
  );
};

export default EmailItem;
