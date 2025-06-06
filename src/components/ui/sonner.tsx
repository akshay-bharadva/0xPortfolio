"use client"

import { useTheme } from "next-themes" // Ensure next-themes is installed or remove if not used
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:rounded-none group-[.toaster]:shadow-[3px_3px_0px_#000]", // Neo-Brutalist toast
          description: "group-[.toast]:text-gray-700", // text-muted-foreground to text-gray-700
          actionButton: // Assuming buttonVariants is updated for Neo-Brutalism
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:rounded-none group-[.toast]:shadow-[2px_2px_0px_#000] hover:group-[.toast]:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:rounded-none group-[.toast]:shadow-[2px_2px_0px_#000] hover:group-[.toast]:bg-gray-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }