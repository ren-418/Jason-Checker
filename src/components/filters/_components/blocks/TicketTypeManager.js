import { useState } from "react";

import Table from "../Table";
import XIcon from "../icons/XIcon";
import {
  Dialog,
  DialogContent,
  List,
  ListItemText,
  ListItemButton,
  DialogActions,
} from "@mui/material";
import { useTheme } from "../../../../ThemeContext";

export default function TicketTypeManager({
  setTableState,
  ticketTypes,
  filter,
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { darkMode } = useTheme();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleItemClick = (ticketType) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(ticketType)
        ? prevSelected.filter((item) => item !== ticketType)
        : [...prevSelected, ticketType]
    );
  };

  const handleSubmit = () => {
    const newFilter = filter.map((item) => {
      if (item.excludeFilter || item["Stock Monitor"]) return item;

      item.ticketTypes = selectedItems;
      return item;
    });

    setTableState({ data: newFilter });
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleOpenModal} className="h-full">
        <Table.Column className="min-w-52 max-w-52 h-full">
          Excluded Ticket Types
        </Table.Column>
      </div>

      <Dialog
        id="TicketTypeManagerDialog"
        open={open}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: "#222222",
            borderRadius: "15px",
          },
        }}
      >
        <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
          <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
            <div className="flex flex-grow text-center">
              <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                Ticket Type Manager
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="bg-black/30 dark:bg-[#595959] rounded-full p-1"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <DialogContent>
            <div className="w-full flex flex-col">
              <List>
                {ticketTypes.map((ticketType) => (
                  <ListItemButton
                    key={ticketType}
                    onClick={() => handleItemClick(ticketType)}
                    style={{
                      backgroundColor: selectedItems.includes(ticketType)
                        ? "#670004"
                        : "transparent",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "block",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={ticketType}
                      className="text-[#3C3C3C] dark:text-white"
                      primaryTypographyProps={{
                        style: {
                          color:
                            selectedItems.includes(ticketType) || darkMode
                              ? "white"
                              : "black",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
              <button
                type="button"
                onClick={handleOpenConfirm}
                className="w-fit rounded-2xl bg-[#670004] text-md px-5 py-1 mt-4 self-end"
              >
                Apply
              </button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: "#222222",
            borderRadius: "15px",
          },
        }}
      >
        <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
          <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
            <div className="flex flex-grow text-center">
              <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                Confirm Apply
              </p>
            </div>
            <button
              onClick={handleCloseConfirm}
              className="bg-black/30 dark:bg-[#595959] rounded-full p-1"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <DialogContent>
            <p className="text-[#3C3C3C] dark:text-white text-center text-md">
              Are you sure you want to apply these ticket types? They will apply
              to all filters on this event.
            </p>
          </DialogContent>
          <DialogActions className="flex justify-end px-4 pb-4">
            <button
              type="button"
              onClick={handleCloseConfirm}
              className="rounded-2xl bg-gray-500 text-md px-4 py-1"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-2xl bg-[#670004] text-md px-5 py-1 ml-2"
            >
              Yes
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
