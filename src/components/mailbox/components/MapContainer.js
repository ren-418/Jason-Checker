import React from "react";
import { Box, CircularProgress, Typography, Button } from "@material-ui/core";

function MapContainer({
  darkMode,
  classes,
  isMlb,
  isAxs,
  isLoading,
  mapImage,
  mapUrl,
  retry,
}) {
  return (
    <Box className={classes.mapContainer} style={{ marginTop: "4px" }}>
      {isMlb ? (
        <img src="/mlb.png" alt="MLB Map" className={classes.mapImage} />
      ) : isAxs ? (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Axs_logo.svg"
          alt="AXS Logo"
          className={classes.mapImage}
          style={{
            height: "180px",
            width: "180px",
            margin: "auto",
          }}
        />
      ) : mapImage && typeof mapImage === "string" && mapImage.trim() !== "" ? (
        <img
          src={`data:image/png;base64,${mapImage}`}
          alt="Event Map"
          className={classes.mapImage}
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
            e.target.onerror = null;
            e.target.src =
              "https://thehcpac.org/wp-content/uploads/2016/11/redticket.png";
          }}
        />
      ) : mapImage !== null ? (
        <img
          src={mapUrl}
          alt="Event Map"
          className={classes.mapImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://thehcpac.org/wp-content/uploads/2016/11/redticket.png";
          }}
        />
      ) : (
        <div
          style={{
            width: "390px",
            height: "290px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: darkMode ? "#121212" : "#FFFFFF",
            borderRadius: "10px",
          }}
        >
          {isLoading ? (
            <>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  mb: 2,
                }}
              >
                <CircularProgress
                  size={40}
                  thickness={4}
                  sx={{
                    color: darkMode ? "#E7E7E7" : "#3C3C3C",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                style={{
                  color: darkMode ? "#E7E7E7" : "#3C3C3C",
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Loading venue map...
              </Typography>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Typography
                variant="body1"
                style={{
                  color: darkMode ? "#E7E7E7" : "#3C3C3C",
                  marginBottom: "16px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Map not available
              </Typography>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  retry();
                }}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "#E7E7E7" : "#3C3C3C",
                  color: darkMode ? "#E7E7E7" : "#3C3C3C",
                  "&:hover": {
                    borderColor: darkMode ? "#FFFFFF" : "#000000",
                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Retry Loading Map
              </Button>
            </div>
          )}
        </div>
      )}
    </Box>
  );
}

export default MapContainer;
