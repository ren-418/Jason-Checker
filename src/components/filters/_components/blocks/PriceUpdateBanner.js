import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

export const PriceUpdateBanner = () => {
  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "#670004",
        color: "white",
        padding: "12px 16px",
        marginBottom: "16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <WarningIcon style={{ color: "white" }} />
      <Typography style={{ fontFamily: "'Inter', sans-serif" }}>
        Your previous filters (before the switch to all-in pricing) will still
        be used for monitoring, so there's no immediate urgency to update them.
      </Typography>
    </Paper>
  );
};

export const PriceUpdateModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#222222",
          borderRadius: "15px",
          maxWidth: "500px",
        },
      }}
    >
      <DialogContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <WarningIcon
            style={{ color: "#670004", marginRight: "12px", fontSize: 28 }}
          />
          <Typography
            variant="h6"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "white",
              fontWeight: "bold",
            }}
          >
            All-In Pricing Update
          </Typography>
        </div>
        <Typography
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "white",
            marginBottom: "8px",
          }}
        >
          Filters now use all-in pricing. Kindly update your filters accordingly
          and resubmit when ready.
        </Typography>
        <Typography
          style={{ fontFamily: "'Inter', sans-serif", color: "white" }}
        >
          Your previous filters (before the switch to all-in pricing) will still
          be used for monitoring, so there's no immediate urgency to update
          them.
        </Typography>
      </DialogContent>
      <DialogActions style={{ padding: "0 24px 20px 24px" }}>
        <Button
          onClick={onClose}
          variant="contained"
          style={{
            backgroundColor: "#670004",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            borderRadius: "8px",
            textTransform: "none",
            padding: "8px 16px",
          }}
        >
          Acknowledge
        </Button>
      </DialogActions>
    </Dialog>
  );
};
