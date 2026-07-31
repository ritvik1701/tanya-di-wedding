// Central config for the wedding site. Update here to propagate everywhere.

export const wedding = {
  bride: "Tanya",
  groom: "Hemabh",
  // Main wedding date, in IST. This is what the countdown ticks down to.
  date: new Date("2026-08-25T20:00:00+05:30"),
  location: "Krishna Greens, Pushpanjali Farms, New Delhi",
};

// The canonical list of event ids. Declared as a literal tuple so that
// anything referring to an event by id (the invite config, the per-event
// artwork maps) fails to compile on a typo rather than silently
// rendering nothing.
export const EVENT_IDS = [
  "kirtan",
  "sagan",
  "mehendi-sangeet",
  "haldi",
  "wedding",
] as const;

export type EventId = (typeof EVENT_IDS)[number];

// Timeline of events. Details taken from the printed invitation cards.
export type WeddingEvent = {
  id: EventId;
  name: string;
  date: Date;
  time: string;
  // Short venue name, shown as the headline. `address` is the full street
  // address, shown beneath it. Display only — the map link is a real pin,
  // not a search on this text.
  venue: string;
  address: string;
  description: string;
  motif: string; // emoji/placeholder for a visual motif later
  // Google Maps pin opened by the Directions button. Shared from Maps
  // itself, so it resolves to the exact venue rather than a name search.
  directionsUrl?: string;
};

const ELDECO = {
  address: "Eldeco Mansionz, Sector 48, Gurugram",
  pin: "https://maps.app.goo.gl/dRSNgZFg8bsiwNm57",
};

export const events: WeddingEvent[] = [
  {
    id: "kirtan",
    name: "Kirtan Ceremony",
    date: new Date("2026-08-15T16:30:00+05:30"),
    time: "4:30 PM - 5:30 PM",
    venue: "Chinmaya Gurudham",
    address:
      "W Block, Plot No-01, Woodstock Ave, Nirvana Country, Sector 50, Gurugram",
    description:
      "An evening of prayers to kick things off. Bless us with your presence!",
    motif: "ॐ",
    directionsUrl: "https://maps.app.goo.gl/47jpNHcUv8W9chgy8",
  },
  {
    id: "sagan",
    name: "Sagan & Ring Ceremony",
    date: new Date("2026-08-23T18:00:00+05:30"),
    time: "6:00 PM onwards",
    venue: "Golden Apple",
    address: "Twin District Center, Near Crown Plaza, Sector-10, Rohini-110085",
    description:
      "Rings exchanged and blessings given, as the two families make it official.",
    motif: "◈",
    directionsUrl: "https://maps.app.goo.gl/Y6HV2mA83ey96FDc8",
  },
  {
    id: "mehendi-sangeet",
    name: "Mehendi & Sangeet",
    date: new Date("2026-08-24T18:00:00+05:30"),
    time: "6:00 PM onwards",
    venue: "Eldeco Mansionz Community Center",
    address: ELDECO.address,
    description: "Come for the henna, stay for the dancing!",
    motif: "✿",
    directionsUrl: ELDECO.pin,
  },
  {
    id: "haldi",
    name: "Haldi",
    date: new Date("2026-08-25T08:00:00+05:30"),
    time: "8:00 AM onwards",
    venue: "Eldeco Mansionz Community Center",
    address: ELDECO.address,
    description: "Join us for a morning of yellow glow!",
    motif: "☀",
    directionsUrl: ELDECO.pin,
  },
  {
    id: "wedding",
    name: "Wedding Ceremony",
    date: new Date("2026-08-25T20:00:00+05:30"),
    time: "8:00 PM onwards",
    venue: "Krishna Greens",
    address: "Block H-1, Dwarka Link Rd, Pushpanjali Farms, New Delhi",
    description:
      "Around the sacred fire, two families become one. The main event.",
    motif: "❉",
    directionsUrl: "https://maps.app.goo.gl/So1mDa5rtb5hpyQS8",
  },
];

// Helper: the "next" upcoming event.
export function getNextEvent(now: Date = new Date()): WeddingEvent | null {
  const upcoming = events.filter((e) => e.date.getTime() > now.getTime());
  if (upcoming.length === 0) return null;
  return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
}
