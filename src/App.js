import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAndActivate, getValue } from "firebase/remote-config"; // New imports here
import { auth, remoteConfig } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/index";
import HomePage from "./components/HomePage/index";
import Purchase from "./components/Purchase/Purchase";
import Info from "./components/Purchase/Info";
// import Snowfall from "react-snowfall";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch remote config values every few minutes
    const fetchInterval = 1 * 60 * 1000;

    const fetchRemoteConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const remoteVersion = getValue(
          remoteConfig,
          "frontend_version"
        ).asString();
        const localVersion = localStorage.getItem("frontend_version");

        if (!localVersion) {
          localStorage.setItem("frontend_version", remoteVersion);
        }
        if (remoteVersion !== localVersion) {
          localStorage.setItem("frontend_version", remoteVersion);
          window.location.reload(true);
        }
      } catch (error) {
        console.error("Failed to fetch remote config:", error);
      }
    };

    fetchRemoteConfig();
    const intervalId = setInterval(fetchRemoteConfig, fetchInterval);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {user ? (
        <HomePage />
      ) : (
        <Router>
          <Routes>
            <Route path="/info" element={<Info />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
