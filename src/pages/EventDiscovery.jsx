import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const dummyEvents = [
  {
    id: 1,
    name: "Dave Matthews Band",
    venue: "Broadview Stage at SPAC, Saratoga Springs, NY",
    datetime: "Fri, July 18, 2025 7:30 PM",
    tickets: {
      source: "Live Nation",
      section: "Section 6, Row R, Seats 11–14",
      quantity: 4,
      price: 219,
    },
    phantom: {
      getIn: 50,
      avg: 581,
    },
    releaseTime: "5/14/2025, 3:18:10 AM",
    mapUrl: "/venue-map-1.png", // Replace with actual image path
  },
  {
    id: 2,
    name: "Morgan Wallen: I'm The Problem Tour",
    venue: "Gillette Stadium, Foxborough, MA",
    datetime: "Sat, August 23, 2025 5:30 PM",
    tickets: {
      source: "Ticketmaster",
      section: "Section 214, Row 8, Seats 27–28",
      quantity: 2,
      price: 207.8,
    },
    phantom: {
      getIn: 186,
      avg: 452,
    },
    releaseTime: "5/14/2025, 3:18:06 AM",
    mapUrl: "/venue-map-2.png",
  },
];

export default function EventDetailView() {
  const [search, setSearch] = useState("");
  const [compactView, setCompactView] = useState(false);

  const filteredEvents = dummyEvents.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Top bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
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
            }}
          />
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => setCompactView(!compactView)}
          >
            {compactView ? "Full View" : "Compact View"}
          </Button>
        </Box>

        {/* Event Cards */}
        {filteredEvents.map((event) => (
          <Card key={event.id} sx={{ mb: 3, bgcolor: "#1a1a1a", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {event.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                📍 {event.venue}
              </Typography>
              <Typography variant="body2" gutterBottom>
                📅 {event.datetime}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: compactView ? "column" : "row",
                  alignItems: compactView ? "flex-start" : "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      backgroundColor:
                        event.tickets.source === "Ticketmaster"
                          ? "#003366"
                          : "#990000",
                      color: "white",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {event.tickets.source} - ({event.tickets.quantity} tickets
                      found)
                    </Typography>
                    <Typography variant="body2">
                      {event.tickets.section} ({event.tickets.quantity}) - $
                      {event.tickets.price}
                    </Typography>
                  </Box>

                  <Box mt={1} sx={{ color: "plum" }}>
                    <Typography variant="body2">Phantom Data</Typography>
                    <Typography variant="body2">
                      Get In: <strong>${event.phantom.getIn}</strong> Average: {" "}
                      <strong>${event.phantom.avg}</strong>
                    </Typography>
                  </Box>
                </Box>

                {!compactView && (
                  <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image={event.mapUrl}
                    alt="Venue Map"
                  />
                )}
              </Box>

              <Box mt={1} sx={{ color: "#aaa", fontSize: 12 }}>
                🕒 Release Time: {event.releaseTime}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
}
