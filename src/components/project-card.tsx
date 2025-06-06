import Link from "next/link";
import { PropsWithChildren } from "react";
import { BsArrowUpRight } from "react-icons/bs";

type Props = PropsWithChildren & {
  project: any; // Consider defining a more specific type for project
};

export default function ProjectCard({ children, project }: Props) {
  return (
    <div
      className="group bg-white border-2 border-black rounded-none shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#4f46e5] active:shadow-[2px_2px_0px_#4f46e5] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all duration-150 overflow-hidden flex flex-col h-full" // Neo-Brutalist card, flex for footer
      key={project.id}
    >
      <div className="p-5 flex-grow"> {/* padding, flex-grow for content */}
        <h2 className="text-xl mb-2 font-bold font-space capitalize text-black group-hover:text-indigo-700 transition-colors flex justify-between items-start">
          <span className="mr-2">{project.name.replaceAll("-", " ")}</span>
          <Link
            className="cursor-pointer text-black group-hover:text-indigo-700 shrink-0"
            href={project.html_url}
            rel="noopener noreferrer nofollow"
            target="_blank"
            title="View on GitHub"
          >
            <BsArrowUpRight className="inline-block w-5 h-5 transition-transform group-hover:rotate-45" />
          </Link>
        </h2>
        <p className="font-medium font-space text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 mb-3 line-clamp-3 text-ellipsis leading-relaxed">
          {project.description || <span className="italic text-gray-500">No description provided.</span>}
        </p>
      </div>
      <div className="p-4 border-t-2 border-black bg-gray-50"> {/* Footer for tags/language */}
        <div className="flex flex-shrink flex-wrap gap-1">
          {project.language && (
            <small className="font-space flex-inline rounded-none bg-yellow-300 border border-black px-2 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]">
              {project.language}
            </small>
          )}
          {project.topics && project.topics.slice(0, 3).map((topic: string) => ( // Show a few topics
            <small
              key={topic}
              className="font-space flex-inline rounded-none bg-gray-200 border border-black px-2 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]"
            >
              {topic}
            </small>
          ))}
        </div>
      </div>
    </div>
  );
}