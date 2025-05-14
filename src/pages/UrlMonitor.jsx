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
import LogoutButton from "../components/LogoutButton";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import urlsData from "../services/urls.json";
import stubhubIcon from "../assets/stubhub.svg";
import vividIcon from "../assets/vivid.jpg";
import TablePagination from "@mui/material/TablePagination";
import styles from "./UrlMonitor.module.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const urlsArray = Object.entries(urlsData); // [ [eventId, data], ... ]

export default function UrlMonitor() {
  const [search, setSearch] = useState("");
  const [urls, setUrls] = useState(urlsArray);
  const [checkedRows, setCheckedRows] = useState({});
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    return fields.some(
      (field) => (field ? String(field).toLowerCase() : '').includes(searchStr)
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

  const paginatedUrls = sortedUrls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Table columns for sorting
  const columns = [
    { key: 'remove', label: 'Remove', sortable: false },
    { key: 'priceRange', label: 'Price Range', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'venue', label: 'Venue', sortable: true },
    { key: 'stubhub', label: 'Stubhub Link', sortable: false },
    { key: 'vivid', label: 'Vivid Link', sortable: false },
    { key: 'eventId', label: 'Event ID', sortable: true },
    { key: 'earlyMonitor', label: 'Early Monitor', sortable: false },
    { key: 'filters', label: 'Filters', sortable: false },
  ];

  return (
    <div className={styles.container}>
      <LogoutButton />
      <Toolbar />
      <div className={styles.card}>
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
              background: "primary.main",
              color: "white",
              borderRadius: 3,
              px: 5,
              py: 1.2,
              fontWeight: 600,
              fontSize: 18,
              textTransform: "none",
              boxShadow: 1,
              "&:hover": { background: "primary.dark" },
            }}
          >
            Add URLs
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography sx={{ color: "success.main", fontWeight: 600, fontSize: 18 }}>
            +520 Artist URLs
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: theme.palette.text.primary }}>
            Total: {filteredUrls.length} / 3500
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 16, color: theme.palette.text.primary }}>
            Total Early URLs: 171 - 200
          </Typography>
        </Box>
      </div>
      <Box textAlign="center" my={3}>
        <Button
          variant="contained"
          sx={{
            background: "primary.main",
            color: "white",
            borderRadius: 3,
            px: 5,
            py: 1.2,
            fontWeight: 600,
            fontSize: 18,
            textTransform: "none",
            boxShadow: 1,
            "&:hover": { background: "primary.dark" },
          }}
        >
          Artist Added Date Monitor
        </Button>
      </Box>
      <TextField
        variant="outlined"
        placeholder="Search"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            fontSize: 18,
            borderRadius: 2,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            marginBottom: 2,
          },
        }}
        className={styles.searchInput}
      />
      <div className={styles.tableWrapper}>
        <Table
          className={styles.table}
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            width: '100%',
            background: 'none',
            borderRadius: 0,
          }}
        >
          <TableHead>
            <TableRow className={styles.theadRow}>
              {columns.map((col, i) => (
                <TableCell
                  key={col.key}
                  className={
                    i === 0
                      ? styles.thLeft + ' ' + styles.theadCell
                      : i === columns.length - 1
                      ? styles.thRight + ' ' + styles.theadCell
                      : styles.theadCell
                  }
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                >
                  {col.label}
                  {col.sortable && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' ? (
                      <ArrowDownwardIcon className={styles.theadSortIcon} />
                    ) : (
                      <ArrowUpwardIcon className={styles.theadSortIcon} />
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUrls.map(([eventId, data], idx) => {
              const hasPresales = Array.isArray(data.presales) && data.presales.length > 0;
              const isTicketmaster = data.site === 'ticketmaster';
              const showVivid = !isTicketmaster;
              const showStubhub = hasPresales;
              const isChecked = checkedRows[eventId];
              return (
                <TableRow
                  key={eventId}
                  className={
                    styles.tbodyRow +
                    (isChecked ? ' ' + styles.rowChecked : '')
                  }
                >
                  {/* Remove */}
                  <TableCell className={styles.td}>
                    <IconButton color="error" onClick={() => handleRemove(eventId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  {/* Price Range */}
                  <TableCell className={styles.td}>{data.priceRange}</TableCell>
                  {/* Date */}
                  <TableCell className={styles.td} style={{ whiteSpace: 'pre-line' }}>{data.date}</TableCell>
                  {/* Name */}
                  <TableCell className={styles.td} style={{ color: idx === 0 ? theme.palette.primary.main : undefined }}>{data.name}</TableCell>
                  {/* Venue */}
                  <TableCell className={styles.td}>{data.venue}</TableCell>
                  {/* Stubhub Link */}
                  <TableCell className={styles.td} align="center">
                    {showStubhub && (
                      <img
                        src={stubhubIcon}
                        alt="StubHub"
                        className={styles.imgMarketplace}
                        style={{ margin: 0 }}
                      />
                    )}
                  </TableCell>
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
                  <TableCell className={styles.td}>
                    <a
                      href="#"
                      style={{
                        color: theme.palette.info.main,
                        textDecoration: "underline",
                        fontWeight: 500,
                        wordBreak: 'break-all',
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
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </TableCell>
                  {/* Filters Button */}
                  <TableCell className={styles.td} align="center">
                    <Button
                      variant="contained"
                      className={styles.filtersBtn}
                      sx={{
                        background: idx % 2 === 0 ? "#7a0a0a" : "#1976d2",
                        color: "#fff",
                        '&:hover': {
                          background: idx % 2 === 0 ? "#a31515" : "#1565c0",
                        },
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
            borderTop: '2px solid #00bcd4',
            background: 'transparent',
            color: theme.palette.text.primary,
            '.MuiTablePagination-toolbar': { justifyContent: 'flex-end', px: 2 },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontWeight: 500 },
            '.MuiTablePagination-actions': { color: theme.palette.text.primary },
          }}
        />
      </div>
    </div>
  );
}
