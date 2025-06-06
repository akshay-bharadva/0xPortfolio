import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-none border-2 border-black bg-card text-card-foreground shadow-[4px_4px_0px_#000]", // Changed to rounded-none, border-2, shadow
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b-2 border-black", className)} // Added border-b
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // HTMLHeadingElement would be more semantic for a title
  React.HTMLAttributes<HTMLDivElement> // HTMLHeadingElement
>(({ className, children, ...props }, ref) => ( // Changed props for children
  <h3 // Changed div to h3 for semantic title
    ref={ref as React.Ref<HTMLHeadingElement>} // Cast ref
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-black", // Changed font-semibold to font-bold, added text-black
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, // HTMLParagraphElement would be more semantic
  React.HTMLAttributes<HTMLDivElement> // HTMLParagraphElement
>(({ className, children, ...props }, ref) => ( // Changed props for children
  <p // Changed div to p for semantic description
    ref={ref as React.Ref<HTMLParagraphElement>} // Cast ref
    className={cn("text-sm text-gray-700", className)} // Adjusted color
    {...props}
  >
    {children}
  </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t-2 border-black mt-4", className)} // Added border-t and mt-4
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }