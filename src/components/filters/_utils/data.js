import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export function isArrayEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;

  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export async function fetchData(
  eventId,
  tableState,
  setTableState,
  defaultData,
  mainUser,
  isTM
) {
  try {
    const filterDoc = doc(
      db,
      "filterInfo",
      `${mainUser.toString()}-${eventId.toString()}`
    );

    const defaultResponse = {
      data: [defaultData],
      filtersApplied: false,
    };
    if (isTM) {
      defaultResponse.filterTotalPrice = true;
    }

    // pull doc data
    let docData;
    try {
      docData = await getDoc(filterDoc);
    } catch (error) {
      setTableState(defaultResponse);
      return defaultResponse;
    }

    if (!docData.exists()) {
      setTableState(defaultResponse);
      return defaultResponse;
    }

    const data = docData.data();

    const filters = data.data;

    if (!filters) {
      setTableState(defaultResponse);
      return defaultResponse;
    }

    if (Object.keys(filters).length === 0) {
      setTableState({ filtersApplied: false });
      return { data: tableState.data, filtersApplied: false };
    }

    const filtersCopy = JSON.parse(JSON.stringify(filters));

    const sortedKeys = Object.keys(filtersCopy).sort((a, b) => {
      const numA = parseInt(a.substring(3));
      const numB = parseInt(b.substring(3));
      return numA - numB;
    });

    const sortedData = sortedKeys.map((key) => {
      if (typeof filtersCopy[key].prices === "string") {
        filtersCopy[key].prices = [{ min: 0, max: filtersCopy[key].prices }];
      }

      if (filtersCopy[key].ticketTypes) {
        filtersCopy[key].ticketTypes = [
          ...new Set(filtersCopy[key].ticketTypes),
        ];
      }

      return filtersCopy[key];
    });

    setTableState({
      data: sortedData,
      selectedPaths: sortedData[0]?.sections ?? [],
      filtersApplied: true,
      filterTotalPrice: data.filterTotalPrice || false,
    });

    return { data: sortedData, filtersApplied: true };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return { data: null, filtersApplied: false };
  }
}
