// This is the main landing page.
// It uses LittleAboutMyself which should now have Neo-Brutalist styling.
import Container from "@/components/container";
import Layout from "@/components/layout";
import LittleAboutMyself from "@/components/little-about-myself"; // Assuming this is styled
// import Me from "@/components/me";
// import Hero from "@/components/hero";
// import Technology from "@/components/technology";
// import Tools from "@/components/tools";

export default function HomePage() { // Renamed component for clarity
  return (
    <Layout>
      {/* Container is already applied within Layout's main section */}
      <LittleAboutMyself />
      {/* 
        Optionally, if this is the main landing page, you might want more sections:
        <Me />
        <Hero />
        <Technology />
        <Tools /> 
      */}
    </Layout>
  );
}