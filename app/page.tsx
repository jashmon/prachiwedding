import { WeddingExperience } from "@/components/WeddingExperience";
import { wedding } from "@/data/wedding";

export default function Home() {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${wedding.bride} and ${wedding.groom}'s wedding`,
    startDate: wedding.dateISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: wedding.venue, address: wedding.city },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <WeddingExperience />
    </>
  );
}
