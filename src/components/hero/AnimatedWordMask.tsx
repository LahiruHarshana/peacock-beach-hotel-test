"use client";

import { forwardRef, useId } from "react";

export type MaskLayout = {
  width: number;
  height: number;
  fontSize: number;
  cx: number;
  cy: number;
  burstCx: number;
  burstCy: number;
  burstR: number;
};

type AnimatedWordMaskProps = {
  wordmark: string;
  maskId: string;
  layout: MaskLayout | null;
  maskGroupRef: React.RefObject<SVGGElement | null>;
  textRef: React.RefObject<SVGTextElement | null>;
};

export const AnimatedWordMask = forwardRef<SVGSVGElement, AnimatedWordMaskProps>(function AnimatedWordMask(
  { wordmark, maskId, layout, maskGroupRef, textRef },
  ref,
) {
  const w = layout?.width ?? 1;
  const h = layout?.height ?? 1;

  return (
    <svg
    ref={ref}
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox={`0 0 ${w} ${h}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          maskContentUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={w}
          height={h}
        >
          <rect x={0} y={0} width={w} height={h} fill="black" />
          <g ref={maskGroupRef}>
            <text
              ref={textRef}
              x={layout?.cx ?? w / 2}
              y={layout?.cy ?? h / 2}
              fontSize={layout?.fontSize ?? 120}
              fill="var(--brand-sand-light)"
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.055em",
                textTransform: "lowercase",
              }}
            >
              {wordmark}
            </text>
          </g>
        </mask>
      </defs>
    </svg>
  );
});

export function useHeroMaskId() {
  const uid = useId().replace(/:/g, "");
  return `hero-mask-${uid}`;
}
