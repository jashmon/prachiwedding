import { wedding } from "@/data/wedding";

export function Hero({ onRsvp }: { onRsvp: () => void }) {
  return (
    <section id="top" className="hero-shell" aria-label="Wedding invitation">
      <div className="hero-frame">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/lakeside-gradient.jpg"
            aria-label="Prachi and Pratik by a lakeside at sunset"
          >
            <source src="/media/lakeside-invitation.mp4" type="video/mp4" />
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
              <button type="button" className="hero-rsvp" onClick={onRsvp} aria-label="RSVP now">
                <span>RSVP</span><small>Reply now</small><span aria-hidden="true">↗</span>
              </button>
              <p className="hero-place">{wedding.city}</p>
            </div>
          </div>
        </div>
    </section>
  );
}
