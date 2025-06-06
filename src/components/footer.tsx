import Link from "next/link";
import { PropsWithChildren, useState, useEffect } from "react"; // Added useEffect
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";

type Props = PropsWithChildren;

export default function Footer({ children }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => { // Corrected setInterval usage with useEffect for cleanup
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  return (
    <footer className="mb-20 md:mb-0 md:my-8 flex flex-col justify-center gap-4 font-space items-center border-t-2 border-black pt-10 text-sm text-black"> {/* border-t-slate-400 to border-t-2 border-black, text-black */}
      <p className="flex flex-col justify-center items-center gap-2 md:block">
        <span className="font-semibold">
          Built with{" "}
          <Link
            href="https://nextjs.org/"
            rel="noreferrer"
            target="_blank"
            className="text-indigo-700 hover:text-indigo-900 font-bold underline hover:bg-yellow-200 transition" // Adjusted link style
          >
            Next.js <BsArrowUpRight className="inline" />
          </Link>
        </span>
        <span className="hidden md:inline mx-1 font-bold">|</span>
        <span className="font-semibold">
          View Source on{" "}
          <a
            href="https://github.com/akshay-bharadva/akshay-bharadva.github.io"
            rel="noreferrer"
            target="_blank"
            className="text-indigo-700 hover:text-indigo-900 font-bold underline hover:bg-yellow-200 transition" // Adjusted link style
          >
            <span>
              GitHub <BsArrowUpRight className="inline" />
            </span>
          </a>
        </span>
      </p>
      <p className="font-bold">
        <AiOutlineCopyrightCircle className="inline-block" />
        &nbsp;
        {new Date().getFullYear()} Akshay Bharadva | {time.getHours().toString().padStart(2, '0')}:
        {time.getMinutes().toString().padStart(2, '0')}
        {/* Removed seconds for less frequent updates visually, if desired add : {time.getSeconds().toString().padStart(2, '0')} */}
      </p>
    </footer>
  );
}