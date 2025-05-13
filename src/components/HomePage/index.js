import AppHeader from "../appBar";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicketDrops from "../mailbox/ticketDrops";
import HomePage from "./Homepage";
import { useState } from "react";
import { EventProvider } from "./UserDataContext";
import SalesPage from "../OnSales";

const App = ({ handleSubmitFlag, handleFlagAfter }) => {
  const [showTicketDrops, setShowTicketDrops] = useState(false);

  return (
    <Router>
      <EventProvider>
        <AppHeader showTicketDrops={showTicketDrops} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                handleSubmitFlag={handleSubmitFlag}
                handleFlagAfter={handleFlagAfter}
                handleShowTicketDrops={setShowTicketDrops}
              />
            }
          />
          <Route path="/sales" element={<SalesPage />} />
          {!showTicketDrops && (
            <Route
              path="/ticket-drops"
              element={
                <TicketDrops
                  handleSubmitFlag={handleSubmitFlag}
                  handleFlagAfter={handleFlagAfter}
                />
              }
            />
          )}
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;
