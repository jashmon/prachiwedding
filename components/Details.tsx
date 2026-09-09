import { MapPin, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { wedding } from "@/data/wedding";
import { Ornament } from "./Ornament";

export function Details({ onRsvp }: { onRsvp: () => void }) {
  return (
    <section id="details" className="details-section section-paper" aria-labelledby="details-title">
      <div className="details-title-block">
        <p className="details-indic" lang="hi">{wedding.devanagari.details}</p>
        <h2 id="details-title">The useful<br />bits.</h2>
      </div>
      <div className="details-list">
        <div className="detail-item detail-venue">
          <p>Venue <span lang="hi">{wedding.detailLabels.venue}</span></p>
          <strong>{wedding.venue}</strong>
          <span>{wedding.city}</span>
          {wedding.mapUrl ? (
            <a href={wedding.mapUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} weight="light" /> Open in maps <ArrowUpRight size={16} weight="light" />
            </a>
          ) : <span className="detail-soon">Directions will appear here</span>}
        </div>
        <div className="detail-item detail-dress">
          <p>Dress <span lang="hi">{wedding.detailLabels.dress}</span></p>
          <strong>{wedding.dressCode}</strong>
          <span>No rules. Bring shoes you can dance in.</span>
        </div>
        <div className="detail-item detail-contact">
          <p>Contact <span lang="hi">{wedding.detailLabels.contact}</span></p>
          <div className="contact-list">
            {wedding.contacts.map((contact) => (
              <a key={contact.phone} href={`tel:+91${contact.phone}`}>
                <strong>{contact.name}</strong>
                <span>{contact.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="details-rsvp">
        <Ornament />
        <span className="details-rsvp-indic" lang="hi">{wedding.devanagari.rsvp}</span>
        <p>Can’t wait to see you!</p>
        <button type="button" className="ink-button" onClick={onRsvp}>
          <span>Send RSVP</span><span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
