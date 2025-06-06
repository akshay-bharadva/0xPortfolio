import Container from "@/components/container";
import Layout from "@/components/layout";
import Projects from "@/components/projects"; // Assuming Projects and ProjectCard are styled

export default function ProjectsPage() { // Renamed component for clarity
  return (
    <Layout>
      {/* Container is already applied within Layout's main section */}
      <Projects />
    </Layout>
  );
}