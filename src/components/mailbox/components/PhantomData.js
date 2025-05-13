import React from "react";
import { Typography, Box } from "@material-ui/core";

function PhantomData({
  event,
  darkMode,
  stubhubData,
  phantomGetIn,
  getAverage,
  classes,
}) {
  const paddingLeft = event.early || event.isLowStock ? "10px" : "2px";

  return (
    <>
      <Typography
        variant="h6"
        className={classes.phantomTitle}
        style={{
          color: "#6C3D8A",
          paddingLeft: paddingLeft,
        }}
      >
        Phantom Data
      </Typography>
      <Box
        mt={1}
        style={{
          lineHeight: "1.75",
          paddingLeft: paddingLeft,
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: darkMode ? "#E7E7E7" : "#000000",
          }}
        >
          Get In:{" "}
          <strong>
            {!event.stubhubId || !stubhubData
              ? "N/A"
              : `$${phantomGetIn.replace("$", "")}`}
          </strong>{" "}
          Average:{" "}
          <strong>
            {!event.stubhubId || !stubhubData
              ? "N/A"
              : stubhubData?.total_data
              ? `$${Object.values(getAverage(stubhubData) || {})[0]?.replace(
                  "$",
                  ""
                )}`
              : "N/A"}
          </strong>
        </Typography>
      </Box>
    </>
  );
}

export default PhantomData;
