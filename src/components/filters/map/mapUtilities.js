import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db, getCurrentUserEmail } from "../../../firebase";

export async function fetchSectionRow(fullURL, setTableState) {
  try {
    const q = query(collection(db, "map_info"), where("url", "==", fullURL));

    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return fetchDataFromAPI();

      const data = snapshot.docs[0].data();

      if (
        data.unique_row.length === 0 ||
        data.unique_sections.length === 0 ||
        !data.unique_row ||
        !data.unique_sections
      ) {
        fetchDataFromAPI();
      }

      setTableState({ rows: data.unique_row ?? [] });

      // TODO: this can be simplified into a single line if we can guarentee the data type
      data.unique_sections?.sort((a, b) => {
        try {
          if (parseInt(a.sectionName) < parseInt(b.sectionName)) return -1;
          if (parseInt(a.sectionName) > parseInt(b.sectionName)) return 1;
        } catch (error) {
          console.error("Error sorting sections:", error);
        }

        if (a.sectionName < b.sectionName) return -1;
        if (a.sectionName > b.sectionName) return 1;
        return 0;
      });

      data.unique_row?.sort((a, b) => {
        const isANumber = !isNaN(a);
        const isBNumber = !isNaN(b);

        if (isANumber && isBNumber) return a - b;
        if (isANumber) return -1;
        if (isBNumber) return 1;
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
      });

      setTableState({
        sections: data.unique_sections ?? [],
        info: data.info ?? [],
        mapid: data.mapUrl ?? "",
        paths: data.paths ?? [],
        totalStock: data.sectionsStock ?? {},
        height: data.mapHeight ?? 0,
        width: data.mapWidth ?? 0,
      });

      if (data.svgItems) {
        const axsMapInfo = {
          svgItems: data.svgItems,
          baseImage: data.baseImage,
          transform: data.transform || false,
          viewBox: data.viewBox,
        };
        setTableState({ axsMapInfo });
      }
    });

    const fetchDataFromAPI = async () => {
      if (fetchDataFromAPI.isFetching) {
        return;
      }

      fetchDataFromAPI.isFetching = true;

      try {
        let fetchUrl = "https://mg.phantomcheckerapi.com/api/ticketmaster/map";

        if (
          fullURL.includes("mlb.tickets.com") ||
          fullURL.includes("mpv.tickets.com")
        ) {
          fetchUrl = "https://mg.phantomcheckerapi.com/api/mlb/map";
        } else if (fullURL.includes("seatgeek.com")) {
          fetchUrl = "https://mg.phantomcheckerapi.com/api/seatgeek/map";
        } else if (
          fullURL.includes("axs.com") ||
          fullURL.includes("axs.co.uk")
        ) {
          fetchUrl = "https://mg.phantomcheckerapi.com/api/axs/map";
        } else if (fullURL.includes("stubhub.com")) {
          fetchUrl = "https://mg.phantomcheckerapi.com/api/stubhub/map";
        } else if (fullURL.includes("evenue.net")) {
          fetchUrl = "https://mg.phantomcheckerapi.com/api/evenue/map";
        }

        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
          body: JSON.stringify({
            url: fullURL,
            email: getCurrentUserEmail(),
          }),
        });

        const data = await response.json();

        data.unique_sections?.sort((a, b) => {
          if (a.sectionName < b.sectionName) return -1;
          if (a.sectionName > b.sectionName) return 1;
          return 0;
        });

        data.unique_row?.sort((a, b) => {
          const isANumber = !isNaN(a);
          const isBNumber = !isNaN(b);

          if (isANumber && isBNumber) return a - b;
          if (isANumber) return -1;
          if (isBNumber) return 1;
          if (a.length !== b.length) return a.length - b.length;
          return a.localeCompare(b);
        });

        setTableState({
          rows: data.unique_row ?? [],
          sections: data.unique_sections ?? [],
          info: data.info ?? [],
          mapid: data.mapUrl ?? "",
          paths: data.paths ?? [],
        });

        if (data.svgItems && data.baseImage) {
          const axsMapInfo = {
            svgItems: data.svgItems,
            baseImage: data.baseImage,
            transform: data.transform || false,
            unique_sections: data.unique_sections,
          };
          setTableState({ axsMapInfo });
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
        setTableState({ rows: [], sections: [] });
      } finally {
        fetchDataFromAPI.isFetching = false;
      }
    };

    return () => unsub();
  } catch (error) {
    console.error("Error fetching section and row data:", error);
    setTableState({ rows: [], sections: [] });
  }
}

export const fetchTicketTypes = async (fullURL) => {
  try {
    let url = "https://mg.phantomcheckerapi.com/api/ticketmaster/ticket-type";
    if (fullURL.includes("axs.com") || fullURL.includes("axs.co.uk")) {
      url = "https://mg.phantomcheckerapi.com/api/axs/ticket-type";
    }
    if (fullURL.includes("seatgeek.com")) {
      url = "https://mg.phantomcheckerapi.com/api/seatgeek/ticket-type";
    }
    if (fullURL.includes("evenue.net")) {
      url = "https://mg.phantomcheckerapi.com/api/evenue/ticket-type";
    }

    if (
      fullURL.includes("ticketmaster.be") ||
      fullURL.includes("ticketmaster.dk") ||
      fullURL.includes("ticketmaster.de") ||
      fullURL.includes("ticketmaster.nl") ||
      fullURL.includes("ticketmaster.fi") ||
      fullURL.includes("ticketmaster.no") ||
      fullURL.includes("ticketmaster.se") ||
      fullURL.includes("ticketmaster.at") ||
      fullURL.includes("ticketmaster.ae") ||
      fullURL.includes("ticketmaster.pl") ||
      fullURL.includes("ticketmaster.es") ||
      fullURL.includes("ticketmaster.ch") ||
      fullURL.includes("ticketmaster.it") ||
      fullURL.includes("ticketmaster.cz") ||
      fullURL.includes("ticketmaster.co.za")
    ) {
      url = "https://mg.phantomcheckerapi.com/api/ticketmaster/ticket-type-eu";
    }
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({
        url: fullURL,
        email: getCurrentUserEmail(),
      }),
    });
  } catch (error) {
    console.error("Error fetching ticket types:", error);
  }
};

