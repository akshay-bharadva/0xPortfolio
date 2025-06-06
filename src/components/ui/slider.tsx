"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group", // Added group for thumb interaction
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-none bg-gray-300 border-2 border-black shadow-[1px_1px_0px_#000_inset]"> {/* rounded-full to rounded-none, bg-secondary to bg-gray-300, added border and inset shadow */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" /> {/* bg-primary can be black or accent */}
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-none border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[2px_2px_0px_black] group-hover:shadow-[3px_3px_0px_#4f46e5] group-active:shadow-[1px_1px_0px_#4f46e5] group-hover:border-indigo-600 group-active:border-indigo-700" /> {/* rounded-full to rounded-none, added shadow and hover/active states */}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }