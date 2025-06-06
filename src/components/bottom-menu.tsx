import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineAppstore,
  AiFillAppstore, // Or BsGrid3X3GapFill for a different showcase icon
  AiOutlineExperiment,
  AiFillExperiment, // Or BsBriefcaseFill
  AiOutlineRead,
  AiFillRead,       // Or BsBookFill
  AiOutlineUser,
} from "react-icons/ai"; // Example icons, choose what fits best
import { FaUser, FaRegUser  } from "react-icons/fa";

import { IconType } from "react-icons";

type NavLink = {
  href: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
};

// Re-map your links to include icons
const NavLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: AiOutlineHome,
    activeIcon: AiFillHome,
  },
  {
    href: "/showcase",
    label: "Showcase",
    icon: AiOutlineAppstore, // Icon for "Showcase"
    activeIcon: AiFillAppstore,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: AiOutlineExperiment, // Icon for "Projects"
    activeIcon: AiFillExperiment,
  },
  {
    href: "/blog",
    label: "Blog",
    icon: AiOutlineRead, // Icon for "Blog"
    activeIcon: AiFillRead,
  },
  {
    href: "/about",
    label: "About",
    icon: FaRegUser , // Icon for "About" (profile-like)
    activeIcon: FaUser,
  },
];

export default function BottomNavBar() {
  const router = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-black shadow-[0px_-2px_0px_#000] z-40 font-space">
      <div className="flex justify-around items-center h-16 px-2">
        {NavLinks.map((link) => {
          const isActive = router.pathname === link.href || (link.href !== "/" && router.pathname.startsWith(link.href));
          const IconComponent = isActive ? link.activeIcon : link.icon;

          return (
            <Link
              href={link.href}
              key={link.href}
              className={`flex flex-col items-center justify-center p-2 rounded-none transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white
                ${
                  isActive
                    ? "text-indigo-700" // Active color, could be black too
                    : "text-gray-600 hover:text-black"
                }`}
              aria-label={link.label}
            >
              <IconComponent className="text-2xl sm:text-3xl mb-0.5" />
              <span
                className={`text-xs font-semibold 
                  ${isActive ? "text-indigo-700" : "text-gray-500 group-hover:text-black"}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}