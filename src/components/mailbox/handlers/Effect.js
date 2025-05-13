import { useEffect } from "react";

import { db, storage } from "../../../firebase";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { playNotificationSound } from "./soundHandlers";
import { getDownloadURL, ref } from "firebase/storage";

const initializeSoundUrls = async () => {
  const soundUrls = {};

  const DEFAULT_SOUNDS = [
    "Default.mp3",
    "metro_msm.mp3",
    "short_bongo.mp3",
    "Boat_Horn.mp4",
    "airplane_chime.mp3",
    "tick.mp3",
    "chime.mp3",
    "boop.mp3",
    "arpeggio.mp3",
    "sweet_text.mp3",
    "argon.mp3",
  ];

  for (const sound of DEFAULT_SOUNDS) {
    const soundRef = ref(storage, `default_sounds/${sound}`);
    const url = await getDownloadURL(soundRef);
    soundUrls[sound] = url;
  }
  return soundUrls;
};

export const useTableEffects = (
  user,
  mainUser,
  setLoading,
  firstRender,
  setEmails,
  searchQuery,
  lastVisible,
  currentPage,
  firstEventIds,
  lastDocs,
  matchingEventIds,
  setCurrentPage,
  setFirstEventIds,
  filterTicketQuantity,
  eventInfoRef,
  soundUrls,
  soundSettings,
  sortOptions,
  urls,
  OnSaleData,
  setViewMode
) => {
  useEffect(() => {
    const initialize = async () => {
      const mailBoxView = localStorage.getItem("mailBoxView") || "list";
      setViewMode(mailBoxView);

      if (user?.email === undefined) return;
      soundUrls.current = await initializeSoundUrls();

      const unsubscribe = onSnapshot(
        doc(db, "userSounds2", user.email),
        (doc) => {
          if (doc.exists()) {
            soundSettings.current = doc.data();

            const mailBoxView = doc.data().mailBoxView || "list";

            localStorage.setItem("mailBoxView", mailBoxView);

            setViewMode(mailBoxView);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    };

    initialize();
  }, [user, soundSettings, soundUrls, setViewMode, firstRender]);

  useEffect(() => {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    function onTidioChatApiReady() {
      window.tidioChatApi.display(false);
    }

    if (window.tidioChatApi) {
      window.tidioChatApi.on("ready", onTidioChatApiReady);
    } else {
      document.addEventListener("tidioChat-ready", onTidioChatApiReady);
    }

    return () => {
      if (window.tidioChatApi) {
        window.tidioChatApi.display(true);
      }
    };
  }, []);

  useEffect(() => {
    if (!user || !user.email || !mainUser) return;
    setLoading(true);
    firstRender.current = true;

    const emailCollectionRef = collection(db, "emails2", mainUser, "emails");
    let q;

    const baseQuery = () => {
      const baseQ = query(
        emailCollectionRef,
        orderBy("timestamp", "desc"),
        limit(filterTicketQuantity && filterTicketQuantity !== 0 ? 500 : 100)
      );

      if (currentPage > 0 && lastVisible.current[currentPage - 1]) {
        return query(baseQ, startAfter(lastVisible.current[currentPage - 1]));
      }
      return baseQ;
    };

    switch (sortOptions[0]) {
      case "saleIndicator":
        let eventIds = [];
        for (let i = 0; i < urls.length; i++) {
          const parsedURL = new URL(urls[i]);
          let eventId = parsedURL.pathname.split("/").pop();
          if (OnSaleData[eventId]) {
            eventIds.push(eventId);
          }
        }
        eventIds = eventIds.filter((id) => id);
        eventIds = eventIds.slice(0, 10);
        if (eventIds.length > 0) {
          q = query(
            emailCollectionRef,
            where("eventId", "in", eventIds),
            orderBy("timestamp", "desc"),
            limit(100)
          );
        }
        break;
      default:
        if (sortOptions.length > 0) {
          const typeFilters = sortOptions.filter(
            (option) => option !== "saleIndicator"
          );
          if (typeFilters.length > 0) {
            const typeMap = {
              earlyMonitor: "early",
              axs: "axs",
              mlb: "mlb",
              seatgeek: "seatgeek",
              priceDrops: "PriceDrop",
              queueDrops: "queue",
              lowStock: "TMLow",
              stubhub: "stubhub",
              ticketmaster: "TMUS",
              evenue: "evenue",
              artist: "artist",
              removeOnsalePresale: "TMUS",
            };

            const types = typeFilters
              .map((filter) => typeMap[filter])
              .filter(Boolean);

            if (types.length > 0) {
              q = query(
                emailCollectionRef,
                where("type", "in", types),
                orderBy("timestamp", "desc"),
                limit(100)
              );
            } else {
              q = baseQuery();
            }
          } else {
            q = baseQuery();
          }
        } else {
          q = baseQuery();
        }
    }

    let unsubscribeEmails;

    if (searchQuery === "") {
      if (!q) return;
      unsubscribeEmails = onSnapshot(q, (snapshot) => {
        setLoading(false);
        let newEmailDatas = [];

        let removeOnsalePresaleEventIds = [];

        if (Object.keys(sortOptions).length !== 0) {
          if (sortOptions.includes("removeOnsalePresale")) {
            for (let i = 0; i < urls.length; i++) {
              const parsedURL = new URL(urls[i]);
              let eventId = parsedURL.pathname.split("/").pop();
              if (OnSaleData[eventId]) {
                removeOnsalePresaleEventIds.push(eventId);
              }
            }
          }
        }

        snapshot.docs.forEach((doc) => {
          const emailData = doc.data();

          if (
            filterTicketQuantity &&
            filterTicketQuantity !== 0 &&
            emailData.quantity < filterTicketQuantity
          ) {
            return;
          }

          if (Object.keys(sortOptions).length !== 0) {
            if (sortOptions.includes("removeOnsalePresale")) {
              if (removeOnsalePresaleEventIds.includes(emailData.eventId)) {
                return;
              }
            }
          }

          newEmailDatas.push({ ...emailData, uuid: doc.id });
        });

        if (snapshot.docs.length > 0) {
          if (currentPage === 0) {
            lastVisible.current = [snapshot.docs[snapshot.docs.length - 1]];
          } else {
            lastVisible.current[currentPage] =
              snapshot.docs[snapshot.docs.length - 1];
          }
        }

        if (Object.keys(sortOptions).length !== 0) {
          if (sortOptions.includes("removeOnsalePresale")) {
            newEmailDatas = newEmailDatas.filter(
              (email) => !removeOnsalePresaleEventIds.includes(email.eventId)
            );
          }
        }

        // Group emails by eventId and timestamp to handle identical events
        const groupedEmails = new Map();

        // Process all emails
        newEmailDatas.forEach((email) => {
          const key = `${email.eventId}-${email.timestamp}`;
          if (!groupedEmails.has(key)) {
            groupedEmails.set(key, []);
          }
          groupedEmails.get(key).push(email);
        });

        // Flatten and sort groups
        const sortedEmails = [];

        // Sort by timestamp first (newest first)
        Array.from(groupedEmails.keys())
          .sort((a, b) => {
            // Get timestamps directly from an email in each group
            const groupA = groupedEmails.get(a)[0];
            const groupB = groupedEmails.get(b)[0];
            const timestampA = new Date(groupA.timestamp);
            const timestampB = new Date(groupB.timestamp);
            return timestampB - timestampA;
          })
          .forEach((key) => {
            // Sort within each timestamp group by UUID to ensure consistent order
            const group = groupedEmails.get(key);
            group.sort((a, b) => a.uuid.localeCompare(b.uuid));
            sortedEmails.push(...group);
          });

        setEmails(sortedEmails);

        if (firstRender.current) {
          firstRender.current = false;
        } else {
          const changes = snapshot.docChanges();
          const addedDocs = changes.filter((change) => {
            if (change.type === "added") {
              if (filterTicketQuantity && filterTicketQuantity !== 0) {
                if (change.doc.data().quantity < filterTicketQuantity) {
                  return false;
                }
              }

              return change;
            }
          });

          if (addedDocs.length > 0 && currentPage === 0) {
            const recentEmail = addedDocs[0].doc.data();

            playNotificationSound(
              recentEmail.quantity,
              recentEmail.eventId,
              eventInfoRef.current,
              user,
              recentEmail.eventUrl,
              soundUrls,
              soundSettings
            );
          }
        }
      });
    }

    return () => {
      if (unsubscribeEmails) unsubscribeEmails();
    };
  }, [
    user,
    currentPage,
    searchQuery,
    mainUser,
    filterTicketQuantity,
    sortOptions,
  ]);

  useEffect(() => {
    if (!user || !user.email || !mainUser || firstEventIds === null) return;
    setLoading(true);
    setEmails([]);

    let latestTimestamp = 0;

    const emailCollectionRef = collection(db, "emails2", mainUser, "emails");
    if (searchQuery !== "" && firstEventIds.length === 0) {
      setLoading(false);
    }

    const chunkedEventIds = [];
    for (let i = 0; i < firstEventIds.length; i += 10) {
      chunkedEventIds.push(firstEventIds.slice(i, i + 10));
    }

    const unsubscribeAll = chunkedEventIds.map((eventIds) => {
      let q;
      if (currentPage === 0 || !lastDocs.current[eventIds[0]]) {
        if (
          filterTicketQuantity === undefined ||
          filterTicketQuantity === 0 ||
          filterTicketQuantity === ""
        ) {
          q = query(
            emailCollectionRef,
            where("eventId", "in", eventIds),
            orderBy("timestamp", "desc"),
            limit(100)
          );
        } else {
          q = query(
            emailCollectionRef,
            orderBy("quantity"),
            orderBy("timestamp", "desc"),
            limit(100),
            where("eventId", "in", eventIds),
            where(
              "quantity",
              ">=",
              filterTicketQuantity ? filterTicketQuantity : 0
            )
          );
        }
      } else {
        if (
          filterTicketQuantity === undefined ||
          filterTicketQuantity === 0 ||
          filterTicketQuantity === ""
        ) {
          q = query(
            emailCollectionRef,
            where("eventId", "in", eventIds),
            orderBy("timestamp", "desc"),
            startAfter(lastDocs.current[eventIds[0]]),
            limit(100)
          );
        } else {
          q = query(
            emailCollectionRef,
            orderBy("quantity"),
            orderBy("timestamp", "desc"),
            where("eventId", "in", eventIds),
            startAfter(lastDocs.current[eventIds[0]]),
            limit(100),
            where(
              "quantity",
              ">=",
              filterTicketQuantity ? filterTicketQuantity : 0
            )
          );
        }
      }

      return onSnapshot(q, (snapshot) => {
        let updatedEmails = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const emailData = { ...change.doc.data(), uuid: change.doc.id };
            updatedEmails.push(emailData);

            const emailTimestamp = new Date(emailData.timestamp).getTime();
            if (emailTimestamp > latestTimestamp) {
              latestTimestamp = emailTimestamp;
              playNotificationSound(
                emailData.quantity,
                emailData.eventId,
                eventInfoRef.current,
                user,
                emailData.eventUrl,
                soundUrls,
                soundSettings
              );
            }
          }
        });

        if (updatedEmails.length > 0) {
          setEmails((prevEmails) => {
            // Group emails by eventId and timestamp to handle identical events
            const groupedEmails = new Map();

            // First, process existing emails
            prevEmails.forEach((email) => {
              const key = `${email.eventId}-${email.timestamp}`;
              if (!groupedEmails.has(key)) {
                groupedEmails.set(key, []);
              }
              groupedEmails.get(key).push(email);
            });

            // Then, process new emails
            updatedEmails.forEach((email) => {
              const key = `${email.eventId}-${email.timestamp}`;
              if (!groupedEmails.has(key)) {
                groupedEmails.set(key, []);
              }
              groupedEmails.get(key).push(email);
            });

            // Flatten and sort groups
            const combinedEmails = [];

            // Sort by timestamp first (newest first)
            Array.from(groupedEmails.keys())
              .sort((a, b) => {
                // Get timestamps directly from an email in each group
                const groupA = groupedEmails.get(a)[0];
                const groupB = groupedEmails.get(b)[0];
                const timestampA = new Date(groupA.timestamp);
                const timestampB = new Date(groupB.timestamp);
                return timestampB - timestampA;
              })
              .forEach((key) => {
                // Sort within each timestamp group by UUID to ensure consistent order
                const group = groupedEmails.get(key);
                group.sort((a, b) => a.uuid.localeCompare(b.uuid));
                combinedEmails.push(...group);
              });

            return combinedEmails;
          });
        }

        if (snapshot.docs.length > 0) {
          lastDocs.current[eventIds[0]] =
            snapshot.docs[snapshot.docs.length - 1];
        }
        setLoading(false);
      });
    });

    return () => unsubscribeAll.forEach((unsubscribe) => unsubscribe());
  }, [user, firstEventIds, currentPage, mainUser, filterTicketQuantity]);

  useEffect(() => {
    if (searchQuery !== "") {
      setFirstEventIds(matchingEventIds ?? []);
      setCurrentPage(0);
      lastDocs.current = {};
    } else {
      setFirstEventIds([]);
      setCurrentPage(0);
      lastDocs.current = {};
    }
  }, [searchQuery]);
};
