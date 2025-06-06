import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';


const tahu = localFont({
  src: "./fonts/Tahu.woff2",
  variable: "--font-tahu",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <main className={tahu.variable}>
        <Component {...pageProps} key={router.asPath} />
      </main>
    </AnimatePresence>
  );
}
