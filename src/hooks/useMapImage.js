import { useState, useEffect, useRef } from "react";
import { auth, getCurrentUserEmail } from "../firebase";

const mapImageCache = new Map();

export const useMapImage = (map_url, eventLink) => {
  const [mapImage, setMapImage] = useState(() => mapImageCache.get(map_url));
  const [isLoading, setIsLoading] = useState(!mapImageCache.has(map_url));
  const isFetchingRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Reset states when map_url changes
    if (!mapImageCache.has(map_url)) {
      setMapImage(null);
      setIsLoading(true);
      retryCountRef.current = 0;
    } else {
      setIsLoading(false);
    }

    async function fetchMapImage(eventLink) {
      if (isFetchingRef.current) return;

      try {
        // Basic validation
        if (!map_url || !auth.currentUser?.email) {
          setMapImage(false);
          setIsLoading(false);
          return;
        }

        // Check cache first
        if (mapImageCache.has(map_url)) {
          setMapImage(mapImageCache.get(map_url));
          setIsLoading(false);
          return;
        }

        if (
          !map_url ||
          (!eventLink.includes("ticketmaster") &&
            !eventLink.includes("livenation")) ||
          !map_url.includes("mapsapi.tmol.io")
        ) {
          setMapImage(false);
          setIsLoading(false);
          return;
        }

        isFetchingRef.current = true;

        const response = await fetch(
          "https://mg.phantomcheckerapi.com/api/ticketmaster/map-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: map_url,
              email: getCurrentUserEmail(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageResponse = await response.text();

        if (
          !imageResponse ||
          imageResponse === "null" ||
          imageResponse.includes("error")
        ) {
          throw new Error("Invalid image response");
        }

        const processedImage = imageResponse.replace(/"/g, "");

        if (processedImage && processedImage.length > 0) {
          mapImageCache.set(map_url, processedImage);
          setMapImage(processedImage);
          retryCountRef.current = 0;
        } else {
          throw new Error("Empty image data");
        }
      } catch (error) {
        console.error("Error fetching map image:", error);

        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            isFetchingRef.current = false;
            fetchMapImage(eventLink);
          }, 1000 * retryCountRef.current);
          return;
        }

        setMapImage(false);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }

    if (!mapImageCache.has(map_url)) {
      fetchMapImage(eventLink);
    }

    return () => {
      isFetchingRef.current = false;
    };
  }, [map_url, eventLink]);

  const retry = () => {
    if (!isLoading) {
      retryCountRef.current = 0;
      setIsLoading(true);
      isFetchingRef.current = false;
      setMapImage(null);
      mapImageCache.delete(map_url); // Clear cache for this URL
    }
  };

  return { mapImage, isLoading, retry };
};
