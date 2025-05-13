import React from "react";

const CornerBox = ({
  totalSeats,
  stubhubData,
  stubhubMin,
  darkMode,
  priceRange,
  axsData = false,
  mlbData = false,
  seatGeekData = false,
  stubhubDropData = false,
}) => {
  const cornerBoxStyles = {
    height: "75px",
    position: "relative",
  };

  const cornerTextStyle = (
    top,
    right,
    bottom,
    left,
    phantom_min = false,
    priceRange = false,
    title,
    darkMode
  ) => ({
    position: "absolute",
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    margin: "0",
    fontWeight: "bold",
    color: darkMode
      ? "rgb(171 118 253)"
      : phantom_min
      ? "#6647BA"
      : priceRange
      ? "#007BFF"
      : "#333",
    textDecoration: title ? "underline" : "",
    fontSize: title ? "19px" : "",
  });

  const sideTextStyle = (
    top,
    right,
    bottom,
    left,
    total_seats = false,
    phantom_data = false,
    darkMode
  ) => ({
    ...cornerTextStyle(top, right, bottom, left),
    textAlign: "center",
    color: darkMode
      ? "rgb(171 118 253)"
      : total_seats
      ? "#007BFF"
      : phantom_data
      ? "#6647BA"
      : "",
  });

  return (
    <div style={cornerBoxStyles}>
      {totalSeats > 0 && (
        <>
          <div style={cornerTextStyle("0", null, null, "0", false, true, true)}>
            {seatGeekData
              ? "SeatGeek Data"
              : axsData
              ? "AXS Data"
              : mlbData
              ? "MLB Data"
              : stubhubDropData
              ? "Stubhub Data"
              : "Ticketmaster Data"}
          </div>

          <div style={sideTextStyle("27.5px", null, null, "0", true)}>
            Total Seats:{" "}
            <div
              style={{
                all: "unset",
                color: darkMode ? "#FFFFFF" : "#333",
              }}
            >
              {totalSeats}
            </div>
          </div>
          {!axsData && !seatGeekData && !mlbData && (
            <div style={cornerTextStyle(null, null, "0", "0", false, true)}>
              Price Range:{" "}
              <div
                style={{
                  all: "unset",
                  color: darkMode ? "#FFFFFF" : "#333",
                }}
              >
                {priceRange}
              </div>
            </div>
          )}
        </>
      )}

      {stubhubData && (
        <>
          <div
            style={cornerTextStyle(
              "0",
              "0",
              null,
              null,
              true,
              true,
              true,
              darkMode
            )}
          >
            Phantom Data
          </div>

          <div
            style={sideTextStyle(
              "27.5px",
              "0",
              null,
              null,
              false,
              true,
              darkMode
            )}
          >
            Total Seats:{" "}
            <div
              style={{
                all: "unset",
                color: darkMode ? "#FFFFFF" : "#333",
              }}
            >
              {stubhubData.total_quantity}
            </div>
          </div>
          <div
            style={cornerTextStyle(
              null,
              "0",
              "0",
              null,
              true,
              false,
              false,
              darkMode
            )}
          >
            Get in:{" "}
            <div
              style={{
                all: "unset",
                color: darkMode ? "#FFFFFF" : "#333",
              }}
            >
              ${stubhubMin}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CornerBox;
