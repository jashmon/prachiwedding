"use client";

import { useState } from "react";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { InvitationIntro } from "./InvitationIntro";
import { Details } from "./Details";
import { Closing } from "./Closing";
import { RSVPModal } from "./RSVPModal";

export function WeddingExperience() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const openRsvp = () => setRsvpOpen(true);

  return (
    <>
      <Navigation onRsvp={openRsvp} />
      <div className={`site-shell${rsvpOpen ? " is-receded" : ""}`} aria-hidden={rsvpOpen || undefined}>
        <main>
          <Hero onRsvp={openRsvp} />
          <InvitationIntro />
          <Details onRsvp={openRsvp} />
        </main>
        <Closing onRsvp={openRsvp} />
      </div>
      <RSVPModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </>
  );
}
