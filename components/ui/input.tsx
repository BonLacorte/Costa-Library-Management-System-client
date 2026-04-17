import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-t-md border-0 border-b-2 border-b-outline-variant bg-surface-container-low px-4 py-2 text-base transition-colors outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-b-primary focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-container/50 disabled:opacity-50 aria-invalid:border-error md:text-sm shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }
