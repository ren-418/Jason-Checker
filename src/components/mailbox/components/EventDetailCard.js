import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

import useStyles from "../handlers/eventDetailStyles";
import { useMapImage } from "../../../hooks/useMapImage";
import { getTicketVendor, getAverage } from "./helpers";

import QueuePingBanner from "./QueuePingBanner";
import LowStockBanner from "./LowStockBanner";
import StandardAdmissionContainer from "./StandardAdmissionContainer";
import PhantomData from "./PhantomData";
import MapContainer from "./MapContainer";
import MarketplaceButtons from "./MarketplaceButtons";
// import OverlayDialog from "./OverlayDialog";

const EventDetailCard = React.memo(
  ({ event, darkMode, isLowStock, handleClick, email }) => {
    const classes = useStyles({ darkMode });
    const theme = useTheme();

    const [isHovered, setIsHovered] = useState(false);

    const { mapImage, isLoading, retry } = useMapImage(
      event.map_url,
      event.eventLink
    );
    const vendorColor = getTicketVendor(event.eventLink).color;

    let eventLinkHref = event.eventLink;

    if (eventLinkHref.includes("ticketmaster.com")) {
      eventLinkHref = eventLinkHref.replace(
        "ticketmaster.com",
        "www.ticketmaster.com"
      );
    } else if (eventLinkHref.includes("ticketmaster.ca")) {
      eventLinkHref = eventLinkHref.replace(
        "ticketmaster.ca",
        "www.ticketmaster.ca"
      );
    }

    const [stubhubData, setStubhubData] = useState(null);
    const [phantomGetIn, setPhantomGetIn] = useState("N/A");

    const isMlb = event.eventLink?.includes("mlb.tickets.com");
    const isAxs = event.eventLink?.includes("axs.com");
    const isQueueOpened = event.qPing;

    useEffect(() => {
      if (!event.stubhubId) return;

      const stubhubDocRef = doc(db, "stubhubData", String(event.stubhubId));
      const unsubscribe = onSnapshot(stubhubDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          let stubhubMin = Infinity;

          if (data.total_data) {
            for (const sectionName in data.total_data) {
              const section = data.total_data[sectionName];
              for (const item of section) {
                if (item.min !== undefined) {
                  const minPrice = parseFloat(
                    item.min.replace("$", "").replace(",", "")
                  );
                  if (
                    !isNaN(minPrice) &&
                    minPrice < stubhubMin &&
                    minPrice !== 0
                  ) {
                    stubhubMin = minPrice;
                  }
                }
              }
            }
          }

          setStubhubData(data);
          setPhantomGetIn(stubhubMin === Infinity ? "N/A" : `$${stubhubMin}`);
        }
      });

      return () => unsubscribe();
    }, [event.stubhubId]);

    const handleLocalOverlayOpen = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleClick(email);
    };

    const handleCardClick = (e) => {
      e.preventDefault();
      let eventLinkHref = event.eventLink;
      if (eventLinkHref.includes("ticketmaster.com")) {
        eventLinkHref = eventLinkHref.replace(
          "ticketmaster.com",
          "www.ticketmaster.com"
        );
      } else if (eventLinkHref.includes("ticketmaster.ca")) {
        eventLinkHref = eventLinkHref.replace(
          "ticketmaster.ca",
          "www.ticketmaster.ca"
        );
      }
      window.open(eventLinkHref, "_blank");
    };

    const handleDragStart = (e) => {
      let eventLinkHref = event.eventLink;
      if (eventLinkHref.includes("ticketmaster.com")) {
        eventLinkHref = eventLinkHref.replace(
          "ticketmaster.com",
          "www.ticketmaster.com"
        );
      } else if (eventLinkHref.includes("ticketmaster.ca")) {
        eventLinkHref = eventLinkHref.replace(
          "ticketmaster.ca",
          "www.ticketmaster.ca"
        );
      }
      e.dataTransfer.setData("text/uri-list", eventLinkHref);
      e.dataTransfer.setData("text/plain", eventLinkHref);
    };

    return (
      <Card
        key={`${event.id || event.uniqueId}-${
          event.qPing ? "queue" : "normal"
        }`}
        className={`${
          event.qPing
            ? darkMode
              ? classes.qPingDarkMode
              : classes.qPing
            : event.early || isLowStock
            ? classes.earlyMonitor
            : classes.card
        }`}
        style={{
          backgroundColor: event.qPing
            ? "transparent"
            : event.early || isLowStock
            ? "transparent"
            : darkMode
            ? "#121212"
            : "#FFFFFF",
          color:
            event.qPing || event.early || isLowStock
              ? "black"
              : darkMode
              ? "#E7E7E7"
              : "#3C3C3C",
          border: "1px solid #7E7E7E",
          cursor: "pointer",
          margin: "10px 0",
          padding: event.early || isLowStock ? "0" : "4px",
          position: "relative",
          overflow: "hidden",
          zIndex: "auto",
        }}
        onClick={handleCardClick}
        draggable="true"
        onDragStart={handleDragStart}
      >
        {/**
         * 1) Queue Ping Banner
         */}
        {event.qPing ? (
          <QueuePingBanner
            event={event}
            darkMode={darkMode}
            classes={classes}
          />
        ) : event.early || isLowStock ? (
          /**
           * 2) Low Stock Banner
           */
          <LowStockBanner
            event={event}
            darkMode={darkMode}
            isLowStock={isLowStock}
            theme={theme}
            vendorColor={vendorColor}
            classes={classes}
            handleLocalOverlayOpen={handleLocalOverlayOpen}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            stubhubData={stubhubData}
            phantomGetIn={phantomGetIn}
            getAverage={getAverage}
          />
        ) : (
          /**
           * 3) Standard scenario
           */

          <CardContent className={classes.content}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {/* Title / Venue / Date */}
                <Typography
                  variant="h5"
                  className={classes.title}
                  style={{
                    color: isQueueOpened
                      ? "black"
                      : darkMode
                      ? "#E7E7E7"
                      : "#3C3C3C",
                  }}
                >
                  {isQueueOpened ? (
                    <>
                      {`${event.name} - ${event.venue}, ${event.date} `}
                      <br />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <img
                          src="/Queue-logo.png"
                          alt="Q-Tickets"
                          style={{
                            height: "25px",
                            width: "auto",
                            marginRight: "10px",
                          }}
                        />
                        <strong>QUEUE OPENED</strong>
                        <img
                          src="/Queue-logo.png"
                          alt="Q-Tickets"
                          style={{
                            height: "25px",
                            width: "auto",
                            marginLeft: "10px",
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    event.name
                  )}
                </Typography>

                <Typography
                  variant="subtitle1"
                  className={classes.subtitle}
                  style={{
                    color: darkMode ? "#E7E7E7" : "#3C3C3C",
                    paddingLeft: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "500",
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
                    fontWeight: "500",
                  }}
                >
                  <img
                    src={darkMode ? "/clock1.svg" : "/clock2.svg"}
                    alt="Time Icon"
                    className={classes.icon}
                  />
                  {event.date}
                </Typography>

                {/**
                 *  StandardAdmissionContainer
                 */}
                <StandardAdmissionContainer
                  event={event}
                  darkMode={darkMode}
                  vendorColor={vendorColor}
                  classes={classes}
                  theme={theme}
                  isHovered={isHovered}
                  setIsHovered={setIsHovered}
                  handleLocalOverlayOpen={handleLocalOverlayOpen}
                />

                {/**
                 *  PhantomData
                 */}
                <PhantomData
                  event={event}
                  darkMode={darkMode}
                  stubhubData={stubhubData}
                  phantomGetIn={phantomGetIn}
                  getAverage={getAverage}
                  classes={classes}
                />
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                <Box
                  className={classes.rightColumnContainer}
                  style={{ gap: "16px" }}
                >
                  {/**
                   *  MapContainer
                   */}
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

                  {/**
                   *  MarketplaceButtons
                   */}
                  <MarketplaceButtons
                    event={event}
                    classes={classes}
                    darkMode={darkMode}
                    isStandard={true}
                  />

                  <Typography
                    variant="caption"
                    className={classes.releaseTime}
                    style={{
                      color: darkMode ? "#E7E7E7" : "#000000",
                      marginTop: "-14px",
                    }}
                  >
                    <strong>Release Time:</strong> {event.releaseTime}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.uniqueId === nextProps.event.uniqueId &&
      prevProps.darkMode === nextProps.darkMode &&
      prevProps.isLowStock === nextProps.isLowStock &&
      prevProps.event.qPing === nextProps.event.qPing &&
      prevProps.event.early === nextProps.event.early &&
      prevProps.event.timestamp === nextProps.event.timestamp &&
      JSON.stringify(prevProps.event.groupTickets) ===
        JSON.stringify(nextProps.event.groupTickets)
    );
  }
);

export default EventDetailCard;
