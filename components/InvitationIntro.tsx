"use client";

import { useLayoutEffect, useRef } from "react";
import { Ornament } from "./Ornament";
import { wedding } from "@/data/wedding";
import { CharacterPair } from "./CharacterPair";

export function InvitationIntro() {
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
      gsap.fromTo(".invitation-statement span", { yPercent: 110 }, {
        yPercent: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: ".invitation-statement", start: "top 78%", once: true },
      });
      gsap.fromTo(".intro-ornament .ornament-line", { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".intro-ornament", start: "top 85%", once: true },
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
    <section ref={root} id="invitation" className="invitation-intro section-paper">
      <p className="invitation-small">
        <span>With the blessings of our families</span>
        <span lang="hi">{wedding.devanagari.familyBlessings}</span>
      </p>
      <h2 className="invitation-statement" aria-label="We would love for you to be there as we begin the next chapter of our story.">
        <span>We would love for you</span>
        <span>to be there as we begin</span>
        <span>the next chapter of our story.</span>
      </h2>
      <CharacterPair action="namaste" className="intro-characters" />
      <p className="invitation-indic-statement" lang="hi">{wedding.devanagari.invitation}</p>
      <Ornament className="intro-ornament" />
      <p className="invitation-indic" lang="hi">{wedding.blessing}</p>
      <p className="invitation-after">{wedding.inviteLine}</p>
    </section>
  );
}
