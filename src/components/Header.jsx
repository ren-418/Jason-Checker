import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Popover from "@mui/material/Popover";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import ListItemIcon from "@mui/material/ListItemIcon";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const Header = ({ mode = "dark", toggleMode = () => {} }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [audio, setAudio] = React.useState("airplane_chime.mp3");
  const [volume, setVolume] = React.useState(50);
  const [desktopNotif, setDesktopNotif] = React.useState(false);
  const [betaModalOpen, setBetaModalOpen] = React.useState(false);
  const [artistSearchModalOpen, setArtistSearchModalOpen] =
    React.useState(false);
  const [artistSearchValue, setArtistSearchValue] = React.useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:1200px)");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Dummy data for demonstration (replace with real data if available)
  const artistResults = [];

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClick = () => {
    setModalOpen(true);
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const audioFiles = [
    "Default.mp3",
    "metro_msm.mp3",
    "Boat_Horn.mp4",
    "short_bongo.mp3",
    "airplane_chime.mp3",
    "tick.mp3",
    "chime.mp3",
    "boop.mp3",
    "arpeggio.mp3",
    "sweet_text.mp3",
    "argon.mp3",
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        background:
          theme.palette.mode === "dark"
            ? "#262626"
            : theme.palette.primary.main,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 2px 12px 0 rgba(20,20,40,0.45)"
            : "none",
        borderBottom:
          theme.palette.mode === "dark" ? "1.5px solid #222b3a" : "none",
        p: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Left: Avatar and Email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 1,
              bgcolor: "#fff",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 24,
              borderRadius: 2,
            }}
            variant="square"
          >
            J
          </Avatar>
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 700 }}>
            Jason
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "#fff", ml: 1 }}
            onClick={handleSettingsClick}
          >
            <SettingsIcon />
          </IconButton>
          {/* Hamburger for mobile */}
          {isMobile && (
            <IconButton
              sx={{ color: "#fff", ml: 1 }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                background: "#232228",
                boxShadow: 3,
                borderRadius: 2,
                mt: 1,
                p: 2,
              },
            }}
          >
            <Button
              variant="contained"
              startIcon={<NotificationsIcon />}
              sx={{
                background: "#4b5bdc",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 2.5,
                py: 1,
                boxShadow: "none",
                "&:hover": { background: "#3a47b3" },
              }}
              disableElevation
              onClick={handleNotifClick}
            >
              Notifications
            </Button>
          </Popover>
          <Switch
            checked={mode === "dark"}
            onChange={toggleMode}
            sx={{
              ml: 1,
              "& .MuiSwitch-switchBase": {
                color: "#a3a6ae",
              },
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#fff",
              },
              "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                backgroundColor: "#a3a6ae",
                opacity: 1,
              },

              "& .MuiSwitch-thumb": {
                backgroundColor: "#fff",
              },
            }}
          />
          {/* Hide header buttons on mobile */}
          {!isMobile && (
            <>
              <Button
                component={Link}
                to="/sales"
                sx={{
                  background: "#fff",
                  color: "#23293a",
                  borderRadius: 999,
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 8px 0 rgba(0,0,0,0.18)"
                      : 1,
                  border:
                    theme.palette.mode === "dark"
                      ? "1.5px solid #23293a"
                      : "none",
                  "&:hover": {
                    background: "#f3f4f6",
                    color:
                      theme.palette.mode === "dark" ? "#23293a" : "#23293a",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 16px 0 rgba(0,0,0,0.22)"
                        : 1,
                  },
                }}
              >
                Jason Event Discovery (BETA)
              </Button>
              <Button
                sx={{
                  background: "#fff",
                  color: "#23293a",
                  borderRadius: 999,
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 8px 0 rgba(0,0,0,0.18)"
                      : 1,
                  border:
                    theme.palette.mode === "dark"
                      ? "1.5px solid #23293a"
                      : "none",
                  "&:hover": {
                    background: "#f3f4f6",
                    color:
                      theme.palette.mode === "dark" ? "#23293a" : "#23293a",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 16px 0 rgba(0,0,0,0.22)"
                        : 1,
                  },
                }}
                onClick={() => setArtistSearchModalOpen(true)}
              >
                Jason Artist Search (BETA)
              </Button>
            </>
          )}
        </Box>
        {/* Drawer for mobile nav */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.mode === "dark" ? "#262626" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              width: 260,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            },
          }}
        >
          <List sx={{ flex: 1 }}>
            <ListItem
              button
              component={Link}
              to="/sales"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="Jason Event Discovery (BETA)"
                primaryTypographyProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/artist-search"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="Jason Artist Search (BETA)"
                primaryTypographyProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="Home"
                primaryTypographyProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/tickets"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="Tickets"
                primaryTypographyProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
          </List>
          <Box sx={{ display: "flex", justifyContent: "space-around", pb: 2 }}>
            <IconButton
              component={Link}
              to="/"
              sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#23293a" }}
            >
              <HomeIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <IconButton
              component={Link}
              to="/tickets"
              sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#23293a" }}
            >
              <ConfirmationNumberIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Drawer>
        {/* Right: Home and Ticket icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton component={Link} to="/" sx={{ color: "#fff" }}>
            <HomeIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <IconButton component={Link} to="/tickets" sx={{ color: "#fff" }}>
            <ConfirmationNumberIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Toolbar>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        PaperProps={{
          sx: { background: "#232228", borderRadius: 3, minWidth: 400, p: 0 },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: 700,
            background: "#232228",
            p: 2,
            pb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Manage Audio Files
          <IconButton
            onClick={handleModalClose}
            sx={{ color: "#fff", ml: 2 }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ color: "#fff", background: "#232228", pt: 1 }}>
          <Typography sx={{ mb: 2 }}>
            Choose your audio from the drop list below:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Select
              value={audio}
              onChange={(e) => setAudio(e.target.value)}
              sx={{
                background: "#232228",
                color: "#fff",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 18,
                ".MuiSelect-icon": { color: "#fff", fontSize: 28 },
                minWidth: 220,
                height: 44,
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.7)",
                pl: 2,
                pr: 4,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: "#232228",
                    color: "#fff",
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 260,
                    boxShadow: "0 2px 24px 0 rgba(0,0,0,0.9)",
                    maxHeight: 400,
                    p: 0,
                  },
                },
                MenuListProps: {
                  sx: {
                    p: 0,
                  },
                },
              }}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: 18,
                      color: "#fff",
                    }}
                  >
                    {selected}
                  </Typography>
                  <PlayArrowIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
              )}
            >
              {audioFiles.map((file) => (
                <MenuItem
                  key={file}
                  value={file}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: audio === file ? "#18171b" : "transparent",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 18,
                    px: 2,
                    py: 1.2,
                    minHeight: 48,
                    "&:hover": {
                      background: "#18171b",
                    },
                  }}
                >
                  <span>{file}</span>
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <PlayArrowIcon sx={{ color: "#fff", fontSize: 28 }} />
                  </ListItemIcon>
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              sx={{
                background: "#4b5bdc",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 2.5,
                py: 1,
                boxShadow: "none",
                "&:hover": { background: "#3a47b3" },
              }}
              disableElevation
              component="label"
            >
              Upload Audio
              <input type="file" hidden accept="audio/*" />
            </Button>
          </Box>
          <Slider
            value={volume}
            onChange={(_, v) => setVolume(v)}
            min={0}
            max={100}
            sx={{ color: "#4b5bdc", mb: 2 }}
          />
          <Box
            sx={{
              background: "#232228",
              border: "2px solid #444",
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <Switch
              checked={desktopNotif}
              onChange={(e) => setDesktopNotif(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4b5bdc" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#4b5bdc",
                },
              }}
            />
            <Typography sx={{ color: "#fff", fontWeight: 500 }}>
              Desktop Notification
            </Typography>
          </Box>
          <Alert
            icon={true}
            severity="warning"
            sx={{
              background: "transparent",
              color: "#fff",
              border: "none",
              mt: 2,
              p: 0,
              alignItems: "center",
              ".MuiAlert-icon": { color: "#fff", mr: 1 },
            }}
          >
            This featu
            <span style={{ fontWeight: 600 }}>
              es only works on the Jason Application.
            </span>
          </Alert>
        </DialogContent>
      </Dialog>
      <Dialog
        open={artistSearchModalOpen}
        onClose={() => setArtistSearchModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.background.default,
            borderRadius: 4,
            color: theme.palette.text.primary,
            boxShadow: 8,
            p: 0,
            minWidth: { xs: 320, sm: 500 },
            maxWidth: 900,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 20,
            pb: 1,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.background.default,
            color: theme.palette.text.primary,
            position: "relative",
          }}
        >
          Artist Search
          <IconButton
            onClick={() => setArtistSearchModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.mode === "dark" ? "#232228" : "#232228",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#e5e5e5" : "#e5e5e5",
            p: { xs: 2, sm: 4 },
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {/* Search Bar */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              display: "flex",
              alignItems: "center",
              mb: 6,
              mt: 2,
            }}
          >
            <TextField
              placeholder="Search"
              value={artistSearchValue}
              onChange={(e) => setArtistSearchValue(e.target.value)}
              variant="outlined"
              fullWidth
              size="medium"
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#fff" : "#fff",
                color: theme.palette.mode === "dark" ? "black" : "black",
                borderRadius: 2,
                fontSize: 18,
                mr: 0,
                boxShadow: 1,
                input: {
                  fontSize: 18,
                  p: "10px 14px",
                  height: "44px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: "44px",
                  p: 0,
                },
              }}
              InputProps={{
                sx: { borderRadius: 2, fontSize: 18, height: "44px", p: 0 },
              }}
            />
            <IconButton
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                borderRadius: 2,
                width: 44,
                height: 44,
                ml: 1,
                boxShadow: 1,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                },
                transition: "background 0.18s, color 0.18s",
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          {/* Results Area */}
          <Box
            sx={{
              width: "100%",
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              mt: 4,
            }}
          >
            {artistResults.length === 0 ? (
              <Typography
                sx={{ color: "#232228", fontSize: 18, fontWeight: 400, mt: 8 }}
              >
                No data available
              </Typography>
            ) : (
              <Box sx={{ width: "100%", maxHeight: 320, overflowY: "auto" }}>
                {/* Map artistResults here */}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
