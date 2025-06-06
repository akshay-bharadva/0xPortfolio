import Link from "next/link";
import { PropsWithChildren } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsGithub, BsLinkedin } from "react-icons/bs";

type Props = PropsWithChildren;

export default function LittleAboutMyselfVariant3({ children }: Props) {
  return (
    <section className="py-16">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full text-center">
        {/* Name and Title Block */}
        <div className="flex flex-col gap-1 text-5xl sm:text-6xl md:text-7xl">
          <p className="font-space text-gray-700 text-4xl sm:text-5xl">Heya, I'm</p>
          <h2 className="text-black font-space font-black">
            Akshay Bharadva
          </h2>
          <p className="font-space text-indigo-700 font-bold text-3xl sm:text-4xl md:text-5xl mt-1">
            Fullstack Developer.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 sm:gap-4">
          <Link
            className="p-3 text-2xl sm:text-3xl text-black bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_#000] hover:bg-yellow-300 hover:shadow-[3px_3px_0px_#4f46e5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#4f46e5] transition-all"
            href="https://github.com/akshay-bharadva"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub Profile"
          >
            <BsGithub />
          </Link>
          <Link
            className="p-3 text-2xl sm:text-3xl text-black bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_#000] hover:bg-yellow-300 hover:shadow-[3px_3px_0px_#4f46e5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#4f46e5] transition-all"
            href="https://www.linkedin.com/in/akshay-bharadva/"
            rel="noreferrer"
            target="_blank"
            aria-label="LinkedIn Profile"
          >
            <BsLinkedin />
          </Link>
          <Link
            className="p-3 text-2xl sm:text-3xl text-black bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_#000] hover:bg-yellow-300 hover:shadow-[3px_3px_0px_#4f46e5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#4f46e5] transition-all"
            href="mailto:akshaybharadva19@gmail.com"
            rel="noreferrer"
            target="_blank"
            aria-label="Email Akshay"
          >
            <AiOutlineMail />
          </Link>
        </div>

        {/* Optional: Place for children prop content (e.g., a short bio) */}
        {children && (
          <div className="mt-4 text-lg text-gray-700 font-space max-w-2xl px-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}