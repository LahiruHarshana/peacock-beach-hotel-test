import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-32 w-full rounded-2xl border border-stone bg-ivory px-4 py-3 text-sm leading-6 text-mocha shadow-sm placeholder:text-mocha/50 focus-visible:border-mocha focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mocha/30",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
