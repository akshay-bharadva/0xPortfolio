import { PropsWithChildren } from "react";
import Link from "next/link"; // Import Link for navigation
import { BsArrowUpRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";

type NotFoundProps = PropsWithChildren; // Renamed Props

export default function NotFound({ children }: NotFoundProps) {
  return (
    <section className="my-8 rounded-none border-2 border-black bg-white p-8 py-12 text-center font-space shadow-[8px_8px_0px_#000]">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-none border-2 border-black bg-red-500 text-5xl font-black text-white shadow-[2px_2px_0px_#000]">
        !
      </div>
      <h1 className="mb-3 text-4xl font-black text-black">
        {" "}
        {/* Changed h2 to h1 */}
        <span className="text-red-600">404</span> | PAGE NOT FOUND
      </h1>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">
        Whoops! Looks like this page took a wrong turn at Albuquerque.
      </p>
      <p className="mb-8 text-gray-700">Let&apos;s get you back on track.</p>

      {children && <div className="mb-8">{children}</div>}

      <Button variant="default" size="lg">
        Go Home <BsArrowUpRight className="ml-1.5 inline" />
      </Button>
    </section>
  );
}
