import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { handleAddRow } from "../../_utils/events";
  import Cross from "@mui/icons-material/Close";

  /* due to the state management co-locating all filter types inside the data attribute, we need to get the real index */
  const attachActiveIndex = (tableState, filter) => ({
    ...filter,
    activeIndex: tableState.data.indexOf(filter),
  });

  export default function ExtraFilterOptions({
    tableState,
    setTableState,
    defaultData,
    twentyFiveDay,
    fullURL,
    changeVF,
  }) {
    const filters = tableState.data
      .filter((filter) => filter.excludeFilter || filter["Stock Monitor"])
      .map((filter) => attachActiveIndex(tableState, filter));

    /* determine if an event is a ticketmaster event */
    const isTicketMaster =
      !fullURL.includes("axs.com") &&
      !fullURL.includes("mlb.tickets.com") &&
      !fullURL.includes("mpv.tickets.com") &&
      !fullURL.includes("seatgeek.com") &&
      !fullURL.includes("stubhub.com") &&
      (fullURL.includes("ticketmaster") || fullURL.includes("livenation"));

    const totalSectionStocks = (selectedSections) => {
      return (selectedSections ?? [])
        .map((section) => tableState.totalStock[section] ?? 0)
        .reduce((a, b) => a + b, 0);
    };

    const totalStockAvailable = (
      allSections,
      selectedSections,
      rowTicketTypes,
      totalAvailableStock
    ) => {
      let totalAvailableStockInSections = 0;

      let seatCache = {};

      for (let x = 0; x < (selectedSections ?? []).length; x++) {
        const section = selectedSections[x];

        const sectionId = allSections.find((s) => s.sectionName === section)?.id;

        for (let i = 0; i < totalAvailableStock.length; i++) {
          if (rowTicketTypes.includes(totalAvailableStock[i].name)) continue;

          if (totalAvailableStock[i].shape === sectionId) {
            const name = `${totalAvailableStock[i].section}${totalAvailableStock[i].shape}`;

            if (seatCache[name]) {
              if (seatCache[name].stock > totalAvailableStock[i].stock) {
                continue;
              }
            }

            seatCache[name] = totalAvailableStock[i];
          }
        }
      }

      for (const name in seatCache) {
        totalAvailableStockInSections += seatCache[name].stock;
      }

      return totalAvailableStockInSections;
    };

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

        setTableState({ selectedRow: filters[currentIndex - 1].activeIndex });
      }

      if (e.key === "ArrowDown") {
        const currentIndex = filters.findIndex(
          (filter) => filter.activeIndex === tableState.selectedRow
        );
        if (currentIndex === filters.length - 1) return;

        setTableState({ selectedRow: filters[currentIndex + 1].activeIndex });
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
      <div
        onKeyUp={handleKeyboardNavigation}
        onKeyDown={handleKeyDownOverride}
        tabIndex={0}
        className="flex flex-col max-w-full min-w-fit w-[500px] bg-[#CACACA] dark:bg-[rgb(57,57,57)] h-full rounded-xl rounded-t-2xl relative focus:outline-none"
      >
        <h4 className="bg-[#BDBDBD] dark:bg-[#2D2D2D] text-[#161616] dark:text-white w-full xl:min-w-full text-center font-semibold px-3 py-2 rounded-t-2xl">
          Extra Filter Options
        </h4>
        <div className="flex flex-col px-4 pt-4 pb-2 min-h-52 space-y-3 max-h-[200px] overflow-y-auto rounded-b-lg">
          {filters.length === 0 && (
            <div className="cursor-pointer w-full flex p-2 space-x-2 items-center rounded-xl">
              <FormControl
                size="small"
                style={{ border: "2px solid rgb(103,0,4)" }}
                className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
              >
                <InputLabel shrink={false}>
                  <span className="text-white">Sections</span>
                </InputLabel>
                <Select
                  multiple={true}
                  className="!text-white w-full"
                  classes={{ icon: "!text-white" }}
                  value={[]}
                  disabled={true}
                >
                  {tableState.sections.map((section) => (
                    <MenuItem
                      key={section.sectionName}
                      value={section.sectionName}
                      className="!block w-full max-w-[300px] !text-wrap !px-2"
                    >
                      {section.sectionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                style={{ border: "2px solid rgb(103,0,4)" }}
                className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
              >
                <InputLabel shrink={false}>
                  <span className="text-white">Rows</span>
                </InputLabel>
                <Select
                  multiple={true}
                  className="!text-white w-full"
                  classes={{ icon: "!text-white" }}
                  value={[]}
                  disabled={true}
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
            </div>
          )}
          {filters.map((filter) => {
            let lowStockSections = tableState.sections;

            if (
              tableState.sections.length === 0 &&
              tableState.totalAvailableStock.length > 0 &&
              filter["Stock Monitor"]
            ) {
              for (let i = 0; i < tableState.totalAvailableStock.length; i++) {
                const section = tableState.totalAvailableStock[i].section;
                lowStockSections.push({
                  sectionName: section,
                  id: tableState.totalAvailableStock[i].shape,
                });
              }
            }

            return (
              <div
                key={filter.activeIndex}
                onClick={(e) => updateSelectedRow(e, filter)}
                className={`cursor-pointer w-full flex p-2 space-x-2 items-center rounded-xl ${
                  tableState.selectedRow === filter.activeIndex
                    ? "bg-[#7d79a8]"
                    : ""
                }`}
              >
                <div onClick={(e) => e.stopPropagation()}>
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
                    className="cursor-pointer h-6 w-6 flex items-center justify-center aspect-square bg-[rgb(103,0,4)] p-1 rounded-full"
                  />
                </div>
                <div className="relative">
                  <span className="text-xs absolute -top-4 left-2 text-[#161616] dark:text-white">
                    Type
                  </span>
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                  >
                    <Select
                      className="!text-white w-full"
                      classes={{ icon: "!text-white" }}
                      value={
                        filter.excludeFilter ? "excludeFilter" : "Stock Monitor"
                      }
                      onChange={(e) =>
                        setTableState({
                          data: tableState.data.map((row, index) =>
                            index === filter.activeIndex
                              ? {
                                  ...row,
                                  excludeFilter:
                                    e.target.value !== "Stock Monitor",
                                  "Stock Monitor":
                                    e.target.value === "Stock Monitor",
                                }
                              : row
                          ),
                        })
                      }
                    >
                      <MenuItem
                        className="w-full max-w-[200px] !block !text-wrap !px-2"
                        value="excludeFilter"
                      >
                        Exclude Filter
                      </MenuItem>
                      {isTicketMaster && (
                        <MenuItem
                          className="w-full max-w-[200px] !block !text-wrap !px-2"
                          value="Stock Monitor"
                        >
                          Low Stock Monitor
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div className="min-w-28 max-w-28 relative">
                  <span className="text-xs absolute -top-4 left-2 text-[#161616] dark:text-white">
                    Sections
                  </span>
                  <FormControl
                    onClick={(e) =>
                      tableState.selectedRow === filter.activeIndex &&
                      e.stopPropagation()
                    }
                    size="small"
                    style={{ border: "2px solid rgb(103,0,4)" }}
                    className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                  >
                    {filter.sections.length === 0 && (
                      <InputLabel shrink={false}>
                        <span className="text-white">Sections</span>
                      </InputLabel>
                    )}
                    <Select
                      multiple={true}
                      className="!text-white w-full"
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
                          className="!block w-full max-w-[300px] !text-wrap !px-2"
                        >
                          {section.sectionName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {filter.excludeFilter && (
                  <div className="min-w-28 max-w-28 relative">
                    <span className="text-xs absolute -top-4 left-2 text-[#161616] dark:text-white">
                      Rows
                    </span>
                    <FormControl
                      onClick={(e) =>
                        tableState.selectedRow === filter.activeIndex &&
                        e.stopPropagation()
                      }
                      size="small"
                      style={{ border: "2px solid rgb(103,0,4)" }}
                      className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                    >
                      {filter.rows.length === 0 && (
                        <InputLabel shrink={false}>
                          <span className="text-white">Rows</span>
                        </InputLabel>
                      )}
                      <Select
                        multiple={true}
                        className="!text-white w-full"
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
                  </div>
                )}
                {filter["Stock Monitor"] && (
                  <>
                    <div className="min-w-16 max-w-16 relative">
                      <span className="text-xs absolute -top-4 text-center w-16 text-[#161616] dark:text-white">
                        Alert At
                      </span>
                      <FormControl
                        onClick={(e) =>
                          tableState.selectedRow === filter.activeIndex &&
                          e.stopPropagation()
                        }
                        size="small"
                        style={{ border: "2px solid rgb(103,0,4)" }}
                        className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                      >
                        <Input
                          classes={{ input: "text-center !text-white !p-2" }}
                          disableUnderline={true}
                          value={filter.totalStock}
                          inputProps={{
                            pattern: "[0-9]*",
                            inputMode: "numeric",
                            style: { appearance: "textfield" },
                          }}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setTableState({
                              data: tableState.data.map((row, index) =>
                                index === filter.activeIndex
                                  ? { ...row, totalStock: value }
                                  : row
                              ),
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="min-w-16 max-w-16 relative">
                      <span className="text-xs absolute -top-4 text-center w-16 text-[#161616] dark:text-white">
                        Total Avail.
                      </span>
                      <FormControl
                        onClick={(e) =>
                          tableState.selectedRow === filter.activeIndex &&
                          e.stopPropagation()
                        }
                        size="small"
                        style={{ border: "2px solid #2D2D2D" }}
                        className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                      >
                        <Input
                          classes={{ input: "text-center !text-white !p-2" }}
                          disabled={true}
                          disableUnderline={true}
                          value={totalStockAvailable(
                            tableState.sections,
                            filter.sections,
                            filter.ticketTypes,
                            tableState.totalAvailableStock
                          )}
                        />
                      </FormControl>
                    </div>
                    <div className="min-w-20 max-w-20 relative">
                      <span className="text-xs absolute -top-4 text-center w-20 text-[#161616] dark:text-white">
                        Total Seats
                      </span>
                      <FormControl
                        onClick={(e) =>
                          tableState.selectedRow === filter.activeIndex &&
                          e.stopPropagation()
                        }
                        size="small"
                        style={{ border: "2px solid #2D2D2D" }}
                        className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                      >
                        <Input
                          classes={{ input: "text-center !text-white !p-2" }}
                          disabled={true}
                          disableUnderline={true}
                          value={totalSectionStocks(filter.sections)}
                        />
                      </FormControl>
                    </div>
                    <div className="min-w-28 max-w-28 relative">
                      <span className="text-[10px] absolute -top-4 left-2 text-[#161616] dark:text-white">
                        Excluded Ticket Types
                      </span>
                      <FormControl
                        onClick={(e) =>
                          tableState.selectedRow === filter.activeIndex &&
                          e.stopPropagation()
                        }
                        size="small"
                        style={{ border: "2px solid rgb(103,0,4)" }}
                        className="w-full text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
                      >
                        {filter.ticketTypes.length === 0 && (
                          <InputLabel shrink={false}>
                            <span className="text-white">Ticket Types</span>
                          </InputLabel>
                        )}
                        <Select
                          multiple={true}
                          className="!text-white w-full"
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
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() =>
            handleAddRow(
              defaultData,
              tableState,
              setTableState,
              twentyFiveDay,
              true,
              false,
              "",
              fullURL
            )
          }
          className="bg-[rgb(103,0,4)] absolute -bottom-4 z-50 left-1/2 -translate-x-1/2 text-sm px-5 py-1 text-white rounded-2xl"
        >
          Add Filter
        </button>
      </div>
    );
  }
