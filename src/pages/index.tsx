// This is the main landing page (Home).
// It uses LittleAboutMyself for the primary introduction.
// import Container from "@/components/container"; // Container is part of Layout
import Layout from "@/components/layout";
import LittleAboutMyself from "@/components/little-about-myself";
import Hero from "@/components/hero"; // Optional: A brief bio section
import Newsletter from "@/components/newsletter"; // Added Newsletter
import Projects from "@/components/projects"; // Showcase a few projects
import Head from "next/head"; // Import Head
import { config as appConfig } from "@/lib/config";

export default function HomePage() {
  const { site: siteConfig } = appConfig;
  // For the homepage, OG tags are handled by the default in Layout.tsx
  // Specific overrides can be done here if needed.
  return (
    <Layout>
      <Head>
        {/* Default OG tags from Layout are usually sufficient for the homepage */}
        {/* Add any specific overrides here if necessary */}
        <link rel="canonical" href={siteConfig.url} />
      </Head>
      <LittleAboutMyself />
      <Hero>
        {/* Optionally add more introductory text here if Hero supports children */}
      </Hero>
      <Projects>
        {/* Projects component will fetch and display projects */}
      </Projects>
      <Newsletter />
    </Layout>
  );
}
