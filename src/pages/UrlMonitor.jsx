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
import { useState } from "react";
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
    <div className={styles.container}>
      <Toolbar />
      <div
        className={styles.card}
        style={{
          background: theme.palette.mode === "dark" ? "#23293a" : "#fff",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 16px 0 rgba(20,20,40,0.18)"
              : "0 2px 16px 0 rgba(0,0,0,0.10)",
          borderRadius: 14,
          border:
            theme.palette.mode === "dark"
              ? "1.5px solid #23293a"
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
                theme.palette.mode === "light" ? "#0f172a" : "#eceef0",
              color: theme.palette.mode === "light" ? "#fff" : "#0f172a",
              borderRadius: 16,
              px: 5,
              py: 1.2,
              fontWeight: 600,
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
            sx={{ color: "success.main", fontWeight: 600, fontSize: 18 }}
          >
            +520 Artist URLs
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
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
            fontWeight: 600,
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
          background: theme.palette.mode === "dark" ? "#23293a" : "#fff",
          borderRadius: 18,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 32px 0 rgba(0,0,0,0.18)"
              : "0 4px 32px 0 rgba(0,0,0,0.12)",
          margin: "0 auto",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          className={styles.table}
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            width: "100%",
            background: "none",
            borderRadius: 0,
          }}
        >
          <TableHead>
            <TableRow
              className={styles.theadRow}
              sx={{
                background:
                  theme.palette.mode === "dark" ? "#23293a" : "#0f172a",
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
                        color:
                          theme.palette.mode === "dark" ? "#fff" : "#0f172a",
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
                        color: theme.palette.info.main,
                        textDecoration: "underline",
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
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: "#fff",
                          backgroundColor: "#222",
                          borderRadius: "6px",
                        },
                        "&.Mui-checked:hover": {
                          backgroundColor: "#222",
                        },
                      }}
                    />
                  </TableCell>
                  {/* Filters Button */}
                  <TableCell className={styles.td} align="center">
                    <Button
                      variant="contained"
                      className={styles.filtersBtn}
                      sx={{
                        background: "#fff",
                        color: "#0f172a",
                        borderRadius: 12,
                        boxShadow: 1,
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        minWidth: 90,
                        "&:hover": {
                          background: "#f3f4f6",
                          color: "#0f172a",
                        },
                        transition: "background 0.18s, color 0.18s",
                      }}
                      onClick={() => setFiltersModalOpen(true)}
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
            fontWeight: 700,
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
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Artist ID
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "#fff",
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
                          textDecoration: "underline",
                          fontWeight: 500,
                        }}
                      >
                        {artist.id}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        className={styles.removeBtn}
                        sx={{
                          background:
                            theme.palette.mode === "dark"
                              ? theme.palette.background.paper
                              : theme.palette.primary.main,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.text.primary
                              : "#fff",
                          borderRadius: 3,
                          fontWeight: 600,
                          px: 2,
                          py: 0.5,
                          fontSize: 15,
                          border:
                            theme.palette.mode === "dark"
                              ? "2px solid #232228"
                              : undefined,
                          "&:hover": {
                            background:
                              theme.palette.mode === "dark"
                                ? "#232228"
                                : theme.palette.primary.dark,
                          },
                        }}
                        onClick={() => handleRemoveArtist(artist.id)}
                      >
                        Remove
                      </Button>
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
          sx: {
            background: theme.palette.background.default,
            borderRadius: 4,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 22,
            pb: 1,
          }}
        >
          <Box>
            <Button
              variant="contained"
              sx={{
                background: theme.palette.primary.main,
                color: "#fff",
                borderRadius: 2,
                fontWeight: 700,
                mr: 2,
                px: 3,
                py: 0.5,
              }}
            >
              EVENT LOGS
            </Button>
            <Button
              variant="contained"
              sx={{
                background: theme.palette.primary.main,
                color: "#fff",
                borderRadius: 2,
                fontWeight: 700,
                px: 3,
                py: 0.5,
              }}
            >
              TEMPLATES
            </Button>
          </Box>
          <IconButton
            onClick={() => setFiltersModalOpen(false)}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: theme.palette.background.default }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={3}
          >
            {/* Left Side: Filters and Notes */}
            <Box flex={1.2}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography
                  fontWeight={700}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Date:
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Thu, May 22, 2025 8:00 PM
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography
                  fontWeight={700}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Name:
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Brad Paisley: Truck Still Works World Tour
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography
                  fontWeight={700}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Venue:
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Kettlehouse Amphitheater, Bonner, MT
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography
                  fontWeight={700}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  Price Range:
                </Typography>
                <Typography
                  fontWeight={500}
                  fontSize={18}
                  color={theme.palette.text.primary}
                >
                  N/A
                </Typography>
              </Box>
              {/* Filter Row */}
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  select
                  label="Sections"
                  value="CENTER, LAWN"
                  SelectProps={{ native: true }}
                  sx={{
                    minWidth: 140,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                  }}
                  InputProps={{
                    sx: { color: theme.palette.text.primary, fontWeight: 600 },
                  }}
                  InputLabelProps={{
                    sx: { color: theme.palette.text.primary },
                  }}
                >
                  <option value="CENTER, LAWN">CENTER, LAWN</option>
                </TextField>
                <TextField
                  select
                  label="Rows"
                  value="Rows"
                  SelectProps={{ native: true }}
                  sx={{
                    minWidth: 100,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                  }}
                  InputProps={{
                    sx: { color: theme.palette.text.primary, fontWeight: 600 },
                  }}
                  InputLabelProps={{
                    sx: { color: theme.palette.text.primary },
                  }}
                >
                  <option value="Rows">Rows</option>
                </TextField>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    px: 1,
                  }}
                >
                  <TextField
                    label="$"
                    value="$0"
                    sx={{ width: 60, bgcolor: "transparent" }}
                    InputProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: theme.palette.text.primary },
                    }}
                  />
                  <Typography
                    color={theme.palette.text.primary}
                    fontWeight={700}
                    mx={1}
                  >
                    -
                  </Typography>
                  <TextField
                    label="$"
                    value=""
                    sx={{ width: 60, bgcolor: "transparent" }}
                    InputProps={{
                      sx: {
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: theme.palette.text.primary },
                    }}
                  />
                </Box>
                <TextField
                  select
                  label="Min. Seats"
                  value="2+"
                  SelectProps={{ native: true }}
                  sx={{
                    minWidth: 80,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                  }}
                  InputProps={{
                    sx: { color: theme.palette.text.primary, fontWeight: 600 },
                  }}
                  InputLabelProps={{
                    sx: { color: theme.palette.text.primary },
                  }}
                >
                  <option value="2+">2+</option>
                </TextField>
                <TextField
                  select
                  label="Excluded Ticket Types"
                  value="Verified Resale, ..."
                  SelectProps={{ native: true }}
                  sx={{
                    minWidth: 180,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                  }}
                  InputProps={{
                    sx: { color: theme.palette.text.primary, fontWeight: 600 },
                  }}
                  InputLabelProps={{
                    sx: { color: theme.palette.text.primary },
                  }}
                >
                  <option value="Verified Resale, ...">
                    Verified Resale, ...
                  </option>
                </TextField>
                <IconButton sx={{ color: theme.palette.text.primary, ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                sx={{
                  background:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : theme.palette.primary.main,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : "#fff",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 4,
                  py: 1,
                  mb: 2,
                  border:
                    theme.palette.mode === "dark"
                      ? "2px solid #232228"
                      : undefined,
                  "&:hover": {
                    background:
                      theme.palette.mode === "dark"
                        ? "#232228"
                        : theme.palette.primary.dark,
                  },
                }}
              >
                Add Filter
              </Button>
              <Box display="flex" gap={2}>
                <Box
                  flex={1}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 3,
                    p: 2,
                    minHeight: 160,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color={theme.palette.text.primary}
                    mb={1}
                  >
                    Notes
                  </Typography>
                </Box>
                <Box
                  flex={1}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 3,
                    p: 2,
                    minHeight: 160,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color={theme.palette.text.primary}
                    mb={1}
                  >
                    Extra Filter Options
                  </Typography>
                  <Box display="flex" gap={2} mb={2}>
                    <TextField
                      select
                      label="Sections"
                      value="Sections"
                      SelectProps={{ native: true }}
                      sx={{
                        minWidth: 120,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                      }}
                      InputProps={{
                        sx: {
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        },
                      }}
                      InputLabelProps={{
                        sx: { color: theme.palette.text.primary },
                      }}
                    >
                      <option value="Sections">Sections</option>
                    </TextField>
                    <TextField
                      select
                      label="Rows"
                      value="Rows"
                      SelectProps={{ native: true }}
                      sx={{
                        minWidth: 100,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                      }}
                      InputProps={{
                        sx: {
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        },
                      }}
                      InputLabelProps={{
                        sx: { color: theme.palette.text.primary },
                      }}
                    >
                      <option value="Rows">Rows</option>
                    </TextField>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.paper
                          : theme.palette.primary.main,
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.text.primary
                          : "#fff",
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 4,
                      py: 1,
                      border:
                        theme.palette.mode === "dark"
                          ? "2px solid #232228"
                          : undefined,
                      "&:hover": {
                        background:
                          theme.palette.mode === "dark"
                            ? "#232228"
                            : theme.palette.primary.dark,
                      },
                    }}
                  >
                    Add Filter
                  </Button>
                </Box>
              </Box>
              <Box mt={3}>
                <Typography
                  fontWeight={700}
                  color={theme.palette.text.primary}
                  mb={1}
                >
                  Section Types
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {["ADA", "CENTER", "LAWN", "LEFT", "PIT", "RIGHT"].map(
                    (type) => (
                      <Button
                        key={type}
                        variant="contained"
                        sx={{
                          background:
                            theme.palette.mode === "dark"
                              ? "#3949ab"
                              : "#3f51b5",
                          color: "#fff",
                          borderRadius: 8,
                          fontWeight: 700,
                          px: 3,
                          py: 0.5,
                        }}
                      >
                        {type}
                      </Button>
                    )
                  )}
                </Box>
              </Box>
            </Box>
            {/* Right Side: Seat Map */}
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                p: 2,
                minHeight: 400,
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                width="100%"
                gap={1}
                mb={1}
              >
                <IconButton
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#3949ab" : "#3f51b5",
                  }}
                >
                  <ZoomInIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#3949ab" : "#3f51b5",
                  }}
                >
                  <ZoomOutIcon />
                </IconButton>
              </Box>
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
              >
                {/* Seat map placeholder */}
                <Box
                  sx={{
                    width: 350,
                    height: 300,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#d1a3f7" : "#ede7f6",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    color={theme.palette.text.primary}
                    fontWeight={700}
                    fontSize={32}
                  >
                    SEAT MAP
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : "#fff",
                borderRadius: 2,
                fontWeight: 700,
                px: 5,
                py: 1.5,
                fontSize: 18,
                border:
                  theme.palette.mode === "dark"
                    ? "2px solid #232228"
                    : undefined,
                "&:hover": {
                  background:
                    theme.palette.mode === "dark"
                      ? "#232228"
                      : theme.palette.primary.dark,
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
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
          <Typography variant="h6" align="center" fontWeight={600} mb={2}>
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
              fontWeight: 700,
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
    </div>
  );
}
