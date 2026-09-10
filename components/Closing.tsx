import { wedding } from "@/data/wedding";
import { Ornament } from "./Ornament";

export function Closing({ onRsvp }: { onRsvp: () => void }) {
  return (
    <footer className="closing-section">
      <div className="closing-inner">
        <p className="closing-small">{wedding.bride} &amp; {wedding.groom}</p>
        <h2>Your Presence<br />means everything<br />to us.</h2>
        <p className="closing-indic" lang="hi">{wedding.blessing}</p>
        <div className="closing-meta">
          <button type="button" onClick={onRsvp}>RSVP <span aria-hidden="true">↗</span></button>
        </div>
        <Ornament className="closing-ornament" />
      </div>
    </footer>
  );
}
