import React from "react";
import { Typography } from "@material-ui/core";
import { isValidPrice, getTicketVendor } from "./helpers";

function StandardAdmissionContainer({
  event,
  darkMode,
  vendorColor,
  classes,
  theme,
  isHovered,
  setIsHovered,
  handleLocalOverlayOpen,
  isLowStock,
}) {
  return (
    <div
      className={`${classes.standardAdmissionContainer} ${
        darkMode
          ? classes.standardAdmissionDark
          : classes.standardAdmissionLight
      }`}
      onClick={(e) => {
        e.stopPropagation();
        handleLocalOverlayOpen(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      style={{
        marginLeft: "2px",
        backgroundColor: isHovered
          ? `${vendorColor}${darkMode ? "30" : "1A"}`
          : darkMode
          ? "#5252524D"
          : "#52525233",
        border: `1px solid ${
          isHovered ? vendorColor : darkMode ? "#5E5E5E" : "#5E5E5E66"
        }`,
        transition:
          "background-color 0.2s ease-in-out, border 0.2s ease-in-out",
        height: "auto",
        minHeight: "fit-content",
        overflow: "visible"
      }}
    >
      <Typography
        variant="h6"
        className={classes.sectionTitle}
        style={{
          color: getTicketVendor(event.eventLink).color,
          marginTop: 0,
        }}
      >
        {getTicketVendor(event.eventLink).name} - ({event.quantity} tickets found)
      </Typography>

      {isLowStock ? (
        <Typography
          variant="body1"
          style={{
            color: darkMode ? "#E7E7E7" : "#000000",
            marginBottom: theme.spacing(1),
          }}
        >
          {Array.isArray(event.groupTickets) &&
            event.groupTickets.slice(0, 2).map((ticket, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                {ticket.name} Section {ticket.sectionName} -{" "}
                {ticket.totalAvailableStock}
              </div>
            ))}
        </Typography>
      ) : Array.isArray(event.groupTickets) ? (
        event.groupTickets.slice(0, 2).map((ticket, index) => {
          return (
            <Typography
              key={index}
              variant="body1"
              style={{
                color: darkMode ? "#E7E7E7" : "#000000",
                marginBottom: theme.spacing(1),
              }}
            >
              {ticket.name && `${ticket.name} - `}Section {ticket.sectionName}
              {ticket.sectionRow && `, Row ${ticket.sectionRow}`}, Seats{" "}
              {ticket.seatNumbers ? ticket.seatNumbers.join(", ") : "N/A"}{" "}
              <strong>
                (
                {ticket.seatNumbers
                  ? ticket.seatNumbers.length
                  : ticket.quantity}
                )
              </strong>
              {isValidPrice(ticket.price) ? (
                <>
                  {" - "}
                  <strong>
                    {event.priceDrop || event.priceIncrease
                      ? `$${ticket.previousPrice}➜${ticket.price}`
                      : `$${ticket.price}`}
                  </strong>
                </>
              ) : null}
            </Typography>
          );
        })
      ) : (
        <Typography
          variant="body1"
          style={{
            color: darkMode ? "#E7E7E7" : "#000000",
            marginBottom: theme.spacing(1),
          }}
        >
          {event.type && `${event.type} - `}Section {event.section}
          {event.row && `, Row ${event.row}`}, Seats {event.seats}{" "}
          <strong>({event.quantity})</strong>
          {isValidPrice(event.price) ? (
            <>
              {" - "}
              <strong>
                {event.priceDrop || event.priceIncrease
                  ? `$${event.previousPrice}->${event.price}`
                  : `$${event.price}`}
              </strong>
            </>
          ) : null}
        </Typography>
      )}

      {Array.isArray(event.groupTickets) && event.groupTickets.length > 2 && (
        <Typography
          variant="body1"
          style={{
            color: darkMode ? "#E7E7E7" : "#000000",
            marginBottom: theme.spacing(1),
          }}
        >
          ...
        </Typography>
      )}
    </div>
  );
}

export default StandardAdmissionContainer;
