"use client"

import { useToast } from "@/hooks/use-toast" // Ensure this path is correct
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast" // Ensure this path is correct

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}> {/* Toast itself is styled in toast.tsx */}
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>} {/* ToastTitle is styled in toast.tsx */}
              {description && (
                <ToastDescription>{description}</ToastDescription> /* ToastDescription is styled in toast.tsx */
              )}
            </div>
            {action} {/* ToastAction is styled in toast.tsx */}
            <ToastClose /> {/* ToastClose is styled in toast.tsx */}
          </Toast>
        )
      })}
      <ToastViewport /> {/* Viewport is generally fine */}
    </ToastProvider>
  )
}