export const wedding = {
  bride: "Prachi",
  groom: "Pratik",
  initials: "P × P",
  dateISO: "2026-10-24",
  dateDisplay: "24.10.26",
  day: "Saturday",
  month: "October",
  year: "2026",
  city: "Suraburdi, Nagpur",
  venue: "Signature Resort",
  mapUrl: "https://share.google/RlSCc6uFTgZotHahs",
  dressCode: "Come dressed to celebrate",
  contacts: [
    { name: "Raju Arya", phone: "9326334345" },
    { name: "Daksh Arya", phone: "7030607346" },
  ],
  inviteLine: "After six years, we are making it official.",
  blessing: "शुभ विवाह",
  devanagari: {
    invited: "आप सादर आमंत्रित हैं",
    familyBlessings: "परिवार के आशीर्वाद के साथ",
    invitation: "हमारी नई शुरुआत में आपका साथ हमें बेहद प्रिय होगा।",
    details: "ज़रूरी बातें",
    rsvp: "आपसे मिलने का इंतज़ार है!",
  },
  detailLabels: {
    venue: "स्थान",
    dress: "पहनावा",
    contact: "संपर्क",
  },
} as const;

export type Wedding = typeof wedding;
