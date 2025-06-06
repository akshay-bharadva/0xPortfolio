import { PropsWithChildren } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import Link from "next/link";

type Props = PropsWithChildren;

type Tool = {
  name: string;
  href: string;
  desc: string;
};

const UsedTools: Tool[] = [
  {
    name: "Visual Studio Code",
    href: "https://code.visualstudio.com/",
    desc: "My all-time favorite text editor with superpowers. Indispensable for coding.",
  },
  {
    name: "Figma",
    href: "https://www.figma.com/",
    desc: "For turning UI/UX designs into real, functional products. Great for collaboration.",
  },
  {
    name: "GitHub",
    href: "https://github.com/",
    desc: "For versioning code, remote backups, and sharing with other developers. Essential.",
  },
  {
    name: "Slack",
    href: "https://slack.com/intl/en-in/",
    desc: "Communication is key. Also, many Open-Source communities are on it for interaction.",
  },
  {
    name: "Discord",
    href: "https://discord.com/",
    desc: "Initially joined for gaming, but later found awesome developer communities.",
  },
  {
    name: "Postman",
    href: "https://www.postman.com/",
    desc: "The go-to tool for API testing and development. Makes debugging endpoints much easier.",
  }
];

export default function Tools({ children }: Props) {
  return (
    <section className="my-12"> {/* Increased margin */}
      <h2 className="text-3xl font-black text-black font-space mb-6 border-b-4 border-black pb-2"> {/* Adjusted title style */}
        Tools I Use
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid layout for tools */}
        {UsedTools.map((tool) => ( // Changed tech to tool
          <div key={tool.href} className="p-5 border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#4f46e5] transition-shadow duration-150">
            <a
              href={tool.href}
              rel="noopener noreferrer" // Corrected rel attribute
              target="_blank"
              className="text-xl font-bold text-indigo-700 hover:text-indigo-900 hover:underline hover:bg-yellow-200 transition group inline-flex items-center mb-1" // Brutalist link style
            >
              <span>{tool.name}</span>
              <BsArrowUpRight className="inline-block ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="font-space text-sm text-gray-700 leading-relaxed">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>
       <p className="mt-8 font-space text-center font-semibold text-black">
        ...plus a healthy dose of coffee and curiosity!
      </p>
    </section>
  );
}