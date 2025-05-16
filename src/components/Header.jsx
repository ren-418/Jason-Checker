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
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

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
  const isMobileHeader = useMediaQuery("(max-width:600px)");

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
      {/* Professional Mobile Header */}
      {isMobileHeader ? (
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          {/* Left: Jason Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
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
          </Box>
          {/* Right: Hamburger */}
          <IconButton
            sx={{ color: "#fff" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
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
              {/* Settings, Notifications, Dark Mode Toggle, etc. */}
              <ListItem>
                <IconButton
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                  }}
                >
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: theme.palette.primary.contrastText,
                    background: theme.palette.primary.main,
                    ml: 1,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                  }}
                  onClick={handleNotifClick}
                >
                  <NotificationsIcon />
                </IconButton>
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleMode}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            </List>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", pb: 2 }}
            >
              <IconButton
                component={Link}
                to="/"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                }}
              >
                <HomeIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <IconButton
                component={Link}
                to="/tickets"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                }}
              >
                <ConfirmationNumberIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Drawer>
        </Toolbar>
      ) : (
        // Old header UI for desktop/full size
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
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
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
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": { background: theme.palette.primary.dark },
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
            <Box
              sx={{ display: "flex", justifyContent: "space-around", pb: 2 }}
            >
              <IconButton
                component={Link}
                to="/"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                }}
              >
                <HomeIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <IconButton
                component={Link}
                to="/tickets"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
                }}
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
      )}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : "#fff",
            borderRadius: 4,
            color: theme.palette.text.primary,
            boxShadow: 8,
            width: 420,
            minWidth: 320,
            maxWidth: 420,
            p: 0,
          },
        }}
        aria-labelledby="audio-modal-title"
      >
        <DialogTitle
          id="audio-modal-title"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 18,
            background: "transparent",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            minHeight: 36,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlayArrowIcon color="primary" sx={{ fontSize: 28 }} />
            Manage Audio Files
          </Box>
          <IconButton
            onClick={handleModalClose}
            sx={{
              color: theme.palette.mode === "dark" ? "#fff" : "#23293a",
              ml: 2,
              p: 0.5,
            }}
            size="small"
            aria-label="Close audio modal"
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            color: theme.palette.text.primary,
            background: "transparent",
            pt: 2,
            pb: 2,
            px: 3,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            minWidth: 320,
            maxWidth: 420,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Choose your audio from the list below:
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ flexWrap: "wrap", gap: 2 }}
              >
                <Select
                  value={audio}
                  onChange={(e) => setAudio(e.target.value)}
                  sx={{
                    background: theme.palette.primary.main,
                    color: theme.palette.mode === "light" ? "#fff" : "black",
                    borderRadius: 999,
                    fontSize: 14,
                    minWidth: 120,
                    height: 36,
                    pl: 2,
                    pr: 2,
                    boxShadow: "none",
                    "& .MuiSelect-icon": { color: "#fff", fontSize: 20 },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        mt: 1,
                        minWidth: 140,
                        boxShadow: "0 2px 24px 0 rgba(0,0,0,0.09)",
                        maxHeight: 400,
                        p: 0,
                      },
                    },
                    MenuListProps: { sx: { p: 0 } },
                  }}
                >
                  {audioFiles.map((file) => (
                    <MenuItem
                      key={file}
                      value={file}
                      sx={{
                        background:
                          audio === file
                            ? theme.palette.action.selected
                            : "transparent",
                        color: theme.palette.text.primary,
                        fontSize: 14,
                        px: 2,
                        py: 0.5,
                        minHeight: 28,
                        "&:hover": { background: theme.palette.action.hover },
                      }}
                    >
                      {file}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  sx={{
                    background: theme.palette.primary.main,
                    color: theme.palette.mode === "light" ? "#fff" : "black",
                    borderRadius: 999,
                    fontSize: 14,
                    px: 2.5,
                    py: 0.5,
                    minWidth: 0,
                    height: 36,
                    boxShadow: "none",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { background: theme.palette.primary.dark },
                  }}
                  component="label"
                  startIcon={<PlayArrowIcon />}
                >
                  Upload Audio
                  <input type="file" hidden accept="audio/*" />
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                Volume
              </Typography>
              <Slider
                value={volume}
                onChange={(_, v) => setVolume(v)}
                min={0}
                max={100}
                sx={{
                  color: theme.palette.primary.main,
                  mb: 1,
                  mt: 0,
                  height: 2,
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    bgcolor: theme.palette.primary.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                  },
                  "& .MuiSlider-rail": {
                    opacity: 1,
                    bgcolor: theme.palette.divider,
                  },
                  "& .MuiSlider-track": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            <Divider />
            <Box
              sx={{
                background: theme.palette.action.hover,
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Switch
                checked={desktopNotif}
                onChange={(e) => setDesktopNotif(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                inputProps={{ "aria-label": "Enable desktop notification" }}
              />
              <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
                Desktop Notification
              </Typography>
            </Box>
            <Alert
              severity="info"
              iconMapping={{
                info: <WarningAmberRoundedIcon fontSize="inherit" />,
              }}
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? "#232228"
                    : theme.palette.action.hover,
                color: theme.palette.text.primary,
                borderRadius: 2,
                fontWeight: 500,
                mt: 1,
                alignItems: "center",
                fontSize: 14,
              }}
            >
              This feature only works on the <b>Phantom Application</b>.
            </Alert>
          </Stack>
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
              color: theme.palette.mode === "dark" ? "white" : "#232228",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#181818" : "#e5e5e5",
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
                borderRadius: 2,
                fontSize: 18,
                mr: 0,
                boxShadow: 1,
                input: {
                  fontSize: 18,
                  p: "10px 14px",
                  height: "44px",
                  color: theme.palette.mode === "dark" ? "#000" : undefined,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: "44px",
                  p: 0,
                },
              }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  fontSize: 18,
                  height: "44px",
                  p: 0,
                  color: theme.palette.mode === "dark" ? "#000" : undefined,
                },
              }}
            />
            <IconButton
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "black" : "#fff",
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
