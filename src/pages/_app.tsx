import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

const tahuFont = localFont({
  // Renamed tahu to tahuFont for clarity
  src: "./fonts/Tahu.woff2", // Ensure this path is correct relative to pages directory
  variable: "--font-tahu",
  display: "swap", // Added font-display strategy
});

// Define a spaceMonoFont if it's used explicitly elsewhere or as a fallback.
// If Space Mono is primarily loaded via globals.css's @import, this might be redundant
// unless you need the font variable for specific components.
// const spaceMonoFont = localFont({
//   src: [
//     { path: './fonts/SpaceMono-Regular.woff2', weight: '400', style: 'normal' },
//     { path: './fonts/SpaceMono-Bold.woff2', weight: '700', style: 'normal' },
//     { path: './fonts/SpaceMono-Italic.woff2', weight: '400', style: 'italic' },
//   ],
//   variable: '--font-space-mono',
//   display: 'swap',
// });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    // ThemeProvider for next-themes (light/dark mode management)
    // Set defaultTheme="light" if dark mode is not implemented or desired.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        {/* Applied Tahu font variable to main. Space Mono is applied via tailwind.config.js and globals.css */}
        <main className={`${tahuFont.variable} font-space`}>
          {" "}
          {/* Added font-space as default */}
          <Component {...pageProps} key={router.asPath} />
        </main>
      </AnimatePresence>
    </ThemeProvider>
  );
}
