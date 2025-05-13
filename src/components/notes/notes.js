import React, { useRef, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../../ThemeContext";

function NotesModal({ open, handleClose, userEmail, eventId, notesDocument }) {
  const noteRef = useRef(notesDocument[eventId] || "");
  const { darkMode } = useTheme();

  useEffect(() => {
    noteRef.current = notesDocument[eventId] || "";
  }, [notesDocument, eventId]);

  const handleSaveNote = async () => {
    try {
      const eventNotesCollectionRef = doc(db, "eventNotes2", userEmail);

      await setDoc(
        eventNotesCollectionRef,
        {
          notes: {
            [eventId]: noteRef.current.value,
          },
        },
        { merge: true }
      );
      handleClose();
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in={open}>
        <div
          style={{
            width: "80%",
            maxWidth: "600px",
            backgroundColor: darkMode ? "#333" : "#fff",
            borderRadius: "10px",
            padding: "20px",
            position: "relative",
            outline: "none",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <IconButton
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" style={{ marginBottom: "20px" }}>
            Event Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            inputRef={noteRef}
            defaultValue={notesDocument[eventId] || ""}
            variant="outlined"
            placeholder="Write your notes here..."
            InputProps={{
              style: { color: darkMode ? "#fff" : "#000" },
            }}
          />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleSaveNote}
            >
              Save Note
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default NotesModal;
