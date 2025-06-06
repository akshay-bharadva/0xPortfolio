import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren; // Renamed Props to ContainerProps for clarity

// This component is a layout helper for responsive padding.
// Neo-Brutalism is more about individual element styling.
export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full px-4 sm:px-8 md:px-24 lg:px-48 xl:px-72">
      {" "}
      {/* Ensure w-full and mx-auto for centering if not full-width */}
      {children}
    </div>
  );
}
