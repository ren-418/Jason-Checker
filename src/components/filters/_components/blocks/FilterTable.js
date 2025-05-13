import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Input,
  InputAdornment,
} from "@mui/material";
import Add from "@material-ui/icons/Add";
import Cross from "../icons/Cross";
import Close from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import Table from "../Table";
import { useRef, useEffect } from "react";
import TicketTypeManager from "./TicketTypeManager";

/* due to the state management co-locating all filter types inside the data attribute, we need to get the real index */
const attachActiveIndex = (tableState, filter) => ({
  ...filter,
  activeIndex: tableState.data.indexOf(filter),
});

export default function FilterTable({
  tableState,
  setTableState,
  onAddFilter,
  changeVF,
  twentyFiveDay,
  isTM,
  priceUpdated,
}) {
  const filters = tableState.data
    .filter((filter) => !filter.excludeFilter && !filter["Stock Monitor"])
    .map((filter) => attachActiveIndex(tableState, filter));
  const previousFilterLength = useRef(filters.length);

  /* checking the ref inside an effect is required in order to get the new lastChild after state change */
  useEffect(() => {
    if (filters.length > previousFilterLength.current) {
      const container = document.getElementById("filterContainer");
      container.lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    previousFilterLength.current = filters.length;
  }, [filters.length]);

  /* update the selected row without overriding the selected paths */
  const updateSelectedRow = (e, filter) => {
    if (tableState.selectedRow === filter.activeIndex) return;

    if (!e.target.className.includes("MuiMenuItem-root")) {
      setTableState({
        selectedRow:
          tableState.selectedRow === filter.activeIndex
            ? -1
            : filter.activeIndex,
        selectedPaths: filter.sections ?? [],
      });
    } else {
      setTableState({
        selectedRow:
          tableState.selectedRow === filter.activeIndex
            ? -1
            : filter.activeIndex,
      });
    }
  };

  /* disable default behavior for keydown events on arrow keys */
  const handleKeyDownOverride = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  /* handle keyboard navigation via arrow keys to cycle through filters */
  const handleKeyboardNavigation = (e) => {
    e.preventDefault();

    if (filters.length === 0) return;

    if (e.key === "ArrowUp") {
      const currentIndex = filters.findIndex(
        (filter) => filter.activeIndex === tableState.selectedRow
      );
      if (currentIndex === 0) return;

      const filter = filters[currentIndex - 1];
      setTableState({
        selectedRow: filter.activeIndex,
        selectedPaths: filter.sections ?? [],
      });
    }

    if (e.key === "ArrowDown") {
      const currentIndex = filters.findIndex(
        (filter) => filter.activeIndex === tableState.selectedRow
      );
      if (currentIndex === filters.length - 1) return;

      const filter = filters[currentIndex + 1];
      setTableState({
        selectedRow: filter.activeIndex,
        selectedPaths: filter.sections ?? [],
      });
    }
  };

  let ticketTypeListUpdated = tableState.ticketTypesList;
  if (changeVF) {
    ticketTypeListUpdated = tableState.ticketTypesList.filter(
      (ticket) => ticket !== "Verified Resale"
    );

    if (!ticketTypeListUpdated.includes("Face Value Exchange")) {
      ticketTypeListUpdated.push("Face Value Exchange");
    }
  }

  return (
    <Table onKeyUp={handleKeyboardNavigation} onKeyDown={handleKeyDownOverride}>
      <Table.Header>
        <Table.Column className="min-w-52 max-w-52">Sections</Table.Column>
        <Table.Column className="min-w-44 max-w-44">Rows</Table.Column>

        <Table.Column className="min-w-44 max-w-44">
          Price Range {isTM ? "(AFTER FEES)" : ""}
        </Table.Column>

        <Table.Column className="min-w-28 max-w-28">Min. Seats</Table.Column>
        <TicketTypeManager
          ticketTypes={ticketTypeListUpdated}
          setTableState={setTableState}
          filter={tableState.data}
        />
        <Table.Column className="w-16 !bg-transparent"> </Table.Column>
      </Table.Header>
      <Table.Body>
        <div
          id="filterContainer"
          className={`w-fit max-h-[350px] overflow-hidden ${
            filters.length > 5 ? "overflow-y-auto" : ""
          }`}
        >
          <div className="flex space-y-0.5 flex-col rounded-b-lg pb-3">
            {filters.map((filter) => (
              <Table.Row
                key={filter.activeIndex}
                tabIndex={0}
                id={`filter-${filter.activeIndex}`}
                onClick={(e) => updateSelectedRow(e, filter)}
              >
                <Table.Item
                  className="min-w-52 max-w-52"
                  selected={tableState.selectedRow === filter.activeIndex}
                >
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] text-white rounded-[16px]"
                  >
                    {filter.sections.length === 0 && (
                      <InputLabel shrink={false}>
                        <span className="text-white">Sections</span>
                      </InputLabel>
                    )}
                    <Select
                      multiple={true}
                      className="flex !text-white w-full !p-0"
                      classes={{ icon: "!text-white" }}
                      value={filter.sections ?? []}
                      onChange={(e) =>
                        setTableState({
                          data: tableState.data.map((row, index) =>
                            index === filter.activeIndex
                              ? { ...row, sections: e.target.value }
                              : row
                          ),
                          selectedPaths: e.target.value,
                        })
                      }
                    >
                      {tableState.sections.map((section) => (
                        <MenuItem
                          key={section.sectionName}
                          value={section.sectionName}
                          className="w-full max-w-[200px] !block !px-2 !text-wrap !text-white"
                        >
                          {section.sectionName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Table.Item>
                <Table.Item
                  className="min-w-44 max-w-44"
                  selected={tableState.selectedRow === filter.activeIndex}
                >
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] text-white rounded-[16px]"
                  >
                    {filter.rows.length === 0 && (
                      <InputLabel shrink={false}>
                        <span className="text-white">Rows</span>
                      </InputLabel>
                    )}
                    <Select
                      multiple={true}
                      className="flex !text-white w-full rounded-b-lg"
                      classes={{ icon: "!text-white" }}
                      value={filter.rows ?? []}
                      onChange={(e) =>
                        setTableState({
                          data: tableState.data.map((row, index) =>
                            index === filter.activeIndex
                              ? { ...row, rows: e.target.value }
                              : row
                          ),
                        })
                      }
                    >
                      {tableState.rows.map((row) => (
                        <MenuItem
                          key={row}
                          value={row}
                          className="w-full max-w-[200px] !block !text-wrap !px-2"
                        >
                          {row}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Table.Item>
                <Table.Item
                  selected={tableState.selectedRow === filter.activeIndex}
                  className="min-w-44 max-w-44 flex flex-col justify-center space-y-1 relative"
                >
                  {filter.prices.map((price, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <div className="flex space-x-2 items-center">
                        <div className="relative">
                          <Input
                            type="number"
                            disableUnderline={true}
                            className="flex !text-white w-full bg-[#6C757D] dark:bg-[rgb(21,21,21)] px-2 py-1 rounded-[16px]"
                            classes={{ input: "num-arrows-hidden" }}
                            style={{
                              border: twentyFiveDay
                                ? "2px solid red"
                                : "2px solid rgb(103,0,4)",
                            }}
                            startAdornment="$"
                            endAdornment={
                              priceUpdated.current &&
                              (price.min > 0 || price.min === "0") ? (
                                <InputAdornment position="end">
                                  <ErrorIcon
                                    style={{ color: "#ff0000", fontSize: 18 }}
                                  />
                                </InputAdornment>
                              ) : null
                            }
                            value={twentyFiveDay ? "20" : price.min ?? 0}
                            onWheel={(e) => e.target.blur()}
                            disabled={twentyFiveDay}
                            onChange={(e) => {
                              if (!twentyFiveDay) {
                                setTableState({
                                  data: tableState.data.map((row, index) =>
                                    index === filter.activeIndex
                                      ? {
                                          ...row,
                                          prices: row.prices.map(
                                            (price, index) =>
                                              index === j
                                                ? {
                                                    ...price,
                                                    min: e.target.value,
                                                  }
                                                : price
                                          ),
                                        }
                                      : row
                                  ),
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            disableUnderline={true}
                            className="flex !text-white w-full bg-[#6C757D] dark:bg-[rgb(21,21,21)] px-2 py-1 rounded-[16px]"
                            classes={{ input: "num-arrows-hidden" }}
                            style={{
                              border: twentyFiveDay
                                ? "2px solid red"
                                : "2px solid rgb(103,0,4)",
                            }}
                            startAdornment="$"
                            endAdornment={
                              priceUpdated.current &&
                              (price.max > 0 || price.max === "0") ? (
                                <InputAdornment position="end">
                                  <ErrorIcon
                                    style={{ color: "#ff0000", fontSize: 18 }}
                                  />
                                </InputAdornment>
                              ) : null
                            }
                            value={twentyFiveDay ? "30" : price.max ?? 0}
                            onWheel={(e) => e.target.blur()}
                            disabled={twentyFiveDay}
                            onChange={(e) => {
                              if (!twentyFiveDay) {
                                setTableState({
                                  data: tableState.data.map((row, index) =>
                                    index === filter.activeIndex
                                      ? {
                                          ...row,
                                          prices: row.prices.map(
                                            (price, index) =>
                                              index === j
                                                ? {
                                                    ...price,
                                                    max: e.target.value,
                                                  }
                                                : price
                                          ),
                                        }
                                      : row
                                  ),
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      {filter.prices.length > 1 && !twentyFiveDay && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Close
                            fontSize="small"
                            className="bg-[rgb(103,0,4)] p-0.5 rounded-full cursor-pointer"
                            onClick={() =>
                              setTableState({
                                data: tableState.data.map((row, index) =>
                                  index === filter.activeIndex
                                    ? {
                                        ...row,
                                        prices: row.prices.filter(
                                          (_, index) => index !== j
                                        ),
                                      }
                                    : row
                                ),
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex w-full items-center justify-center mt-4 absolute z-10 -bottom-2.5 left-1/2 -translate-x-1/2">
                    {!twentyFiveDay && (
                      <Add
                        onClick={() =>
                          setTableState({
                            data: tableState.data.map((row, index) =>
                              index === filter.activeIndex
                                ? {
                                    ...row,
                                    prices: [
                                      ...row.prices,
                                      { min: 0, max: "" },
                                    ],
                                  }
                                : row
                            ),
                          })
                        }
                        className="bg-[rgb(103,0,4)] p-0.5 rounded-full cursor-pointer"
                        fontSize="small"
                      />
                    )}
                  </div>
                </Table.Item>
                <Table.Item
                  className="min-w-28 max-w-28"
                  selected={tableState.selectedRow === filter.activeIndex}
                >
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full bg-[#6C757D] dark:bg-[rgb(21,21,21)] text-white rounded-[16px]"
                  >
                    {filter.numSeats === null && (
                      <InputLabel shrink={false}>
                        <span className="text-white">Min. Seats</span>
                      </InputLabel>
                    )}
                    <Select
                      className="flex !text-white w-full"
                      classes={{ icon: "!text-white" }}
                      value={filter.numSeats ?? 2}
                      onChange={(e) =>
                        setTableState({
                          data: tableState.data.map((row, index) =>
                            index === filter.activeIndex
                              ? { ...row, numSeats: parseInt(e.target.value) }
                              : row
                          ),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((seat) => (
                        <MenuItem
                          key={seat}
                          value={parseInt(seat)}
                          className="w-full !block !text-wrap !px-2"
                        >
                          {seat}+
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Table.Item>
                <Table.Item
                  className="min-w-52 max-w-52 group-last:rounded-br-lg"
                  selected={tableState.selectedRow === filter.activeIndex}
                >
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full bg-[#6C757D] dark:bg-[rgb(21,21,21)] text-white rounded-[16px]"
                  >
                    {filter.ticketTypes.length === 0 && (
                      <InputLabel shrink={false}>
                        <span className="text-white">Ticket Types</span>
                      </InputLabel>
                    )}
                    <Select
                      multiple={true}
                      className="flex !text-white w-full"
                      classes={{ icon: "!text-white" }}
                      value={filter.ticketTypes ?? []}
                      onChange={(e) =>
                        setTableState({
                          data: tableState.data.map((row, index) =>
                            index === filter.activeIndex
                              ? { ...row, ticketTypes: e.target.value }
                              : row
                          ),
                        })
                      }
                      MenuProps={{
                        classes: {
                          paper: "MuiMenuItemAlt-root",
                        },
                      }}
                    >
                      {ticketTypeListUpdated.map((ticket) => {
                        let keyValue = ticket;
                        if (ticket === "Face Value Exchange") {
                          keyValue = "Verified Resale";
                        }

                        return (
                          <MenuItem
                            key={keyValue}
                            value={keyValue}
                            className="text-ellipsis w-full max-w-[200px] !block !text-wrap !px-2 MuiMenuItemAlt-root"
                          >
                            {ticket}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Table.Item>
                <Table.Item
                  onClick={(e) => e.stopPropagation()}
                  className="w-16 flex items-center justify-center !bg-transparent"
                  selected={tableState.selectedRow === filter.activeIndex}
                >
                  <Cross
                    onClick={() =>
                      setTableState({
                        data: tableState.data.filter(
                          (_, index) => index !== filter.activeIndex
                        ),
                        selectedRow: 0,
                        selectedPaths: tableState.data[0]?.sections ?? [],
                      })
                    }
                    className="h-8 w-8 flex cursor-pointer items-center justify-center aspect-square p-1 rounded-full text-[rgb(103,0,4)]"
                  />
                </Table.Item>
              </Table.Row>
            ))}
          </div>
        </div>

        <div className="flex justify-center relative">
          <button
            type="button"
            onClick={onAddFilter}
            className="absolute w-fit rounded-2xl bg-[rgb(103,0,4)] text-md px-5 py-1 mt-1"
          >
            Add Filter
          </button>
          <button
            type="submit"
            className="xl:hidden absolute right-[64px] w-fit rounded-2xl bg-[rgb(103,0,4)] text-md px-5 py-1 mt-1"
          >
            Submit
          </button>
        </div>
      </Table.Body>
    </Table>
  );
}
