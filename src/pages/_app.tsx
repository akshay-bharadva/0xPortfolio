import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/components/theme-provider";

const tahuFont = localFont({
  src: "./fonts/Tahu.woff2",
  variable: "--font-tahu",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <main className={`${tahuFont.variable} font-space`}>
          <Component {...pageProps} key={router.asPath} />
        </main>
      </AnimatePresence>
    </ThemeProvider>
  );
}