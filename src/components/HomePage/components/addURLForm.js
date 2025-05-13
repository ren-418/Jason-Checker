import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function AddURLForm({
  darkMode,
  handleAddUrl,
  newUrls,
  setNewUrls,
  editFilters,
}) {
  // Calculate the number of rows dynamically
  const numberOfRows = newUrls.length > 4 ? newUrls.length : 10;

  return (
    <>
      <br />
      <form
        onSubmit={handleAddUrl}
        className="add-url-form"
        style={{
          userSelect: "none",
        }}
      >
        {!editFilters ? (
          <>
            <TextField
              id="add-urls-textarea"
              label="Add URLs"
              multiline={true}
              rows={numberOfRows}
              value={newUrls.join("\n")}
              onChange={(e) => setNewUrls(e.target.value.split("\n"))}
              variant="outlined"
              fullWidth={true}
              style={{
                backgroundColor: darkMode ? "#0d0d0d" : "",
                border: "1px solid #670004",
              }}
            />
            <Button
              type="submit"
              style={{
                backgroundColor: "#670004",
                color: "#e7e7e7",
                marginBottom: "12px",
                minWidth: "157px",
                textAlign: "center",
                borderRadius: "12px",
                padding: "4px",
                fontSize: "15px",
                marginTop: "-18px",
                border: "1px solid #521114",
                textTransform: "none", // Add this line
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Add URLs
            </Button>
          </>
        ) : null}
      </form>
    </>
  );
}

export default AddURLForm;
