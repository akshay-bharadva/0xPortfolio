import Link from "next/link";
import { PropsWithChildren, useState, useEffect } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import ProjectCard from "./project-card";
import { Button } from "@/components/ui/button"; // Assuming Button is updated

type Props = PropsWithChildren;

const USERNAME = `akshay-bharadva`;
const URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=9`; // Fetch 9 most recently updated

export default function Projects({ children }: Props) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const filteredProjects = data
          .filter((p: any) => !p.private && p.language && !p.fork && !p.archived && !p.name.includes(USERNAME))
          // Sorting by updated_at is already handled by API param `sort=updated`
          // Additional sort by description length (shortest first for some reason, might want to reconsider or remove)
          .sort(
            (a: any, b: any) => (a.description?.length || 0) - (b.description?.length || 0)
          );
        setProjects(filteredProjects);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setError(err.message || "Could not load projects.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="my-8">
      <h2 className="text-3xl font-black text-black font-space mb-8 border-b-4 border-black pb-3"> {/* Adjusted title style */}
        Projects
      </h2>
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-none h-12 w-12 border-t-4 border-b-4 border-black mx-auto"></div>
          <p className="mt-4 font-bold text-black text-lg">Loading Projects...</p>
        </div>
      )}
      {error && !loading && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 font-semibold p-4 rounded-none shadow-[3px_3px_0_#B91C1C]">
          Error: {error}
        </div>
      )}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16 bg-yellow-100 border-2 border-black shadow-[6px_6px_0_#000] p-8 rounded-none">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-black text-yellow-300 text-5xl font-black flex items-center justify-center border-2 border-black rounded-none">
                ?
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">NO PROJECTS FOUND.</h3>
              <p className="text-gray-700 font-medium">Maybe I'm busy building the next big thing. Or just napping.</p>
            </div>
          </div >
      )}
      {!loading && !error && projects.length > 0 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"> {/* Increased gap */}
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link
                href={`https://github.com/${USERNAME}?tab=repositories`}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="text-md" // Button component handles most styling
              >
                <span>
                  More on GitHub <BsArrowUpRight className="inline ml-1" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}