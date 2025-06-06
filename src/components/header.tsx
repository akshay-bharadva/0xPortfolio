import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

type LinkProps = {
  href: string;
  label: string;
};

const Links: LinkProps[] = [
  {
    href: "/",
    label: "Home",
  },
  // { // Removed experience link as per new main.tsx page
  //   href: "/experience",
  //   label: "Experience",
  // },
  {
    href: "/showcase", // New main page for portfolio items and experience
    label: "Showcase",
  },
  {
    href: "/projects",
    label: "Projects",
  },
  {
    href: "/blog", // Added Blog link
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

export default function Header({ children }: Props) {
  const router = useRouter();

  return (
    <header className="hidden md:block px-4 sm:px-8 md:px-24 lg:px-48 xl:px-72 font-space py-4 sm:py-6 fixed top-0 w-full left-0 z-50"> {/* Adjusted padding */}
      <div className="hidden sm:flex sm:flex-row sm:gap-x-1 w-auto mx-auto px-2 py-1 rounded-none border-2 border-black shadow-[3px_3px_0px_#000] backdrop-blur-sm bg-white/80"> {/* Neo-Brutalist nav bar */}
        {Links.map((link) => (
          <Link
            className={`cursor-pointer px-3 py-1.5 last-of-type:mr-0 transform transition-all duration-150 text-sm font-bold rounded-none hover:bg-yellow-300 hover:text-black active:bg-yellow-400 
            ${router.pathname === link.href 
              ? "bg-black text-white shadow-[1px_1px_0px_#fff_inset]" 
              : "text-black hover:shadow-[1px_1px_0px_#000]"
            }`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Basic Mobile Nav (Consider a hamburger menu for more items) */}
      <div className="sm:hidden flex flex-col items-center gap-1 p-2 border-b-2 border-black bg-white shadow-[0px_2px_0px_#000]">
         {Links.map((link) => (
          <Link
            className={`cursor-pointer px-3 py-2 w-full text-center transform transition-all duration-150 text-sm font-bold rounded-none hover:bg-yellow-300 hover:text-black active:bg-yellow-400
            ${router.pathname === link.href 
              ? "bg-black text-white" 
              : "text-black"
            }`}
            href={link.href}
            key={link.href + "-mobile"}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}