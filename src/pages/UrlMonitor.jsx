import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect, useRef } from "react";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import urlsData from "../services/urls.json";
import stubhubIcon from "../assets/stubhub.svg";
import vividIcon from "../assets/vivid.jpg";
import TablePagination from "@mui/material/TablePagination";
import styles from "./UrlMonitor.module.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import DialogActions from "@mui/material/DialogActions";
import dayjs from "dayjs";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const urlsArray = Object.entries(urlsData); // [ [eventId, data], ... ]

export default function UrlMonitor() {
  const [search, setSearch] = useState("");
  const [urls, setUrls] = useState(urlsArray);
  const [checkedRows, setCheckedRows] = useState({});
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");
  const [artistList, setArtistList] = useState([
    { name: "Phish", id: "748766" },
    { name: "Dead & Company", id: "2150235" },
    { name: "Billy Joel", id: "735392" },
    { name: "Dave Matthews Band", id: "746531" },
    { name: "Sturgill Simpson", id: "1810482" },
    { name: "WWE", id: "807358" },
    { name: "WWE WrestleMania", id: "853853" },
    { name: "WWE Monday Night RAW", id: "858957" },
    { name: "Dancing with the Stars", id: "1086116" },
    { name: "Nine Inch Nails", id: "735762" },
    { name: "Weird Al Yankovic", id: "772893" },
    { name: "Seattle Seahawks", id: "806020" },
  ]);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [betaModalOpen, setBetaModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [notes, setNotes] = useState("");
  const [showToTop, setShowToTop] = useState(false);
  const topRef = useRef(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const onScroll = () => setShowToTop(window.scrollY > 200);
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

  const handleRemove = (id) => {
    setUrls((prev) => prev.filter(([eventId]) => eventId !== id));
  };

  const handleCheck = (eventId) => {
    setCheckedRows((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  // Search logic: filter by any column, case-insensitive
  const filteredUrls = urls.filter(([eventId, data]) => {
    const searchStr = search.toLowerCase();
    const fields = [
      eventId,
      data.priceRange,
      data.date,
      data.name,
      data.venue,
      data.site,
    ];
    return fields.some((field) =>
      (field ? String(field).toLowerCase() : "").includes(searchStr)
    );
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedUrls = [...filteredUrls].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const [idA, dataA] = a;
    const [idB, dataB] = b;
    let valA = dataA[sortConfig.key] || "";
    let valB = dataB[sortConfig.key] || "";
    if (sortConfig.key === "eventId") {
      valA = idA;
      valB = idB;
    }
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedUrls = sortedUrls.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Table columns for sorting
  const columns = [
    { key: "remove", label: "Remove", sortable: false },
    { key: "priceRange", label: "Price Range", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "venue", label: "Venue", sortable: true },
    { key: "stubhub", label: "Stubhub Link", sortable: false },
    { key: "vivid", label: "Vivid Link", sortable: false },
    { key: "eventId", label: "Event ID", sortable: true },
    { key: "earlyMonitor", label: "Early Monitor", sortable: false },
    { key: "filters", label: "Filters", sortable: false },
  ];

  const filteredArtists = artistList.filter(
    (artist) =>
      artist.name.toLowerCase().includes(artistSearch.toLowerCase()) ||
      artist.id.includes(artistSearch)
  );

  const handleRemoveArtist = (id) => {
    setArtistList((prev) => prev.filter((artist) => artist.id !== id));
  };

  return (
    <Box className={styles.container}>
      <div ref={topRef} />
      <Toolbar />
      <div
        className={styles.card}
        style={{
          background: theme.palette.mode === "dark" ? "#262626" : "#fff",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 16px 0 rgba(20,20,40,0.18)"
              : "0 2px 16px 0 rgba(0,0,0,0.10)",
          borderRadius: 14,
          border:
            theme.palette.mode === "dark"
              ? "1.5px solid #262626"
              : "1.5px solid #d1d5db",
          maxWidth: 900,
          width: "100%",
          margin: "32px auto 24px auto",
          padding: "24px 24px 18px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Add URLs Section */}
        <TextField
          label="Add URLs"
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          InputProps={{
            sx: {
              fontSize: 20,
              p: 2,
              color: theme.palette.text.primary,
              bgcolor: theme.palette.background.default,
            },
          }}
          InputLabelProps={{
            sx: { fontSize: 20, color: theme.palette.text.primary },
          }}
        />
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            sx={{
              background:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : "#eceef0",
              color: theme.palette.mode === "light" ? "#fff" : "#0f172a",
              borderRadius: 16,
              px: 5,
              py: 1.2,
              fontWeight: 500,
              fontSize: 18,
              textTransform: "none",
              boxShadow: 1,
              "&:hover": {
                background:
                  theme.palette.mode === "light" ? "#17213a" : "#f3f4f6",
                color: theme.palette.mode === "light" ? "#fff" : "#0f172a",
              },
            }}
          >
            Add URLs
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography
            sx={{ color: "success.main", fontWeight: 500, fontSize: 18 }}
          >
            +520 Artist URLs
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 18,
              color: theme.palette.text.primary,
            }}
          >
            Total: {filteredUrls.length} / 3500
          </Typography>
        </Box>
      </div>
      <Box textAlign="center" my={3}>
        <Button
          variant="contained"
          sx={{
            background: theme.palette.mode === "light" ? "#0f172a" : "#eceef0",
            color: theme.palette.mode === "light" ? "#fff" : "#0f172a",
            borderRadius: 16,
            px: 5,
            py: 1.2,
            fontWeight: 500,
            fontSize: 18,
            textTransform: "none",
            boxShadow: 1,
            "&:hover": {
              background:
                theme.palette.mode === "light" ? "#17213a" : "#f3f4f6",
              color: theme.palette.mode === "light" ? "#fff" : "#0f172a",
            },
            mr: 2,
          }}
          onClick={() => setArtistModalOpen(true)}
        >
          Artist Added Date Monitor
        </Button>
      </Box>
      <div
        className={styles.tableWrapper}
        style={{
          background: theme.palette.mode === "dark" ? "#262626" : "#fff",
          borderRadius: 18,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 32px 0 rgba(0,0,0,0.18)"
              : "0 4px 32px 0 rgba(0,0,0,0.12)",
          margin: "0 auto",
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table
          className={styles.table}
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            width: "100%",
            minWidth: 700,
            background: "none",
            borderRadius: 0,
          }}
        >
          <TableHead>
            <TableRow
              className={styles.theadRow}
              sx={{
                background:
                  theme.palette.mode === "dark" ? "#262626" : "#0f172a",
              }}
            >
              {columns
                .filter((col) => col.key !== "stubhub")
                .map((col, i) => (
                  <TableCell
                    key={col.key}
                    className={
                      i === 0
                        ? styles.thLeft + " " + styles.theadCell
                        : i === columns.length - 2 // -2 because we removed one column
                        ? styles.thRight + " " + styles.theadCell
                        : styles.theadCell
                    }
                    onClick={
                      col.sortable ? () => handleSort(col.key) : undefined
                    }
                    sx={{
                      cursor: col.sortable ? "pointer" : "default",
                      userSelect: "none",
                      color: "#ffffff",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {col.label}
                    {col.sortable &&
                      sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowDownwardIcon className={styles.theadSortIcon} />
                      ) : (
                        <ArrowUpwardIcon className={styles.theadSortIcon} />
                      ))}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUrls.map(([eventId, data], idx) => {
              const hasPresales =
                Array.isArray(data.presales) && data.presales.length > 0;
              const isTicketmaster = data.site === "ticketmaster";
              const showVivid = !isTicketmaster;
              const isChecked = checkedRows[eventId];
              return (
                <TableRow
                  key={eventId}
                  sx={{
                    background:
                      idx % 2 === 0
                        ? theme.palette.background.paper
                        : theme.palette.action.hover,
                    transition: "background 0.18s",
                  }}
                >
                  {/* Remove */}
                  <TableCell className={styles.td}>
                    <IconButton
                      onClick={() => handleRemove(eventId)}
                      sx={{
                        color: theme.palette.error.main,
                        p: 0.5,
                        "&:hover": {
                          background: theme.palette.action.hover,
                          color:
                            theme.palette.mode === "dark"
                              ? "#ff5252"
                              : theme.palette.error.dark,
                        },
                      }}
                    >
                      <DeleteIcon sx={{ color: "inherit" }} />
                    </IconButton>
                  </TableCell>
                  {/* Price Range */}
                  <TableCell className={styles.td}>{data.priceRange}</TableCell>
                  {/* Date */}
                  <TableCell
                    className={styles.td}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {data.date}
                  </TableCell>
                  {/* Name */}
                  <TableCell
                    className={styles.td}
                    style={{
                      color: idx === 0 ? theme.palette.primary.main : undefined,
                    }}
                  >
                    {data.name}
                  </TableCell>
                  {/* Venue */}
                  <TableCell className={styles.td}>{data.venue}</TableCell>
                  {/* Vivid Link */}
                  <TableCell className={styles.td} align="center">
                    {showVivid && (
                      <img
                        src={vividIcon}
                        alt="Vivid"
                        className={styles.imgMarketplace}
                        style={{ margin: 0 }}
                      />
                    )}
                  </TableCell>
                  {/* Event ID */}
                  <TableCell
                    className={styles.td}
                    sx={{ whiteSpace: "nowrap", textAlign: "center" }}
                  >
                    <a
                      href="#"
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                        textDecoration: "none",
                        fontWeight: 500,
                        wordBreak: "break-all",
                      }}
                    >
                      {eventId}
                    </a>
                  </TableCell>
                  {/* Early Monitor */}
                  <TableCell className={styles.td} align="center">
                    <Checkbox
                      checked={!!checkedRows[eventId]}
                      onChange={() => handleCheck(eventId)}
                    />
                  </TableCell>
                  {/* Filters Button */}
                  <TableCell className={styles.td} align="center">
                    <Button
                      variant="contained"
                      className={styles.filtersBtn}
                      sx={{
                        background:
                          theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : "#fff",
                        color:
                          theme.palette.mode === "light" ? "#fff" : "#0f172a",
                        borderRadius: 12,
                        boxShadow: 1,
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        minWidth: 90,
                        "&:hover": {
                          background:
                            theme.palette.mode === "light"
                              ? theme.palette.primary.dark
                              : "#f3f4f6",
                          color:
                            theme.palette.mode === "light" ? "#fff" : "#0f172a",
                        },
                        transition: "background 0.18s, color 0.18s",
                      }}
                      onClick={() => {
                        setSelectedRow({ eventId, ...data });
                        setDetailModalOpen(true);
                      }}
                    >
                      Filters
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[50, 100, 200]}
          component="div"
          count={filteredUrls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "2px solid #00bcd4",
            background: "transparent",
            color: theme.palette.text.primary,
            ".MuiTablePagination-toolbar": {
              justifyContent: "flex-end",
              px: 2,
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              { fontWeight: 500 },
            ".MuiTablePagination-actions": {
              color: theme.palette.text.primary,
            },
          }}
        />
      </div>
      <Dialog
        open={artistModalOpen}
        onClose={() => setArtistModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.palette.background.default,
            borderRadius: 3,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 500,
            color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default,
          }}
        >
          Artist Added Date Monitor
          <IconButton
            aria-label="close"
            onClick={() => setArtistModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.text.primary,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: theme.palette.background.default }}>
          <TextField
            variant="outlined"
            placeholder="Search or paste URL"
            fullWidth
            value={artistSearch}
            onChange={(e) => setArtistSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: theme.palette.text.primary }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: 18,
                borderRadius: 2,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                mb: 2,
              },
            }}
            InputLabelProps={{ style: { color: theme.palette.text.primary } }}
          />
          <Box
            sx={{
              mt: 2,
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table
              sx={{ minWidth: 500, bgcolor: theme.palette.background.default }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color:
                        theme.palette.mode === "light" ? "#fff" : "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color:
                        theme.palette.mode === "light" ? "#fff" : "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    Artist ID
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color:
                        theme.palette.mode === "light" ? "#fff" : "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArtists.map((artist, idx) => (
                  <TableRow
                    key={artist.id}
                    sx={{ bgcolor: theme.palette.background.paper }}
                  >
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                      }}
                    >
                      {artist.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href="#"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        {artist.id}
                      </a>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRemoveArtist(artist.id)}
                        sx={{
                          color: theme.palette.error.main,
                          p: 0.5,
                          "&:hover": {
                            background: theme.palette.action.hover,
                            color:
                              theme.palette.mode === "dark"
                                ? "#ff5252"
                                : theme.palette.error.dark,
                          },
                        }}
                      >
                        <DeleteIcon sx={{ color: "inherit" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          className: styles.filterModal,
          sx: { p: 0, borderRadius: 4, minWidth: 1200, maxWidth: 1600 },
        }}
      >
        <div className={styles.filterModalHeader}>
          <div className={styles.filterModalHeaderLeft}>
            <button className={styles.filterModalHeaderButton}>
              EVENT LOGS
            </button>
            <button className={styles.filterModalHeaderButton}>
              TEMPLATES
            </button>
            <button className={styles.filterModalHeaderButton}>
              EVENT MANAGER
            </button>
          </div>
          <button
            className={styles.filterModalCloseBtn}
            onClick={() => setFiltersModalOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </button>
        </div>
        <div className={styles.filterModalContent}>
          <div className={styles.filterModalLeft}>
            {/* Filter Row */}
            <div className={styles.filterModalFilterRow}>
              <div className={styles.filterModalFilterCol}>
                <label className={styles.filterModalFilterLabel}>
                  Sections
                </label>
                <select className={styles.filterModalSelect}>
                  <option className={styles.filterModalOption}>
                    CENTER, LAWN
                  </option>
                </select>
              </div>
              <div className={styles.filterModalFilterCol}>
                <label className={styles.filterModalFilterLabel}>Rows</label>
                <select className={styles.filterModalSelect}>
                  <option className={styles.filterModalOption}>Rows</option>
                </select>
              </div>
              <div className={styles.filterModalFilterCol}>
                <label className={styles.filterModalFilterLabel}>
                  Price Range
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className={styles.filterModalInput} placeholder="$0" />
                  <span
                    style={{
                      alignSelf: "center",
                      fontWeight: 700,
                      color: "#232323",
                    }}
                  >
                    -
                  </span>
                  <input className={styles.filterModalInput} placeholder="$" />
                </div>
              </div>
              <div className={styles.filterModalFilterCol}>
                <label className={styles.filterModalFilterLabel}>
                  Min. Seats
                </label>
                <select className={styles.filterModalSelect}>
                  <option className={styles.filterModalOption}>2+</option>
                </select>
              </div>
              <div className={styles.filterModalFilterCol}>
                <label className={styles.filterModalFilterLabel}>
                  Excluded Ticket Types
                </label>
                <select className={styles.filterModalSelect}>
                  <option className={styles.filterModalOption}>
                    Verified Resale, ...
                  </option>
                </select>
              </div>
              <button className={styles.filterModalAddFilterBtn}>
                Add Filter
              </button>
            </div>
            {/* Notes & Extra Filter Options */}
            <div className={styles.filterModalMainRow}>
              <div className={styles.filterModalNotes}>
                <textarea
                  className={styles.filterModalTextarea}
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className={styles.filterModalExtraOptions}>
                <div className={styles.filterModalSectionLabel}>
                  Extra Filter Options
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1 }}>
                    <label className={styles.filterModalFilterLabel}>
                      Sections
                    </label>
                    <select className={styles.filterModalSelect}>
                      <option className={styles.filterModalOption}>
                        Sections
                      </option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className={styles.filterModalFilterLabel}>
                      Rows
                    </label>
                    <select className={styles.filterModalSelect}>
                      <option className={styles.filterModalOption}>Rows</option>
                    </select>
                  </div>
                </div>
                <button className={styles.filterModalAddFilterBtn}>
                  Add Filter
                </button>
              </div>
            </div>
            {/* Section Types */}
            <div className={styles.filterModalSection}>
              <div className={styles.filterModalSectionLabel}>
                Section Types
              </div>
              <div className={styles.filterModalSectionTypes}>
                {["ADA", "CENTER", "LAWN", "LEFT", "PIT", "RIGHT"].map(
                  (type) => (
                    <button
                      key={type}
                      className={styles.filterModalSectionTypeBtn}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Right: Seat Map */}
          <div className={styles.filterModalRight}>
            <div className={styles.filterModalZoomControls}>
              <button className={styles.filterModalZoomBtn}>
                <ZoomInIcon fontSize="inherit" />
              </button>
              <button className={styles.filterModalZoomBtn}>
                <ZoomOutIcon fontSize="inherit" />
              </button>
            </div>
            <div className={styles.filterModalSeatMap}>SEAT MAP</div>
          </div>
        </div>
        <button className={styles.filterModalSubmitBtn}>Submit</button>
      </Dialog>
      <Dialog
        open={betaModalOpen}
        onClose={() => setBetaModalOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            background: theme.palette.background.paper,
            borderRadius: 3,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 400,
          }}
        >
          <Typography variant="h6" align="center" fontWeight={500} mb={2}>
            This Product is in Beta
          </Typography>
          <Typography align="center" mb={3}>
            Thank you for trying our beta product. Please acknowledge that you
            understand this and sign ups for the product will be available soon.
            Please Provide feedback.
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "#fff",
              color: "#0f172a",
              borderRadius: 2,
              fontWeight: 500,
              px: 4,
              py: 1,
              fontSize: 16,
              boxShadow: 1,
              "&:hover": {
                background: "#f3f4f6",
                color: "#0f172a",
              },
            }}
            onClick={() => setBetaModalOpen(false)}
          >
            ACKNOWLEDGE
          </Button>
        </DialogContent>
      </Dialog>
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
              bgcolor: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              color: theme.palette.mode === "dark" ? "#0f172a" : "#fff",
              boxShadow: 3,
              borderRadius: 2,
              width: 56,
              height: 56,
              "&:hover": {
                bgcolor: theme.palette.mode === "dark" ? "#f3f4f6" : "#7a0a0a",
                color: theme.palette.mode === "dark" ? "#0f172a" : "#fff",
              },
              fontSize: 32,
              fontWeight: "normal",
            }}
          >
            <KeyboardArrowUpIcon sx={{ fontSize: 36 }} />
          </IconButton>
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              color: theme.palette.mode === "dark" ? "#0f172a" : "#fff",
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
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#fff",
            borderRadius: 4,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
            minWidth: { xs: "100vw", sm: 600, md: 900 },
            maxWidth: 1600,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: { xs: 20, sm: 24 },
            pb: 1,
            gap: 2,
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#f5f7fa",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 20 } }}
            >
              {selectedRow?.name || ""}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
            >
              <b>Date:</b> {selectedRow?.date || ""} &nbsp; <b>Venue:</b>{" "}
              {selectedRow?.venue || ""}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
            >
              <b>Price Range:</b> {selectedRow?.priceRange || "N/A"}
            </Typography>
          </Box>
          <IconButton onClick={() => setDetailModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            pt: 2,
            pb: 2,
            px: { xs: 1, sm: 3 },
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#fff",
          }}
        >
          {/* Left: Filters and Notes */}
          <Box sx={{ flex: 1, minWidth: 0, mb: { xs: 3, md: 0 } }}>
            {/* Filter Controls */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#f5f7fa",
                borderRadius: 2,
                p: 2,
                boxShadow: theme.palette.mode === "dark" ? 2 : 1,
              }}
            >
              <TextField
                select
                label="Sections"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 120,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <option>Sections</option>
              </TextField>
              <TextField
                select
                label="Rows"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 100,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <option>Rows</option>
              </TextField>
              <TextField
                label="Price Min"
                type="number"
                sx={{
                  minWidth: 80,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              />
              <TextField
                label="Price Max"
                type="number"
                sx={{
                  minWidth: 80,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              />
              <TextField
                select
                label="Min. Seats"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 90,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <option>2+</option>
              </TextField>
              <TextField
                select
                label="Ticket Types"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 130,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <option>Ticket Types</option>
              </TextField>
            </Box>
            {/* Notes */}
            <Box
              sx={{
                mt: 2,
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#f5f7fa",
                border: `1.5px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                minHeight: 120,
                boxShadow: theme.palette.mode === "dark" ? 2 : 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.primary,
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
                    color: theme.palette.text.primary,
                  },
                  disableUnderline: true,
                }}
                variant="standard"
              />
            </Box>
          </Box>
          {/* Right: Seat Map and Section Types */}
          <Box
            sx={{
              minWidth: { xs: 0, md: 320 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Seat Map Placeholder */}
            <Box
              sx={{
                width: "100%",
                minHeight: 220,
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#f5f7fa",
                borderRadius: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.palette.mode === "dark" ? 2 : 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.secondary }}
              >
                SEAT MAP
              </Typography>
            </Box>
            {/* Section Types */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Section Types
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {["ADA", "CENTER", "LAWN", "LEFT", "PIT", "RIGHT"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="contained"
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark" ? "#6366f1" : "#6366f1",
                        color: "#fff",
                        borderRadius: 2,
                        fontWeight: 500,
                        px: 2,
                        py: 0.5,
                        fontSize: 14,
                        minWidth: 60,
                        textTransform: "none",
                        boxShadow: 1,
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "#4338ca"
                              : "#4338ca",
                        },
                      }}
                    >
                      {type}
                    </Button>
                  )
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", px: 4, pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 4,
              py: 1,
              fontSize: 16,
              bgcolor: theme.palette.mode === "dark" ? "#b91c1c" : "#ef4444",
              color: "#fff",
              boxShadow: 2,
              "&:hover": {
                bgcolor: theme.palette.mode === "dark" ? "#991b1b" : "#dc2626",
              },
            }}
            onClick={() => setDetailModalOpen(false)}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
