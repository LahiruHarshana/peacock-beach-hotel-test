"use client";

import { forwardRef } from "react";

type HeroArchitectureGridProps = {
  verticalRef?: React.RefObject<HTMLDivElement | null>;
};

export const HeroArchitectureGrid = forwardRef<HTMLDivElement, HeroArchitectureGridProps>(function HeroArchitectureGrid(
  { verticalRef },
  ref,
) {
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <div
        ref={verticalRef}
        className="halden-grid absolute inset-0 opacity-40 transition-opacity duration-300"
      />
      <div
        className="absolute inset-x-[5vw] inset-y-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "100% 33.33%, 100% 100%",
          backgroundPosition: "0 33.33%, 0 100%",
          backgroundRepeat: "no-repeat",
        }}
      />
      <GridMarkers />
    </div>
  );
});

function GridMarkers() {
  const markers = ["25%", "50%", "75%"];
  return (
    <>
      {markers.map((left) => (
        <span
          key={left}
          className="absolute top-[calc(33.33%-3px)] h-1.5 w-1.5 -translate-x-1/2 border border-line bg-canvas"
          style={{ left }}
          aria-hidden
        />
      ))}
    </>
  );
}