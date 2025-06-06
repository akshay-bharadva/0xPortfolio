"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// For Neo-Brutalism, Collapsible often implies visual cues on Trigger and Content.
// The base components are fine, styling would be applied to Trigger/Content usage.
// Example Usage:
// <Collapsible>
//   <CollapsibleTrigger
//     className="p-2 border-2 border-black rounded-none bg-yellow-300 font-bold w-full text-left hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
//   >
//     Toggle Section
//   </CollapsibleTrigger>
//   <CollapsibleContent
//     className="p-4 border-2 border-black border-t-0 rounded-none bg-white data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden"
//   >
//     <p>Content for the collapsible section goes here. It can be anything.</p>
//   </CollapsibleContent>
// </Collapsible>
//
// Add to tailwind.config.js keyframes and animation:
// keyframes: {
//   'collapsible-down': {
//     from: { height: '0' },
//     to: { height: 'var(--radix-collapsible-content-height)' },
//   },
//   'collapsible-up': {
//     from: { height: 'var(--radix-collapsible-content-height)' },
//     to: { height: '0' },
//   },
// }
// animation: {
//  'collapsible-down': 'collapsible-down 0.2s ease-out',
//  'collapsible-up': 'collapsible-up 0.2s ease-out',
// }

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
