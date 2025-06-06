import Container from "@/components/container";
import Experience from "@/components/experience"; // Assuming Experience is styled
import Layout from "@/components/layout";

export default function ExperiencePage() { // Renamed component
  return (
    <Layout>
      {/* Container is already applied within Layout's main section */}
      <Experience />
    </Layout>
  );
}