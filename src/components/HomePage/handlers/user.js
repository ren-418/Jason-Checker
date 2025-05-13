import { doc, runTransaction } from "firebase/firestore";
import { auth } from "../../../firebase";

const handleFilterClick = (setCurrentFilterUrl, setShowFilter) => (url) => {
  setCurrentFilterUrl(url);
  setShowFilter(true);
};

const handleFilterClose = (setShowFilter) => () => {
  setShowFilter(false);
};

const handleSignOut = (db, user) => async () => {
  try {
    const cookies = document.cookie.split("; ");
    let sessionId = null;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === "sessionid") {
        sessionId = cookie[1];
      }
    }

    const sessionDocRef = doc(db, "sessions", user.email);

    await runTransaction(db, async (transaction) => {
      const sessionDocSnapshot = await transaction.get(sessionDocRef);

      if (!sessionDocSnapshot.exists()) {
        return;
      }

      const sessionInfoDoc = sessionDocSnapshot.data();
      const SessionInfo = sessionInfoDoc.sessions;
      const newSessionInfo = SessionInfo.filter(
        (session) => session.sessionId !== sessionId
      );

      transaction.update(sessionDocRef, { sessions: newSessionInfo });
    });

    auth.signOut();
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};

export { handleFilterClick, handleFilterClose, handleSignOut };
