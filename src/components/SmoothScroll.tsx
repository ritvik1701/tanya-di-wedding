"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton so other components can call lenis.scrollTo(...)
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export default function SmoothScroll() {
  useEffect(() => {
    // Always start at the top on page load/refresh — don't let the browser
    // restore a previous scroll position.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;
    // Defensive: tell Lenis explicitly to start at 0 too
    lenis.scrollTo(0, { immediate: true, force: true });

    // Drive Lenis from GSAP's ticker and sync ScrollTrigger
    function onScroll() {
      ScrollTrigger.update();
    }
    lenis.on("scroll", onScroll);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
