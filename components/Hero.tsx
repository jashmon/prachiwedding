"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { wedding } from "@/data/wedding";

export function Hero({ onRsvp }: { onRsvp: () => void }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (video.current && video.current.readyState >= 2) {
      const frame = window.requestAnimationFrame(() => setReady(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop || !root.current) return;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
        })
        .to(".hero-frame", { scale: 0.94, borderRadius: 22, ease: "none" }, 0)
        .to(".hero-video", { scale: 1.01, ease: "none" }, 0)
        .to(".hero-bride", { xPercent: -16, autoAlpha: 0.2, ease: "none" }, 0)
        .to(".hero-groom", { xPercent: 16, autoAlpha: 0.2, ease: "none" }, 0)
        .to(".hero-amp", { rotate: 18, scale: 1.25, autoAlpha: 0.15, ease: "none" }, 0)
        .to(".hero-foot", { yPercent: -80, autoAlpha: 0, ease: "none" }, 0);
      }, root);
      cleanup = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={root} id="top" className="hero-shell" aria-label="Wedding invitation film">
      <div className="hero-sticky">
        <div className="hero-frame">
          <video
            ref={video}
            className={`hero-video${ready ? " is-ready" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.jpg"
            aria-label="A short film of Prachi and Pratik together"
            onCanPlay={() => setReady(true)}
          >
            <source media="(max-width: 767px)" src="/media/prachi-pratik-film-mobile-lite.mp4" type="video/mp4" />
            <source src="/media/prachi-pratik-film.mp4" type="video/mp4" />
          </video>
          <div className="hero-tone" />
          <div className="hero-grain" />

          <div className="hero-copy">
            <p className="hero-kicker">
              <span lang="hi">{wedding.devanagari.invited}</span>
              <span>You are invited</span>
            </p>
            <h1>
              <span className="hero-bride">{wedding.bride}</span>
              <span className="hero-amp" aria-hidden="true">&amp;</span>
              <span className="hero-groom">{wedding.groom}</span>
            </h1>
            <div className="hero-foot">
              <p className="hero-date">{wedding.day}<br />24 October 2026</p>
              <button type="button" className="hero-rsvp" onClick={onRsvp}>
                <span>RSVP</span><span aria-hidden="true">↘</span>
              </button>
              <p className="hero-place">Together since 2020<br />{wedding.city}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
