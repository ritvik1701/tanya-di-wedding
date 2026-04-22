// Central config for the wedding site. Update here to propagate everywhere.

export const wedding = {
  bride: "Tanya",
  groom: "Hemabh",
  // Main wedding date. Using local time (IST-like) — adjust if needed.
  date: new Date("2026-08-25T00:00:00+05:30"),
  location: "TBD",
};

// Timeline of events. Dates are placeholders until confirmed.
export type WeddingEvent = {
  id: string;
  name: string;
  date: Date;
  time: string;
  venue: string;
  description: string;
  motif: string; // emoji/placeholder for a visual motif later
};

export const events: WeddingEvent[] = [
  {
    id: "haldi",
    name: "Haldi",
    date: new Date("2026-08-23T10:00:00+05:30"),
    time: "10:00 AM onwards",
    venue: "TBD",
    description:
      "A sun-soaked morning of turmeric blessings, laughter, and the scent of marigolds.",
    motif: "☀",
  },
  {
    id: "mehendi",
    name: "Mehendi",
    date: new Date("2026-08-23T17:00:00+05:30"),
    time: "5:00 PM onwards",
    venue: "TBD",
    description:
      "Henna, music, and stories traced in vine and petal across the bride's hands.",
    motif: "✿",
  },
  {
    id: "sangeet",
    name: "Sangeet",
    date: new Date("2026-08-24T19:00:00+05:30"),
    time: "7:00 PM onwards",
    venue: "TBD",
    description:
      "A night of song and dance — the families come together in celebration.",
    motif: "♪",
  },
  {
    id: "wedding",
    name: "The Wedding",
    date: new Date("2026-08-25T18:00:00+05:30"),
    time: "6:00 PM onwards",
    venue: "TBD",
    description:
      "Around the sacred fire, two families become one. The main event.",
    motif: "❉",
  },
  {
    id: "reception",
    name: "Reception",
    date: new Date("2026-08-26T19:00:00+05:30"),
    time: "7:00 PM onwards",
    venue: "TBD",
    description: "A royal evening to toast the newlyweds.",
    motif: "✦",
  },
];

// Helper: the "next" upcoming event (used by the countdown).
export function getNextEvent(now: Date = new Date()): WeddingEvent | null {
  const upcoming = events.filter((e) => e.date.getTime() > now.getTime());
  if (upcoming.length === 0) return null;
  return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
}
