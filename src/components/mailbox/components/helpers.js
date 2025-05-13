const getStubhubLevelPrices = (stubhubData) => {
  if (!stubhubData?.total_data) return null;

  const levelPrices = {};

  for (const category in stubhubData.total_data) {
    const sections = stubhubData.total_data[category];
    const minArray = sections
      .map((section) => {
        const minValue = parseFloat(section.min?.replace(/[$,]/g, ""));
        return !isNaN(minValue) && minValue !== 0 ? minValue : null;
      })
      .filter((min) => min !== null);

    if (minArray.length > 0) {
      levelPrices[category] = `$${Math.min(...minArray)}`;
    }
  }

  return levelPrices;
};

const getTicketVendor = (eventLink) => {
  if (!eventLink) return { name: "N/A", color: "#0094FF" };

  if (eventLink.includes("ticketmaster"))
    return { name: "Ticketmaster", color: "#026CDF" };
  if (eventLink.includes("livenation"))
    return { name: "Live Nation", color: "#E41D39" };
  if (eventLink.includes("seatgeek"))
    return { name: "Seatgeek", color: "#FF5B49" };
  if (eventLink.includes("stubhub"))
    return { name: "Stubhub", color: "#3F1D74" };
  if (eventLink.includes("axs.com")) return { name: "Axs", color: "#1D549D" };
  if (eventLink.includes("mlb.tickets.com"))
    return { name: "MLB", color: "#bf0d3e" };
  if (eventLink.includes(".tickets.com") || eventLink.includes("tickets.com"))
    return { name: "Tickets.com", color: "#bf0d3e" };

  return { name: "N/A", color: "#0094FF" };
};

const isValidPrice = (price) => {
  if (!price) return false;
  const numPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
      : price;
  return !isNaN(numPrice) && numPrice > 0;
};

const handleStubhubDragStart = (e, stubhubId) => {
  e.stopPropagation();
  const stubhubUrl = `https://www.stubhub.com/event/${stubhubId}`;
  e.dataTransfer.setData("text/uri-list", stubhubUrl);
  e.dataTransfer.setData("text/plain", stubhubUrl);
};

const handleVividDragStart = (e, vividUrl) => {
  e.stopPropagation();
  e.dataTransfer.setData("text/uri-list", vividUrl);
  e.dataTransfer.setData("text/plain", vividUrl);
};

const getAverage = (stubhubData) => {
  if (!stubhubData?.total_data) return null;

  const allPrices = [];

  for (const category in stubhubData.total_data) {
    const sections = stubhubData.total_data[category];
    sections.forEach(section => {
      const price = parseFloat(section.min?.replace(/[$,]/g, ""));
      if (!isNaN(price) && price !== 0) {
        allPrices.push(price);
      }
    });
  }

  if (allPrices.length === 0) return null;

  const totalAverage = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
  return { "Total": `$${Math.round(totalAverage)}` };
};

export {
  getStubhubLevelPrices,
  getTicketVendor,
  isValidPrice,
  handleStubhubDragStart,
  handleVividDragStart,
  getAverage,
};
