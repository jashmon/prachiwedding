import Image from "next/image";
import { wedding } from "@/data/wedding";

export function Story() {
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <header className="story-heading">
        <p>
          <span>Six years, in a few frames</span>
          <span lang="hi">{wedding.devanagari.story}</span>
        </p>
        <h2 id="story-title">Not a timeline.<br />Just us.</h2>
      </header>
      <div className="story-sequence">
        {wedding.story.map((moment, index) => (
          <article className={`story-moment story-moment-${index + 1}`} key={moment.year}>
            <p className="story-year">{moment.year}</p>
            <figure className="story-photo">
              <Image
                src={moment.image}
                alt={`${wedding.bride} and ${wedding.groom} together in ${moment.year}`}
                fill
                sizes={index === 1 ? "(max-width: 767px) 88vw, 42vw" : "(max-width: 767px) 92vw, 58vw"}
                loading="lazy"
              />
            </figure>
            <p className="story-line">{moment.line}</p>
          </article>
        ))}
        <div className="story-forever" aria-label="Forever">
          <span>and then</span>
          <p>forever</p>
        </div>
      </div>
    </section>
  );
}
