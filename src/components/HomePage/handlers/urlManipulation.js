import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc,
    writeBatch,
  } from "firebase/firestore";
  import { auth, getCurrentUserEmail } from "../../../firebase";

  export const fetchArtistUrls = async (url) => {
    try {
      let fetchUrl = "https://mg.phantomcheckerapi.com/api/ticketmaster/artist";
      if (url.includes("seatgeek.com")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/seatgeek/artist";
      }
      if (url.includes("axs.com") || url.includes("axs.co.uk")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/axs/artist";
      }
      if (url.includes("stubhub.com")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/stubhub/artist";
      }
      return await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          url: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      console.error("Error fetching ticket types:", error);
    }
  };

  export const fetchVenueUrls = async (url) => {
    try {
      let fetchUrl = "https://mg.phantomcheckerapi.com/api/ticketmaster/venue";
      if (url.includes("seatgeek.com")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/seatgeek/venue";
      }
      if (url.includes("axs.com") || url.includes("axs.co.uk")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/axs/venue";
      }
      if (url.includes("stubhub.com")) {
        fetchUrl = "https://mg.phantomcheckerapi.com/api/stubhub/venue";
      }
      return await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          url: url,
          email: getCurrentUserEmail(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
    } catch (error) {
      console.error("Error fetching ticket types:", error);
    }
  };

  export const handleAddUrl = async (
    e,
    newUrls,
    urls,
    TotalUrls,
    setNewUrls,
    user,
    db,
    showModal
  ) => {
    if (e.length !== 0) e.preventDefault();
    if (!newUrls.length) return;

    // lets add support for this

    const processUrls = async (urlsToProcess) => {
      const validHostnames = [
        "seatgeek.com",
        "ticketmaster.com",
        "ticketmaster.ca",
        "livenation.com",
        "livenation.ca",
        "ticketmaster.co.uk",
        "axs.com",
        "www.axs.com",
        "shop.axs.com",
        "tix.axs.com",
        "shop.axs.co.uk",
        "q.axs.co.uk",
        "ticketmaster.ie",
        "ticketmaster.com.mx",
        "mlb.tickets.com",
        "mpv.tickets.com",
        "ticketmaster.be",
        "ticketmaster.dk",
        "ticketmaster.de",
        "ticketmaster.nl",
        "ticketmaster.fi",
        "ticketmaster.no",
        "ticketmaster.se",
        "ticketmaster.at",
        "ticketmaster.ae",
        "ticketmaster.pl",
        "ticketmaster.es",
        "ticketmaster.ch",
        // "ticketmaster.it",
        "ticketmaster.cz",
        "ticketmaster.co.za",
        "ticketmaster.co.nz",
        "ticketmaster.com.au",
        "stubhub.com",
        "evenue.net",
        "*.evenue.net",
        ...[
          "seatgeek.com",
          "ticketmaster.com",
          "ticketmaster.ca",
          "livenation.com",
          "livenation.ca",
          "ticketmaster.co.uk",
          "axs.com",
          "www.axs.com",
          "shop.axs.com",
          "tix.axs.com",
          "shop.axs.co.uk",
          "q.axs.co.uk",
          "ticketmaster.ie",
          "ticketmaster.com.mx",
          "mlb.tickets.com",
          "mpv.tickets.com",
          "ticketmaster.be",
          "ticketmaster.dk",
          "ticketmaster.de",
          "ticketmaster.nl",
          "ticketmaster.fi",
          "ticketmaster.no",
          "ticketmaster.se",
          "ticketmaster.at",
          "ticketmaster.ae",
          "ticketmaster.pl",
          "ticketmaster.es",
          "ticketmaster.ch",
          // "ticketmaster.it",
          "ticketmaster.cz",
          "ticketmaster.co.za",
          "ticketmaster.co.nz",
          "ticketmaster.com.au",
          "stubhub.com",
          "evenue.net",
          "*.evenue.net",
        ]
          .map((domain) => [
            `www.${domain}`,
            `concerts.${domain}`,
            `sports.${domain}`,
            `www.concerts.${domain}`,
            `www.sports.${domain}`,
            `m.${domain}`,
            `www.m.${domain}`,
            `m.concerts.${domain}`,
            `m.sports.${domain}`,
            `www.m.concerts.${domain}`,
            `www.m.sports.${domain}`,
            `*.evenue.net`,
          ])
          .flat(),
      ];

      let newUrlsWithoutEmptyStrings = urlsToProcess.filter((url) => url.trim());

      newUrlsWithoutEmptyStrings = newUrlsWithoutEmptyStrings.map((url) => {
        if (url.endsWith("/")) {
          url = url.slice(0, -1);
        }
        return url;
      });

      for (let url of newUrlsWithoutEmptyStrings) {
        let urlObj;
        try {
          urlObj = new URL(url);
          urlObj.search = "";
          url = urlObj.toString();
        } catch {
          alert(`Invalid URL: ${url}`);
          return [];
        }

        if (!validHostnames.includes(urlObj.hostname)) {
          if (!urlObj.hostname.includes("evenue.net")) {
            alert(`Invalid URL entered - ${urlObj.hostname}`);
            return [];
          }
        }
      }

      newUrlsWithoutEmptyStrings = newUrlsWithoutEmptyStrings.map((url) => {
        if (url.includes("axs.com")) return url;
        if (url.includes("axs.co.uk")) return url;
        if (url.includes("mlb.tickets.com")) {
          let urlObj = new URL(url);
          let searchParams = new URLSearchParams(urlObj.search);
          let pid = searchParams.get("pid");
          let agency = searchParams.get("agency");
          let eventId = searchParams.get("eventId");
          let orgId = searchParams.get("orgid");
          let salesGroupId = searchParams.get("salesGroupId");

          let newUrl = `https://mlb.tickets.com/?agency=${agency}`;

          if (eventId) {
            newUrl += `&eventId=${eventId}`;
          }

          if (pid) {
            newUrl += `&pid=${pid}`;
          }

          if (orgId) {
            newUrl += `&orgid=${orgId}`;
          }

          if (salesGroupId) {
            newUrl += `&salesGroupId=${salesGroupId}`;
          }

          return newUrl;
        }
        if (url.includes("mpv.tickets.com")) {
          let urlObj = new URL(url);
          let searchParams = new URLSearchParams(urlObj.search);
          let pid = searchParams.get("pid");
          let agency = searchParams.get("agency");

          let eventId = searchParams.get("eventId");

          let orgId = searchParams.get("orgid");

          let salesGroupId = searchParams.get("salesGroupId");

          let newUrl = `https://mpv.tickets.com/?agency=${agency}`;

          if (eventId) {
            newUrl += `&eventId=${eventId}`;
          }

          if (pid) {
            newUrl += `&pid=${pid}`;
          }

          if (orgId) {
            newUrl += `&orgid=${orgId}`;
          }

          if (salesGroupId) {
            newUrl += `&salesGroupId=${salesGroupId}`;
          }

          return newUrl;
        }
        if (url.includes("seatgeek.com")) {
          let urlObj = new URL(url);
          const items = urlObj.pathname.split("/");
          let event_id = items.pop();

          const seatGeekType = items.pop();

          const newUrl = `https://seatgeek.com/--tickets/-/${seatGeekType}/${event_id}`;
          return newUrl;
        }

        if (url.includes("stubhub.com")) {
          const re = /\/event\/(\d+)/;
          const match = url.match(re);

          if (match && match[1]) {
            // console.log(match);
            return `https://stubhub.com/event/${match[1]}`;
          }

          // should have some sort of error handling
          return "";
        }

        if (url.includes("evenue.net") && url.includes("SEGetEventInfo")) {
          const siteId = getSiteId(url);
          const dataAccId = getDataAccountId(url);
          const linkId = getLinkId(url);
          const ticketCode = getTicketCode(url);

          const hostName = getHostname(url);

          const newUrl = `https://${hostName}.evenue.net/cgi-bin/ncommerce3/SEGetEventInfo?ticketCode=${ticketCode}&linkID=${linkId}&dataAccId=${dataAccId}&locale=en_US&siteId=${siteId}`;
          return newUrl;
        }

        let urlObj = new URL(url);
        urlObj.search = "";
        return urlObj.toString();
      });

      let alertGroups = {
        unsupported: [],
        exists: [],
        limitReached: false,
      };

      newUrlsWithoutEmptyStrings = newUrlsWithoutEmptyStrings.filter(
        (url, i, self) => {
          const urlObj = new URL(url);
          let event_id = urlObj.pathname.split("/").pop();

          if (url.includes("axs.com") || url.includes("axs.co.uk")) {
            const match = url.match(/e=([0-9]+)/);
            if (match) {
              event_id = match[1];
            } else {
              event_id = urlObj.pathname.split("/")[1];
            }
          }
          if (url.includes("stubhub.com")) {
            const re = /\/event\/(\d+)/;
            const match = url.match(re);
            event_id = match[1];
          }
          if (url.includes("seatgeek.com")) {
            event_id = urlObj.pathname.split("/").pop();
          }
          if (
            url.includes("mpv.tickets.com") ||
            url.includes("mlb.tickets.com")
          ) {
            let urlObj = new URL(url);
            let searchParams = new URLSearchParams(urlObj.search);
            let pid = searchParams.get("pid");
            let eventId = searchParams.get("eventId");

            if (pid) {
              event_id = pid;
            } else if (eventId) {
              event_id = eventId;
            }
          }

          if (url.includes("evenue.net") && url.includes("SEGetEventInfo")) {
            const siteId = getSiteId(url);
            const dataAccId = getDataAccountId(url);
            const linkId = getLinkId(url);
            const ticketCode = getTicketCode(url);

            event_id = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
          } else if (url.includes("evenue.net") && url.includes("/event/")) {
            let urlObj = new URL(url);

            event_id = urlObj.pathname.split("/").slice(-2).join("-");
          }

          if (
            urls.some((existingUrl) => {
              const existingUrlObj = new URL(existingUrl);
              let existingEventId = existingUrlObj.pathname.split("/").pop();
              if (
                existingUrl.includes("axs.com") ||
                existingUrl.includes("axs.co.uk")
              ) {
                const match = existingUrl.match(/e=([0-9]+)/);
                if (match) {
                  existingEventId = match[1];
                } else {
                  existingEventId = existingUrlObj.pathname.split("/")[1];
                }
              }
              if (existingUrl.includes("stubhub.com")) {
                const re = /\/event\/(\d+)/;
                const match = existingUrl.match(re);
                existingEventId = match[1];
              }
              if (existingUrl.includes("seatgeek.com")) {
                existingEventId = existingUrlObj.pathname.split("/").pop();
              }
              if (
                existingUrl.includes("mpv.tickets.com") ||
                existingUrl.includes("mlb.tickets.com")
              ) {
                let urlObj = new URL(existingUrl);
                let searchParams = new URLSearchParams(urlObj.search);
                let pid = searchParams.get("pid");
                let eventId = searchParams.get("eventId");

                if (pid) {
                  existingEventId = pid;
                } else if (eventId) {
                  existingEventId = eventId;
                }
              }

              if (
                existingUrl.includes("evenue.net") &&
                existingUrl.includes("SEGetEventInfo")
              ) {
                const siteId = getSiteId(existingUrl);
                const dataAccId = getDataAccountId(existingUrl);
                const linkId = getLinkId(existingUrl);
                const ticketCode = getTicketCode(existingUrl);
                existingEventId = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
              } else if (
                existingUrl.includes("evenue.net") &&
                existingUrl.includes("/event/")
              ) {
                let urlObj = new URL(existingUrl);

                existingEventId = urlObj.pathname.split("/").slice(-2).join("-");
              }

              return existingEventId === event_id;
            })
          ) {
            alertGroups.exists.push(url);
            return false;
          }

          if (
            TotalUrls !== undefined &&
            urls.length + newUrls.length > TotalUrls
          ) {
            alertGroups.limitReached = true;
            return false;
          }

          if (event_id.startsWith("Z") && !url.includes("axs.com")) {
            alertGroups.unsupported.push(url);
            return false;
          }

          if (url.includes("axs.com") || url.includes("axs.co.uk")) {
            const match = url.match(/e=([0-9]+)/);
            if (match) {
              event_id = match[1];
            } else {
              event_id = urlObj.pathname.split("/")[1];
            }
          } else if (
            url.includes("mlb.tickets.com") ||
            url.includes("mpv.tickets.com")
          ) {
            return true;
          } else if (url.includes("seatgeek.com")) {
            return true;
          } else if (url.includes("stubhub.com")) {
            return true;
          } else if (url.includes("evenue.net")) {
            return true;
          } else if (event_id.length !== 16) {
            if (
              (url.includes("ticketmaster") || url.includes("livenation")) &&
              !url.includes("ticketmaster.be") &&
              !url.includes("ticketmaster.dk") &&
              !url.includes("ticketmaster.de") &&
              !url.includes("ticketmaster.nl") &&
              !url.includes("ticketmaster.fi") &&
              !url.includes("ticketmaster.no") &&
              !url.includes("ticketmaster.se") &&
              !url.includes("ticketmaster.at") &&
              !url.includes("ticketmaster.ae") &&
              !url.includes("ticketmaster.pl") &&
              !url.includes("ticketmaster.es") &&
              !url.includes("ticketmaster.ch") &&
              // !url.includes("ticketmaster.it") &&
              !url.includes("ticketmaster.cz") &&
              !url.includes("ticketmaster.co.za") &&
              !event_id.startsWith("Z")
            ) {
              alertGroups.unsupported.push(url);
              return false;
            }
          }

          return true;
        }
      );

      let alertMessages = [];

      if (alertGroups.unsupported.length) {
        alertMessages.push(
          `We do not support these events:\n${alertGroups.unsupported.join("\n")}`
        );
      }

      if (alertGroups.exists.length) {
        alertMessages.push(
          `These URLs already exist:\n${alertGroups.exists.join("\n")}`
        );
      }

      if (alertGroups.limitReached) {
        alertMessages.push(
          "You cannot add more URLs, you have reached the limit!"
        );
      }

      if (alertMessages.length) {
        showModal(alertMessages.join("\n\n"));
      }

      // newFormatUrls
      const newFormatUrls = newUrlsWithoutEmptyStrings.map((url) => {
        const urlObj = new URL(url);
        const event_id = urlObj.pathname.split("/").pop();
        const siteOrigin = getSiteOrigin(url);
        const siteReferrer = getSiteReferrer(url);

        let newUrl;

        if (
          url.includes("mlb.tickets.com") ||
          url.includes("mpv.tickets.com") ||
          url.includes("seatgeek.com") ||
          url.includes("stubhub.com")
        ) {
          if (url.includes("stubhub.com")) {
            if (url.endsWith("/")) {
              url = url.slice(0, -1);
            }
          }

          newUrl = url;
          return newUrl;
        }

        if (url.includes("evenue.net")) {
          newUrl = url;
          return newUrl;
        }

        if (urlObj.host.includes("axs.com")) {
          const match = url.match(/e=([0-9]+)/);
          if (match) {
            const eParam = match[1];
            const cParam = `c=axs&e=${eParam}`;
            newUrl = `https://shop.axs.com/?${cParam}`;
          } else {
            const parsedUrl = new URL(url);

            const event_id = parsedUrl.pathname.split("/")[1];

            newUrl = `https://tix.axs.com/${event_id}`;
          }
        } else if (urlObj.host.includes("axs.co.uk")) {
          const match = url.match(/e=([0-9]+)/);
          if (match) {
            const eParam = match[1];
            const cParam = `c=axseu&e=${eParam}`;
            newUrl = `https://q.axs.co.uk/?${cParam}`;
          } else {
            const parsedUrl = new URL(url);

            const event_id = parsedUrl.pathname.split("/")[1];

            newUrl = `https://shop.axs.co.uk/${event_id}`;
          }
        } else if (siteReferrer !== "") {
          newUrl = `https://${siteReferrer}.${siteOrigin}/event/${event_id}`;
        } else {
          newUrl = `https://${siteOrigin}/event/${event_id}`;
        }

        return newUrl;
      });

      return newFormatUrls;
    };

    for (let i = 0; i < newUrls.length; i++) {
      let url = newUrls[i];

      let info = [];
      const urlObj = new URL(url); // Use the URL constructor to parse the URL
      const path = urlObj.pathname; // Get the pathname without query parameters

      let items = urlObj.pathname.split("/");

      items = items.filter((item) => item !== "");

      const possibleEventId = items[items.length - 1];

      if (
        (url.includes("axs.com") || url.includes("axs.co.uk")) &&
        url.includes("/venues/")
      ) {
        info = await fetchVenueUrls(url);
      }

      if (
        (url.includes("axs.com") || url.includes("axs.co.uk")) &&
        (url.includes("/artists/") || url.includes("/events/"))
      ) {
        info = await fetchArtistUrls(url);
      }

      if (url.includes("stubhub.com") && url.includes("/performer/")) {
        info = await fetchArtistUrls(url);
      }

      if (url.includes("seatgeek.com") && url.includes("/venues/")) {
        info = await fetchVenueUrls(url);
      }

      if (url.includes("stubhub.com") && url.includes("/venue/")) {
        info = await fetchVenueUrls(url);
      }

      if (
        url.includes("seatgeek.com") &&
        items.length === 1 &&
        !/^\d+$/.test(possibleEventId)
      ) {
        info = await fetchArtistUrls(url);
      }

      if (url.includes("ticketmaster") && path.includes("artist")) {
        const siteOrigin = getSiteOrigin(url);
        let event_id = url.split("/").pop();

        if (event_id.includes("?")) {
          event_id = event_id.split("?")[0];
        }
        url = `https://${siteOrigin}/artist/${event_id}`;

        info = await fetchArtistUrls(url);

        if (info.length === 0) {
          alert("No urls found for this artist.");
          return;
        }
      }

      if (url.includes("ticketmaster.com") && path.includes("venue")) {
        const siteOrigin = getSiteOrigin(url);
        let event_id = url.split("/").pop();
        url = `https://${siteOrigin}/venue/${event_id}`;

        info = await fetchVenueUrls(url);
      }

      if (info.length !== 0) {
        const validatedInfo = await processUrls(info);
        if (setNewUrls !== undefined) {
          setNewUrls([]);
        }
        if (validatedInfo.length === 0) return;
        await updateDbAndUserData(validatedInfo, user, db);
        return;
      }
    }

    const validatedNewUrls = await processUrls(newUrls);
    if (validatedNewUrls.length !== 0) {
      await updateDbAndUserData(validatedNewUrls, user, db);
    }
    if (setNewUrls !== undefined) {
      setNewUrls([]);
    }
  };

  const getSiteOrigin = (url) => {
    if (url.includes("livenation.ca")) return "livenation.ca";
    if (url.includes("ticketmaster.ca")) return "ticketmaster.ca";
    if (url.includes("livenation.com")) return "livenation.com";
    if (url.includes("ticketmaster.co.uk")) return "ticketmaster.co.uk";
    if (url.includes("ticketmaster.ie")) return "ticketmaster.ie";
    if (url.includes("ticketmaster.com.mx")) return "ticketmaster.com.mx";
    if (url.includes("axs.com")) return "axs.com";
    if (url.includes("axs.co.uk")) return "axs.co.uk";
    if (url.includes("ticketmaster.be")) return "ticketmaster.be";
    if (url.includes("ticketmaster.dk")) return "ticketmaster.dk";
    if (url.includes("ticketmaster.de")) return "ticketmaster.de";
    if (url.includes("ticketmaster.nl")) return "ticketmaster.nl";
    if (url.includes("ticketmaster.fi")) return "ticketmaster.fi";
    if (url.includes("ticketmaster.no")) return "ticketmaster.no";
    if (url.includes("ticketmaster.se")) return "ticketmaster.se";
    if (url.includes("ticketmaster.at")) return "ticketmaster.at";
    if (url.includes("ticketmaster.ae")) return "ticketmaster.ae";
    if (url.includes("ticketmaster.pl")) return "ticketmaster.pl";
    if (url.includes("ticketmaster.es")) return "ticketmaster.es";
    if (url.includes("ticketmaster.ch")) return "ticketmaster.ch";
    if (url.includes("ticketmaster.it")) return "ticketmaster.it";
    if (url.includes("ticketmaster.cz")) return "ticketmaster.cz";
    if (url.includes("ticketmaster.co.za")) return "ticketmaster.co.za";
    if (url.includes("ticketmaster.com.au")) return "ticketmaster.com.au";
    if (url.includes("ticketmaster.co.nz")) return "ticketmaster.co.nz";

    return "ticketmaster.com";
  };

  const getSiteReferrer = (url) => {
    if (url.includes("concerts")) return "concerts";
    return "";
  };

  export const getSiteId = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get("siteId") || "";
    } catch (error) {
      return "";
    }
  };

  export const getDataAccountId = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get("dataAccId") || "";
    } catch (error) {
      return "";
    }
  };

  export const getHostname = (urlString) => {
    try {
      const urlObj = new URL(urlString);

      const parts = urlObj.hostname.split(".");
      return parts.length > 0 ? parts[0] : "N/A";
    } catch (error) {
      return "N/A";
    }
  };

  export const getLinkId = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get("linkID") || "";
    } catch (error) {
      return "";
    }
  };

  export const getTicketCode = (urlString) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get("ticketCode") || "";
    } catch (error) {
      return "";
    }
  };

  const updateDbAndUserData = async (newUrls, user, db) => {
    let list_of_event_ids = newUrls.map((url_data) => {
      const url = new URL(url_data);

      if (
        url_data.includes("mlb.tickets.com") ||
        url_data.includes("mpv.tickets.com") ||
        url_data.includes("seatgeek.com") ||
        url_data.includes("stubhub.com")
      ) {
        return "";
      }

      if (url_data.includes("evenue.net")) {
        return "";
      }

      if (url_data.includes("ticketmaster.be")) return "";
      if (url_data.includes("ticketmaster.dk")) return "";
      if (url_data.includes("ticketmaster.de")) return "";
      if (url_data.includes("ticketmaster.nl")) return "";
      if (url_data.includes("ticketmaster.fi")) return "";
      if (url_data.includes("ticketmaster.no")) return "";
      if (url_data.includes("ticketmaster.se")) return "";
      if (url_data.includes("ticketmaster.at")) return "";
      if (url_data.includes("ticketmaster.ae")) return "";
      if (url_data.includes("ticketmaster.pl")) return "";
      if (url_data.includes("ticketmaster.es")) return "";
      if (url_data.includes("ticketmaster.ch")) return "";
      if (url_data.includes("ticketmaster.it")) return "";
      if (url_data.includes("ticketmaster.cz")) return "";
      if (url_data.includes("ticketmaster.co.za")) return "";

      if (url_data.includes("axs.com")) {
        return "";
      }
      if (url_data.includes("axs.co.uk")) {
        return "";
      }

      // console.log("here", url)
      const event_id = url.pathname.split("/").pop();
      return event_id;
    });

    let axs_event_ids = newUrls.map((url_data) => {
      const url = new URL(url_data);
      if (!url.host.includes("axs.co")) {
        return { eventId: "" };
      }

      let queryParams = url.searchParams;
      let site = queryParams.get("c");
      // currently 'axs', 'axseu'
      if (!site || site === "") {
        if ("tix.axs.com" === url.host) {
          // console.log(url.host);
          site = "axs";
        }
        if ("shop.axs.co.uk" === url.host) {
          site = "axseu";
        }
      }

      let eventId = queryParams.get("e");
      if (!eventId || eventId === "") {
        eventId = url.pathname.split("/").pop();
      }

      return {
        site: site,
        eventId: eventId,
        params: {}, // none need for axs atm
      };
    });

    let mlb_event_ids = newUrls.map((url_data) => {
      if (
        url_data.includes("mlb.tickets.com") ||
        url_data.includes("mpv.tickets.com")
      ) {
        let urlObj = new URL(url_data);
        let searchParams = new URLSearchParams(urlObj.search);
        let pid = searchParams.get("pid");
        let eventId = searchParams.get("eventId");

        if (pid) {
          return pid;
        }

        if (eventId) {
          return eventId;
        }
      }
      return "";
    });

    let seatgeek_event_ids = newUrls.map((url_data) => {
      if (url_data.includes("seatgeek.com")) {
        let urlObj = new URL(url_data);

        let event_id = urlObj.pathname.split("/").pop();
        return event_id;
      }
      return "";
    });

    let stubhub_event_ids = newUrls.map((url_data) => {
      if (url_data.includes("stubhub.com")) {
        let urlObj = new URL(url_data);

        let event_id = urlObj.pathname.split("/").pop();
        return event_id;
      }
      return "";
    });

    let evenue_event_ids = newUrls.map((url_data) => {
      if (
        url_data.includes("evenue.net") &&
        url_data.includes("SEGetEventInfo")
      ) {
        const siteId = getSiteId(url_data);
        const dataAccId = getDataAccountId(url_data);
        const linkId = getLinkId(url_data);
        const ticketCode = getTicketCode(url_data);

        return `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
      } else if (
        url_data.includes("evenue.net") &&
        url_data.includes("/event/")
      ) {
        let urlObj = new URL(url_data);

        return urlObj.pathname.split("/").slice(-2).join("-");
      }

      return "";
    });

    list_of_event_ids = list_of_event_ids.filter(
      (event_id) => event_id.length > 0
    );

    axs_event_ids = axs_event_ids.filter((event) => event?.eventId.length > 0);

    mlb_event_ids = mlb_event_ids.filter((event_id) => event_id.length > 0);

    seatgeek_event_ids = seatgeek_event_ids.filter(
      (event_id) => event_id.length > 0
    );

    stubhub_event_ids = stubhub_event_ids.filter(
      (event_id) => event_id.length > 0
    );

    evenue_event_ids = evenue_event_ids.filter((event_id) => event_id.length > 0);

    const batch = writeBatch(db);

    if (evenue_event_ids.length > 0) {
      let evenue_urls = newUrls.filter((url) => {
        if (url.includes("evenue.net")) {
          return true;
        }

        return false;
      });

      fetch("https://mg.phantomcheckerapi.com/api/evenue/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          urls: evenue_urls,
          email: user,
        }),
      });

      for (let i = 0; i < evenue_event_ids.length; i++) {
        const docId = `${user}-${evenue_event_ids[i]}`;
        const urlLogsDoc = doc(db, "UrlLogs", docId);

        const url = newUrls.filter((url_data) => {
          let event_id = evenue_event_ids[i];

          event_id = event_id.split("-")[0];

          if (url_data.includes(event_id)) {
            return true;
          }
          return false;
        });

        batch.set(
          urlLogsDoc,
          {
            urlAdditions: {
              [new Date().toLocaleString("en-US", {
                timeZone: "America/New_York",
              })]: {
                e: url,
                u: getCurrentUserEmail(),
              },
            },
            emailAddress: user,
            eventId: evenue_event_ids[i],
          },
          { merge: true }
        );
      }
    }

    if (stubhub_event_ids.length > 0) {
      const stubhub_urls = newUrls.filter((url) => {
        if (url.includes("stubhub.com")) {
          return true;
        }
        return false;
      });

      for (let i = 0; i < stubhub_urls.length; i++) {
        const url = stubhub_urls[i];
        try {
          fetch("https://mg.phantomcheckerapi.com/api/stubhub/map", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: url,
              email: getCurrentUserEmail(),
            }),
          });
        } catch (error) {}
      }

      fetch("https://mg.phantomcheckerapi.com/api/stubhub/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          event_ids: stubhub_event_ids,
          email: user,
        }),
      });

      for (let i = 0; i < stubhub_event_ids.length; i++) {
        const docId = `${user}-${stubhub_event_ids[i]}`;
        const urlLogsDoc = doc(db, "UrlLogs", docId);

        const url = newUrls.filter((url_data) => {
          if (url_data.includes(stubhub_event_ids[i])) {
            return true;
          }
          return false;
        });

        batch.set(
          urlLogsDoc,
          {
            urlAdditions: {
              [new Date().toLocaleString("en-US", {
                timeZone: "America/New_York",
              })]: {
                e: url,
                u: getCurrentUserEmail(),
              },
            },
            emailAddress: user,
            eventId: stubhub_event_ids[i],
          },
          { merge: true }
        );
      }
    }

    if (mlb_event_ids.length > 0) {
      let mlb_urls = newUrls.filter((url) => {
        if (url.includes("mlb.tickets.com") || url.includes("mpv.tickets.com")) {
          return true;
        }

        return false;
      });

      fetch("https://mg.phantomcheckerapi.com/api/mlb/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          urls: mlb_urls,
          email: user,
        }),
      });
    }

    for (let i = 0; i < mlb_event_ids.length; i++) {
      const docId = `${user}-${mlb_event_ids[i]}`;
      const urlLogsDoc = doc(db, "UrlLogs", docId);

      const url = newUrls.filter((url_data) => {
        if (url_data.includes(mlb_event_ids[i])) {
          return true;
        }
        return false;
      });

      batch.set(
        urlLogsDoc,
        {
          urlAdditions: {
            [new Date().toLocaleString("en-US", {
              timeZone: "America/New_York",
            })]: {
              e: url,
              u: getCurrentUserEmail(),
            },
          },
          emailAddress: user,
          eventId: mlb_event_ids[i],
        },
        { merge: true }
      );
    }

    if (axs_event_ids.length > 0) {
      const axs_urls = newUrls.filter((url) => {
        // console.log(url);
        if (url.includes("axs.com") || url.includes("axs.co.uk")) {
          return true;
        }
        return false;
      });

      for (let i = 0; i < axs_urls.length; i++) {
        const url = axs_urls[i];
        try {
          fetch("https://mg.phantomcheckerapi.com/api/axs/map", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: url,
              email: getCurrentUserEmail(),
            }),
          });
        } catch (error) {}
      }

      fetch("https://mg.phantomcheckerapi.com/api/axs/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          event_ids: axs_event_ids,
          email: user,
        }),
      });

      // console.log(axs_event_ids)
      // console.log(axs_urls)
      for (let i = 0; i < axs_event_ids.length; i++) {
        const docId = `${user}-${axs_event_ids[i].eventId}`;
        // console.log(docId)
        const urlLogsDoc = doc(db, "UrlLogs", docId);

        const url = axs_urls.filter((url_data) => {
          // console.log(url_data)
          // console.log(axs_event_ids)
          if (url_data.includes(axs_event_ids[i].eventId)) {
            // console.log("heree 1" )
            return true;
          }
          // console.log("heree 2" )

          return false;
        });

        //  console.log("url to set", url)

        batch.set(
          urlLogsDoc,
          {
            urlAdditions: {
              [new Date().toLocaleString("en-US", {
                timeZone: "America/New_York",
              })]: {
                e: url,
                u: getCurrentUserEmail(),
              },
            },
            emailAddress: user,
            eventId: axs_event_ids[i].eventId,
          },
          { merge: true }
        );
      }
    }

    if (seatgeek_event_ids.length > 0) {
      const seatgeek_urls = newUrls.filter((url) => {
        if (url.includes("seatgeek.com")) {
          return true;
        }
        return false;
      });

      for (let i = 0; i < seatgeek_urls.length; i++) {
        const url = seatgeek_urls[i];
        try {
          fetch("https://mg.phantomcheckerapi.com/api/seatgeek/map", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: url,
            }),
          });
        } catch (error) {}
      }

      fetch("https://mg.phantomcheckerapi.com/api/seatgeek/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          event_ids: seatgeek_event_ids,
          email: user,
        }),
      });

      for (let i = 0; i < seatgeek_event_ids.length; i++) {
        const docId = `${user}-${seatgeek_event_ids[i]}`;
        const urlLogsDoc = doc(db, "UrlLogs", docId);

        const url = newUrls.filter((url_data) => {
          if (url_data.includes(seatgeek_event_ids[i])) {
            return true;
          }
          return false;
        });

        batch.set(
          urlLogsDoc,
          {
            urlAdditions: {
              [new Date().toLocaleString("en-US", {
                timeZone: "America/New_York",
              })]: {
                e: url,
                u: getCurrentUserEmail(),
              },
            },
            emailAddress: user,
            eventId: seatgeek_event_ids[i],
          },
          { merge: true }
        );
      }
    }

    if (list_of_event_ids.length > 0) {
      fetch("https://mg.phantomcheckerapi.com/api/ticketmaster/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          event_ids: list_of_event_ids,
          email: user,
        }),
      });

      for (let i = 0; i < list_of_event_ids.length; i++) {
        const docId = `${user}-${list_of_event_ids[i]}`;
        const urlLogsDoc = doc(db, "UrlLogs", docId);

        const url = newUrls.filter((url_data) => {
          // if urldata includes the event id
          if (url_data.includes(list_of_event_ids[i])) {
            return true;
          }
          return false;
        });

        batch.set(
          urlLogsDoc,
          {
            urlAdditions: {
              [new Date().toLocaleString("en-US", {
                timeZone: "America/New_York",
              })]: {
                e: url,
                u: getCurrentUserEmail(),
              },
            },
            emailAddress: user,
            eventId: list_of_event_ids[i],
          },
          { merge: true }
        );
      }
    }

    const euEvents = newUrls.filter((url) => {
      if (url.includes("ticketmaster.be")) return true;
      if (url.includes("ticketmaster.dk")) return true;
      if (url.includes("ticketmaster.de")) return true;
      if (url.includes("ticketmaster.nl")) return true;
      if (url.includes("ticketmaster.fi")) return true;
      if (url.includes("ticketmaster.no")) return true;
      if (url.includes("ticketmaster.se")) return true;
      if (url.includes("ticketmaster.at")) return true;
      if (url.includes("ticketmaster.ae")) return true;
      if (url.includes("ticketmaster.pl")) return true;
      if (url.includes("ticketmaster.es")) return true;
      if (url.includes("ticketmaster.ch")) return true;
      if (url.includes("ticketmaster.it")) return true;
      if (url.includes("ticketmaster.cz")) return true;
      if (url.includes("ticketmaster.co.za")) return true;
      return false;
    });

    if (euEvents.length > 0) {
      fetch("https://mg.phantomcheckerapi.com/api/ticketmaster/details-eu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          urls: euEvents,
          email: user,
        }),
      });
    }

    const userDoc = doc(db, "users", user);
    // batch.update(userDoc, { urls: arrayUnion(...newUrls) });
    batch.update(userDoc, { urls: arrayUnion.apply(null, newUrls) });

    await batch.commit();
  };

  export const handleRemoveUrl = async (
    urlToRemove,
    user,
    db,
    totalEarly,
    early
  ) => {
    const batch = writeBatch(db);

    const userDoc = doc(db, "users", user);

    batch.update(userDoc, { urls: arrayRemove(urlToRemove) });

    const url = new URL(urlToRemove);
    let event_id = url.pathname.split("/").pop();

    if (urlToRemove.includes("axs.com") || urlToRemove.includes("axs.co.uk")) {
      const match = urlToRemove.match(/e=([0-9]+)/);
      if (match) {
        event_id = match[1];
      }
    }

    if (
      urlToRemove.includes("mlb.tickets.com") ||
      urlToRemove.includes("mpv.tickets.com")
    ) {
      let urlObj = new URL(urlToRemove);
      let searchParams = new URLSearchParams(urlObj.search);

      let pId = searchParams.get("pid");

      let event_id2 = searchParams.get("eventId");

      if (pId) {
        event_id = pId;
      } else if (event_id2) {
        event_id = event_id2;
      }
    }

    if (
      urlToRemove.includes("evenue.net") &&
      urlToRemove.includes("SEGetEventInfo")
    ) {
      const siteId = getSiteId(urlToRemove);
      const dataAccId = getDataAccountId(urlToRemove);
      const linkId = getLinkId(urlToRemove);
      const ticketCode = getTicketCode(urlToRemove);

      event_id = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
    } else if (
      urlToRemove.includes("evenue.net") &&
      urlToRemove.includes("/event/")
    ) {
      let urlObj = new URL(urlToRemove);

      event_id = urlObj.pathname.split("/").slice(-2).join("-");
    }

    const removeDocId = `${user}-${event_id}`;

    const urlLogsDoc = doc(db, "UrlLogs", removeDocId);

    batch.set(
      urlLogsDoc,
      {
        urlRemovals: {
          [new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
          })]: {
            e: urlToRemove,
            u: getCurrentUserEmail(),
          },
        },
        emailAddress: user,
        eventId: event_id,
      },
      { merge: true }
    );

    batch.commit();

    handleEarlyMonitorToggle(urlToRemove, false, user, db, totalEarly, early);
  };

  export const handleEarlyMonitorToggle = async (
    url,
    isChecked,
    email,
    db,
    totalEarly,
    early
  ) => {
    const userDoc = doc(db, "users", email);

    if (isChecked) {
      if (early.length >= totalEarly) {
        alert("You have reached your limit for early URLs and cannot add more.");
        return;
      }

      await updateDoc(userDoc, {
        early: arrayUnion(url),
      });
    } else {
      if (!early.includes(url)) return;
      await updateDoc(userDoc, {
        early: arrayRemove(url),
      });
    }

    const urlParsed = new URL(url);
    let event_id = urlParsed.pathname.split("/").pop();

    if (url.includes("axs.com") || url.includes("axs.co.uk")) {
      const match = url.match(/e=([0-9]+)/);
      if (match) {
        event_id = match[1];
      }
    }

    const docId = `${email}-${event_id}`;

    const urlLogsDoc = doc(db, "UrlLogs", docId);
    await setDoc(
      urlLogsDoc,
      {
        earlyMonitorToggles: {
          [new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
          })]: {
            e: url,
            c: isChecked,
            u: getCurrentUserEmail(),
          },
        },
        emailAddress: email,
        eventId: event_id,
      },
      { merge: true }
    );
  };
