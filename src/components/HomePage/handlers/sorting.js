import { useMemo } from "react";
import moment from "moment";
import {
  getDataAccountId,
  getLinkId,
  getSiteId,
  getTicketCode,
} from "./urlManipulation";

export const useSortedUrls = (urls, eventsInfo, sortConfig, early) => {
  return useMemo(() => {
    // Pre-process URLs and event info once before sorting
    let sortableUrls = urls.map((url) => {
      const urlObj = new URL(url);
      let eventId = urlObj.pathname.split("/").pop();
      let eventInfo = eventsInfo[eventId] || {};

      // Extract event info based on URL type once
      if (url.includes("mlb.tickets.com") || url.includes("mpv.tickets.com")) {
        const searchParams = new URLSearchParams(urlObj.search);
        eventId = searchParams.get("pid") || searchParams.get("eventId");
        eventInfo = eventsInfo[eventId] || {};
      } else if (url.includes("evenue.net") && url.includes("SEGetEventInfo")) {
        const siteId = getSiteId(url);
        const dataAccId = getDataAccountId(url);
        const linkId = getLinkId(url);
        const ticketCode = getTicketCode(url);
        eventId = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
        eventInfo = eventsInfo[eventId] || {};
      } else if (url.includes("axs.com")) {
        const match = url.match(/e=([0-9]+)/);
        eventId = match ? match[1] : urlObj.pathname.split("/").pop();
        eventInfo = eventsInfo[eventId] || {};
      }

      return {
        url,
        eventId,
        eventInfo,
        date: parseDateWithMoment(eventInfo.date, url),
      };
    });

    // Sort using pre-processed data
    if (sortConfig !== null) {
      sortableUrls.sort((a, b) => {
        if (sortConfig.key === "eventId") {
          if (a.eventId < b.eventId)
            return sortConfig.direction === "ascending" ? -1 : 1;
          if (a.eventId > b.eventId)
            return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }

        if (sortConfig.key === "date") {
          if (!a.date.isValid() && !b.date.isValid()) return 0;
          if (!a.date.isValid()) return 1;
          if (!b.date.isValid()) return -1;

          const timestampA = a.date.unix();
          const timestampB = b.date.unix();
          if (timestampA === timestampB) return 0;
          return sortConfig.direction === "ascending"
            ? timestampA - timestampB
            : timestampB - timestampA;
        }

        // For other keys
        const valueA = a.eventInfo[sortConfig.key];
        const valueB = b.eventInfo[sortConfig.key];
        if (valueA < valueB)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (valueA > valueB)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    // Handle early items
    if (sortConfig.key === "early") {
      return sortConfig.direction === "ascending"
        ? [...early, ...sortableUrls.map((item) => item.url)]
        : [...sortableUrls.map((item) => item.url), ...early];
    }

    return sortableUrls.map((item) => item.url);
  }, [urls, eventsInfo, sortConfig, early]);
};

function parseDateWithMoment(dateString, url) {
  if (dateString === "TBD" || dateString === "loading") {
    return moment.invalid();
  }

  let parsedDate;

  // Array of date formats to try
  const dateFormats = ["ddd, MMMM D, YYYY h:mm A"];

  // Try each format
  for (const format of dateFormats) {
    parsedDate = moment(dateString, format, true);
    if (parsedDate.isValid()) {
      return parsedDate;
    }
  }

  // If no format matches, try moment's automatic parsing
  parsedDate = moment(dateString);
  if (parsedDate.isValid()) {
    return parsedDate;
  }

  // If all parsing attempts fail, log a warning and return an invalid date
  // console.warn(`Failed to parse date: ${dateString} for URL: ${url}`);
  return moment.invalid();
}

export const useSortConfigUpdate = (currentSortConfig) => {
  return (key) => {
    let direction = "ascending";
    if (
      currentSortConfig &&
      currentSortConfig.key === key &&
      currentSortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    return { key, direction };
  };
};
