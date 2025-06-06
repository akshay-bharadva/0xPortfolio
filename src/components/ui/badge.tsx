import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border-2 border-black px-2.5 py-0.5 text-xs font-bold shadow-[1px_1px_0px_#000] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", // Changed to rounded-none, added border, font-bold, shadow
  {
    variants: {
      variant: {
        default:
          "bg-yellow-300 text-black hover:bg-yellow-400", // Example brutalist badge
        secondary:
          "bg-gray-300 text-black hover:bg-gray-400",
        destructive:
          "bg-red-500 text-white border-black hover:bg-red-600", // Ensure black border for contrast if needed
        outline: "text-foreground bg-transparent", // border-black is base
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }