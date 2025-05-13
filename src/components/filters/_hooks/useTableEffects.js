import { useRef, useEffect } from "react";
import { fetchSectionRow, fetchTicketTypes } from "../map/mapUtilities";
import { isArrayEqual, fetchData } from "../_utils/data";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

// TODO: the data fetching here appears to rely on a firstCall ref, this should likely be swapped for react-query.

export function isValidResaleUrl(urlStr) {
  if (
    urlStr.includes("ticketmaster.com") ||
    urlStr.includes("ticketmaster.ca") ||
    urlStr.includes("livenation.com")
  ) {
    const urlObj = new URL(urlStr);
    const items = urlObj.pathname.split("/");
    const event_id = items.pop();

    return event_id.startsWith("Z");
  }
  return false;
}

export function useTableEffects(
  tableState,
  setTableState,
  defaultData,
  fullURL,
  eventId,
  twentyFiveDay,
  eventType,
  mainUser,
  isTM
) {
  const prevDataRef = useRef();
  const prevSelectedRowRef = useRef();

  const firstCall = useRef(true);

  const { data, selectedRow, selectedPaths, filtersApplied } = tableState;

  useEffect(() => {
    if (window.tidioChatApi) window.tidioChatApi.display(false);
  }, []);

  // TODO: the need for this effect is a result of bad state structuring, ideally this can be refactored away in the future
  useEffect(() => {
    if (!data || data.length === 0 || !data[selectedRow]) return;
    if (isArrayEqual(selectedPaths, data[selectedRow]?.sections)) return;

    data[selectedRow].sections = [...selectedPaths];
    setTableState({ data });
  }, [selectedPaths]);

  useEffect(() => {
    if (
      data !== prevDataRef.current ||
      selectedRow !== prevSelectedRowRef.current ||
      !isArrayEqual(data[selectedRow]?.sections || [], selectedPaths)
    ) {
      if (data[selectedRow]?.sections)
        setTableState({ selectedPaths: data[selectedRow].sections });
      else if (data.length === 0) setTableState({ selectedPaths: [] });
      else if (data.length > 0 && selectedRow >= data.length) {
        setTableState({ selectedRow: 0, selectedPaths: [] });
      }
    }

    prevDataRef.current = data;
    prevSelectedRowRef.current = selectedRow;
  }, [selectedPaths]);

  useEffect(() => {
    // Define async function inside effect
    async function loadData() {
      if (firstCall.current) {
        fetchSectionRow(fullURL, setTableState);
        fetchTicketTypes(fullURL);
        firstCall.current = false;
      }

      const { data: filterData, filtersApplied } = await fetchData(
        eventId,
        tableState,
        setTableState,
        defaultData,
        mainUser,
        isTM
      );

      const inventory_ref = doc(db, "inventory_types", eventId);

      const unsub = onSnapshot(inventory_ref, (doc) => {
        if (!doc.exists()) return;

        const data = doc.data();
        const totalAvailableStock = data["sectionStock"] ?? {};
        const ticketTypesList = data["types"] ?? [];

        setTableState({ totalAvailableStock, ticketTypesList });

        if (!filtersApplied) {
          let additionalTicketTypes = [
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
            "Prime",
            "Premium",
            "Accessibility",
          ];

          if (isValidResaleUrl(fullURL)) {
            additionalTicketTypes = additionalTicketTypes.filter(
              (type) => type !== "Verified Resale" && type !== "Resale"
            );
          }

          if (twentyFiveDay) additionalTicketTypes.push("Standard");

          if (eventType && eventType !== "") {
            additionalTicketTypes = additionalTicketTypes.filter(
              (type) => type !== "Resale"
            );
          }

          const matchingTicketTypes = ticketTypesList.filter((tt) =>
            additionalTicketTypes.some((type) => tt.includes(type))
          );

          if (matchingTicketTypes.length > 0 && filterData) {
            const updatedData = filterData.map((item) => ({
              ...item,
              ticketTypes: [...item.ticketTypes, ...matchingTicketTypes],
            }));
            setTableState({ data: updatedData });
          }
        }
      });

      return () => unsub();
    }

    // Call the async function
    loadData();
  }, [eventId, fullURL, filtersApplied]);
}
