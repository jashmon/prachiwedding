import { wedding } from "@/data/wedding";
import { Ornament } from "./Ornament";

export function Closing({ onRsvp }: { onRsvp: () => void }) {
  return (
    <footer className="closing-section">
      <div className="closing-inner">
        <p className="closing-small">{wedding.bride} &amp; {wedding.groom}</p>
        <h2>See you<br />there.</h2>
        <p className="closing-farewell" lang="hi">{wedding.devanagari.farewell}</p>
        <p className="closing-indic" lang="hi">{wedding.blessing}</p>
        <div className="closing-meta">
          <p>24.10.26</p>
          <button type="button" onClick={onRsvp}>RSVP <span aria-hidden="true">↗</span></button>
        </div>
        <Ornament className="closing-ornament" />
      </div>
    </footer>
  );
}
