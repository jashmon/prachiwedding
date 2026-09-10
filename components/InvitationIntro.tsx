import { Ornament } from "./Ornament";
import { wedding } from "@/data/wedding";

export function InvitationIntro() {
  return (
    <section id="invitation" className="invitation-intro section-paper">
      <p className="invitation-small">
        <span>With the blessings of our families</span>
        <span lang="hi">{wedding.devanagari.familyBlessings}</span>
      </p>
      <h2 className="invitation-statement" aria-label="We would love for you to be there as we begin the next chapter of our story.">
        <span>We would love for you</span>
        <span>to be there as we begin</span>
        <span>the next chapter of our story.</span>
      </h2>
      <p className="invitation-indic-statement" lang="hi">{wedding.devanagari.invitation}</p>
      <Ornament className="intro-ornament" />
      <p className="invitation-indic" lang="hi">{wedding.blessing}</p>
      <p className="invitation-after">{wedding.inviteLine}</p>
    </section>
  );
}
