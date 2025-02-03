import { useState, useEffect } from "react";

const useWatchBreakpoints = (breakpoints) => {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints}px)`);
    const handleMediaChange = (e) => setIsLg(e.matches);

    // Set initial state and add listener
    setIsLg(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return isLg;
};

export default useWatchBreakpoints;