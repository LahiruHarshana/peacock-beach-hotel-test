"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useCinematic } from "@/components/site/motion/use-cinematic";
import { DESKTOP_MOTION } from "@/components/site/motion/home/constants";

export function HomeRoomReel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const setup = useCallback((gsap: typeof import("gsap").default) => {
    const reel = root.current;
    const row = track.current;
    if (!reel || !row || row.children.length < 2) return;

    gsap.set(row, {
      display: "flex",
      flexDirection: "row",
      width: "max-content",
      gap: "1.25rem",
      paddingLeft: "4.25vw",
      paddingRight: "8vw",
    });
    gsap.set(row.children, {
      width: "min(72vw, 54rem)",
      flex: "none",
      height: "calc(100dvh - 7.25rem)",
      position: "relative",
    });

    const images = gsap.utils.toArray<HTMLElement>("[data-reel-media]", reel);
    const distance = () => Math.max(0, row.scrollWidth - window.innerWidth + 48);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: reel,
        start: "top 80px",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(row, { x: () => -distance(), ease: "none" }, 0);
    images.forEach((media, index) => {
      timeline.fromTo(
        media,
        { xPercent: -6 + index * 2 },
        { xPercent: 6 - index * 2, ease: "none" },
        0,
      );
    });
  }, []);

  useCinematic(root, setup, DESKTOP_MOTION);

  return (
    <div ref={root} data-cinema="home-reel" className="overflow-x-hidden">
      <div ref={track} className="flex flex-col gap-12 md:gap-0">
        {children}
      </div>
    </div>
  );
}
