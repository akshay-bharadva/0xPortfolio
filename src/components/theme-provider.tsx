"use client";
// This component is for next-themes, which manages light/dark mode.
// Neo-Brutalism can work in both modes, but this site seems to primarily use a light mode aesthetic.
// If dark mode is not a design goal, this provider might be simplified or removed.
// For now, keeping it as is, assuming it might be used or was planned.

import * as React from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Enforce 'light' theme if Neo-Brutalism is strictly light-mode focused
  // Or allow theme switching if a dark Neo-Brutalist theme is also designed.
  // Forcing light: return <NextThemesProvider {...props} forcedTheme="light">{children}</NextThemesProvider>
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
