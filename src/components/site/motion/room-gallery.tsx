"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";

const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

/** Horizontal scroll is a desktop enhancement. Narrow screens keep the vertical stack. */
export function RoomGallery({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const row = track.current;
    if (!row) return;
    gsap.set(row, { display: "flex", flexDirection: "row", width: "max-content", gap: "2rem" });
    gsap.set(row.children, { width: "72vw", flex: "none" });
    const distance = row.scrollWidth - (root.current?.clientWidth ?? row.clientWidth);
    if (distance < 48) return;
    gsap.to(row, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${distance}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);

  return (
    <div ref={root} className="overflow-x-hidden">
      <div ref={track} className="flex flex-col gap-12">
        {children}
      </div>
    </div>
  );
}
