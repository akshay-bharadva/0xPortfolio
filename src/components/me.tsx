import Image from "next/image"; // Using Next/Image for optimization if possible
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function Me({ children }: Props) {
  return (
    <section className="py-8"> {/* Added padding */}
      <div className="flex flex-col gap-5 items-center justify-center w-full h-full mb-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center p-4 border-2 border-black rounded-none bg-white shadow-[6px_6px_0px_#000]"> {/* Container for avatar and name */}
          <Image // Changed from <img> to <Image>
            src={"https://avatars.githubusercontent.com/u/52954931?v=4"}
            alt="Akshay Bharadva avatar"
            width={128} // Required for Next/Image
            height={128} // Required for Next/Image
            className="w-32 h-32 rounded-none border-2 border-black" // rounded-full to rounded-none, added border
            priority // Load image faster if it's LCP
          />
          <h2 className="text-4xl sm:text-5xl text-black font-tahu mb-0 -rotate-6 line-clamp-5 text-center sm:text-left"> {/* Adjusted rotation, text color, margin */}
            Akshay
            <br />
            Bharadva
          </h2>
        </div>
      </div>
    </section>
  );
}