// Which events each invitation link shows.
//
// Two levels on purpose. EVENT_SETS names the handful of combinations
// that actually recur, and INVITES maps a link id to one of them. Editing
// a set updates every link that uses it; adding a guest group is one new
// line in INVITES and nothing else.

import { events, type EventId, type WeddingEvent } from "./wedding";

export const EVENT_SETS = {
  everything: ["kirtan", "sagan", "mehendi-sangeet", "haldi", "wedding"],
  kirtanAndWedding: ["kirtan", "wedding"],
  kirtanSaganWedding: ["kirtan", "sagan", "wedding"],
  saganAndWedding: ["sagan", "wedding"],
  weddingOnly: ["wedding"],
  kirtanOnly: ["kirtan"],
} satisfies Record<string, readonly EventId[]>;

export type EventSetName = keyof typeof EVENT_SETS;

export type Invite = {
  // A note about who this link went to. Never rendered on the page.
  for: string;
  // A named set, or an explicit list for a one-off that doesn't fit one.
  events: EventSetName | readonly EventId[];
};

// The id is the entire secret, so it stays random rather than
// descriptive. A descriptive id is guessable, and it also tells whoever
// receives it what they were sorted into. Drawn from an alphabet with
// 0/O and 1/l/i left out, so an id is safe to read aloud or type off a
// printed card.
export const INVITES = {
  "7m4esyf4": {
    for: "Kirtan and Wedding",
    events: "kirtanAndWedding",
  },
  "8qmzy9hc": {
    for: "Kirtan, Sagan and Wedding",
    events: "kirtanSaganWedding",
  },
  yzm9uadt: {
    for: "Wedding only",
    events: "weddingOnly",
  },
  "87d6vkcr": {
    for: "Kirtan only",
    events: "kirtanOnly",
  },
  dhgkmcsj: {
    for: "All five events",
    events: "everything",
  },
  n7q4vx2k: {
    for: "Sample link (Sagan and Wedding)",
    events: "saganAndWedding",
  },
} satisfies Record<string, Invite>;

export const inviteIds = Object.keys(INVITES);

export function getInvite(id: string): Invite | null {
  return (INVITES as Record<string, Invite>)[id] ?? null;
}

// Filters the canonical list rather than mapping over the invite's own
// ids, so events always come out in date order no matter what order the
// set was written in.
export function eventsForInvite(invite: Invite): WeddingEvent[] {
  const ids =
    typeof invite.events === "string"
      ? EVENT_SETS[invite.events]
      : invite.events;
  const allowed = new Set<string>(ids);
  return events.filter((e) => allowed.has(e.id));
}
