"use client";

import { useEffect, useRef } from "react";
export function Navigation({ onRsvp }: { onRsvp: () => void }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nav.current) return;
    const invitation = document.querySelector<HTMLElement>("#invitation");
    if (!invitation) return;
    let ticking = false;
    const update = () => {
      nav.current?.toggleAttribute("data-paper", window.scrollY >= invitation.offsetTop - 72);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav ref={nav} className="site-nav" aria-label="Main navigation">
      <a className="nav-monogram" href="#top" aria-label="Prachi and Pratik, back to top">P × P</a>
      <div className="nav-actions">
        <a href="#details">Details</a>
        <button type="button" onClick={onRsvp}>RSVP</button>
      </div>
    </nav>
  );
}
