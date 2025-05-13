import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CustomThemeProvider } from "./ThemeContext";
import "./css/Globals.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function MainApp() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <App />
    </CustomThemeProvider>
  );
}

root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);