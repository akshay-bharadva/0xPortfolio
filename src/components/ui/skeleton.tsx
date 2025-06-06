import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none bg-gray-300 border-2 border-black", className)} // rounded-md to rounded-none, bg-muted to bg-gray-300, added border
      {...props}
    />
  )
}

export { Skeleton }