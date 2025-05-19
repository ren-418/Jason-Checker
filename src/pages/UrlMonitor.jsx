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
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
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
  const [eventManagerModalOpen, setEventManagerModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null });
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([
    "Benjamin",
    "Certification",
    "C#, Python, Software, Software Engnnier, React, CSS",
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [eventLogsModalOpen, setEventLogsModalOpen] = useState(false);
  const eventLogs = [
    {
      timestamp: "5/15/2025, 4:09:19 PM",
      event: "URL_Addition",
      user: "mini@richtooth.com",
    },
  ];
  // Add filterRows state and handlers at the top level of the component
  const [filterRows, setFilterRows] = useState([
    { section: "Sections", row: "Rows", priceMin: "", priceMax: "", minSeats: "2+", ticketType: "Special Offers, ..." },
  ]);
  const handleAddRow = () => {
    setFilterRows([...filterRows, { section: "Sections", row: "Rows", priceMin: "", priceMax: "", minSeats: "2+", ticketType: "Special Offers, ..." }]);
  };
  const handleRemoveRow = (idx) => {
    setFilterRows(filterRows.filter((_, i) => i !== idx));
  };
  const handleRowChange = (idx, key, value) => {
    setFilterRows(filterRows.map((row, i) => i === idx ? { ...row, [key]: value } : row));
  };

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
    { key: "ACO", label: "ACO", sortable: false },
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
      {/* Search Input */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          variant="outlined"
          fullWidth
          sx={{
            maxWidth: 500,
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: 1,
            input: {
              fontSize: 18,
              p: '12px 16px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: 18,
              p: 0,
            },
          }}
          InputProps={{
            sx: {
              borderRadius: 3,
              fontSize: 18,
              height: '44px',
              p: 0,
              color: theme.palette.text.primary,
            },
          }}
        />
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
            minWidth: 900,
            background: "none",
            borderRadius: 0,
            tableLayout: 'fixed',
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
                      width:
                        col.key === 'remove' ? 60 :
                        col.key === 'priceRange' ? 120 :
                        col.key === 'date' ? 120 :
                        col.key === 'name' ? 180 :
                        col.key === 'venue' ? 140 :
                        col.key === 'vivid' ? 60 :
                        col.key === 'eventId' ? 120 :
                        col.key === 'ACO' ? 80 :
                        col.key === 'filters' ? 120 :
                        undefined,
                      minWidth:
                        col.key === 'remove' ? 60 :
                        col.key === 'priceRange' ? 120 :
                        col.key === 'date' ? 120 :
                        col.key === 'name' ? 180 :
                        col.key === 'venue' ? 140 :
                        col.key === 'vivid' ? 60 :
                        col.key === 'eventId' ? 120 :
                        col.key === 'ACO' ? 80 :
                        col.key === 'filters' ? 120 :
                        undefined,
                      maxWidth:
                        col.key === 'remove' ? 60 :
                        col.key === 'priceRange' ? 120 :
                        col.key === 'date' ? 120 :
                        col.key === 'name' ? 180 :
                        col.key === 'venue' ? 140 :
                        col.key === 'vivid' ? 60 :
                        col.key === 'eventId' ? 120 :
                        col.key === 'ACO' ? 80 :
                        col.key === 'filters' ? 120 :
                        undefined,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
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
                  <TableCell className={styles.td} sx={{ width: 60, minWidth: 60, maxWidth: 60, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <IconButton
                      onClick={() => setDeleteTarget({ type: 'event', id: eventId }) || setDeleteConfirmOpen(true)}
                      sx={{ color: theme.palette.error.main, p: 0.5, '&:hover': { bgcolor: theme.palette.action.hover, color: theme.palette.error.dark } }}
                    >
                      <DeleteIcon sx={{ color: 'inherit' }} />
                    </IconButton>
                  </TableCell>
                  {/* Price Range */}
                  <TableCell className={styles.td} sx={{ width: 120, minWidth: 120, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.priceRange}</TableCell>
                  {/* Date */}
                  <TableCell className={styles.td} sx={{ width: 120, minWidth: 120, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {data.date}
                  </TableCell>
                  {/* Name */}
                  <TableCell className={styles.td} sx={{ width: 180, minWidth: 180, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: idx === 0 ? theme.palette.primary.main : undefined }}>
                    {data.name}
                  </TableCell>
                  {/* Venue */}
                  <TableCell className={styles.td} sx={{ width: 140, minWidth: 140, maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.venue}</TableCell>
                  {/* Vivid Link */}
                  <TableCell className={styles.td} align="center" sx={{ width: 60, minWidth: 60, maxWidth: 60, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  <TableCell className={styles.td} sx={{ width: 120, minWidth: 120, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
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
                  <TableCell className={styles.td} align="center" sx={{ width: 80, minWidth: 80, maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Checkbox
                      checked={!!checkedRows[eventId]}
                      onChange={() => handleCheck(eventId)}
                    />
                  </TableCell>
                  {/* Filters Button */}
                  <TableCell className={styles.td} align="center" sx={{ width: 100, minWidth: 100, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                        fontWeight: 400,
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
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            background: theme.palette.background.default,
            borderRadius: { xs: 0, sm: 3 },
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
            width: "100%",
            minHeight: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            m: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 500,
            color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
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
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: theme.palette.background.default,
            minHeight: { xs: "calc(100vh - 56px)", sm: "auto" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
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
              overflowX: "auto",
              overflowY: "auto",
              width: "100%",
              maxWidth: "100%",
              maxHeight: { xs: "55vh", sm: 400 },
              boxShadow: 1,
              "::-webkit-scrollbar": {
                height: 8,
                width: 8,
                background:
                  theme.palette.mode === "dark" ? "#232228" : "#e0e0e0",
                borderRadius: 8,
              },
              "::-webkit-scrollbar-thumb": {
                background: theme.palette.mode === "dark" ? "#444" : "#bdbdbd",
                borderRadius: 8,
              },
              scrollbarColor: `${
                theme.palette.mode === "dark" ? "#444" : "#bdbdbd"
              } ${theme.palette.mode === "dark" ? "#232228" : "#e0e0e0"}`,
              scrollbarWidth: "thin",
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
                        onClick={() => setDeleteTarget({ type: 'artist', id: artist.id }) || setDeleteConfirmOpen(true)}
                        sx={{ color: theme.palette.error.main, p: 0.5, '&:hover': { bgcolor: theme.palette.action.hover, color: theme.palette.error.dark } }}
                      >
                        <DeleteIcon sx={{ color: 'inherit' }} />
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
          sx: {
            p: 0,
            borderRadius: 4,
            minWidth: 1200,
            maxWidth: 1600,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#f5f7fa",
          },
        }}
      >
        <div
          className={styles.filterModalHeader}
          style={{
            background: theme.palette.primary.main,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: 3,
                boxShadow: 1,
                textTransform: "none",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              EVENT LOGS
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: 3,
                boxShadow: 1,
                textTransform: "none",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              TEMPLATES
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: 3,
                boxShadow: 1,
                textTransform: "none",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              EVENT MANAGER
            </Button>
          </div>
          <IconButton
            onClick={() => setFiltersModalOpen(false)}
            sx={{ color: "#fff", ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div
          className={styles.filterModalContent}
          style={{
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#f5f7fa",
            padding: 24,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <div
            className={styles.filterModalLeft}
            style={{ flex: 2, marginRight: 24 }}
          >
            {/* Filter Row */}
            <div
              className={styles.filterModalFilterRow}
              style={{ display: "flex", gap: 16, marginBottom: 24 }}
            >
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
            <div
              className={styles.filterModalMainRow}
              style={{ display: "flex", gap: 24 }}
            >
              <div
                className={styles.filterModalNotes}
                style={{
                  flex: 1,
                  background: theme.palette.background.paper,
                  borderRadius: 8,
                  boxShadow: theme.palette.mode === "dark" ? 2 : 1,
                  padding: 16,
                  border: `1.5px solid ${theme.palette.divider}`,
                }}
              >
                <textarea
                  className={styles.filterModalTextarea}
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 120,
                    border: "none",
                    background: "transparent",
                    color: theme.palette.text.primary,
                    fontSize: 16,
                    fontWeight: 400,
                    outline: "none",
                  }}
                />
              </div>
              <div
                className={styles.filterModalExtraOptions}
                style={{
                  flex: 1,
                  background: theme.palette.background.paper,
                  borderRadius: 8,
                  boxShadow: theme.palette.mode === "dark" ? 2 : 1,
                  padding: 16,
                  border: `1.5px solid ${theme.palette.divider}`,
                }}
              >
                <div
                  className={styles.filterModalSectionLabel}
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 12,
                    color: theme.palette.text.primary,
                  }}
                >
                  Extra Filter Options
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1 }}>
                    <label className={styles.filterModalFilterLabel}>
                      Sections
                    </label>
                    <select
                      className={styles.filterModalSelect}
                      style={{
                        width: "100%",
                        borderRadius: 4,
                        padding: 8,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <option className={styles.filterModalOption}>
                        Sections
                      </option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className={styles.filterModalFilterLabel}>
                      Rows
                    </label>
                    <select
                      className={styles.filterModalSelect}
                      style={{
                        width: "100%",
                        borderRadius: 4,
                        padding: 8,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <option className={styles.filterModalOption}>Rows</option>
                    </select>
                  </div>
                </div>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 400,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 1,
                    textTransform: "none",
                    "&:hover": { bgcolor: theme.palette.primary.dark },
                  }}
                >
                  Add Filter
                </Button>
              </div>
            </div>
            {/* Section Types */}
            <div
              className={styles.filterModalSection}
              style={{ marginTop: 24 }}
            >
              <div
                className={styles.filterModalSectionLabel}
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.palette.text.primary,
                }}
              >
                Section Types
              </div>
              <div
                className={styles.filterModalSectionTypes}
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {["ADA", "CENTER", "LAWN", "LEFT", "PIT", "RIGHT"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="contained"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 400,
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontSize: 14,
                        minWidth: 60,
                        textTransform: "none",
                        boxShadow: 1,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      {type}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Right: Seat Map */}
          <div
            className={styles.filterModalRight}
            style={{
              flex: 1,
              background: theme.palette.background.paper,
              borderRadius: 8,
              boxShadow: theme.palette.mode === "dark" ? 2 : 1,
              padding: 16,
              border: `1.5px solid ${theme.palette.divider}`,
            }}
          >
            <div
              className={styles.filterModalZoomControls}
              style={{ display: "flex", gap: 8, marginBottom: 16 }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 400,
                  borderRadius: 2,
                  minWidth: 40,
                  minHeight: 40,
                  boxShadow: 1,
                  textTransform: "none",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                <ZoomInIcon fontSize="inherit" />
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 400,
                  borderRadius: 2,
                  minWidth: 40,
                  minHeight: 40,
                  boxShadow: 1,
                  textTransform: "none",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                <ZoomOutIcon fontSize="inherit" />
              </Button>
            </div>
            <div
              className={styles.filterModalSeatMap}
              style={{
                width: "100%",
                minHeight: 220,
                background: theme.palette.background.default,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: 18,
              }}
            >
              SEAT MAP
            </div>
          </div>
        </div>
        <Button
          className={styles.filterModalSubmitBtn}
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 400,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            fontSize: 16,
            boxShadow: 1,
            textTransform: "none",
            margin: "24px auto 0 auto",
            display: "block",
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          Submit
        </Button>
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
                bgcolor: theme.palette.mode === "dark" ? "#f3f4f6" : "#0f172a",
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
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#f5f7fa",
            borderRadius: { xs: 0, sm: 4 },
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
            width: "100%",
            minHeight: { xs: "100vh", sm: "auto" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            m: 0,
          },
        }}
      >
        {/* Modal Header with Event Logs, Templates, Event Manager */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
            bgcolor:
              theme.palette.mode === "dark"
                ? "#181818"
                : theme.palette.primary.main,
            borderTopLeftRadius: { xs: 0, sm: 4 },
            borderTopRightRadius: { xs: 0, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              size={
                typeof window !== "undefined" && window.innerWidth < 600
                  ? "small"
                  : "medium"
              }
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1.2 },
                fontSize: { xs: 13, sm: 16 },
                minWidth: { xs: 80, sm: 120 },
                boxShadow: 1,
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#f3f4f6"
                      : theme.palette.primary.dark,
                  color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                },
              }}
              onClick={() => setEventLogsModalOpen(true)}
            >
              EVENT LOGS
            </Button>
            <Button
              variant="contained"
              size={
                typeof window !== "undefined" && window.innerWidth < 600
                  ? "small"
                  : "medium"
              }
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1.2 },
                fontSize: { xs: 13, sm: 16 },
                minWidth: { xs: 80, sm: 120 },
                boxShadow: 1,
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#f3f4f6"
                      : theme.palette.primary.dark,
                  color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                },
              }}
              onClick={() => setTemplateModalOpen(true)}
            >
              TEMPLATES
            </Button>
            <Button
              variant="contained"
              size={
                typeof window !== "undefined" && window.innerWidth < 600
                  ? "small"
                  : "medium"
              }
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                fontWeight: 400,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1.2 },
                fontSize: { xs: 13, sm: 16 },
                minWidth: { xs: 80, sm: 120 },
                boxShadow: 1,
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "#f3f4f6"
                      : theme.palette.primary.dark,
                  color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                },
              }}
              onClick={() => setEventManagerModalOpen(true)}
            >
              EVENT MANAGER
            </Button>
          </Box>
          <IconButton
            onClick={() => setDetailModalOpen(false)}
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#fff",
              ml: 2,
              alignSelf: { xs: "flex-end", sm: "center" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Event Info Row */}
        <Box
          sx={{
            px: { xs: 2, sm: 4 },
            pt: 2,
            pb: 1,
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#f5f7fa",
            borderBottom: `1.5px solid ${
              theme.palette.mode === "dark" ? "#333" : theme.palette.divider
            }`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.text.primary,
            }}
          >
            {selectedRow?.name || ""}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.text.secondary,
              mb: 0.5,
            }}
          >
            <b>Date:</b> {selectedRow?.date || ""} &nbsp; <b>Venue:</b>{" "}
            {selectedRow?.venue || ""}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.text.secondary,
            }}
          >
            <b>Price Range:</b> {selectedRow?.priceRange || "N/A"}
          </Typography>
        </Box>
        {/* Main Content Grid */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            px: { xs: 2, sm: 4 },
            py: { xs: 2, sm: 3 },
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#f5f7fa",
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          {/* Left: Filters, Notes, Extra Filter Options */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: { xs: "100%", sm: "auto" },
              alignItems: { xs: "center", sm: "stretch" },
            }}
          >
            {/* Filter Row */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                borderRadius: 2,
                boxShadow: 1,
                p: 2,
                mb: 1,
                border: `1.5px solid ${
                  theme.palette.mode === "dark" ? "#333" : theme.palette.divider
                }`,
                width: { xs: "100%", sm: "auto" },
                alignItems: { xs: "center", sm: "flex-start" },
              }}
            >
              <TextField
                select
                label="Sections"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 120,
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 120 },
                  mb: { xs: 1, sm: 0 },
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
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 100 },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                <option>Rows</option>
              </TextField>
              <TextField
                label="Price Min"
                type="number"
                sx={{
                  minWidth: 100,
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 100 },
                  mb: { xs: 1, sm: 0 },
                }}
              />
              <TextField
                label="Price Max"
                type="number"
                sx={{
                  minWidth: 100,
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 100 },
                  mb: { xs: 1, sm: 0 },
                }}
              />
              <TextField
                select
                label="Min. Seats"
                SelectProps={{ native: true }}
                sx={{
                  minWidth: 90,
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 90 },
                  mb: { xs: 1, sm: 0 },
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
                  bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.primary,
                  },
                  width: { xs: "100%", sm: 130 },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                <option>Ticket Types</option>
              </TextField>
            </Box>
            {/* Notes */}
            <Box
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                border: `1.5px solid ${
                  theme.palette.mode === "dark" ? "#333" : theme.palette.divider
                }`,
                borderRadius: 2,
                p: 2,
                minHeight: 120,
                boxShadow: 1,
                mb: 1,
                width: { xs: "100%", sm: "auto" },
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
                    fontWeight: 400,
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
            {/* Extra Filter Options */}
            <Box
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                border: `1.5px solid ${
                  theme.palette.mode === "dark" ? "#333" : theme.palette.divider
                }`,
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Extra Filter Options
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                }}
              >
                <TextField
                  select
                  label="Sections"
                  SelectProps={{ native: true }}
                  sx={{
                    minWidth: 120,
                    bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                    borderRadius: 1,
                    color: theme.palette.text.primary,
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.primary,
                    },
                    width: { xs: "100%", sm: 120 },
                    mb: { xs: 1, sm: 0 },
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
                    bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                    borderRadius: 1,
                    color: theme.palette.text.primary,
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.primary,
                    },
                    width: { xs: "100%", sm: 100 },
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <option>Rows</option>
                </TextField>
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 400,
                  borderRadius: 2,
                  px: 3,
                  boxShadow: 1,
                  textTransform: "none",
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Add Filter
              </Button>
            </Box>
          </Box>
          {/* Right: Seat Map and Section Types */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 3, sm: 0 },
            }}
          >
            {/* Seat Map Placeholder */}
            <Box
              sx={{
                width: "100%",
                minHeight: 180,
                bgcolor: theme.palette.mode === "dark" ? "#232228" : "#fff",
                borderRadius: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 1,
                border: `1.5px solid ${
                  theme.palette.mode === "dark" ? "#333" : theme.palette.divider
                }`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary }}
              >
                SEAT MAP
              </Typography>
            </Box>
            {/* Section Types */}
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Section Types
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  width: "100%",
                }}
              >
                {["ADA", "CENTER", "LAWN", "LEFT", "PIT", "RIGHT"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="contained"
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "#fff"
                            : theme.palette.primary.main,
                        color:
                          theme.palette.mode === "dark" ? "#181818" : "#fff",
                        fontWeight: 400,
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        fontSize: 14,
                        minWidth: 60,
                        textTransform: "none",
                        boxShadow: 1,
                        width: { xs: "48%", sm: "auto" },
                        mb: { xs: 1, sm: 0 },
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "#f3f4f6"
                              : theme.palette.primary.dark,
                          color:
                            theme.palette.mode === "dark" ? "#181818" : "#fff",
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
        </Box>
        <DialogActions
          sx={{
            justifyContent: { xs: "center", sm: "flex-end" },
            px: { xs: 2, sm: 4 },
            pb: 2,
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#f5f7fa",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 400,
              px: 4,
              py: 1,
              fontSize: 16,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.primary.main,
              color: theme.palette.mode === "dark" ? "#181818" : "#fff",
              boxShadow: 2,
              textTransform: "none",
              '&:hover': {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#f3f4f6"
                    : theme.palette.primary.dark,
                color: theme.palette.mode === "dark" ? "#181818" : "#fff",
              },
            }}
            onClick={() => setDetailModalOpen(false)}
          >
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={eventManagerModalOpen}
        onClose={() => setEventManagerModalOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            borderRadius: 4,
            boxShadow: 8,
            p: 0,
            width: { xs: "90vw", sm: 900 },
            maxWidth: { xs: 420, sm: 900 },
            minWidth: { xs: 320, sm: 600 },
            height: "auto",
            maxHeight: { xs: "90vh", sm: "90vh" },
            m: { xs: "auto", sm: 0 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 0.2,
            px: { xs: 2, sm: 4 },
            pt: '15px',
            pb: { xs: 1, sm: 2 },
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Codes & DID ID Manager
          </span>
          <IconButton
            onClick={() => setEventManagerModalOpen(false)}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 8,
            pb: 3,
            px: { xs: 2, sm: 4 },
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            minHeight: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                flex: 1,
              }}
            >
              <TextField
                placeholder="Enter codes, one per line"
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  mb: 0,
                  fontSize: 14,
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: 14, py: 1 },
                }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                  fontWeight: 400,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: 14,
                  minWidth: 80,
                  textTransform: "none",
                  boxShadow: 1,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                ADD CODE
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                flex: 1,
                mt: { xs: 2, sm: 0 },
              }}
            >
              <TextField
                placeholder="Enter URL with DID ID"
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  mb: 0,
                  fontSize: 14,
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: 14, py: 1 },
                }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === "dark" ? "#181818" : "#fff",
                  fontWeight: 400,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontSize: 14,
                  minWidth: 80,
                  textTransform: "none",
                  boxShadow: 1,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                ADD DID ID
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, textAlign: 'center', pt: 3, pb: 1 }}>
          Are you sure you want to delete this {deleteTarget.type}?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              px: 3,
              py: 1,
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              mr: 2,
              boxShadow: 1,
              textTransform: 'none',
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteTarget.type === 'event') handleRemove(deleteTarget.id);
              if (deleteTarget.type === 'artist') handleRemoveArtist(deleteTarget.id);
              if (deleteTarget.type === 'template') setTemplates(templates.filter(t => t !== deleteTarget.id));
              setDeleteConfirmOpen(false);
            }}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              py: 1,
              bgcolor: theme.palette.error.main,
              color: '#fff',
              boxShadow: 1,
              textTransform: 'none',
              '&:hover': { bgcolor: theme.palette.error.dark },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            borderRadius: 4,
            boxShadow: 8,
            p: 0,
            minWidth: 380,
            maxWidth: 420,
            width: "95vw",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 18,
            color: "#fff",
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            pt: 2,
            pb: 1,
          }}
        >
          Template Manager
          <IconButton
            aria-label="close"
            onClick={() => setTemplateModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            px: 3,
            pt: 2,
            pb: 1,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <TextField
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder="Template Name"
            variant="outlined"
            fullWidth
            sx={{
              mb: 2,
              bgcolor: "transparent",
              borderRadius: 2,
              input: {
                color: "#fff",
                fontWeight: 500,
                fontSize: 18,
                px: 2,
                py: 1.5,
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              sx: {
                color: "#fff",
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 16,
              py: 1,
              mb: 2,
              textTransform: "none",
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
            onClick={() => {
              if (templateName.trim() && !templates.includes(templateName.trim())) {
                setTemplates([templateName.trim(), ...templates]);
                setTemplateName("");
              }
            }}
          >
            Save Template
          </Button>
          <Divider sx={{ my: 2, borderColor: theme.palette.mode === "dark" ? "#444" : "#555" }} />
          <Typography sx={{ fontWeight: 500, fontSize: 16, mb: 1, textAlign: "center" }}>
            Existing Templates
          </Typography>
          <Box sx={{ mb: 2 }}>
            {templates.map((tpl, idx) => (
              <Box
                key={tpl}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.5,
                  px: 1,
                  borderRadius: 2,
                  bgcolor: selectedTemplate === tpl ? theme.palette.primary.main : "transparent",
                  color: selectedTemplate === tpl ? theme.palette.primary.contrastText : "#fff",
                  cursor: "pointer",
                  mb: 0.5,
                  transition: "background 0.18s, color 0.18s",
                }}
                onClick={() => setSelectedTemplate(tpl)}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontWeight: 500,
                    fontSize: 15,
                    color: selectedTemplate === tpl ? theme.palette.primary.contrastText : "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tpl}
                </Typography>
                <IconButton
                  size="small"
                  onClick={e => { e.stopPropagation(); setDeleteTarget({ type: 'template', id: tpl }); setDeleteConfirmOpen(true); }}
                  sx={{ color: theme.palette.error.main, ml: 1, p: 0.5, '&:hover': { bgcolor: theme.palette.action.hover, color: theme.palette.error.dark } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "transparent", px: 3, pb: 2, pt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 16,
              py: 1,
              textTransform: "none",
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
            disabled={!selectedTemplate}
            onClick={() => {
              // handle apply and save selected template
              setTemplateModalOpen(false);
            }}
          >
            APPLY AND SAVE SELECTED TEMPLATE
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={eventLogsModalOpen}
        onClose={() => setEventLogsModalOpen(false)}
        maxWidth="md"
        fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            borderRadius: { xs: 0, sm: 4 },
            boxShadow: 8,
            p: 0,
            minWidth: { xs: '100vw', sm: 500 },
            maxWidth: { xs: '100vw', sm: 700 },
            width: { xs: '100vw', sm: '95vw' },
            m: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: 16, sm: 18 },
            color: "#fff",
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            borderTopLeftRadius: { xs: 0, sm: 4 },
            borderTopRightRadius: { xs: 0, sm: 4 },
            pt: { xs: 1.5, sm: 2 },
            pb: { xs: 0.5, sm: 1 },
            px: { xs: 2, sm: 4 },
          }}
        >
          Event Logs
          <IconButton
            aria-label="close"
            onClick={() => setEventLogsModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
            color: "#fff",
            px: { xs: 1, sm: 3 },
            pt: { xs: 1, sm: 2 },
            pb: { xs: 1.5, sm: 2 },
            minWidth: { xs: 0, sm: 400 },
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#232228" : "#23293a",
              borderRadius: 2,
              overflow: "auto",
              width: "100%",
              boxShadow: 0,
              mb: 1,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Table sx={{ minWidth: 400, width: "100%", bgcolor: "transparent" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "transparent" }}>
                  <TableCell
                    sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 14, sm: 17 }, textAlign: "center", borderBottom: "none", px: { xs: 1, sm: 2 } }}
                  >
                    Timestamp
                  </TableCell>
                  <TableCell
                    sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 14, sm: 17 }, textAlign: "center", borderBottom: "none", px: { xs: 1, sm: 2 } }}
                  >
                    Event
                  </TableCell>
                  <TableCell
                    sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 14, sm: 17 }, textAlign: "center", borderBottom: "none", px: { xs: 1, sm: 2 } }}
                  >
                    User
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventLogs.map((log, idx) => (
                  <TableRow key={idx} sx={{ bgcolor: "transparent" }}>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: { xs: 15, sm: 18 },
                        textAlign: "center",
                        borderBottom: "none",
                        bgcolor: "transparent",
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      {log.timestamp}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        textAlign: "center",
                        bgcolor: "transparent",
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          bgcolor: "#3ec96b",
                          color: "#fff",
                          borderRadius: 999,
                          px: { xs: 1.5, sm: 2.5 },
                          py: { xs: 0.5, sm: 0.5 },
                          fontWeight: 700,
                          fontSize: { xs: 15, sm: 17 },
                          gap: 1,
                          cursor: "pointer",
                          boxShadow: 2,
                          transition: "background 0.18s, box-shadow 0.18s",
                          '&:hover': {
                            bgcolor: '#2fa85a',
                            boxShadow: 4,
                          },
                          outline: 'none',
                          whiteSpace: 'nowrap',
                          minWidth: 120,
                          justifyContent: 'center',
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="URL Addition"
                      >
                        <AddIcon sx={{ fontSize: { xs: 18, sm: 22 }, mr: 1 }} /> URL Addition
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: { xs: 15, sm: 18 },
                        textAlign: "center",
                        borderBottom: "none",
                        bgcolor: "transparent",
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      {log.user}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
