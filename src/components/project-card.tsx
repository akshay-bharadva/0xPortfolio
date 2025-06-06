import Link from "next/link";
import { PropsWithChildren } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import type { GitHubRepo } from "@/types"; // Import a more specific type if available

type ProjectCardProps = PropsWithChildren & {
  project: GitHubRepo; // Use a more specific type
};

export default function ProjectCard({ children, project }: ProjectCardProps) {
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-none border-2 border-black bg-white font-space shadow-[6px_6px_0px_#000] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#4f46e5] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#4f46e5]"
      key={project.id} // Key should ideally be on the element mapped in the parent
    >
      <div className="grow p-5">
        <h3 className="mb-2 flex items-start justify-between text-xl font-bold capitalize text-black transition-colors group-hover:text-indigo-700">
          {" "}
          {/* Changed h2 to h3 */}
          <span className="mr-2">{project.name.replaceAll("-", " ")}</span>
          {project.html_url && ( // Conditionally render link
            <Link
              className="-m-1 shrink-0 cursor-pointer rounded-none border-2 border-transparent p-1 text-black hover:border-black hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group-hover:text-indigo-700" // Make icon more clickable
              href={project.html_url}
              rel="noopener noreferrer nofollow" // nofollow is fine for external links
              target="_blank"
              title="View on GitHub"
              aria-label={`View ${project.name} on GitHub`}
            >
              <BsArrowUpRight className="inline-block size-5 transition-transform group-hover:rotate-[15deg]" />
            </Link>
          )}
        </h3>
        <p className="mb-3 line-clamp-3 text-ellipsis text-sm font-medium leading-relaxed text-gray-700 transition-all duration-200 hover:text-gray-900">
          {project.description || (
            <span className="italic text-gray-500">
              No description provided for this project.
            </span>
          )}
        </p>
        {children && <div className="mt-2">{children}</div>}
      </div>
      {(project.language || (project.topics && project.topics.length > 0)) && ( // Only render footer if there's content
        <div className="border-t-2 border-black bg-gray-50 p-4">
          <div className="flex shrink flex-wrap gap-1.5">
            {" "}
            {/* Increased gap */}
            {project.language && (
              <small className="flex-inline rounded-none border border-black bg-yellow-300 px-2 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]">
                {project.language}
              </small>
            )}
            {project.topics &&
              project.topics.slice(0, 3).map((topic: string) => (
                <small
                  key={topic}
                  className="flex-inline rounded-none border border-black bg-gray-200 px-2 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]"
                >
                  {topic}
                </small>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
