"use client";

import { useState } from "react";
import { IntroSequence } from "./IntroSequence";
import { SmoothScroll } from "./SmoothScroll";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { InvitationIntro } from "./InvitationIntro";
import { WeddingDate } from "./WeddingDate";
import { Events } from "./Events";
import { Story } from "./Story";
import { Details } from "./Details";
import { Closing } from "./Closing";
import { RSVPModal } from "./RSVPModal";

export function WeddingExperience() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const openRsvp = () => setRsvpOpen(true);

  return (
    <>
      <IntroSequence />
      <SmoothScroll />
      <Navigation onRsvp={openRsvp} />
      <div className={`site-shell${rsvpOpen ? " is-receded" : ""}`} aria-hidden={rsvpOpen || undefined}>
        <main>
          <Hero onRsvp={openRsvp} />
          <InvitationIntro />
          <WeddingDate />
          <Events />
          <Story />
          <Details onRsvp={openRsvp} />
        </main>
        <Closing onRsvp={openRsvp} />
      </div>
      <RSVPModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </>
  );
}
