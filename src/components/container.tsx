import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

// This component is a layout helper, Neo-Brutalism is more about individual element styling.
// Keeping it as is, assuming its purpose is purely for responsive padding.
export default function Container({ children }: Props) {
  return (
    <div className="px-4 sm:px-8 md:px-24 lg:px-48 xl:px-72">{children}</div>
  );
}