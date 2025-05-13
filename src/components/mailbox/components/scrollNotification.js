import { useState, useEffect, useCallback } from "react";

const ScrollPauseNotification = ({
  children,
  pausedEmails,
  isPaused,
  setIsPaused,
  onResume,
  isDetailView,
  onPause
}) => {
  const [newEmailCount, setNewEmailCount] = useState(0);
  const [canPause, setCanPause] = useState(true);

  const handleClick = useCallback(() => {
    setIsPaused(false);
    setCanPause(false);
    setNewEmailCount(0);
    
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        onResume();
      }, 100);
    });

    setTimeout(() => {
      setCanPause(true);
    }, 3000);
  }, [setIsPaused, onResume]);

  const handlePause = useCallback(() => {
    // Group emails by eventId and timestamp to handle identical events
    const groupedEmails = new Map();
    
    // Process all emails
    pausedEmails.forEach(email => {
      const key = `${email.eventId}-${email.timestamp}`;
      if (!groupedEmails.has(key)) {
        groupedEmails.set(key, []);
      }
      groupedEmails.get(key).push(email);
    });
    
    // Flatten and sort groups
    const sortedEmails = [];
    
    // Sort by timestamp first
    Array.from(groupedEmails.keys())
      .sort((a, b) => {
        // Get timestamps directly from an email in each group
        const groupA = groupedEmails.get(a)[0];
        const groupB = groupedEmails.get(b)[0];
        const timestampA = new Date(groupA.timestamp);
        const timestampB = new Date(groupB.timestamp);
        return timestampB - timestampA;
      })
      .forEach(key => {
        // Sort within each timestamp group by UUID to ensure consistent order
        const group = groupedEmails.get(key);
        group.sort((a, b) => a.uuid.localeCompare(b.uuid));
        sortedEmails.push(...group);
      });
    
    onPause(sortedEmails);
  }, [pausedEmails, onPause]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    if (scrollPosition === 0) {
      setIsPaused(false);
      setCanPause(true);
      setNewEmailCount(0);
      return;
    }

    const scrollThreshold = isDetailView ? 10 : 0.5;

    if (totalHeight > 0 && !isPaused && canPause) {
      if (scrollPercentage > scrollThreshold) {
        setIsPaused(true);
        handlePause();
      }
    }

    // Resume scrolling when near the top
    if (scrollPercentage < scrollThreshold && isPaused) {
      setIsPaused(false);
      setCanPause(false);
      setTimeout(() => {
        setCanPause(true);
      }, 3000);
      setNewEmailCount(0);
    }
  }, [isPaused, canPause, setIsPaused, isDetailView, handlePause]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setNewEmailCount((prevCount) => prevCount + 1);
  }, [pausedEmails]);

  return (
    <>
      {isPaused && (
        <div className="fixed bottom-8 right-16 flex items-center z-50">
          <div
            className="flex items-center cursor-pointer group bg-[#333333] rounded-full border-2 border-[#434343] w-36 relative"
            onClick={handleClick}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-[#4B4B4B] rounded-full">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 15L12 9L6 15" />
              </svg>
            </div>

            <div className="flex items-center h-10 rounded-full pl-4">
              <span className="text-white text-xl font-semibold">To Top</span>
            </div>

            <div className="absolute -right-4 -top-4 flex items-center justify-center w-8 h-8 bg-[#670004] rounded-full">
              <span className="text-white text-sm font-bold">
                {newEmailCount}
              </span>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default ScrollPauseNotification;
