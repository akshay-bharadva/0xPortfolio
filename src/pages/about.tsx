import Container from "@/components/container";
import Hero from "@/components/hero"; // Assuming Hero is styled
import Layout from "@/components/layout";
import Me from "@/components/me"; // Assuming Me is styled
import Technology from "@/components/technology"; // Assuming Technology is styled
import Tools from "@/components/tools"; // Assuming Tools is styled

export default function AboutPage() { // Renamed component for clarity
  return (
    <Layout>
      {/* Container is already applied within Layout's main section */}
      <Me />
      <Hero />
      <Technology />
      <Tools />
    </Layout>
  );
}