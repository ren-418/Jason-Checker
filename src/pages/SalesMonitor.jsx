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
import { useState } from "react";
import dayjs from "dayjs";
import DatePicker from "@mui/lab/DatePicker";

const timeSlots = [
  "3:00 PM",
  "4:00 PM",
  "4:45 PM",
  "5:00 PM",
  "5:15 PM",
  "5:30 PM",
  "6:00 PM",
];

const dummyEvents = [
  {
    id: "1",
    name: '"AL SON DE ELLAS"',
    venue: "Rose & Alfred Miniaci Performing Arts Center, Ft Lauderdale, FL",
    datetime: "Sun, June 8, 2025 7:30 PM",
    offer: "ONSALE",
    price: "TBD",
    url: "0D0062A6DE8D34DF",
  },
  {
    id: "2",
    name: '2025 Jeff Chang "Continuum: OUR STORY World Tour"',
    venue: "The Theater at MSG, New York, NY",
    datetime: "Sat, October 4, 2025 10:00 PM",
    offer: "Venue Presale, Chase Cardholder Preferred Tickets",
    price: "TBD",
    url: "3B0062A9CE3710E3",
  },
];

export default function SalesMonitor() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [search, setSearch] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Sales Day + Time Slots */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Sales Day
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              slotProps={{
                textField: {
                  size: "small",
                  variant: "outlined",
                  sx: { bgcolor: "white", borderRadius: 1 },
                },
              }}
            />
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#8B0000" }}>
              <TableCell sx={{ color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ color: "white" }}>Venue</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Offer</TableCell>
              <TableCell sx={{ color: "white" }}>Price Range</TableCell>
              <TableCell sx={{ color: "white" }}>URL</TableCell>
              <TableCell sx={{ color: "white" }}>Add Event</TableCell>
              <TableCell sx={{ color: "white" }}>Add Artist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyEvents
              .filter((e) =>
                e.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.datetime}</TableCell>
                  <TableCell>{event.offer}</TableCell>
                  <TableCell>{event.price}</TableCell>
                  <TableCell>
                    <a href="#" style={{ color: "#40a9ff" }}>
                      {event.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" size="small">
                      Add Event
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" size="small">
                      Add Artist
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
