import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ffffff",
    },
    background: {
      default: "#161616",
      paper: "#161616",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

const TicketQuantityFilter = ({ onApply, darkMode }) => {
  const [open, setOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const wrapperRef = useRef(null);

  const handleOpen = () => setOpen(true);

  const handleQuantityChange = (event) => {
    setTicketQuantity(event.target.value);
  };

  const handleApplyFilter = () => {
    onApply({
      ticketQuantity: Number(ticketQuantity),
      selectedOption: selectedOptions,
    });
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const option = event.target.name;

    if (option === "saleIndicator") {
      // If selecting saleIndicator, clear all other options and only select this
      setSelectedOptions(event.target.checked ? ["saleIndicator"] : []);
    } else {
      // If selecting any other option
      if (selectedOptions.includes("saleIndicator")) {
        // If saleIndicator was selected, clear it first
        setSelectedOptions([]);
      }

      // Handle the checkbox toggle
      if (event.target.checked) {
        setSelectedOptions((prev) => [...prev, option]);
      } else {
        setSelectedOptions((prev) => prev.filter((item) => item !== option));
      }
    }
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          display: "inline-block",
          userSelect: "none",
        }}
      >
        <IconButton
          onClick={handleOpen}
          style={{
            color: darkMode ? "white" : "#000",
            marginTop: "-15px",
          }}
        >
          <FilterListIcon />
        </IconButton>
        {open && (
          <Box
            style={{
              position: "absolute",
              zIndex: 1,
              top: "100%",
              left: 0,
              backgroundColor: "#222222",
              padding: "16px",
              borderRadius: "13px",
              width: "250px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor: "#2d2d2d",
                borderRadius: "13px",
                padding: "8px",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                  margin: "0px",
                }}
              >
                Sort Options
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <TextField
                label="Ticket Quantity"
                type="number"
                variant="outlined"
                size="small"
                value={ticketQuantity}
                onChange={handleQuantityChange}
                fullWidth
                InputProps={{
                  style: { color: "#fff", borderColor: "#fff" },
                }}
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
                style={{
                  backgroundColor: "#333",
                  borderRadius: "8px",
                }}
              />
            </div>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("ticketmaster")}
                    onChange={handleCheckboxChange}
                    name="ticketmaster"
                    style={{ color: "#fff" }}
                  />
                }
                label={
                  <span style={{ fontSize: "14px" }}>
                    Ticketmaster / Live Nation
                  </span>
                }
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("axs")}
                    onChange={handleCheckboxChange}
                    name="axs"
                    style={{ color: "#fff" }}
                  />
                }
                label="AXS"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("mlb")}
                    onChange={handleCheckboxChange}
                    name="mlb"
                    style={{ color: "#fff" }}
                  />
                }
                label="MLB"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("seatgeek")}
                    onChange={handleCheckboxChange}
                    name="seatgeek"
                    style={{ color: "#fff" }}
                  />
                }
                label="SeatGeek"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("evenue")}
                    onChange={handleCheckboxChange}
                    name="evenue"
                    style={{ color: "#fff" }}
                  />
                }
                label="Evenue"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("stubhub")}
                    onChange={handleCheckboxChange}
                    name="stubhub"
                    style={{ color: "#fff" }}
                  />
                }
                label="Stubhub"
                style={{ color: "#fff" }}
              />
            </Box>
            {/* <Box mb={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("ticketmasteruk")}
                    onChange={handleCheckboxChange}
                    name="ticketmasteruk"
                    style={{ color: "#fff" }}
                  />
                }
                label="Ticketmaster UK"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("ticketmastereu")}
                    onChange={handleCheckboxChange}
                    name="ticketmastereu"
                    style={{ color: "#fff" }}
                  />
                }
                label="Ticketmaster EU"
                style={{ color: "#fff" }}
              />
            </Box> */}
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("earlyMonitor")}
                    onChange={handleCheckboxChange}
                    name="earlyMonitor"
                    style={{ color: "#fff" }}
                  />
                }
                label="Early Monitor"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("priceDrops")}
                    onChange={handleCheckboxChange}
                    name="priceDrops"
                    style={{ color: "#fff" }}
                  />
                }
                label="Price Drops"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("saleIndicator")}
                    onChange={handleCheckboxChange}
                    name="saleIndicator"
                    style={{ color: "#fff" }}
                  />
                }
                label="Onsale / Presale"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("artist")}
                    onChange={handleCheckboxChange}
                    name="artist"
                    style={{ color: "#fff" }}
                  />
                }
                label="Artist Add"
                style={{ color: "#fff" }}
              />
            </Box>
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("lowStock")}
                    onChange={handleCheckboxChange}
                    name="lowStock"
                    style={{ color: "#fff" }}
                  />
                }
                label="Low Stock"
                style={{ color: "#fff" }}
              />
            </Box>
            {/* <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("queueDrops")}
                    onChange={handleCheckboxChange}
                    name="queueDrops"
                    style={{ color: "#fff" }}
                  />
                }
                label="Queue Opened"
                style={{ color: "#fff" }}
              />
            </Box> */}
            <Box mb={1} style={{ height: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions.includes("removeOnsalePresale")}
                    onChange={handleCheckboxChange}
                    name="removeOnsalePresale"
                    style={{ color: "#fff", fontSize: "14px" }}
                  />
                }
                label={
                  <span style={{ fontSize: "14px" }}>
                    Remove Onsale / Presale
                  </span>
                }
                style={{ color: "#fff" }}
              />
            </Box>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "rgb(103, 0, 4)",
                  color: "#fff",
                  borderRadius: "8px",
                  width: "100px",
                }}
                onClick={handleApplyFilter}
              >
                Apply
              </Button>
            </div>
          </Box>
        )}
      </div>
    </ThemeProvider>
  );
};

export default TicketQuantityFilter;
