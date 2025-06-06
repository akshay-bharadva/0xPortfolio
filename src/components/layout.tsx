import Head from "next/head";
import { PropsWithChildren } from "react";
import Container from "./container";
import Header from "./header";
import BottomMenu from "./bottom-menu";
import Footer from "./footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // For admin panel notifications
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"; // For Shadcn default toast (if used elsewhere)


type Props = PropsWithChildren;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DEFAULT_OG_TITLE = "Akshay Bharadva - Fullstack Developer";
const DEFAULT_OG_DESCRIPTION = "Portfolio and Blog of Akshay Bharadva, showcasing projects and thoughts on web development.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/default-og-image.png`;

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Akshay Bharadva</title>
        <meta name="description" content="Akshay Bharadva - Fullstack Developer Portfolio & Blog" />
        <meta name="description" content="Akshay Bharadva - Fullstack Developer Portfolio & Blog" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content={DEFAULT_OG_TITLE} />
        <meta property="og:description" content={DEFAULT_OG_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Akshay Bharadva" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_OG_TITLE} />
        <meta name="twitter:description" content={DEFAULT_OG_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        {/* <meta name="twitter:site" content="@yourTwitterHandle" /> */}
        {/* <meta name="twitter:creator" content="@yourTwitterHandle" /> */}

        <link rel="alternate" type="application/rss+xml" title="Akshay Bharadva Blog RSS Feed" href="/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </Head>
      {/* bg-body might conflict with explicit bg-gray-100 etc. on pages. Standardize to bg-background or a specific color.
          For Neo-Brutalism, often a light, slightly off-white or vibrant color is used for body background.
          Let's use bg-gray-100 as a base for now as seen in blog pages.
      */}
      <div className="flex flex-col justify-between min-h-screen selection:bg-yellow-300 selection:text-black bg-gray-100">
        <Header /> {/* Header is fixed, so Container might not be needed around it here */}
        <main className="mt-24 sm:mt-32 flex-grow"> {/* Adjusted margin-top for fixed header, flex-grow to push footer down */}
          <Container>
            {children}
          </Container>
        </main>
        <Container>
          <Footer />
        </Container>
        <BottomMenu />
        <SonnerToaster /> {/* For Supabase admin actions */}
        <ShadcnToaster /> {/* If using useToast hook from Shadcn */}
      </div>
    </>
  );
}