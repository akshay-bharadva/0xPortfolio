import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-none border-2 border-black bg-card text-card-foreground shadow-[4px_4px_0px_#000]",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b-2 border-black",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement, // Changed to HTMLHeadingElement
  React.HTMLAttributes<HTMLHeadingElement> // Changed to HTMLHeadingElement
>(({ className, children, ...props }, ref) => (
  <h3 // Changed div to h3 for semantic title
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-black",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed to HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement> // Changed to HTMLParagraphElement
>(({ className, children, ...props }, ref) => (
  <p // Changed div to p for semantic description
    ref={ref}
    className={cn("text-sm text-gray-700", className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // pt-0 if header has pb-6
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t-2 border-black mt-4",
      className,
    )} // pt-0 if content has pb-6
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
