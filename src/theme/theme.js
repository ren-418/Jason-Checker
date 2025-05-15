import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#fff" : "#0f172a" }, // White in dark, navy in light
      secondary: { main: mode === "dark" ? "#232323" : "#f8fafc" },
      background: {
        default: mode === "dark" ? "#181818" : "#fff",
        paper: mode === "dark" ? "#232323" : "#fff",
        sidebar: mode === "dark" ? "#181818" : "#f8fafc",
      },
      text: {
        primary: mode === "dark" ? "#fff" : "#1e293b",
        secondary: mode === "dark" ? "#d1d5db" : "#64748b",
      },
    },
    typography: {
      fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
  });

export default getTheme;
