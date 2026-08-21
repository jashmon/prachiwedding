import { wedding } from "@/data/wedding";

export function Events() {
  return (
    <section id="events" className="events-section section-paper" aria-labelledby="events-title">
      <div className="events-heading">
        <p className="events-indic" lang="hi">{wedding.devanagari.celebrations}</p>
        <h2 id="events-title">Four reasons<br />to celebrate.</h2>
        <p>The full schedule will arrive closer to the day.</p>
      </div>
      <div className="event-fragments">
        {wedding.events.map((event, index) => (
          <article className={`event-fragment event-${event.tone}`} key={event.name} tabIndex={0}>
            <div className="event-border" aria-hidden="true"><i /><i /><i /><i /></div>
            <p className="event-index">{String(index + 1).padStart(2, "0")}</p>
            <div className="event-title-wrap">
              <p className="event-indic" lang="hi">{event.indic}</p>
              <h3>{event.name}</h3>
            </div>
            <p className="event-note">{event.note}</p>
            <p className="event-when">{event.when}</p>
            <span className="event-motif" aria-hidden="true"><i /><i /></span>
          </article>
        ))}
      </div>
    </section>
  );
}
