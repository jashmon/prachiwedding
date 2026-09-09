"use client";

import { useLayoutEffect, useRef } from "react";
import { wedding } from "@/data/wedding";

export function WeddingDate() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
      gsap.fromTo(".date-number span", { yPercent: 100 }, {
        yPercent: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
      });
      gsap.to(".date-cross", {
        rotate: 45,
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      }, root);
      cleanup = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={root} id="date" className="date-section">
      <div className="date-annotation">
        <p>Saturday <span lang="hi">शनिवार</span></p>
        <p>Save this date</p>
      </div>
      <div className="date-number" aria-label="24 October 2026">
        <span>24</span>
        <i className="date-cross" aria-hidden="true">×</i>
        <span>10</span>
        <i className="date-cross" aria-hidden="true">×</i>
        <span>26</span>
      </div>
      <p className="date-indic" lang="hi">{wedding.devanagari.date}</p>
      <p className="date-note">One date. All our favourite people.</p>
    </section>
  );
}
