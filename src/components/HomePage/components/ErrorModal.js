import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const Modal = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "white",
          color: "black",
          minWidth: "300px",
        },
      }}
    >
      <DialogTitle>Notice</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
