import { PropsWithChildren } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";


type Props = PropsWithChildren;

export default function NotFound({ children }: Props) {
  return (
    <section className="my-8 py-12 text-center bg-white border-2 border-black rounded-none shadow-[8px_8px_0px_#000] p-8 font-space"> {/* Added font-space to section */}
      <div className="w-20 h-20 mx-auto mb-6 bg-red-500 border-2 border-black flex items-center justify-center text-white text-5xl font-black rounded-none shadow-[2px_2px_0px_#000]">
        !
      </div>
      <h2 className="text-4xl font-black text-black font-space mb-3">
        <span className="text-red-600">404</span> | PAGE NOT FOUND
      </h2>
      <p className="mb-4 font-space text-gray-700 text-lg leading-relaxed">
        Whoops! Looks like this page took a wrong turn at Albuquerque.
      </p>
      <p className="font-space text-gray-700 mb-8"> {/* Added mb-8 for spacing */}
        Let's get you back on track.
      </p>

      <Button variant="default" onClick={() => { }}>
        Go Home <BsArrowUpRight className="inline ml-1" />

      </Button>

    </section>
  );
}