import { useReducer } from "react";
import { useTheme } from "../../../ThemeContext";

const reducer = (data, payload) => ({ ...data, ...payload });
const initialData = {
  ticketTypesList: [],
  rows: [],
  sections: [],
  filtersApplied: false,
  selectedPaths: [],
  paths: [],
  info: {},
  mapid: "",
  selectedRow: 0,
  totalStock: {},
  totalAvailableStock: {},
  axsMapInfo: undefined,
  isNotificationDialogOpen: false,
  data: [],
};

export function useTableState() {
  const [tableState, setTableState] = useReducer(reducer, initialData);
  const { darkMode } = useTheme();

  const defaultData = {
    excludeFilter: false,
    "Stock Monitor": false,
    totalStock: 0,
    availableStock: 0,
    totalSectionStock: 0,
    sections: [],
    rows: [],
    prices: [{ min: 0, max: "" }],
    numSeats: 2,
    ticketTypes: [],
  };

  return { tableState, setTableState, darkMode, defaultData };
}
