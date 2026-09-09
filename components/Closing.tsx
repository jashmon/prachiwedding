import { wedding } from "@/data/wedding";
import { Ornament } from "./Ornament";
import { CharacterPair } from "./CharacterPair";

export function Closing({ onRsvp }: { onRsvp: () => void }) {
  return (
    <footer className="closing-section">
      <div className="closing-inner">
        <p className="closing-small">{wedding.bride} &amp; {wedding.groom}</p>
        <h2>Your Presence<br />means everything<br />to us.</h2>
        <CharacterPair action="wave" className="closing-characters" />
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
