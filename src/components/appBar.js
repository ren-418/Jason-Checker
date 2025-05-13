import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  makeStyles,
  Popover,
} from "@material-ui/core";
import { useTheme } from "../ThemeContext";
import { useState } from "react";
import { useEventContext } from "./HomePage/UserDataContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import "../css/SideBar.css";
import NotificationDialog from "./NotifcationManager/Overlay";
import MainAccountOverlay from "./AccountManager/MainAcccountOverlay";
import VividArtistSearch from "./VividArtistSearch/VividArtistSearch";
import { getCurrentUserEmail } from "../firebase";
import SoldoutEvents from "./SoldoutEvents";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    height: "36px",
    width: "36px",
    marginRight: theme.spacing(1),
  },
  title: {
    height: "36px",
    width: "auto",
    marginLeft: theme.spacing(1),
    marginTop: "10px",
    display: "inline-block",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 13,
    color: "white",
  },
  twentyFiveDayText: {
    backgroundColor: "#f5f5f5",
    color: "#950006",
    padding: theme.spacing(1),
    borderRadius: "4px",
    marginRight: theme.spacing(2),
    fontWeight: "bold",
  },
  popover: {
    borderRadius: "10px",
  },
  menu: {
    position: "absolute",
    top: "500px",
    right: "0px",
    zIndex: 1,
  },
  menuContent: {
    backgroundColor: "#222222",
    padding: "10px 20px",
    color: "white",

    // paper elevation .MuiPaper-root get rid of the background colork
  },
  menuButton: {
    backgroundColor: "#4054AF",
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    color: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    justifyContent: "flex-start",
    "&:hover": {
      backgroundColor: "#5065C0",
    },
  },
  menuButtonText: {
    fontSize: "14px",
    marginLeft: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  iconButton: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
  },
  link: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },
}));

const AppHeader = ({ showTicketDrops }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const classes = useStyles();
  const userContext = useEventContext();
  const { twentyFiveDay, planType, allowedEmails, mainUser } = userContext;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNotificationOpen, setisNotificationOpen] = useState(false);
  const [isManagerOpen, setisManagerOpen] = useState(false);

  const openPopup = (event) => {
    setAnchorEl(event.currentTarget);
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "black" }}>
      <Toolbar className={classes.toolbar} style={{ minHeight: "64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <img
            alt="Logo"
            src="/logo2.png"
            className={classes.logo}
            style={{ flexShrink: 0 }}
          />
          <Typography
            style={{
              marginLeft: "10px",
              color: "white",
              userSelect: "text",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {getCurrentUserEmail()}
          </Typography>
          <IconButton
            onClick={openPopup}
            className={classes.iconButton}
            style={{ marginLeft: "20px", flexShrink: 0 }}
            disableRipple
          >
            <img
              src="/setting.png"
              alt="setting"
              style={{
                height: "25.71px",
                width: "25.71px",
              }}
            />
          </IconButton>
          <Popover
            open={isPopupOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            classes={{
              paper: classes.popover,
            }}
            PaperProps={{
              style: {
                backgroundColor: "#222222",
                color: "white",
              },
            }}
          >
            <div className={classes.menuContent}>
              <button
                className={classes.menuButton}
                onClick={() => {
                  setisNotificationOpen(true);
                  setIsPopupOpen(false);
                }}
              >
                <NotificationsIcon />
                <span className={classes.menuButtonText}>Notifications</span>
              </button>
              {getCurrentUserEmail() === userContext.mainUser && (
                <button
                  className={classes.menuButton}
                  onClick={() => {
                    setisManagerOpen(true);
                    setIsPopupOpen(false);
                  }}
                >
                  <AccountCircleIcon />
                  <span className={classes.menuButtonText}>
                    Account Manager
                  </span>
                </button>
              )}
              {planType === "whop" && (
                <button
                  className={classes.menuButton}
                  onClick={() => {
                    window.open("https://whop.com/hub/memberships/", "_blank");
                  }}
                >
                  <span className={classes.menuButtonText}>
                    Manage Whop Plan
                  </span>
                </button>
              )}
              {planType === "stripe" && (
                <button
                  className={classes.menuButton}
                  onClick={() => {
                    window.open(
                      "https://billing.phantomchecker.com/p/login/cN28wRglhfdF0x25kk",
                      "_blank"
                    );
                  }}
                >
                  <span className={classes.menuButtonText}>
                    Manage Stripe Plan
                  </span>
                </button>
              )}
            </div>
          </Popover>
          <NotificationDialog
            open={isNotificationOpen}
            onClose={() => {
              setisNotificationOpen(false);
            }}
          />
          <MainAccountOverlay
            open={isManagerOpen}
            handleClose={() => {
              setisManagerOpen(false);
            }}
          />
          <IconButton
            onClick={toggleDarkMode}
            className={classes.iconButton}
            disableRipple
          >
            {darkMode ? (
              <svg
                width="25"
                height="14"
                viewBox="0 0 25 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="8.58307e-06"
                  width="25"
                  height="14"
                  rx="7"
                  fill="#D9D9D9"
                  fillOpacity="0.9"
                />
                <circle cx="18.5" cy="7" r="4.5" fill="#0C0C0C" />
              </svg>
            ) : (
              <svg
                width="25"
                height="14"
                viewBox="0 0 25 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="8.58307e-06"
                  width="25"
                  height="14"
                  rx="7"
                  fill="#D9D9D9"
                  fillOpacity="0.9"
                />
                <circle cx="6.5" cy="7" r="4.5" fill="#0C0C0C" />
              </svg>
            )}
          </IconButton>
          <IconButton
            component={Link}
            to="/sales"
            className={classes.iconButton}
            style={{ padding: 0, flexShrink: 1, minWidth: 0 }}
            disableRipple
          >
            <button
              className={classes.menuButton}
              style={{
                backgroundColor: "#670004",
                fontSize: "18px",
                borderRadius: "16px",
                fontFamily: "'Inter', sans-serif",
                color: "white",
                height: "30px",
                marginLeft: "20px",
                whiteSpace: "nowrap",
                padding: "0 12px",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "315px",
              }}
            >
              Phantom Event Discovery (BETA)
            </button>
          </IconButton>
          <VividArtistSearch />
          {allowedEmails.includes(mainUser) && <SoldoutEvents />}
        </div>
        <Box className={classes.rightSection} style={{ flexShrink: 0 }}>
          {twentyFiveDay && (
            <Typography variant="body2" className={classes.twentyFiveDayText}>
              $25 Day Account
            </Typography>
          )}
          <IconButton
            component={Link}
            to="/"
            className={classes.iconButton}
            disableRipple
          >
            <img
              src="/home.png"
              alt="home"
              style={{
                height: "25.71px",
                width: "25.71px",
              }}
            />
          </IconButton>
          {!showTicketDrops && (
            <IconButton
              component={Link}
              to="/ticket-drops"
              className={classes.iconButton}
              disableRipple
            >
              <img
                src="/ticket.png"
                alt="ticket"
                style={{
                  height: "25.71px",
                  width: "25.71px",
                }}
              />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
