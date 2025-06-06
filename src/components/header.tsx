import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useState, useEffect } from "react"; // Added useState, useEffect for mobile menu

type HeaderProps = PropsWithChildren; // Renamed Props

interface NavLink {
  // Renamed LinkProps to NavLink for clarity
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  // Renamed Links to NAV_LINKS
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/showcase",
    label: "Showcase",
  },
  {
    href: "/projects",
    label: "Projects",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu on route change
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const linkClasses = (href: string, isMobile: boolean = false) =>
    `cursor-pointer px-3 py-1.5 last-of-type:mr-0 transform transition-all duration-150 text-sm font-bold rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white
    ${
      router.pathname === href
        ? "bg-black text-white shadow-[1px_1px_0px_hsl(var(--primary-foreground))_inset]"
        : "text-black hover:bg-yellow-300 hover:text-black hover:shadow-[1px_1px_0px_#000] active:bg-yellow-400"
    }
    ${isMobile ? "block w-full text-center py-2.5" : ""}`;

  return (
    // Fixed header with backdrop blur for Neo-Brutalism aesthetic
    <header className="fixed left-0 top-0 z-50 w-full border-b-2 border-black bg-white/80 py-3 font-space shadow-[0px_2px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm sm:py-4">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-8 md:px-24 lg:px-48 xl:px-72">
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation Toggle */}
        <div className="flex w-full justify-end sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-none border-2 border-black bg-white p-2 shadow-[2px_2px_0_#000] hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:bg-yellow-400"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="size-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <nav className="absolute left-0 top-full flex w-full flex-col items-center gap-0.5 border-x-2 border-b-2 border-t-0 border-black bg-white p-2 shadow-[0px_4px_6px_rgba(0,0,0,0.1)] sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              className={linkClasses(link.href, true)}
              href={link.href}
              key={`${link.href}-mobile`}
              onClick={() => setIsMobileMenuOpen(false)} // Close on click
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
