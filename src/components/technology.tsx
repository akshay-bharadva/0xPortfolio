import { PropsWithChildren } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import Link from "next/link"; // Use Next Link for internal navigation if applicable

type Props = PropsWithChildren;

type Tech = {
  name: string;
  href: string;
  desc: string;
};

const Technologies: Tech[] = [
  {
    name: "React",
    href: "https://react.dev/",
    desc: "My go-to library for SPA (single-page applications). Building dynamic UIs is a breeze.",
  },
  {
    href: "https://redux-toolkit.js.org/",
    name: "Redux Toolkit",
    desc: "When state gets complex, RTK helps keep things manageable and predictable.",
  },
  {
    href: "https://nextjs.org/",
    name: "Next.js",
    desc: "For server-side applications, static sites, and this website! Love the DX.",
  },
  { href: "https://www.mysql.com/", name: "MySQL", desc: "The good old reliable RDBMS. Solid and widely used." },
  {
    href: "https://www.prisma.io/",
    name: "Prisma",
    desc: "TypeScript ORM that makes database interactions type-safe and intuitive.",
  },
  {
    href: "https://www.python.org/",
    name: "Python",
    desc: "Versatile language. Currently sharpening my skills with CS50P.",
  },
  {
    href: "https://tailwindcss.com/",
    name: "Tailwind CSS",
    desc: "Utility-first CSS framework for rapid UI development. Makes styling fun again!",
  },
  {
    href: "https://supabase.com/",
    name: "Supabase",
    desc: "The open source Firebase alternative. Backend-as-a-Service with Postgres.",
  }
];

export default function Technology({ children }: Props) {
  return (
    <section className="my-12"> {/* Increased margin */}
      <h2 className="text-3xl font-black text-black font-space mb-6 border-b-4 border-black pb-2"> {/* Adjusted title style */}
        Tech Stack
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid layout for tech items */}
        {Technologies.map((tech) => (
          <div key={tech.href} className="p-5 border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#4f46e5] transition-shadow duration-150">
            <a
              href={tech.href}
              rel="noopener noreferrer" // Corrected rel attribute
              target="_blank"
              className="text-xl font-bold text-indigo-700 hover:text-indigo-900 hover:underline hover:bg-yellow-200 transition group inline-flex items-center mb-1" // Brutalist link style
            >
              <span>{tech.name}</span>
              <BsArrowUpRight className="inline-block ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="font-space text-sm text-gray-700 leading-relaxed">
              {tech.desc}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 font-space text-center font-semibold text-black">
        ...and always eager to learn more to get the job done right!
      </p>
    </section>
  );
}