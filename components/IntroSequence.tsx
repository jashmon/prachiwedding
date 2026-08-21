"use client";

import { useEffect, useState } from "react";

export function IntroSequence() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeen = window.sessionStorage.getItem("wedding-intro-seen") === "yes";
    if (reduce || hasSeen) {
      const frame = window.requestAnimationFrame(() => setDone(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("wedding-intro-seen", "yes");
      setDone(true);
    }, 2450);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-glyph"><span /></div>
      <p className="intro-initials">P × P</p>
      <span className="intro-rule" />
    </div>
  );
}