export function handleSvgPathClick(path, tableState, setTableState) {
  /* if there is no filter available, exist early to prevent an error */
  if (tableState.data.length === 0) return;

  if (Array.isArray(path)) {
    let paths = [...tableState.selectedPaths];

    path.forEach((section) => {
      if (paths.includes(section.name)) {
        paths = paths.filter((path) => path !== section.name);
      } else {
        paths.push(section.name);
      }
    });

    setTableState({ selectedPaths: paths });
  } else {
    if (tableState.selectedPaths.includes(path.name)) {
      setTableState({
        selectedPaths: tableState.selectedPaths.filter((p) => p !== path.name),
      });
    } else {
      setTableState({
        selectedPaths: [...tableState.selectedPaths, path.name],
      });
    }
  }

  let row = tableState.data[tableState.selectedRow];
  const previousSelectionIds = row.sectionIds ?? [];
  const clickedSectionIds = Array.isArray(path)
    ? path.map((p) => p.id)
    : path.id;

  let allSectionIds = [...previousSelectionIds];

  if (Array.isArray(path)) {
    for (let sectionId of clickedSectionIds) {
      if (previousSelectionIds.includes(sectionId)) {
        allSectionIds = allSectionIds.filter((id) => id !== sectionId);
      } else {
        allSectionIds.push(sectionId);
      }
    }
  } else {
    if (previousSelectionIds.includes(clickedSectionIds)) {
      allSectionIds = allSectionIds.filter((id) => id !== clickedSectionIds);
    } else {
      allSectionIds.push(clickedSectionIds);
    }
  }

  row = { ...row, sectionIds: allSectionIds };

  const data = [...tableState.data];
  data[tableState.selectedRow] = row;
  setTableState({ data });
}

export const organizeSections = (sections) => {
  if (!sections || !Array.isArray(sections)) {
    return;
  }

  let organizedSections = {};

  // Group sections by prefix
  sections.forEach((section) => {
    // Check for valid section
    if (!section || typeof section !== "object" || !section.name) {
      return;
    }

    let name = section.name;
    let specialPrefixMatch = name.match(/^(\d+)(ST|ND|RD|TH)/);
    let numberPrefix = name.match(/^\d+/);
    let letterPrefix = name.match(/^[a-zA-Z]+/);
    let wheelchairSection = name.startsWith("W");

    if (specialPrefixMatch) {
      let specialPrefix = specialPrefixMatch[0]; // Extracts "1ST", "2ND", etc.
      if (!organizedSections[specialPrefix]) {
        organizedSections[specialPrefix] = [];
      }
      organizedSections[specialPrefix].push(section);
      return;
    }

    if (numberPrefix && !specialPrefixMatch) {
      let key = Math.floor(parseInt(numberPrefix[0]) / 100) * 100 + "s";
      if (!organizedSections[key]) {
        organizedSections[key] = [];
      }
      organizedSections[key].push(section);
      return;
    }

    // Group by wheelchair sections
    if (wheelchairSection) {
      let key = "Wheelchair";
      if (!organizedSections[key]) {
        organizedSections[key] = [];
      }
      organizedSections[key].push(section);
      return;
    }

    // Group by letter prefix (excluding W which we've already grouped as wheelchair)
    if (letterPrefix && letterPrefix[0].toUpperCase() !== "W") {
      let key = letterPrefix[0].toUpperCase();
      if (!organizedSections[key]) {
        organizedSections[key] = [];
      }
      organizedSections[key].push(section);
      return;
    }
  });

  // Extract the sections not grouped by prefix
  let remainingSections = sections.filter((section) => {
    if (!section || typeof section !== "object" || !section.name) {
      return false;
    }

    let name = section.name;
    let numberPrefix = name.match(/^\d+/);
    let letterPrefix = name.match(/^[a-zA-Z]+/);
    let wheelchairSection = name.startsWith("W");

    return (
      !numberPrefix &&
      !letterPrefix &&
      !wheelchairSection &&
      !/^(\d+)(ST|ND|RD|TH)/.test(name)
    );
  });

  // Group remaining sections by common words
  while (remainingSections.length > 0) {
    let currentSection = remainingSections.pop();
    if (
      !currentSection ||
      typeof currentSection !== "object" ||
      !currentSection.name
    ) {
      continue;
    }

    let matchedGroupKey = null;

    // Check if this section matches any existing non-numeric group
    for (let key in organizedSections) {
      if (
        !/^\d+s$/.test(key) &&
        !/^[a-zA-Z]$/.test(key) &&
        key !== "Wheelchair" &&
        currentSection.name.includes(key)
      ) {
        matchedGroupKey = key;
        break;
      }
    }

    // If matched with an existing group
    if (matchedGroupKey) {
      organizedSections[matchedGroupKey].push(currentSection);
    } else {
      let commonWord = currentSection.name.split(" ")[0];
      if (!organizedSections[commonWord]) {
        organizedSections[commonWord] = [];
      }
      organizedSections[commonWord].push(currentSection);
    }
  }

  // Organize keys in alphabetical order
  let orderedSections = {};
  Object.keys(organizedSections)
    .sort()
    .forEach((key) => {
      orderedSections[key] = organizedSections[key];
    });

  return orderedSections;
};
