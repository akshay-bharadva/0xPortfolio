import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function Hero({ children }: Props) {
  return (
    <section className="py-8 my-8 border-2 border-black rounded-none bg-yellow-100 p-6 shadow-[6px_6px_0px_#000]"> {/* Added container style */}
      <div className="flex gap-10 items-center justify-between">
        <div className="">
          {/* 
          <h2 className="text-3xl font-bold text-black font-space mb-4">
            Akshay Bharadva <small className="text-sm">(He/Him)</small>
          </h2>
           */}
          <p className="font-space mb-4 text-gray-800 leading-relaxed text-base"> {/* Adjusted text color and leading */}
            Heya! I&apos;m fullstack developer and life-long learner,from India, living in
            ON, Canada. I enjoy learning new technologies and collaborating with
            other developers to make products a reality. I also enjoy
            open-source, and despite having a full-time job, I devote time to
            exploring open-source projects and studying their tech stack and
            coding conventions.
          </p>
          <p className="font-space text-gray-800 leading-relaxed text-base"> {/* Adjusted text color and leading */}
            Fun but sad fact: I often misspelled the return keyword. i.e,{" "}
            <span className="text-indigo-700 font-bold bg-yellow-200 px-1 border border-black">&ldquo;reutrn&rdquo;</span>. let me
            know if you have any trick so that I can avoid this mistake.(P.S. thanks to linter for preventing me to broke pipeline of the deployment 😅)
          </p>
        </div>
      </div>
    </section>
  );
}