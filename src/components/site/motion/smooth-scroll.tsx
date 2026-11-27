"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { loadGsap, prefersReducedMotion } from "@/lib/motion/gsap-runtime";
import { attachScrollRuntime, detachScrollRuntime, refreshScrollTriggers } from "@/lib/motion/lenis-scroll";

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    document.documentElement.classList.add("lenis");

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let gsapTicker: ((time: number, deltaTime: number, frame: number, elapsed: number) => void) | null = null;

    void (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();

      lenis.on("scroll", ScrollTrigger.update);

      const scroller = document.documentElement;

      ScrollTrigger.scrollerProxy(scroller, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value as number, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scroller.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.defaults({ scroller });

      ScrollTrigger.addEventListener("refresh", () => lenis.resize());

      gsapTicker = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(gsapTicker);
      gsap.ticker.lagSmoothing(0);

      attachScrollRuntime({ lenis, gsap, ScrollTrigger });

      const runRefresh = () => refreshScrollTriggers();
      requestAnimationFrame(() => {
        runRefresh();
        requestAnimationFrame(runRefresh);
      });
      window.setTimeout(runRefresh, 200);
      window.setTimeout(runRefresh, 600);
    })();

    return () => {
      document.documentElement.classList.remove("lenis");
      if (gsapTicker) {
        void loadGsap().then(({ gsap }) => {
          gsap.ticker.remove(gsapTicker!);
        });
      }
      detachScrollRuntime();
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (window.location.hash) return;

    const resetTop = () => {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    };

    resetTop();
    const frame = window.requestAnimationFrame(() => {
      resetTop();
      refreshScrollTriggers();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
