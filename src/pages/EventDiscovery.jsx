import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect, useRef } from "react";
import { allEvents } from "./SalesMonitor";
import TM_LOGO from "../assets/tm.png";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import stadium from "../assets/stadium.png";
import stadium2 from "../assets/stadium2.png";
import stadium3 from "../assets/stadium3.png";
import stadium4 from "../assets/stadium4.png";
import Badge from "@mui/material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SvgIcon from "@mui/material/SvgIcon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

// Utility to format date
function formatDate(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val instanceof Date)
    return val.toLocaleString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  return String(val);
}

export default function EventDetailView() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [page, setPage] = useState(1);
  const [showToTop, setShowToTop] = useState(false);
  const eventsPerPage = 6;
  const [removedEvents, setRemovedEvents] = useState([]);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [readdConfirmOpen, setReaddConfirmOpen] = useState(false);
  const filteredEvents = allEvents.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const pagedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );
  const topRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterState, setFilterState] = useState({
    tm: false,
    axs: false,
    mlb: false,
    seatgeek: false,
    evenue: false,
    stubhub: false,
    early: false,
    price: false,
    onsale: false,
    artist: false,
    low: false,
    remove: false,
  });
  const [sortOption, setSortOption] = useState("Ticket Quantity");

  // Scroll to top button logic
  useEffect(() => {
    const onScroll = () => {
      setShowToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Theme-based colors
  const isDark = theme.palette.mode === "dark";
  const bgMain = isDark ? "#18181b" : "#fff";
  const bgCard = isDark ? "#232228" : "#fff";
  const borderColor = isDark ? "#444" : "#d1d5db";
  const textColor = isDark ? "#fff" : "#23293a";
  const subTextColor = isDark ? "#aaa" : "#888";

  // For stadium images cycling
  const stadiumImages = [stadium, stadium2, stadium3, stadium4];

  return (
    <Box sx={{ bgcolor: bgMain, minHeight: "100vh", pb: 8 }}>
      <div ref={topRef} />
      {/* Sticky Search Bar Row */}
      <Box
        sx={{
          position: "sticky",
          top: 50, // below header
          zIndex: 10,
          bgcolor: bgMain,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                bgcolor: isDark ? "#262626" : "#fff",
                borderRadius: 2,
                border: `1.5px solid ${borderColor}`,
                px: 2.5,
                py: 0.5,
                boxShadow: isDark
                  ? "0 2px 8px 0 rgba(20,20,40,0.18)"
                  : "0 2px 8px 0 rgba(0,0,0,0.08)",
              }}
            >
              <FilterListIcon
                sx={{
                  color: isDark ? "#aaa" : "#444",
                  mr: 1,
                  cursor: "pointer",
                }}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              />
              <TextField
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{
                  flex: 1,
                  bgcolor: "transparent",
                  fontSize: 18,
                  color: textColor,
                }}
              />
              <IconButton
                sx={{
                  color: theme.palette.mode == "light" ? "#fff" : "#232323",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 2,
                  ml: 1,
                  fontWeight: "normal",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light" ? "#17213a" : "#f3f4f6",
                    color: theme.palette.mode === "light" ? "#fff" : "#232323",
                  },
                  transition: "background 0.18s, color 0.18s",
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              sx={{
                background: theme.palette.primary.main,
                color: theme.palette.mode === "light" ? "#fff" : "#232323",
                borderRadius: 2,
                fontWeight: "normal",
                px: 3,
                py: 1.2,
                ml: 2,
                fontSize: 16,
                boxShadow: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "light" ? "#17213a" : "#f3f4f6",
                  color: theme.palette.mode === "light" ? "#fff" : "#232323",
                },
                transition: "background 0.18s, color 0.18s",
              }}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Expanded View" : "Compact View"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Margin between search and blog */}
      <Box sx={{ height: 70 }} />

      {/* Event Cards */}
      <Container maxWidth="md" sx={{ pt: 1, px: { xs: 1, sm: 2, md: 0 } }}>
        {pagedEvents.map((event, idx) => {
          const hasBadge =
            event.offer && event.offer.toLowerCase().includes("presale");
          if (!expanded) {
            // Expanded view: professional blog card like image
            return (
              <Box
                key={event.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "stretch",
                  bgcolor: isDark ? "#262626" : "#fff",
                  borderRadius: 3,
                  border: `1.5px solid ${borderColor}`,
                  mb: 2,
                  px: 0,
                  py: 0,
                  boxShadow: 0,
                  position: "relative",
                  minHeight: 180,
                  overflow: "visible",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 6 },
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedEvent(event);
                  setModalOpen(true);
                }}
              >
                {/* Left: Blog Info */}
                <Box
                  sx={{
                    flex: 1,
                    px: 3,
                    py: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: textColor,
                      mb: 0.5,
                      wordBreak: "break-word",
                      fontSize: 20,
                    }}
                  >
                    {event.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: subTextColor,
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />{" "}
                    {event.venue}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: subTextColor,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />{" "}
                    {formatDate(event.datetime) || formatDate(event.dateStr)}
                  </Typography>
                  {/* Ticket Info */}
                  <Box
                    sx={{
                      background: isDark ? "#232228" : "#f3f4f6",
                      color: textColor,
                      borderRadius: 2,
                      p: 2,
                      mb: 1,
                      fontSize: 15,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>
                      Ticketmaster
                    </span>
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>
                      - (
                      {event.ticketsFound
                        ? event.ticketsFound
                        : Math.floor(Math.random() * 12 + 1)}{" "}
                      tickets found)
                    </span>
                  </Box>
                  <Box
                    sx={{
                      background: isDark ? "#232228" : "#e5e7eb",
                      color: textColor,
                      borderRadius: 2,
                      p: 2,
                      fontSize: 15,
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    Verified Ticket - Section 100, Row 10, Seats 1-2, <b>2</b> -{" "}
                    <b>$425.93</b>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#7c3aed", fontWeight: 700, mt: 1 }}
                  >
                    Jason Data
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: subTextColor, mb: 1 }}
                  >
                    Get In: <b>$140</b> Average: <b>$336</b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#3d186a",
                        color: "#fff",
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <SvgIcon sx={{ fontSize: 18, mr: 0.5 }}>
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </SvgIcon>{" "}
                      S
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: subTextColor, fontWeight: 500, ml: 1 }}
                    >
                      Release Time: {formatDate(event.dateStr)}
                    </Typography>
                  </Box>
                </Box>
                {/* Right: Stadium Image */}
                <Box
                  sx={{
                    minWidth: 180,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={stadiumImages[idx % stadiumImages.length]}
                    alt="venue map"
                    sx={{
                      width: 140,
                      height: 110,
                      objectFit: "contain",
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            );
          }
          return (
            <Box
              key={event.id}
              sx={{
                display: "flex",
                alignItems: "stretch",
                bgcolor: isDark ? "#262626" : "#fff",
                borderRadius: 3,
                border: `1.5px solid ${borderColor}`,
                mb: 2,
                px: 0,
                py: 0,
                boxShadow: 0,
                position: "relative",
                minHeight: 100,
                overflow: "visible",
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: 6,
                  background: isDark ? "#232228" : "#f3f4f6",
                },
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedEvent(event);
                setModalOpen(true);
              }}
            >
              {/* Blog Card Content */}
              <Box
                sx={{
                  flex: 1,
                  px: 2.5,
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: textColor,
                    mb: 0.5,
                    wordBreak: "break-word",
                    fontSize: 17,
                  }}
                >
                  {event.name} - {event.venue},{" "}
                  {typeof event.datetime === "string"
                    ? event.datetime
                    : event.dateStr}{" "}
                  <b style={{ fontWeight: 700, color: "#23293a" }}>
                    (
                    {event.ticketsFound
                      ? event.ticketsFound
                      : Math.floor(Math.random() * 12 + 1)}{" "}
                    tickets found)
                  </b>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: subTextColor, fontSize: 14, mt: 0.5, mb: 2 }}
                >
                  Release Time: {formatDate(event.dateStr)}
                </Typography>
                {/* Presale badge at bottom right */}
                {hasBadge && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 11,
                      bottom: 8,
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText || "#fff",
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        fontWeight: 400,
                        fontSize: 13,
                        boxShadow: 2,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        transition: "background 0.18s, color 0.18s",
                      }}
                    >
                      presale
                    </Box>
                  </Box>
                )}
              </Box>
              {/* TM/source button on right, vertically centered */}
              <Box
                sx={{
                  minWidth: 80,
                  maxWidth: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                  borderLeft: `1.5px solid ${borderColor}`,
                  position: "relative",
                  px: 0,
                }}
              >
                <Box
                  component="img"
                  src={TM_LOGO}
                  alt="tm"
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "contain",
                    bgcolor: "#1583e9",
                    borderRadius: 2,
                    p: 1,
                  }}
                />
              </Box>
            </Box>
          );
        })}
        {/* Pagination Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            sx={{
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              background: "transparent",
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText || "#fff",
                borderColor: theme.palette.primary.dark,
              },
              transition: "background 0.18s, color 0.18s",
            }}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            sx={{
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              background: "transparent",
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText || "#fff",
                borderColor: theme.palette.primary.dark,
              },
              transition: "background 0.18s, color 0.18s",
            }}
          >
            Next
          </Button>
        </Box>
      </Container>
      {/* To Top Button */}
      {showToTop && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleToTop}
            sx={{
              bgcolor: isDark ? "#fff" : "#23293a",
              color: isDark ? "#0f172a" : "#fff",
              boxShadow: 3,
              borderRadius: 2,
              width: 56,
              height: 56,
              "&:hover": {
                bgcolor: isDark ? "#ffffff" : "#7a0a0a",
                color: isDark ? "#0f172a" : "#fff",
              },
              fontSize: 32,
              fontWeight: "normal",
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: 36 }} />
          </IconButton>
          <Box
            sx={{
              bgcolor: isDark ? "#fff" : "#23293a",
              color: isDark ? "#0f172a" : "#fff",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 16,
              boxShadow: 3,
              ml: 1,
              minWidth: 60,
              textAlign: "center",
            }}
          >
            To Top
          </Box>
        </Box>
      )}
      {/* Detail Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? "#181818" : "#fff",
            borderRadius: { xs: 0, sm: 4 },
            boxShadow: 8,
            m: { xs: 0, sm: 2 },
            width: { xs: "100vw", sm: 720, md: 900 },
            minHeight: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            display: "flex",
            flexDirection: "column",
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 800,
            fontSize: { xs: 22, sm: 28 },
            letterSpacing: 0.2,
            pb: 0,
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 4 },
            position: { xs: "fixed", sm: "static" },
            top: 0,
            left: 0,
            width: { xs: "100vw", sm: "auto" },
            zIndex: 1201,
            bgcolor: isDark ? "#181818" : "#fff",
            borderTopLeftRadius: { xs: 0, sm: 4 },
            borderTopRightRadius: { xs: 0, sm: 4 },
            boxShadow: { xs: 3, sm: 0 },
            borderBottom: { xs: "1px solid #e5e7eb", sm: "none" },
            mb: { xs: "0px", sm: 0 },
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "inherit",
              color: isDark ? "#fff" : "#23293a",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {selectedEvent?.name || ""}
          </span>
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ height: { xs: "450px", sm: 0 } }} />
        <DialogContent
          sx={{
            pt: { xs: 15, sm: 2 },
            pb: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 4 },
            width: { xs: "100vw", sm: "auto" },
            minHeight: { xs: "calc(100vh - 64px)", sm: "auto" },
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: { xs: 3, sm: 4 },
            bgcolor: isDark ? "#181818" : "#fff",
            justifyItems: { xs: "center", md: "stretch" },
          }}
        >
          {/* Left: Event Info, Table, Jason Data */}
          <Box
            sx={{
              width: { xs: "95vw", sm: "100%" },
              maxWidth: { xs: 360, sm: "none" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mx: "auto",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                mb: 1,
                justifyContent: { xs: "center", md: "flex-start" },
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#fff" : "#23293a",
                  fontSize: 16,
                  display: "inline",
                }}
              >
                Date:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: 16, display: "inline", ml: 1 }}
              >
                {formatDate(selectedEvent?.datetime) ||
                  formatDate(selectedEvent?.dateStr) ||
                  ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: isDark ? "#fff" : "#23293a",
                  ml: 2,
                  fontSize: 16,
                  display: "inline",
                }}
              >
                Venue:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: 16, display: "inline", ml: 1 }}
              >
                {selectedEvent?.venue || ""}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2,
                justifyContent: { xs: "center", md: "flex-start" },
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  fontWeight: 400,
                  px: 4,
                  py: 1.2,
                  fontSize: 16,
                  bgcolor: isDark ? "#fff" : theme.palette.primary.main,
                  boxShadow: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: isDark ? "#f3f4f6" : theme.palette.primary.dark,
                  },
                  color: isDark ? "#23293a" : "#fff",
                }}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  fontWeight: 400,
                  px: 4,
                  py: 1.2,
                  fontSize: 16,
                  bgcolor: isDark ? "#fff" : theme.palette.primary.main,
                  boxShadow: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: isDark ? "#f3f4f6" : theme.palette.primary.dark,
                  },
                  color: isDark ? "#23293a" : "#fff",
                }}
              >
                Enable ACO
              </Button>
              <IconButton
                sx={{
                  bgcolor: isDark ? "#232228" : "#e5e7eb",
                  color: isDark ? "#fff" : "#23293a",
                  borderRadius: 2,
                  ml: 1,
                  width: 40,
                  height: 40,
                  boxShadow: 1,
                }}
              >
                <VolumeUpIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                textAlign: { xs: "center", md: "left" },
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Total Quantity: <b>5</b>
            </Typography>
            <Box
              sx={{
                mb: 2,
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Box
                sx={{
                  bgcolor: isDark ? "#232228" : "#f5f7fa",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  minHeight: 48,
                  width: "100%",
                  justifyContent: { xs: "center", md: "flex-start" },
                  boxShadow: 0,
                  fontWeight: 600,
                }}
              >
                <a
                  href={selectedEvent?.url || "https://ticketmaster/0esfw234"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 17,
                    textDecoration: "underline",
                    wordBreak: "break-all",
                  }}
                >
                  {`https://ticketmaster/` + selectedEvent?.url ||
                    "https://ticketmaster/0esfw234"}
                </a>
              </Box>
            </Box>
            <Divider sx={{ my: 2, borderColor: isDark ? "#333" : "#e5e7eb" }} />
            <Box
              sx={{
                borderRadius: 3,
                overflowX: "auto",
                overflowY: "hidden",
                mb: 2,
                width: "100%",
                boxShadow: 1,
                bgcolor: isDark ? "#232228" : "#f8fafc",
                maxWidth: { xs: 360, sm: "none" },
                mx: "auto",
              }}
            >
              {/* Buy All Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  px: 2,
                  pt: 2,
                  mb: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedRows.length === 0}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    fontSize: 15,
                    boxShadow: 1,
                    textTransform: "none",
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.mode === "light" ? "#fff" : "#23293a",
                    "&:hover": { bgcolor: theme.palette.primary.dark },
                    ml: 2,
                  }}
                  onClick={() => {
                    /* handle buy all action */
                  }}
                >
                  Buy All ({selectedRows.length})
                </Button>
              </Box>
              <Table sx={{ minWidth: 500, width: "100%" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#23293a" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        style={{ color: "white" }}
                        checked={selectedRows.length === 2}
                        indeterminate={
                          selectedRows.length > 0 && selectedRows.length < 2
                        }
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows([0, 1]);
                          else setSelectedRows([]);
                        }}
                        sx={{ color: "#fff" }}
                        inputProps={{ "aria-label": "select all tickets" }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      Ticket Type
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      Section
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      Row
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      Seats (Qty)
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                      Links
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[0, 1].map((idx) => (
                    <TableRow
                      hover
                      key={idx}
                      selected={selectedRows.includes(idx)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(idx)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedRows([...selectedRows, idx]);
                            else
                              setSelectedRows(
                                selectedRows.filter((i) => i !== idx)
                              );
                          }}
                          sx={{ color: theme.palette.primary.main }}
                          inputProps={{
                            "aria-label": `select ticket row ${idx + 1}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>Standard Admission</TableCell>
                      <TableCell>{idx === 0 ? 224 : 225}</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>
                        {idx === 0 ? "1, 2, 3" : "11, 12"}{" "}
                        <b>({idx === 0 ? 3 : 2})</b>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          sx={{
                            ml: 1,
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? "white"
                                : theme.palette.primary.main,
                            color:
                              theme.palette.mode === "dark" ? "black" : "white",
                            borderRadius: 2,
                            fontWeight: 400,
                            px: 2,
                            py: 0.5,
                            fontSize: 14,
                            boxShadow: 1,
                          }}
                        >
                          BUY
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Divider sx={{ my: 2, borderColor: isDark ? "#333" : "#e5e7eb" }} />
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: 16,
                  mb: 0.5,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Jason Data
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#fff" : "#23293a",
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Get In: <b>$140</b> Average: <b>$336</b>
              </Typography>
            </Box>
          </Box>
          {/* Right: Stadium Image, Ticketmaster Data, Notes */}
          <Box
            sx={{
              width: { xs: "95vw", sm: "100%" },
              maxWidth: { xs: 360, sm: "none" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Box
              component="img"
              src={stadiumImages[0]}
              alt="venue map"
              sx={{
                width: { xs: 180, sm: 220, md: 260 },
                height: { xs: 100, sm: 140, md: 180 },
                objectFit: "contain",
                borderRadius: 3,
                mb: 1,
                boxShadow: 1,
                mx: "auto",
                bgcolor: isDark ? "#232228" : "#f8fafc",
              }}
            />
            <Box
              sx={{
                width: "100%",
                bgcolor: isDark ? "#232228" : "#f5f7fa",
                borderRadius: 3,
                p: 2,
                mb: 1,
                mx: "auto",
                textAlign: "center",
                boxShadow: 1,
              }}
            >
              <a
                href="#"
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "underline",
                }}
              >
                Ticketmaster Data
              </a>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#fff" : "#23293a",
                  fontWeight: 500,
                  mt: 1,
                  fontSize: 15,
                }}
              >
                Total Seats: <b>9</b>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                Price Range: N/A
              </Typography>
            </Box>
            {/* Notes Area */}
            <Box
              sx={{
                width: "100%",
                bgcolor: isDark ? "#232228" : "#fff",
                border: `1.5px solid ${borderColor}`,
                borderRadius: 3,
                p: { xs: 1.5, sm: 2.5 },
                mb: 2,
                minHeight: 120,
                boxShadow: isDark ? 2 : 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                alignItems: "center",
                mx: "auto",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: isDark ? "#fff" : textColor,
                  fontWeight: 700,
                  fontSize: 18,
                  mb: 1,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                Notes
              </Typography>
              <TextField
                multiline
                minRows={4}
                placeholder="Add your notes here..."
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: "transparent",
                    border: "none",
                    fontWeight: 500,
                    fontSize: 17,
                    px: 1,
                    py: 1.5,
                    color: isDark ? "#fff" : textColor,
                    textAlign: "center",
                  },
                  disableUnderline: true,
                }}
                variant="standard"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, sm: 4 },
            pb: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-end" },
            borderTop: { xs: "1px solid #e5e7eb", sm: "none" },
            width: "100%",
            background: "none",
            position: { xs: "fixed", sm: "static" },
            left: 0,
            bottom: 0,
            zIndex: 1301,
            bgcolor: { xs: isDark ? "#181818" : "#fff", sm: "transparent" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark ? "#fff" : "#23293a",
              fontWeight: 700,
              textAlign: { xs: "center", sm: "left" },
              mb: { xs: 2, sm: 0 },
              fontSize: 15,
            }}
          >
            Release Time: {formatDate(selectedEvent?.dateStr)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {removedEvents.includes(selectedEvent?.id) ? (
              <Button
                variant="contained"
                color="success"
                sx={{
                  borderRadius: 2,
                  fontWeight: 400,
                  px: 4,
                  py: 1.2,
                  fontSize: 16,
                  bgcolor: theme.palette.success.main,
                  color: "#fff",
                  boxShadow: 2,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    bgcolor: theme.palette.success.dark,
                  },
                }}
                onClick={() => setReaddConfirmOpen(true)}
              >
                Re-add Event
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 2,
                  fontWeight: 400,
                  px: 4,
                  py: 1.2,
                  fontSize: 16,
                  bgcolor: isDark ? "#b91c1c" : "#ef4444",
                  color: "#fff",
                  boxShadow: 2,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    bgcolor: isDark ? "#991b1b" : "#dc2626",
                  },
                }}
                onClick={() => setRemoveConfirmOpen(true)}
              >
                REMOVE
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#fff",
            color: "#181818",
            borderRadius: 3,
            boxShadow: 6,
            p: 2,
            minWidth: 220,
            maxWidth: 260,
          },
        }}
      >
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 16, mb: 1 }}
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          >
            Sort Options
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              color: theme.palette.mode === "dark" ? "#fff" : "#fff",
            }}
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
              borderRadius: 1,
              mb: 1,
              "& .MuiSelect-select": {
                color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                fontWeight: 600,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "& .MuiSvgIcon-root": { color: theme.palette.primary.main },
            }}
            SelectProps={{
              native: true,
              sx: { color: theme.palette.mode === "dark" ? "#fff" : "#fff" },
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                    color: "#000",
                  },
                },
                MenuListProps: {
                  sx: {
                    "& .MuiMenuItem-root": {
                      color: "#000",
                      bgcolor:
                        theme.palette.mode === "dark" ? "#232228" : "#fff",
                    },
                  },
                },
              },
            }}
            InputProps={{
              sx: { color: theme.palette.mode === "dark" ? "#fff" : "#fff" },
            }}
          >
            <option
              value="Ticket Quantity"
              style={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
            >
              Ticket Quantity
            </option>
            <option
              value="Price"
              style={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
            >
              Price
            </option>
            <option
              value="Date"
              style={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
            >
              Date
            </option>
          </TextField>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.tm}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, tm: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Ticketmaster / Live Nation"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.axs}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, axs: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="AXS"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.mlb}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, mlb: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="MLB"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.seatgeek}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, seatgeek: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="SeatGeek"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.evenue}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, evenue: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Evenue"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.stubhub}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, stubhub: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Stubhub"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.early}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, early: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Early Monitor"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.price}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, price: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Price Drops"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.onsale}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, onsale: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Onsale / Presale"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.artist}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, artist: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Artist Add"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.low}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, low: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Low Stock"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.remove}
                onChange={(e) =>
                  setFilterState((s) => ({ ...s, remove: e.target.checked }))
                }
                sx={{
                  color: theme.palette.mode === "light" ? "#0f172a" : "#fff",
                }}
              />
            }
            label="Remove Onsale / Presale"
            style={{
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          />
        </FormGroup>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
              fontWeight: 700,
              px: 4,
              py: 1,
              fontSize: 15,
              boxShadow: 1,
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
            onClick={() => setFilterAnchorEl(null)}
          >
            APPLY
          </Button>
        </Box>
      </Popover>
      {/* Remove Confirm Dialog */}
      <Dialog
        open={removeConfirmOpen}
        onClose={() => setRemoveConfirmOpen(false)}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
            pt: 3,
            pb: 1,
            bgcolor: isDark ? "#181818" : "#fff",
            color: isDark ? "#fff" : "#23293a",
          }}
        >
          Are you sure you want to remove this event?
        </DialogTitle>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
            bgcolor: isDark ? "#181818" : "#fff",
          }}
        >
          <Button
            onClick={() => setRemoveConfirmOpen(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              px: 3,
              py: 1,
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              mr: 2,
              boxShadow: 1,
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setRemovedEvents([...removedEvents, selectedEvent.id]);
              setRemoveConfirmOpen(false);
            }}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              py: 1,
              bgcolor: theme.palette.error.main,
              color: "#fff",
              boxShadow: 1,
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.error.dark },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {/* Re-add Confirm Dialog */}
      <Dialog
        open={readdConfirmOpen}
        onClose={() => setReaddConfirmOpen(false)}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
            pt: 3,
            pb: 1,
            bgcolor: isDark ? "#181818" : "#fff",
            color: isDark ? "#fff" : "#23293a",
          }}
        >
          Are you sure you want to re-add this event?
        </DialogTitle>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
            bgcolor: isDark ? "#181818" : "#fff",
          }}
        >
          <Button
            onClick={() => setReaddConfirmOpen(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              px: 3,
              py: 1,
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              mr: 2,
              boxShadow: 1,
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setRemovedEvents(
                removedEvents.filter((id) => id !== selectedEvent.id)
              );
              setReaddConfirmOpen(false);
            }}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              py: 1,
              bgcolor: theme.palette.success.main,
              color: "#fff",
              boxShadow: 1,
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.success.dark },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
