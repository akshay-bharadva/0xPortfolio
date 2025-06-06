// This file is identical to the one in src/hooks, likely a duplicate.
// Keeping one in src/hooks and deleting this one is recommended.
// For now, I will assume src/hooks/use-mobile.tsx is the canonical one.
// If this file is indeed used, it should be:
"use client"; // Add "use client" if it's used in client components directly and not just by other client components
import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Define as a constant

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Ensure window is defined (runs only on client-side)
    if (typeof window === "undefined") {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches); // Use mql.matches for direct boolean
    };

    // Initial check
    onChange();

    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this runs once on mount

  return isMobile === undefined ? false : isMobile; // Return false during SSR or before hydration
}
