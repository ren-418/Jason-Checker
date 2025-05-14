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
import logo from "../assets/logo2.png";
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

const Header = ({ mode = 'dark', toggleMode = () => {} }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [audio, setAudio] = React.useState("airplane_chime.mp3");
  const [volume, setVolume] = React.useState(50);
  const [desktopNotif, setDesktopNotif] = React.useState(false);
  const [betaModalOpen, setBetaModalOpen] = React.useState(false);

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
      sx={{ background: "#000", boxShadow: "none", p: 0 }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Left: Avatar and Email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={logo}
            alt="avatar"
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
            kylekopitar@gmail.com
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "#fff", ml: 1 }}
            onClick={handleSettingsClick}
          >
            <SettingsIcon />
          </IconButton>
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
            checked={mode === 'dark'}
            onChange={toggleMode}
            sx={{
              ml: 1,
              '& .MuiSwitch-switchBase.Mui-checked': { color: mode === 'dark' ? '#fff' : '#000' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: mode === 'dark' ? '#fff' : '#000' },
            }}
          />
        </Box>
        {/* Modal Dialog for Manage Audio Files */}
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
                es only works on the Phantom Application.
              </span>
            </Alert>
          </DialogContent>
        </Dialog>

        {/* Center: Red pill buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/sales"
            sx={{
              background: "#7a0a0a",
              color: "#fff",
              borderRadius: 999,
              px: 3,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { background: "#a31515" },
            }}
          >
            Phantom Event Discovery (BETA)
          </Button>
          <Button
            sx={{
              background: "#7a0a0a",
              color: "#fff",
              borderRadius: 999,
              px: 3,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { background: "#a31515" },
            }}
            onClick={() => setBetaModalOpen(true)}
          >
            Phantom Artist Search (BETA)
          </Button>
        </Box>

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
        open={betaModalOpen}
        onClose={() => setBetaModalOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            background: mode === 'dark' ? '#18171b' : '#fff',
            borderRadius: 3,
            color: mode === 'dark' ? '#fff' : '#222',
            boxShadow: 8,
            p: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 400 }}>
          <Box sx={{
            background: mode === 'dark' ? '#111' : '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.25)',
            border: '2px solid #222',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 350,
          }}>
            <Typography variant="h6" align="center" fontWeight={600} mb={2}>
              This Product is in Beta
            </Typography>
            <Typography align="center" mb={3}>
              Thank you for trying our beta product. Please acknowledge that you understand this and sign ups for the product will be available soon. Please Provide feedback.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: '#7a0a0a',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 700,
                px: 4,
                py: 1,
                fontSize: 16,
                boxShadow: 1,
                '&:hover': { background: '#a31515' },
              }}
              onClick={() => setBetaModalOpen(false)}
            >
              ACKNOWLEDGE
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
