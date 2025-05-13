import React from "react";
import { CardContent, Typography, Grid, Box } from "@material-ui/core";
import StandardAdmissionContainer from "./StandardAdmissionContainer";
import PhantomData from "./PhantomData";
import MapContainer from "./MapContainer";
import MarketplaceButtons from "./MarketplaceButtons";

function LowStockBanner({
  event,
  darkMode,
  isLowStock,
  theme,
  vendorColor,
  classes,
  handleLocalOverlayOpen,
  isHovered,
  setIsHovered,
  stubhubData,
  phantomGetIn,
  getAverage,
  isMlb,
  isAxs,
  isLoading,
  mapImage,
  retry,
}) {
  return (
    <div
      style={{
        width: "calc(100% + 8px)",
        margin: "-4px -4px 0 -4px",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          background: isLowStock
            ? "linear-gradient(90deg, rgb(142, 68, 173) 0%, rgb(215, 174, 251) 100%)"
            : "linear-gradient(90deg, #FFDE9C96 0%, #FFAA0096 100%)",
          padding: "16px",
          borderRadius: "15px",
          marginBottom: "8px",
          border: "1px solid #7E7E7E",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: darkMode ? "#E7E7E7" : "#3C3C3C",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "bold",
          }}
        >
          {`${event.name} (${event.quantity} tickets found)`}
        </Typography>
      </div>

      <CardContent className={classes.content} style={{ paddingLeft: "16px" }}>
        <Grid container spacing={2}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="subtitle1"
              className={classes.subtitle}
              style={{
                color: darkMode ? "#E7E7E7" : "#3C3C3C",
                paddingLeft: "8px",
                fontSize: "1.1rem",
                fontWeight: "500"
              }}
            >
              <img
                src={darkMode ? "/pin1.svg" : "/pin2.svg"}
                alt="Location Icon"
                className={classes.icon}
              />
              {event.venue}
            </Typography>
            <Typography
              variant="subtitle1"
              className={classes.subtitle}
              style={{
                color: darkMode ? "#E7E7E7" : "#3C3C3C",
                paddingLeft: "8px",
                fontSize: "1.1rem",
                fontWeight: "500"
              }}
            >
              <img
                src={darkMode ? "/clock1.svg" : "/clock2.svg"}
                alt="Time Icon"
                className={classes.icon}
              />
              {event.date}
            </Typography>

            <StandardAdmissionContainer
              event={event}
              darkMode={darkMode}
              vendorColor={vendorColor}
              classes={classes}
              theme={theme}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              handleLocalOverlayOpen={handleLocalOverlayOpen}
              isLowStock={isLowStock}
            />

            <PhantomData
              event={event}
              darkMode={darkMode}
              stubhubData={stubhubData}
              phantomGetIn={phantomGetIn}
              getAverage={getAverage}
              classes={classes}
            />
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={4}>
            <Box className={classes.rightColumnContainer}>
              {/* Map Container */}
              <MapContainer
                darkMode={darkMode}
                classes={classes}
                isMlb={isMlb}
                isAxs={isAxs}
                isLoading={isLoading}
                mapImage={mapImage}
                mapUrl={event.map_url}
                retry={retry}
              />

              {/* Marketplace Buttons */}
              <MarketplaceButtons
                event={event}
                classes={classes}
                darkMode={darkMode}
                isStandard={false}
              />

              {/* Release Time */}
              <Typography
                variant="caption"
                className={classes.releaseTime}
                style={{ color: darkMode ? "#E7E7E7" : "#000000" }}
              >
                <strong>Release Time:</strong> {event.releaseTime}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </div>
  );
}

export default LowStockBanner;
