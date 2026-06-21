import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-fg-subtle selection:bg-primary selection:text-primary-foreground bg-surface-2 border border-line text-fg h-11 w-full min-w-0 rounded-lg px-3.5 py-1 text-base shadow-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-line-strong",
        "focus-visible:border-brand focus-visible:ring-brand-soft focus-visible:ring-[3px] focus-visible:bg-surface",
        "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
