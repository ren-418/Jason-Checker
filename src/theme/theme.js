import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "rgb(82, 17, 20)" }, // Deep red
      secondary: { main: "#ffffff" },
      ...(mode === "dark"
        ? {}
        : {
            background: { default: "#fff", paper: "#f5f5f5" },
          }),
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

export default getTheme;
