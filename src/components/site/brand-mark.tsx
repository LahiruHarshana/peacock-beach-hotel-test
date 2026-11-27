import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "ivory";
}) {
  const ring = tone === "ivory" ? "border-ivory/80" : "border-ocean/80";
  const fill = tone === "ivory" ? "bg-ivory" : "bg-ocean";
  const mark = tone === "ivory" ? "bg-gold" : "bg-gold";

  return (
    <span className={cn("relative flex h-8 w-8 items-center justify-center", className)} aria-hidden="true">
      <span className={cn("absolute inset-0 rounded-full border", ring)} />
      <span className={cn("h-2 w-2 rounded-full", fill)} />
      <span className={cn("absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 translate-x-[2px]", mark)} />
    </span>
  );
}
