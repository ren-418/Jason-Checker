import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  search: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  formPaginationWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    position: "relative",
  },
  searchField: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },

  searchDark: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
    backgroundColor: "#424242",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
    width: "75%",
  },
  searchButton: {
    padding: "10px 20px",
    height: "50px",
    whiteSpace: "nowrap",
  },
  signOut: {
    position: "absolute",
    left: "10px",
    top: "120px",
    marginTop: "20px",
  },
  iconButton: {
    position: "absolute",
    left: "-335px",
    top: "-10px",
    backgroundColor: "#121212",
    width: "45px",
    "&:hover": {
      backgroundColor: "black",
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
    width: "26px",
    height: "26px",
  },
  Readall: {
    position: "absolute",
    right: "10px",
    top: "20px",
    zIndex: 998
  },
}));

export default useStyles;
