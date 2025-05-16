import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import styles from "./UrlMonitor.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs from "dayjs";
// import DatePicker from "@mui/lab/DatePicker";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { v4 as uuidv4 } from "uuid";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// Generate 200 sample events
function generateSampleEvents() {
  const venues = [
    "The Bell House, Brooklyn, NY",
    "Brooklyn Steel, Brooklyn, United States",
    "The Studio At The Bomb Factory, Dallas, United States",
    "Royale, Boston, United States",
    "House of Blues Orlando, Orlando, FL",
    "The Wiltern, Los Angeles, CA",
    "COS Torwar, Warszawa",
    "Atlas Arena, Łódź",
    "Etihad Arena, Yas Bay, Abu Dhabi",
    "MSG, New York, NY",
  ];
  const offers = [
    "ONSALE",
    "Artist Presale",
    "Spotify Presale",
    "BIT Presale",
    "Venue Presale",
    "Chase Cardholder Preferred Tickets",
  ];
  const prices = ["TBD", "N/A", "$45", "$60", "$100", "$150", "$200"];
  const names = [
    "Aaron & Josh Do Improv-athon",
    "Anamanaguchi",
    "Steven Wilson - The Overview Tour",
    "STING 3.0 TOUR",
    "Kylie Minogue: TENSION TOUR 2025",
    "Fast Lane Access - Bop To The Top Summer 2025",
    "Jiaoying Summers: What Specie Are You? Tour",
    "Morgan Wallen: I'm The Problem Tour",
    "Dave Matthews Band",
    "Billy Joel",
  ];
  // Generate events for 10 different days, 20 per day
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  let events = [];
  for (let d = 0; d < 10; d++) {
    for (let i = 0; i < 20; i++) {
      const minutes = (i % 48) * 15;
      const eventDate = new Date(
        baseDate.getTime() + d * 86400000 + minutes * 60000
      );
      const dateStr = eventDate.toLocaleString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      events.push({
        id: uuidv4(),
        name: names[i % names.length] + (i % 3 === 0 ? " EVENING SHOW" : ""),
        venue: venues[i % venues.length],
        datetime: eventDate,
        offer: offers[i % offers.length],
        price: prices[i % prices.length],
        url: Math.random().toString(36).substring(2, 12).toUpperCase(),
        dateStr,
      });
    }
  }
  // Add 100 more events for more data
  for (let i = 0; i < 100; i++) {
    const eventDate = new Date(
      baseDate.getTime() + (i % 5) * 86400000 + (i % 48) * 15 * 60000
    );
    const dateStr = eventDate.toLocaleString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    events.push({
      id: uuidv4(),
      name: names[i % names.length] + (i % 2 === 0 ? " LATE SHOW" : ""),
      venue: venues[i % venues.length],
      datetime: eventDate,
      offer: offers[i % offers.length],
      price: prices[i % prices.length],
      url: Math.random().toString(36).substring(2, 12).toUpperCase(),
      dateStr,
    });
  }
  return events;
}

const allEvents = generateSampleEvents();

function getTimeSlots() {
  const slots = [];
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 48; i++) {
    const hour = d.getHours();
    const min = d.getMinutes();
    const ampm = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    slots.push(`${hour12}:${min.toString().padStart(2, "0")} ${ampm}`);
    d.setMinutes(d.getMinutes() + 15);
  }
  return slots;
}

const timeSlots = getTimeSlots();

