import { db } from "../../firebase";
import "../../css/HomePage.css";

import FilterForm from "../filters/index";

import AddURLForm from "./components/addURLForm";
import SearchBar from "./components/searchBar";
import UrlTable from "./components/UrlTable";
import { useTableState } from "./State";
import { useSortConfigUpdate, useSortedUrls } from "./handlers/sorting";
import {
  handleInputChange,
  handleKeyDown,
  searchResults,
} from "./handlers/search";
import {
  handleFilterClick,
  handleFilterClose,
  handleSignOut,
} from "./handlers/user";
import {
  handleAddUrl,
  handleEarlyMonitorToggle,
  handleRemoveUrl,
} from "./handlers/urlManipulation";
import TicketDrops from "../mailbox/ticketDrops";
import { useEventContext } from "./UserDataContext";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core";

import { Link } from "react-router-dom";
// import FilterFormOld from "../filtersOld";
import NotAllowed from "../NotAllowed";
import Modal from "./components/ErrorModal";
import ArtistManager from "../artistManager";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    position: "absolute",
    left: "10px",
    top: "70px",
    backgroundColor: "#121212",
    width: "45px", // Remove background
    "&:hover": {
      backgroundColor: "black", // Remove background on hover
    },
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  logoutIcon: {
    "&:hover": {
      backgroundColor: "black",
    },
    width: "26px", // Adjust the size as needed
    height: "26px", // Adjust the size as needed
    marginLeft: "3px",
  },
}));

const HomePage = ({ handleShowTicketDrops }) => {
  const classes = useStyles();
  const userContext = useEventContext();

  const {
    user,
    eventsInfo,
    urls,
    TotalUrls,
    early,
    totalEarly,
    mutedEvents,
    editFilters,
    showTable,
    mainUser,
    vividIds,
    phantomAllowed,
    artistUrls,
  } = userContext;

  if (editFilters && showTable) {
    handleShowTicketDrops(true);
  } else {
    handleShowTicketDrops(false);
  }

  const stubhubIds = userContext.stubHubInfo;
  const filterIds = userContext.filterIds;

  const {
    newUrls,
    setNewUrls,
    showFilter,
    setShowFilter,
    currentFilterUrl,
    setCurrentFilterUrl,
    sortConfig,
    setSortConfig,
    searchTerm,
    setSearchTerm,
    suggestions,
    setSuggestions,
    wordIndex,
    setWordIndex,
    suggestionIndex,
    setSuggestionIndex,
    darkMode,
    modalOpen,
    setModalOpen,
    modalMessage,
    setModalMessage,
  } = useTableState();

  const sortedUrls = useSortedUrls(urls, eventsInfo, sortConfig, early);
  const getNewSortConfig = useSortConfigUpdate(sortConfig);

  const handleSort = (key) => {
    const newSortConfig = getNewSortConfig(key);
    setSortConfig(newSortConfig);
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  if (!user) return null;

  if (phantomAllowed === false) {
    return <NotAllowed />;
  }

  return (
    <div className="home-page">
      {/* <GlobalMessage show={user.email === mainUser} user={user} /> */}

      {editFilters && showTable && <TicketDrops signOutButton={true} />}

      <Link onClick={handleSignOut(db, user)} className={classes.link}>
        <IconButton
          color="inherit"
          disableRipple
          className={classes.iconButton}
        >
          <img src="/logout.png" alt="logout" className={classes.logoutIcon} />
        </IconButton>
      </Link>
      <AddURLForm
        darkMode={darkMode}
        handleAddUrl={(e) =>
          handleAddUrl(
            e,
            newUrls,
            urls,
            TotalUrls,
            setNewUrls,
            mainUser,
            db,
            showModal
          )
        }
        newUrls={newUrls}
        setNewUrls={setNewUrls}
        editFilters={editFilters}
      />

      {!showTable && TotalUrls && (
        <>
          {artistUrls.length > 0 ? (
            <p
              style={{
                fontSize: "17px",
                margin: "0",
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span>URLs: {urls ? urls.length : "0"}</span>
              <span style={{ color: "#4CAF50" }}>
                +{artistUrls.length * 10} Artist URLs
              </span>
              <span
                style={{
                  paddingTop: "4px",
                }}
              >
                Total: {urls.length + artistUrls.length * 10}
                {TotalUrls ? ` / ${TotalUrls}` : ""}
              </span>
            </p>
          ) : (
            <p style={{ fontSize: "17px", margin: "0", fontWeight: "bold" }}>
              Total URLs: {urls ? urls.length : "0"}
              {TotalUrls ? " - " + TotalUrls : ""}
            </p>
          )}

          <p
            style={{
              fontSize: "17px",
              margin: "0 0 35px",
              fontWeight: "bold",
              opacity: early.length === 0 && totalEarly === 0 ? 0.5 : 1,
              cursor:
                early.length === 0 && totalEarly === 0 ? "not-allowed" : "auto",
            }}
            aria-disabled={early.length === 0 && totalEarly === 0}
          >
            Total Early Urls: {early ? early.length : "0"}
            {totalEarly !== undefined ? ` - ${totalEarly}` : " - 0"}
          </p>

          <ArtistManager />

          <SearchBar
            darkMode={darkMode}
            searchTerm={searchTerm}
            handleInputChange={(e) =>
              handleInputChange(
                e,
                eventsInfo,
                setSearchTerm,
                setSuggestions,
                setWordIndex,
                setSuggestionIndex
              )
            }
            handleKeyDown={(e) =>
              handleKeyDown(
                e,
                suggestions,
                setSearchTerm,
                setWordIndex,
                setSuggestionIndex,
                wordIndex,
                suggestionIndex
              )
            }
            suggestions={suggestions}
            suggestionIndex={suggestionIndex}
            wordIndex={wordIndex}
          />

          <UrlTable
            darkMode={darkMode}
            searchResults={searchResults(sortedUrls, eventsInfo, searchTerm)}
            eventsInfo={eventsInfo}
            handleRemoveUrl={(e) =>
              handleRemoveUrl(e, mainUser, db, totalEarly, early)
            }
            sortConfig={sortConfig}
            handleSort={handleSort}
            filterIds={filterIds}
            handleFilterClick={handleFilterClick(
              setCurrentFilterUrl,
              setShowFilter
            )}
            vividIds={vividIds}
            handleEarlyMonitorToggle={(e) => {
              handleEarlyMonitorToggle(
                e[0],
                e[1],
                mainUser,
                db,
                totalEarly,
                early,
                showModal
              );
            }}
            early={early}
            totalEarly={totalEarly}
            stubhubIds={stubhubIds}
            editFilters={editFilters}
            mutedEvents={mainUser === user.email ? mutedEvents : false}
          />

          {showFilter && !editFilters && (
            <>
              <FilterForm
                eventId={currentFilterUrl[0]}
                handleClose={handleFilterClose(setShowFilter)}
                email={mainUser}
                fullURL={currentFilterUrl[1]}
                eventInfo={currentFilterUrl[2]}
                stubhubId={stubhubIds[currentFilterUrl[0]]}
              />
            </>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default HomePage;
