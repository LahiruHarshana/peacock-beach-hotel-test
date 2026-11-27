"use client";

import { useCallback, useEffect, useState } from "react";
import type { MaskLayout } from "./AnimatedWordMask";
import { HERO_MASK_DESKTOP, HERO_MASK_MOBILE } from "./hero-motion.config";

function fitFontSize(textEl: SVGTextElement, targetWidth: number, viewportH: number) {
  let lo = 8;
  let hi = Math.min(viewportH * 0.55, 520);
  let best = lo;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    textEl.setAttribute("font-size", String(mid));
    const box = textEl.getBBox();
    if (box.width <= targetWidth) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

export function useTypographyReveal(
  pinRef: React.RefObject<HTMLElement | null>,
  textRef: React.RefObject<SVGTextElement | null>,
) {
  const [layout, setLayout] = useState<MaskLayout | null>(null);
  const [layoutReady, setLayoutReady] = useState(false);

  const measure = useCallback(() => {
    const pin = pinRef.current;
    const text = textRef.current;
    if (!pin || !text) return;

    const width = pin.clientWidth;
    const height = pin.clientHeight;
    if (width < 1 || height < 1) return;

    const mobile = width < 768;
    const profile = mobile ? HERO_MASK_MOBILE : HERO_MASK_DESKTOP;
    const targetWidth = width * profile.wordWidthRatio;

    const cx = width / 2;
    const cy = height * 0.52;

    text.setAttribute("x", String(cx));
    text.setAttribute("y", String(cy));

    const fontSize = fitFontSize(text, targetWidth, height);
    text.setAttribute("font-size", String(fontSize));

    const burstCx = width * profile.burstCxRatio;
    const burstCy = height * profile.burstCyRatio;
    const burstR = Math.hypot(width, height) * profile.burstRadiusRatio;

    setLayout((prev) => {
      const next = {
        width,
        height,
        fontSize,
        cx,
        cy,
        burstCx,
        burstCy,
        burstR,
      };
      if (
        prev &&
        prev.width === next.width &&
        prev.height === next.height &&
        prev.fontSize === next.fontSize &&
        prev.burstR === next.burstR
      ) {
        return prev;
      }
      return next;
    });
    setLayoutReady(true);
  }, [pinRef, textRef]);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      measure();
    };

    void document.fonts.ready.then(run);
    run();

    const pin = pinRef.current;
    if (!pin) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(run);
    });
    ro.observe(pin);

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [measure, pinRef]);

  return { layout, layoutReady, remeasure: measure };
}