export default function SalesMonitor() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [search, setSearch] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(0);
  const theme = useTheme();

  // Filter events by date, time slot, and search
  const filteredEvents = allEvents.filter((e) => {
    // Date match (ignore time)
    const eventDate = dayjs(e.datetime);
    const isSameDay = eventDate.isSame(selectedDate, "day");
    if (!isSameDay) return false;
    // Time slot match
    const slotStart = dayjs(selectedDate)
      .hour(0)
      .minute(0)
      .add(selectedSlot * 15, "minute");
    const slotEnd = slotStart.add(15, "minute");
    if (
      !(
        eventDate.isSame(slotStart) ||
        (eventDate.isAfter(slotStart) && eventDate.isBefore(slotEnd))
      )
    )
      return false;
    // Search match
    const searchStr = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(searchStr) ||
      e.venue.toLowerCase().includes(searchStr) ||
      e.offer.toLowerCase().includes(searchStr) ||
      e.url.toLowerCase().includes(searchStr)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Sales Day */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
          Sales Day
        </Typography>
      </Box>
      {/* Search & DatePicker Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#262626" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              borderRadius: 999,
              border:
                theme.palette.mode === "dark"
                  ? "1.5px solid #444"
                  : "1.5px solid #d1d5db",
              fontSize: 16,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
              px: 2,
              py: 1.5,
              height: 48,
              minWidth: { xs: "100%", sm: 260 },
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 260 },
            }}
          >
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              slotProps={{
                textField: {
                  variant: "standard",
                  InputProps: {
                    disableUnderline: true,
                    sx: {
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                      bgcolor: "transparent",
                      borderRadius: 999,
                      height: 48,
                      px: 0,
                    },
                  },
                  sx: {
                    width: "100%",
                    bgcolor: "transparent",
                    borderRadius: 999,
                  },
                },
              }}
            />
          </Box>
        </LocalizationProvider>
        <TextField
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              bgcolor: theme.palette.mode === "dark" ? "#262626" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              borderRadius: 999,
              border:
                theme.palette.mode === "dark"
                  ? "1.5px solid #444"
                  : "1.5px solid #d1d5db",
              fontSize: 16,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
              px: 2,
              py: 1.5,
              height: 48,
              minWidth: { xs: "100%", sm: 260 },
            },
          }}
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: 999,
            width: { xs: "100%", sm: "auto" },
          }}
        />
      </Box>
      {/* Time Tabs */}
      <Box sx={{ mb: 2, overflowX: "auto", bgcolor: "transparent" }}>
        <Tabs
          value={selectedSlot}
          onChange={(_, v) => setSelectedSlot(v)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { background: "#0f172a", height: 3 } }}
          sx={{ minHeight: 44 }}
        >
          {timeSlots.map((slot, idx) => (
            <Tab
              key={slot}
              label={slot}
              value={idx}
              sx={{
                minWidth: 90,
                fontWeight: 600,
                transition: "background 0.18s, color 0.18s",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
        <Paper
          sx={{
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: theme.palette.mode === "dark" ? "#262626" : "#fff",
            minWidth: 1100,
          }}
        >
          <Table sx={{ tableLayout: "fixed", minWidth: 1100 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#262626" : "#0f172a",
                }}
              >
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 220,
                  }}
                >
                  Event Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 200,
                  }}
                >
                  Venue
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 180,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 120,
                  }}
                >
                  Offer
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 100,
                  }}
                >
                  Price Range
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 120,
                  }}
                >
                  URL
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 120,
                  }}
                >
                  Add Event
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    width: 120,
                  }}
                >
                  Add Artist
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    {event.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    {event.venue}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    {event.datetime.toLocaleString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    {event.offer}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    {event.price}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                    }}
                  >
                    <a
                      href="#"
                      style={{
                        color: "#40a9ff",
                        textDecoration: "underline",
                        fontWeight: 500,
                        wordBreak: "break-all",
                      }}
                    >
                      {event.url}
                    </a>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                      p: { xs: 0.5, sm: 1.5 },
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background:
                          theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : "#fff",
                        color:
                          theme.palette.mode === "light" ? "#fff" : "#232323",
                        borderRadius: 16,
                        fontWeight: 400,
                        px: { xs: 1.5, sm: 3 },
                        py: { xs: 0.5, sm: 1 },
                        minWidth: { xs: 0, sm: 90 },
                        maxWidth: { xs: 110, sm: "none" },
                        boxShadow: 1,
                        textTransform: "none",
                        fontSize: { xs: 13, sm: 15 },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "&:hover": {
                          background:
                            theme.palette.mode === "light"
                              ? "#17213a"
                              : "#f3f4f6",
                          color:
                            theme.palette.mode === "light" ? "#fff" : "#232323",
                        },
                        transition: "background 0.18s, color 0.18s",
                      }}
                    >
                      Add Event
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                      border: `1px solid ${theme.palette.divider}`,
                      wordBreak: "break-word",
                      verticalAlign: "middle",
                      p: { xs: 0.5, sm: 1.5 },
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background:
                          theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : "#fff",
                        color:
                          theme.palette.mode === "light" ? "#fff" : "#232323",
                        borderRadius: 16,
                        fontWeight: 400,
                        px: { xs: 1.5, sm: 3 },
                        py: { xs: 0.5, sm: 1 },
                        minWidth: { xs: 0, sm: 90 },
                        maxWidth: { xs: 110, sm: "none" },
                        boxShadow: 1,
                        textTransform: "none",
                        fontSize: { xs: 13, sm: 15 },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "&:hover": {
                          background:
                            theme.palette.mode === "light"
                              ? "#17213a"
                              : "#f3f4f6",
                          color:
                            theme.palette.mode === "light" ? "#fff" : "#232323",
                        },
                        transition: "background 0.18s, color 0.18s",
                      }}
                    >
                      Add Artist
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
}

export { allEvents };
