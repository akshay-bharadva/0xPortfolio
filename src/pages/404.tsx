import Container from "@/components/container";
import Layout from "@/components/layout";
import NotFound from "@/components/not-found"; // Assuming NotFound is styled

export default function Custom404() { // Renamed component for clarity
  return (
    <Layout>
      {/* Container is already applied within Layout's main section */}
      <NotFound />
    </Layout>
  );
}