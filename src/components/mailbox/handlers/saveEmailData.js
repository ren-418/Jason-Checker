import { auth, db } from "../../../firebase";
import { doc, setDoc, increment } from "firebase/firestore";

const updateUserData = async (user) => {
  const ipAddress = await fetch(
    "https://mg.phantomcheckerapi.com/api-internal/extra/get-ip",
    {
      headers: {
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.ip);
  const userAgent = navigator.userAgent;
  const userDocRef = doc(db, "ticketDropIPs", user.email);

  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // months are zero-indexed, so we add 1
  const day = currentDate.getDate().toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const currentWeek = `${year}-W${getWeekNumber(currentDate)}`;

  const ipData = `${ipAddress}-${userAgent}`;

  await setDoc(
    userDocRef,
    {
      userData: {
        [ipData]: increment(1),
      },
      monthlyCount: {
        [month]: increment(1),
      },
      weeklyCount: {
        [currentWeek]: increment(1),
      },
      dailyCount: {
        [`${year}-${month}-${day}`]: increment(1),
      },
      increment: increment(1),
    },
    { merge: true }
  );
};

// Helper function to get the week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export default updateUserData;
