import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  IconButton,
  Typography,
  Checkbox,
} from "@material-ui/core";
import delete1 from "../../assets/delete.png";
import close from "../../assets/close.png";
import { db, getCurrentUserEmail } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

function MainAccountOverlay({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [subAccounts, setSubAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [maxSubAccounts, setMaxSubAccounts] = useState(null);
  const [subAnalytics, setSubAnalytics] = useState({});

  const [subSettings, setSubSettings] = useState({});

  const fetchSubAccounts = async () => {
    const mainAccountEmail = getCurrentUserEmail();
    const q = query(
      collection(db, "users"),
      where("mainAccount", "==", mainAccountEmail)
    );
    const querySnapshot = await getDocs(q);

    const subSettings = {};
    querySnapshot.docs.forEach((doc) => {
      subSettings[doc.data().email] = doc.data().settings || {};
    });
    setSubSettings(subSettings);

    const subAccounts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setSubAccounts([{ email: mainAccountEmail }, ...subAccounts]);
  };

  const fetchMaxSubAccounts = async () => {
    const docRef = doc(db, "users", getCurrentUserEmail());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMaxSubAccounts(docSnap.data().maxSubAccounts);
    }
  };

  useEffect(() => {
    let unsubscribe = null;

    if (open) {
      fetchSubAccounts();
      fetchMaxSubAccounts();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [open]);

  useEffect(() => {
    let unsubscribe = null;

    if (open && subAccounts.length > 0) {
      unsubscribe = listenForAnalytics(subAccounts);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [open, subAccounts]);

  const listenForAnalytics = (accounts) => {
    const unsubscribes = accounts.map((account) => {
      const docRef = doc(db, "ticketDropIPs", account.email);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setSubAnalytics((prevAnalytics) => ({
            ...prevAnalytics,
            [account.email]: docSnap.data(),
          }));
        }
      });
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  };

  const handleAddSubAccount = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (subAccounts.length >= maxSubAccounts) {
      setError("Maximum Sub Accounts Reached");
      return;
    }
    try {
      if (error) setError(null);
      setEmail("");
      setSubAccounts([...subAccounts, { email }]);

      // format the email to be in lower case
      const formattedEmail = email.toLowerCase();

      const response = await fetch(
        "https://us-central1-phantomchecker.cloudfunctions.net/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formattedEmail,
            mainAccount: getCurrentUserEmail(),
          }),
        }
      );

      if (response && response.status !== 200) {
        setSubAccounts(subAccounts.slice(0, -1));

        const errorResponse = await response.json();
        setError(errorResponse.message);
        return;
      }

      fetchSubAccounts();
    } catch (error) {
      setError("Error Creating Account");
      console.error("Error adding sub account:", error);
    }
  };

  const handleDeleteSubAccount = async (email) => {
    try {
      if (error) setError(null);
      const response = await fetch(
        "https://us-central1-phantomchecker.cloudfunctions.net/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            mainAccountEmail: getCurrentUserEmail(),
          }),
        }
      );

      // if the response is an error, set the error message
      if (response && response.status !== 200) {
        setError(response.message);
        return;
      }

      fetchSubAccounts();
    } catch (error) {
      setError("Error Deleting Account");
      console.error("Error deleting sub account:", error);
    }
  };

  const handleShowTableChange = async (email, checked) => {
    const docRef = doc(db, "users", email);

    setDoc(
      docRef,
      {
        settings: {
          ...subSettings[email],
          showTable: checked,
          editFilters: checked ? true : false,
        },
      },
      { merge: true }
    );

    setSubSettings({
      ...subSettings,
      [email]: {
        ...subSettings[email],
        showTable: checked,
        editFilters: checked ? true : false,
      },
    });
  };

  const handleEditFiltersChange = async (checked, email) => {
    const docRef = doc(db, "users", email);

    setDoc(
      docRef,
      {
        settings: {
          ...subSettings[email],
          editFilters: checked,
        },
      },
      { merge: true }
    );

    setSubSettings({
      ...subSettings,
      [email]: {
        ...subSettings[email],
        editFilters: checked,
      },
    });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    const currentWeek = `${year}-W${getWeekNumber(currentDate)}`;
    return { month, day, currentWeek };
  };

  const getCurrentDate2 = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"xl"}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "1200px", // Set your desired width here
          backgroundColor: "#222222",
          borderRadius: "15px",
        },
      }}
    >
      <div
        style={{
          backgroundColor: "#222222",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2d2d2d",
            borderRadius: "30px",
            padding: "5px 10px",
            position: "relative",
          }}
        >
          <p
            style={{
              color: "#e7e7e7",
              fontWeight: "bold",
              margin: 0,
              flex: 1,
              fontSize: "14px",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Manage Sub Accounts - Current Sub Account: {subAccounts.length}/
            {maxSubAccounts}
          </p>
          <button
            style={{
              backgroundColor: "#515151",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "50%",
              borderRadius: "50%",
              transform: "translateY(-50%)",
              height: "22px",
              width: "22px",
              marginRight: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "'Inter', sans-serif",
            }}
            onClick={handleClose}
          >
            <img src={close} alt="close" />
          </button>
        </div>
        <table
          style={{
            margin: "10px",
            fontSize: "14px",
            color: "#e7e7e7",
            width: "98%",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <tr style={{ backgroundColor: "#2d2d2d", marginBottom: "1px" }}>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "200px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Email
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Daily Clicks
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Weekly Clicks
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Monthly Clicks
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Total Clicks
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Hide URL Table
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Disable Filter
            </th>
            <th
              style={{
                borderTopRightRadius: "5px",
                borderTopLeftRadius: "5px",
                padding: "0px",
                minWidth: "100px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Action
            </th>
          </tr>
          {subAccounts.map((account, index) => {
            const data = subAnalytics[account.email] || {};
            const { month, currentWeek } = getCurrentDate();

            return (
              <tr
                key={account.email}
                style={{
                  // backgroundColor: "#2f408b",
                  backgroundColor: index % 2 === 0 ? "#2f408b" : "#3a4e9e",
                  marginBottom: "1px",
                  fontWeight: "normal",
                  border: "1px solid #313F81",
                  fontFamily: "'Inter', sans-serif",
                  height: "50px",
                }}
              >
                <th
                  style={{
                    minWidth: "200px",
                    fontWeight: "normal",
                    minHeight: "100px",
                  }}
                >
                  {account.email}
                </th>
                <th style={{ minWidth: "100px", fontWeight: "normal" }}>
                  {data?.dailyCount?.[getCurrentDate2()] || 0}
                </th>
                <th style={{ minWidth: "100px", fontWeight: "normal" }}>
                  {data?.weeklyCount?.[currentWeek] || 0}
                </th>
                <th style={{ minWidth: "100px", fontWeight: "normal" }}>
                  {data?.monthlyCount?.[month] || 0}
                </th>
                <th style={{ minWidth: "100px", fontWeight: "normal" }}>
                  {data?.increment || 0}
                </th>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {account.email !== getCurrentUserEmail() && (
                    <Checkbox
                      color="default"
                      onChange={(e) =>
                        handleShowTableChange(account.email, e.target.checked)
                      }
                      checked={subSettings[account.email]?.showTable || false}
                      sx={{
                        color: "#ffffff",
                        "&.Mui-checked": {
                          color: "#ffffff",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    />
                  )}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {account.email !== getCurrentUserEmail() && (
                    <Checkbox
                      color="default"
                      checked={subSettings[account.email]?.editFilters || false}
                      disabled={subSettings[account.email]?.showTable || false}
                      onChange={(e) =>
                        handleEditFiltersChange(e.target.checked, account.email)
                      }
                      sx={{
                        color: "#ffffff",
                        "&.Mui-checked": {
                          color: "#ffffff",
                        },
                        "&.Mui-disabled": {
                          color: "rgba(255, 255, 255, 0.3)",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    />
                  )}
                </td>
                <th style={{ minWidth: "100px" }}>
                  {account.email !== getCurrentUserEmail() && (
                    <IconButton
                      onClick={() => handleDeleteSubAccount(account.id)}
                    >
                      <img
                        src={delete1}
                        alt="Delete"
                        style={{ marginTop: "5px" }}
                      />
                    </IconButton>
                  )}
                </th>
              </tr>
            );
          })}
        </table>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="flex-column"
        >
          <TextField
            autoFocus
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Sub Account Email"
            type="email"
            fullWidth
            variant="outlined"
            style={{
              marginTop: "16px",
              width: "320px",
              color: "#e7e7e7",
              borderRadius: "12px",
              border: "1px solid #313F81",
            }}
            InputProps={{
              style: {
                color: "#e7e7e7",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#e7e7e7",
              },
            }}
          />
          {error !== null && (
            <Typography color="error" style={{ marginTop: "8px" }}>
              {error}
            </Typography>
          )}
          <button
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#0d0d0d",
              width: "320px",
              fontSize: "14px",
              color: "#e7e7e7",
              border: "1px solid #313F81",
              borderRadius: "12px",
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
              marginTop: "10px",
            }}
            onClick={handleAddSubAccount}
          >
            Add Sub Account Email
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default MainAccountOverlay;
