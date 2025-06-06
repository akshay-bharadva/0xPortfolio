"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// For Neo-Brutalism, Collapsible often implies visual cues on Trigger and Content.
// The base components are fine, styling would be applied to Trigger/Content usage.
// Example:
// <Collapsible>
//   <CollapsibleTrigger className="p-2 border-2 border-black rounded-none bg-yellow-300 font-bold">Toggle</CollapsibleTrigger>
//   <CollapsibleContent className="p-4 border-2 border-black border-t-0 rounded-none bg-white">
//     Content here
//   </CollapsibleContent>
// </Collapsible>

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }