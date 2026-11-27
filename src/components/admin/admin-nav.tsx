"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({ links }: { links: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:overflow-visible" aria-label="Admin">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-xs font-medium uppercase tracking-[0.12rem] transition-colors",
              active ? "bg-mocha text-ivory" : "text-mocha/75 hover:bg-mocha/[0.04] hover:text-mocha",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
