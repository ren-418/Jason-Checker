import { arrayUnion, doc, writeBatch } from "firebase/firestore";
import { db, getCurrentUserEmail } from "../../../firebase";
import { isValidResaleUrl } from "../_hooks/useTableEffects";

export function handleAddRow(
  defaultData,
  tableState,
  setTableState,
  twentyFiveDay,
  isExculdeFilter = false,
  isStockMonitor = false,
  eventType,
  fullURL
) {
  let tickets = [
    "Verified Resale",
    "Official Platinum",
    "Special Offers",
    "VIP",
    "Wheel Chair",
    "Make A Difference Ticket",
    "Platinum",
    "Diamond",
    "Gold",
    "Silver",
    "Resale",
    "Premium",
    "Prime",
    "Accessibility",
  ];

  if (isValidResaleUrl(fullURL)) {
    tickets = tickets.filter(
      (type) => type !== "Verified Resale" && type !== "Resale"
    );
  }

  if (twentyFiveDay) tickets.push("Standard");

  if (eventType && eventType !== "") {
    tickets = tickets.filter((type) => type !== "Resale");
  }

  const additionalTicketTypes = tableState.ticketTypesList.filter((type) =>
    tickets.some((vipType) => type.includes(vipType))
  );

  const newData = {
    ...defaultData,
    excludeFilter: isExculdeFilter,
    "Stock Monitor": isStockMonitor,
    ticketTypes:
      additionalTicketTypes.length > 0
        ? additionalTicketTypes
        : defaultData.ticketTypes,
  };

  setTableState({
    data: [...tableState.data, newData],
    selectedRow: tableState.data.length,
    selectedPaths: [],
  });
}

export async function handleSubmit(
  e,
  tableState,
  email,
  eventId,
  onClose,
  fullURL,
  isTM
) {
  if (e !== undefined) {
    e.preventDefault();
  }
  try {
    /* convert the data to a filter format */
    const filters = tableState.data.reduce((filters, current, index) => {
      const sections = tableState.sections
        .filter((section) => current.sections.includes(section.sectionName))
        .map((section) => section.id);
      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });

      filters[`row${index + 1}`] = {
        ...current,
        sectionIds: sections,
        timestamp: timestamp,
        id: Math.floor(Math.random() * 1000000),
      };

      return filters;
    }, {});

    /* ensure minimum and maximum price values are different */
    const isInvalidPriceRange = tableState.data.some((item) =>
      item.prices.some(
        (price) => Number(price.min) === Number(price.max) && price.max !== ""
      )
    );
    if (isInvalidPriceRange) {
      alert("Minimum and maximum prices cannot be the same.");
      return;
    }

    /* update the filter collection with the new data */
    const batch = writeBatch(db);
    const docId = `${email}-${eventId}`;
    const urlLogsDoc = doc(db, "UrlLogs", docId);

    /* update the url logs document */
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });
    const filter = { e: fullURL, u: getCurrentUserEmail() };

    batch.set(
      urlLogsDoc,
      {
        urlFilters: { [timestamp]: filter },
        emailAddress: email,
        eventId: eventId,
      },
      { merge: true }
    );

    const filterIdDoc = doc(db, "filterIds", email);

    let site = "";

    switch (true) {
      case fullURL.includes("seatgeek.com"):
        site = "seatgeek";
        break;

      case fullURL.includes("ticketmaster.com") ||
        fullURL.includes("ticketmaster.ca") ||
        fullURL.includes("ticketmaster.co.nz") ||
        fullURL.includes("livenation.com"):
        if (fullURL.includes("ticketmaster.com.mx")) {
          site = "ticketmasterUK";
          break;
        }
        site = "ticketmaster";
        break;
      case fullURL.includes("ticketmaster.com.mx") ||
        fullURL.includes("ticketmaster.co.uk") ||
        fullURL.includes("ticketmaster.ie"):
        site = "ticketmasterUK";
        break;

      case fullURL.includes("axs.com") || fullURL.includes("axs.co.uk"):
        site = "axs";
        break;

      case fullURL.includes("tickets.com"):
        site = "mlb";
        break;
      case fullURL.includes("stubhub.com"):
        site = "stubhub";
        break;

      case fullURL.includes("ticketmaster.de") ||
        fullURL.includes("ticketmaster.be") ||
        fullURL.includes("ticketmaster.cz") ||
        fullURL.includes("ticketmaster.dk") ||
        fullURL.includes("ticketmaster.es") ||
        fullURL.includes("ticketmaster.nl") ||
        fullURL.includes("ticketmaster.no") ||
        fullURL.includes("ticketmaster.at") ||
        fullURL.includes("ticketmaster.pl") ||
        fullURL.includes("ticketmaster.fi") ||
        fullURL.includes("ticketmaster.se") ||
        fullURL.includes("ticketmaster.ch") ||
        fullURL.includes("ticketmaster.ae"):
        site = "ticketmasterEU";
        break;
      case fullURL.includes("evenue.net"):
        site = "evenue";
        break;
      default:
        site = "ticketmaster";
        break;
    }

    const filterInfoDoc = doc(db, "filterInfo", `${email}-${eventId}`);

    const filterInfo = {
      data: filters,
      last_modified: new Date(),
      emailAddress: email,
      eventId: eventId,
      url: fullURL,
      site: site,
    };

    if (isTM) {
      filterInfo.filterTotalPrice = true;
    }

    batch.set(filterInfoDoc, filterInfo);

    batch.set(
      filterIdDoc,
      {
        filterIds: arrayUnion(eventId),
        last_modified: new Date(),
        emailAddress: email,
      },
      { merge: true }
    );

    batch.commit();
    onClose();
  } catch (error) {
    console.error("Error handling submission: ", error);
  }
}
