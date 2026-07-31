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
  // Shown large on the card, and as the countdown's headline when the
  // countdown is pointing at this event.
  nameHi: string;
  // Overrides nameHi in the countdown headline only. The wedding reads
  // "शुभ विवाह" there and plain "विवाह" on its card.
  countdownHi?: string;
  // The moment the event starts, written with the IST offset so it is an
  // absolute instant. Everything that compares against "now" uses this,
  // so it must stay the start of the window that `time` describes.
  date: Date;
  // The window as printed on the card, for display only.
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
    nameHi: "कीर्तन",
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
    nameHi: "सगन",
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
    nameHi: "मेहंदी और संगीत",
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
    nameHi: "हल्दी",
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
    nameHi: "विवाह",
    countdownHi: "शुभ विवाह",
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

export const byDate = (a: WeddingEvent, b: WeddingEvent) =>
  a.date.getTime() - b.date.getTime();

// What the countdown points at, given the events a particular link shows.
//
// The wedding anchors the page whenever it is on the list, even though
// earlier events come first. For a list without it, the countdown has
// nothing else to mean, so it takes the earliest event instead.
//
// Never points backwards. If the pick has already started, it falls
// through to the earliest event still ahead, and returns null once none
// are — the caller shows a stopped clock for that.
//
// `now` of null is the first paint. These pages are prerendered at build
// time, so a target that depended on the clock would be computed weeks
// before anyone opens it and would disagree with the browser at
// hydration. The null case is the same on both sides; the caller swaps
// in the real instant a tick after mount.
export function countdownTarget(
  list: WeddingEvent[],
  now: Date | null,
): WeddingEvent | null {
  const sorted = [...list].sort(byDate);
  const marriage = sorted.find((e) => e.id === "wedding");

  if (!now) return marriage ?? sorted[0] ?? null;

  if (marriage && marriage.date.getTime() > now.getTime()) return marriage;
  return sorted.find((e) => e.date.getTime() > now.getTime()) ?? null;
}
