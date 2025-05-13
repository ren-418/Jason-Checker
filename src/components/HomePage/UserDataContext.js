import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db, getCurrentUserEmail } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRef } from "react";
import moment from "moment-timezone";
import LZString from "lz-string";
import { convertDatesToLocalTimezone2 } from "../OnSales";

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mainUser, setMainUser] = useState(null);
  const [eventsInfo, setEventsInfo] = useState({});
  const [stubHubInfo, setStubHubInfo] = useState({});
  const [filterIds, setFilterIds] = useState([]);
  const [urls, setUrls] = useState([]);
  const [TotalUrls, setTotalUrls] = useState(0);
  const [artistUrls, setArtistUrls] = useState([]);
  const [notesDocument, setNotesDocument] = useState({});
  const [early, setEarly] = useState([]);
  const [totalEarly, setTotalEarly] = useState(0);
  const [mutedEvents, setMutedEvents] = useState({});
  const [editFilters, setEditFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [qEvents, setQEvents] = useState([]);
  const [twentyFiveDay, setTwentyFiveDay] = useState(false);
  const [vividIds, setVividIds] = useState({});
  const [planType, setPlanType] = useState(undefined);
  const [allowedEmails, setAllowedEmails] = useState([]);

  const [phantomAllowed, setPhantomAllowed] = useState(true);

  const [OnSaleData, setOnSaleData] = useState({});

  const eventInfoRef = useRef({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let mainAccount = getCurrentUserEmail();
        const userDocRef = doc(db, "users", getCurrentUserEmail());

        const unsubscribeSubUserSnapshot = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userSnapshotData = docSnapshot.data();

              if (userSnapshotData.role === "sub") {
                mainAccount = userSnapshotData.mainAccount;
                setEditFilters(userSnapshotData.settings?.editFilters || false);
                setShowTable(userSnapshotData.settings?.showTable || false);
              } else {
                setEditFilters(false);
                setShowTable(false);
              }

              setMainUser(mainAccount);

              fetchUserSpecificData(
                mainAccount,
                userSnapshotData.role !== "sub"
              );
            }
          }
        );

        return () => unsubscribeSubUserSnapshot();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchOnSaleData = async () => {
    const targetSalesDay = moment(moment().tz("America/New_York").toDate())
      .tz("America/New_York")
      .startOf("day");

    if (targetSalesDay.isDST()) {
      targetSalesDay.add(1, "hours");
    }

    const salesCollection = collection(db, "OnSale2");

    const qTm = query(
      salesCollection,
      where("salesDay", "==", targetSalesDay.toDate()),
      where("eventType", "==", "tm"),
      orderBy("date", "desc"),
      limit(1)
    );

    const onSaleSnapshot = await getDocs(qTm);
    let onsaleDoc = null;

    onSaleSnapshot.forEach((doc) => {
      const data = doc.data();
      onsaleDoc = data;
    });

    if (!onsaleDoc) {
      console.log("No matching onsale doc found");
    }

    const saleData = convertDatesToLocalTimezone2(onsaleDoc.data);

    const combinedData = Object.entries(saleData).reduce(
      (acc, [hour, hourData]) => {
        hourData.forEach((event) => {
          if (event.u) {
            const parsedUrl = new URL(event.u);
            const event_id = parsedUrl.pathname.split("/").pop();

            if (!acc[event_id]) {
              acc[event_id] = [];
            }

            const isDuplicate = acc[event_id].some((e) => {
              return (
                e.v === event.v &&
                JSON.stringify(e.o) === JSON.stringify(event.o) &&
                e.n === event.n &&
                e.p === event.p &&
                JSON.stringify(e.a) === JSON.stringify(event.a) &&
                e.d === event.d &&
                e.u === event.u &&
                e.c === event.c &&
                e.time === hour
              );
            });

            if (!isDuplicate) {
              acc[event_id].push({
                venue: event.v,
                offer: event.o,
                eventName: event.n,
                priceRange: event.p,
                artistUrl: event.a,
                date: event.d,
                url: event.u,
                capacity: event.c,
                time: hour,
              });
            }
          }
        });
        return acc;
      },
      {}
    );

    setOnSaleData(combinedData);
  };
  useEffect(() => {
    if (!user || !mainUser) return;

    let sessionSubscribe;
    const timeoutId = setTimeout(() => {
      const sessionDocRef = doc(db, "sessions", user.email);
      sessionSubscribe = onSnapshot(sessionDocRef, async (lir) => {
        if (lir.exists()) {
          const data = lir.data();

          const ipAddress = await fetch(
            "https://mg.phantomcheckerapi.com/api-internal/extra/get-ip",
            {
              headers: {
                Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                email: getCurrentUserEmail(),
              },
            }
          )
            .then((res) => res.json())
            .then((data) => data.ip);

          const userAgent = navigator.userAgent;

          if (userAgent && userAgent.includes("PhantomChecker")) {
            if (!userAgent.includes("PhantomChecker/1.1.3")) {
              if (!userAgent.includes("Mac")) {
                // setPhantomAllowed(false);
              }
            }
          }

          const cookiesInfo = document.cookie.split("; ");

          let xamInfo = null;

          for (let i = 0; i < cookiesInfo.length; i++) {
            const cookie = cookiesInfo[i].split("=");
            if (cookie[0] === "sessionid") {
              xamInfo = cookie[1];
            }
          }

          let sessionExists = false;
          for (let i = 0; i < data.sessions.length; i++) {
            const session = data.sessions[i];
            if (
              session.sessionId === xamInfo &&
              session.ipAddress === ipAddress &&
              session.userAgent === userAgent
            ) {
              sessionExists = true;
            }
          }

          if (!sessionExists) {
            document.cookie = "sessionid=;";
            auth.signOut();
          }
        } else {
          console.log("session does not exist");
          const ipAddress = await fetch(
            "https://mg.phantomcheckerapi.com/api-internal/extra/get-ip",
            {
              headers: {
                Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                email: getCurrentUserEmail(),
              },
            }
          )
            .then((res) => res.json())
            .then((data) => data.ip)
            .catch((error) => {
              console.error("Error fetching IP address: ", error);
            });

          const userAgent = navigator.userAgent;

          const cookies = document.cookie.split("; ");

          let sessionId = null;
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === "sessionid") {
              sessionId = cookie[1];
            }
          }

          const newSession = {
            ipAddress,
            userAgent,
            sessionId,
            timestamp: new Date(),
          };

          setDoc(sessionDocRef, {
            sessions: [newSession],
            totalSessions: 1,
          });
        }
      });
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      if (sessionSubscribe) sessionSubscribe();
    };
  }, [user, mainUser]);

  const fetchUserSpecificData = (mainAccount, isMainAccount) => {
    const userDoc = doc(db, "users", mainAccount);
    return onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setAllowedEmails(userData.allowedEmails2 || []);
        setUrls(userData.urls?.reverse() || []);
        setTotalUrls(userData.TotalUrls || 0);
        setEarly(userData.early || []);
        setTotalEarly(userData.TotalEarly || 0);
        setMutedEvents(userData.mutedEvents || {});
        setTwentyFiveDay(userData.twentyFiveDollarDay || false);
        if (userData.stripe && isMainAccount) {
          setPlanType("stripe");
        }
        if (userData.whop && isMainAccount) {
          setPlanType("whop");
        }
        setArtistUrls(userData.artistUrls || []);
      }
    });
  };

  useEffect(() => {
    if (!mainUser) return;

    const unsubscribes = [];

    const fetchEventsInfoAndStubHubData = async () => {
      let cachedEventInfo = {};
      if (localStorage.getItem("eventInfo")) {
        try {
          const decodedEventInfoJSON = LZString.decompressFromBase64(
            localStorage.getItem("eventInfo")
          );
          cachedEventInfo = JSON.parse(decodedEventInfoJSON) || {};
          setEventsInfo(cachedEventInfo);
          eventInfoRef.current = cachedEventInfo;
        } catch (error) {
          console.error("Error parsing cached event info:", error);
        }
      }

      const filterIdsDoc = doc(db, "filterIds", mainUser);
      const unsubscribeFilterIds = onSnapshot(filterIdsDoc, (docSnapshot) => {
        const data = docSnapshot.data() || {};
        const filterIds = data.filterIds || [];

        setFilterIds(filterIds);
      });

      unsubscribes.push(unsubscribeFilterIds);

      const eventInfoCollection = query(
        collection(db, "event_info5"),
        where("email", "==", mainUser),
        where("last_modified", ">=", new Date(Date.now() - 6 * 60 * 60 * 1000))
      );

      const fetchInitEventInfo = async () => {
        try {
          const res = await fetch(
            "https://mg.phantomcheckerapi.com/api/firebase/get-users-full-events",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
              },
              body: JSON.stringify({ email: mainUser }),
            }
          );
          const data = await res.json();

          // Merge new data with cached data
          const mergedData = { ...cachedEventInfo, ...data };

          // Update local state
          setEventsInfo(mergedData);
          eventInfoRef.current = mergedData;

          // Save to localStorage
          const compressedEventInfo = LZString.compressToBase64(
            JSON.stringify(mergedData)
          );
          localStorage.setItem("eventInfo", compressedEventInfo);

          return mergedData;
        } catch (error) {
          console.error("Error fetching initial event info:", error);
          return cachedEventInfo; // Return cached data if fetch fails
        }
      };

      await fetchInitEventInfo();

      const unsubscribeEventInfo = onSnapshot(
        eventInfoCollection,
        (docSnapshot) => {
          let currentEventInfo = { ...eventInfoRef.current };

          docSnapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
              const data = change.doc.data();
              currentEventInfo[data.eventId] = data.eventData;
            }
          });

          eventInfoRef.current = currentEventInfo;
          setEventsInfo(currentEventInfo);

          const compressedEventInfo = LZString.compressToBase64(
            JSON.stringify(currentEventInfo)
          );
          localStorage.setItem("eventInfo", compressedEventInfo);
        },
        (error) => {
          console.error("Error fetching event info document: ", error);
        }
      );

      unsubscribes.push(unsubscribeEventInfo);

      const qEventsDoc = doc(db, "QEvents", "info");
      const unsubscribeQEvents = onSnapshot(qEventsDoc, (docSnapshot) => {
        const data = docSnapshot.data();

        const urls = data.urls || [];
        let eventIds = [];
        urls.forEach((url) => {
          const parsedURL = new URL(url);
          let eventId = parsedURL.pathname.split("/").pop();
          eventIds.push(eventId);
        });

        setQEvents(eventIds);
      });

      unsubscribes.push(unsubscribeQEvents);

      const stubhubDoc = doc(db, "stubhubID2", mainUser);
      const unsubscribeStubHub = onSnapshot(stubhubDoc, (docSnapshot) => {
        const data = docSnapshot.data()?.stubhubUrls || {};

        setStubHubInfo(data);
      });

      unsubscribes.push(unsubscribeStubHub);

      const vividDoc = doc(db, "vividID2", mainUser);
      const unsubscribeVivid = onSnapshot(vividDoc, (docSnapshot) => {
        const data = docSnapshot.data()?.vividUrls || {};

        setVividIds(data);
      });

      unsubscribes.push(unsubscribeVivid);

      const eventNoteDocRef = doc(db, "eventNotes2", mainUser);
      const unsubscribeEventNotes = onSnapshot(
        eventNoteDocRef,
        (querySnapshot) => {
          const querySnapshotData = querySnapshot.data();
          if (querySnapshotData) {
            const data = querySnapshotData.notes || {};

            setNotesDocument(data);
          }
        }
      );

      unsubscribes.push(unsubscribeEventNotes);
    };

    fetchEventsInfoAndStubHubData();
    fetchOnSaleData();

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [mainUser]);

  const value = {
    user,
    eventsInfo,
    stubHubInfo,
    urls,
    TotalUrls,
    notesDocument,
    early,
    totalEarly,
    mutedEvents,
    qEvents,
    allowedEmails,
    editFilters,
    showTable,
    mainUser,
    eventInfoRef,
    twentyFiveDay,
    vividIds,
    setTwentyFiveDay,
    planType,
    phantomAllowed,
    OnSaleData,
    filterIds,
    artistUrls,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

export default EventProvider;
