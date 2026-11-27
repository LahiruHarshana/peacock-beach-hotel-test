"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markIntroSeen, signalIntroDone } from "@/lib/motion/intro-session";

/** The editorial hero is the brand introduction. No separate loading curtain. */
export function IntroCurtain() {
  const pathname = usePathname();

  useEffect(() => {
    markIntroSeen();
    signalIntroDone();
  }, [pathname]);

  return null;
}
