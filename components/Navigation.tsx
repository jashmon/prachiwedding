"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Navigation({ onRsvp }: { onRsvp: () => void }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nav.current) return;
    const trigger = ScrollTrigger.create({
      trigger: "#invitation",
      start: "top 72px",
      onEnter: () => nav.current?.setAttribute("data-paper", "true"),
      onLeaveBack: () => nav.current?.removeAttribute("data-paper"),
    });
    return () => trigger.kill();
  }, []);

  return (
    <nav ref={nav} className="site-nav" aria-label="Main navigation">
      <a className="nav-monogram" href="#top" aria-label="Prachi and Pratik, back to top">P × P</a>
      <a className="nav-date" href="#date">24.10.26</a>
      <div className="nav-actions">
        <a href="#details">Details</a>
        <button type="button" onClick={onRsvp}>RSVP</button>
      </div>
    </nav>
  );
}
