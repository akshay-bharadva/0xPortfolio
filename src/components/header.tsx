import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type HeaderProps = PropsWithChildren;

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/showcase", label: "Showcase" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header({ children }: HeaderProps) {
  const router = useRouter();

  const linkClasses = (href: string) =>
    `cursor-pointer px-3 py-1.5 last-of-type:mr-0 transform transition-all duration-150 text-sm font-bold rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${router.pathname === href ? "bg-black text-white shadow-[1px_1px_0px_hsl(var(--primary-foreground))_inset]" : "text-black hover:bg-yellow-300 hover:text-black hover:shadow-[1px_1px_0px_#000] active:bg-yellow-400"}`;

  return (
    <header className="hidden md:block fixed left-0 top-0 z-50 w-full border-b-2 border-black bg-white/80 py-3 font-space shadow-[0px_2px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm sm:py-4">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-8 md:px-24 lg:px-48 xl:px-72">
        <nav className="hidden w-auto sm:flex sm:flex-row sm:gap-x-1">
          {NAV_LINKS.map((link) => (
            <Link
              className={linkClasses(link.href)}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}