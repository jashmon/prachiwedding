"use client";

import { useEffect } from "react";
export function SmoothScroll() {
  useEffect(() => {
    const desktopPointer = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    if (!desktopPointer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.08, smoothWheel: true, syncTouch: false });
      let frame = 0;
      const update = (time: number) => {
        lenis.raf(time);
        frame = window.requestAnimationFrame(update);
      };
      frame = window.requestAnimationFrame(update);
      cleanup = () => {
        window.cancelAnimationFrame(frame);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
