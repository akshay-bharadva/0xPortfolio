// This page seems to be for a dedicated experience section.
// If experience is now part of the "Showcase" page, this might be redundant or could be repurposed.
// Assuming it's still a valid page for now.

// import Container from "@/components/container"; // Container is part of Layout
import ExperienceComponent from "@/components/experience"; // Renamed Experience to ExperienceComponent
import Layout from "@/components/layout";
import Head from "next/head"; // Import Head
import { config as appConfig } from "@/lib/config";

export default function ExperiencePage() {
  const { site: siteConfig } = appConfig;
  const pageTitle = `My Experience | ${siteConfig.title}`;
  const pageDescription = `Detailed work experience of Akshay Bharadva, showcasing roles, responsibilities, and technologies used.`;
  const pageUrl = `${siteConfig.url}/experience/`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
      </Head>
      <ExperienceComponent />
    </Layout>
  );
}
