import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-stone bg-ivory px-4 py-2 text-sm text-mocha shadow-sm placeholder:text-mocha/50 focus-visible:border-mocha focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mocha/30",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";
