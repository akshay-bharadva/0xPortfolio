"use client"; // This hook is client-side only

import * as React from "react";

const MOBILE_BREAKPOINT = 768; // pixels

export function useIsMobile(): boolean {
  // Explicit return type
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initial state based on window width if available (for client-side rendering)
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false; // Default for SSR (will be updated on client)
  });

  React.useEffect(() => {
    // Ensure this effect runs only on the client
    if (typeof window === "undefined") {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = () => {
      setIsMobile(mql.matches);
    };

    // Set initial state correctly after mount
    handleChange();

    mql.addEventListener("change", handleChange);

    return () => mql.removeEventListener("change", handleChange);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return isMobile;
}
