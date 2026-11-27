import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: "default" | "outline" | "warning" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-mocha text-ivory",
        variant === "outline" && "border border-mocha/15 bg-ivory text-mocha/75",
        variant === "warning" && "bg-greige text-mocha",
        className,
      )}
      {...props}
    />
  );
}
