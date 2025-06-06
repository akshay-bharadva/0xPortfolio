// import Container from "@/components/container"; // Container is part of Layout
import Layout from "@/components/layout";
import NotFoundComponent from "@/components/not-found"; // Renamed NotFound to NotFoundComponent

export default function Custom404Page() {
  // Renamed component for clarity and consistency
  return (
    <Layout>
      <NotFoundComponent />
    </Layout>
  );
}
