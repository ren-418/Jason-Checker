import React, { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  Typography,
  makeStyles,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 6, 4),
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "500px",
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const BetaAcknowledgmentOverlay = ({ onAcknowledge }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleAcknowledge = () => {
    setOpen(false);
    if (onAcknowledge) onAcknowledge();
  };

  return (
    <Modal
      open={open}
      onClose={() => {}} // Prevent closing without acknowledgment
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={classes.modal}
    >
      <Fade in={open}>
        <Box className={classes.paper}>
          <Typography variant="h6" gutterBottom style={{ color: "black" }}>
            This Product is in Beta
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: "black" }}>
            Thank you for trying our beta product. Please acknowledge that you
            understand this and sign ups for the product will be available soon.
            Please Provide feedback.
          </Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#670004",
              color: "white",
            }}
            className={classes.button}
            onClick={handleAcknowledge}
          >
            Acknowledge
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BetaAcknowledgmentOverlay;
