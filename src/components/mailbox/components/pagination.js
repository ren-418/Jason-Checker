import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  paginationContainer: {
    marginTop: theme.spacing(2),
  },
  page: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    cursor: "pointer",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.main}`,
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    textAlign: "center",
    userSelect: "none",
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
}));

const Pagination = ({
  currentPage,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) => {
  const classes = useStyles();

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between" // This will space your arrows to the left and right
      alignItems="center"
      className={classes.paginationContainer}
    >
      <Box
        className={`${classes.page} ${!hasPrevPage ? classes.disabled : ""}`}
        onClick={handlePrevPage}
      >
        {"< Previous"}
      </Box>
      {currentPage > 0 && <Box className={classes.page}>{currentPage}</Box>}
      <Box
        className={`${classes.page} ${!hasNextPage ? classes.disabled : ""}`}
        onClick={handleNextPage}
      >
        {"Next >"}
      </Box>
    </Grid>
  );
};

export default Pagination;
