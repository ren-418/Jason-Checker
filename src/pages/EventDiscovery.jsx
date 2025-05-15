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
              <FilterListIcon sx={{ color: isDark ? "#aaa" : "#444", mr: 1 }} />
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
                bgcolor: isDark ? "#f3f4f6" : "#7a0a0a",
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
            borderRadius: 3,
            boxShadow: 8,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 24,
            pb: 1,
          }}
        >
          {selectedEvent?.name || ""}
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            pt: 1,
          }}
        >
          {/* Left: Event Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.mode === "light" ? "#23293a" : "white",
                }}
              >
                Date:
              </Typography>
              <Typography variant="body2">
                {formatDate(selectedEvent?.datetime) ||
                  formatDate(selectedEvent?.dateStr) ||
                  ""}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.mode === "light" ? "#23293a" : "white",
                  ml: 2,
                }}
              >
                Venue:
              </Typography>
              <Typography variant="body2">
                {selectedEvent?.venue || ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                style={{
                  color: theme.palette.mode === "light" ? "white" : "black",
                }}
                sx={{
                  borderRadius: 2,
                  fontWeight: "normal",
                  px: 3,
                  py: 0.5,
                  fontSize: 16,
                }}
              >
                Filters
              </Button>
              <IconButton
                sx={{
                  bgcolor: "#e5e7eb",
                  color: "#23293a",
                  borderRadius: 2,
                  ml: 1,
                  width: 40,
                  height: 40,
                }}
              >
                <VolumeUpIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Total Quantity: <b>5</b>
            </Typography>
            <Box sx={{ mb: 2 }}>
              {/* Show URL as clickable link, not input */}
              <Box
                sx={{
                  bgcolor: isDark ? "#232228" : "#f5f7fa",
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  minHeight: 48,
                }}
              >
                <a
                  href={selectedEvent?.url || "https://ticketmaster/0esfw234"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#2563eb",
                    fontWeight: 600,
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
            {/* Table */}
            <Box sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#23293a" }}>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Ticket Type
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Section
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Row
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Seats (Qty)
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Links
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Standard Admission</TableCell>
                    <TableCell>224</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>
                      1, 2, 3 <b>(3)</b>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "#0f172a"
                              : "white",
                          color:
                            theme.palette.mode === "light" ? "#fff" : "black",
                          borderRadius: 2,
                          fontWeight: "normal",
                          px: 2,
                          py: 0.5,
                          fontSize: 14,
                        }}
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Standard Admission</TableCell>
                    <TableCell>225</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>
                      11, 12 <b>(2)</b>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "#0f172a"
                              : "white",
                          color:
                            theme.palette.mode === "light" ? "#fff" : "black",
                          borderRadius: 2,
                          fontWeight: "normal",
                          px: 2,
                          py: 0.5,
                          fontSize: 14,
                        }}
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.mode === "light" ? "#7c3aed" : "white",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Jason Data
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === "light" ? "#23293a" : "white",
                mb: 1,
              }}
            >
              Get In: <b>$140</b> Average: <b>$336</b>
            </Typography>
          </Box>
          {/* Right: Stadium Image and Ticketmaster Data + Notes */}
          <Box
            sx={{
              minWidth: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              flex: 1,
            }}
          >
            <Box
              component="img"
              src={stadiumImages[0]}
              alt="venue map"
              sx={{
                width: 260,
                height: 180,
                objectFit: "contain",
                borderRadius: 2,
                mb: 1,
              }}
            />
            <Box
              sx={{
                width: "100%",
                bgcolor: "#f5f7fa",
                borderRadius: 2,
                p: 2,
                mb: 1,
              }}
            >
              <a
                href="#"
                style={{
                  color: "#2563eb",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "underline",
                }}
              >
                Ticketmaster Data
              </a>
              <Typography
                variant="body2"
                sx={{ color: "#23293a", fontWeight: 500, mt: 1 }}
              >
                Total Seats: <b>9</b>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#2563eb", fontWeight: 500 }}
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
                borderRadius: 2,
                p: 2.5,
                mb: 2,
                minHeight: 120,
                boxShadow: isDark ? 2 : 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: textColor,
                  fontWeight: 700,
                  fontSize: 18,
                  mb: 1,
                  letterSpacing: 0.2,
                  textAlign: "left",
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
                    color: textColor,
                  },
                  disableUnderline: true,
                }}
                variant="standard"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.mode === "light" ? "#23293a" : "white",
              fontWeight: 700,
            }}
          >
            Release Time: {formatDate(selectedEvent?.dateStr)}
          </Typography>
          {/* Two buttons: Disable and Remove */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              disabled
              sx={{
                borderRadius: 2,
                fontWeight: "normal",
                px: 4,
                py: 1,
                fontSize: 16,
                color: isDark ? "#aaa" : "#888",
                borderColor: isDark ? "#444" : "#bbb",
                bgcolor: isDark ? "#232228" : "#f3f4f6",
                "&.Mui-disabled": {
                  color: isDark ? "#555" : "#bbb",
                  borderColor: isDark ? "#333" : "#eee",
                  bgcolor: isDark ? "#232228" : "#f3f4f6",
                  opacity: 1,
                },
              }}
            >
              Disable
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                fontWeight: "normal",
                px: 4,
                py: 1,
                fontSize: 16,
                bgcolor: isDark ? "#b91c1c" : "#ef4444",
                color: "#fff",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: isDark ? "#991b1b" : "#dc2626",
                },
              }}
            >
              Remove
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
