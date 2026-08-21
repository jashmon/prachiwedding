"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wedding } from "@/data/wedding";

gsap.registerPlugin(ScrollTrigger);

export function WeddingDate() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
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
    return () => ctx.revert();
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
