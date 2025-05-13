import React, { createContext, useState, useContext, useEffect } from "react";
import { createTheme } from '@mui/material';
import ThemeProvider as MUIThemeProvider from '@mui/material/ThemeProvider as MUIThemeProvider';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const userDoc = doc(db, "Logins", user.email);

        getDoc(userDoc).then((docSnapshot) => {
          if (
            docSnapshot.exists() &&
            docSnapshot.data().darkMode !== undefined
          ) {
            setDarkMode(docSnapshot.data().darkMode);
          }
        });
      }
    });

    // Cleanup the observer on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // apply the tailwindcss dark mode class to the body for full dark mode support
    if (darkMode && !document.body.classList.contains("dark")) document.body.classList.add("dark");
    if (!darkMode && document.body.classList.contains("dark")) document.body.classList.remove("dark");
  }, [darkMode]);

  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);


    // Get the currently logged-in user
    const user = auth.currentUser;

    if (user) {
      // Update the user's theme preference in Firestore
      const userDoc = doc(db, "Logins", user.email);
      setDoc(userDoc, { darkMode: newMode }, { merge: true });
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, user }}>
      <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
