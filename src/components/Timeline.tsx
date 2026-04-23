"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { events, type WeddingEvent } from "@/config/wedding";
import EventIcon from "./EventIcon";
import ThemeMotif from "./ThemeMotif";
import { getLenis } from "./SmoothScroll";
import ContactsModal from "./ContactsModal";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

// Background images per event. Sangeet doesn't have one yet — fall back
// to a placeholder colour.
const EVENT_BG_IMAGES: Record<string, string | null> = {
  haldi: "/assets/backgrounds/haldi.jpg",
  mehendi: "/assets/backgrounds/mehendi.jpg",
  sangeet: null,
  wedding: "/assets/backgrounds/wedding.jpg",
};
const EVENT_BG_FALLBACK: Record<string, string> = {
  haldi: "#f4c15b",
  mehendi: "#8ba15a",
  sangeet: "#b77aa2",
  wedding: "#c74a2b",
};

// Unified creamy text colour for every event — reads cleanly over every
// darkened background.
const FG_TITLE = "#fff4e0";
const FG_BODY = "#fff4e0";
const FG_LABEL = "#e8dbb4";

// Hindi translations for each event — displayed large, with the English
// name as a smaller caps subtitle underneath (matching the hero treatment).
const EVENT_HI: Record<string, string> = {
  haldi: "हल्दी",
  mehendi: "मेहंदी",
  sangeet: "संगीत",
  wedding: "विवाह",
};

// Per-event theme — `color` drives the motif + accent visuals, `name`
// is the human-readable palette label shown in "we celebrate in …".
const EVENT_THEMES: Record<
  string,
  { color: string; accent: string; name: string }
> = {
  haldi: { color: "#b994c6", accent: "#d8bfe2", name: "lilac" },
  mehendi: { color: "#8aa36a", accent: "#bcd08f", name: "henna green" },
  sangeet: { color: "#8a6bb3", accent: "#e6b22b", name: "indigo" },
  wedding: { color: "#d8525c", accent: "#c9a35d", name: "crimson" },
};

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Progress sidebar state
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  // Which event's contacts modal is open (null = closed)
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const openEvent = useMemo<WeddingEvent | null>(
    () => events.find((e) => e.id === openEventId) ?? null,
    [openEventId]
  );

  // Track which event section is currently in view so the sidebar dot
  // highlights as we scroll through the slide deck.
  useEffect(() => {
    const update = () => {
      const deck = deckRef.current;
      if (!deck) return;
      const rect = deck.getBoundingClientRect();
      const vh = window.innerHeight;

      // Hide when the deck isn't in view
      if (rect.top > 0 || rect.bottom < vh * 0.5) {
        setVisible(false);
        return;
      }
      setVisible(true);

      // Each event occupies one viewport-height of scroll in the deck.
      const scrolledPast = Math.max(0, -rect.top);
      const idx = Math.min(
        events.length - 1,
        Math.max(0, Math.floor(scrolledPast / vh + 0.15))
      );
      setActive(idx);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Click a dot → smoothly scroll to that event's slot in the deck
  const scrollToEvent = useCallback((idx: number) => {
    const deck = deckRef.current;
    if (!deck) return;
    const rect = deck.getBoundingClientRect();
    const deckTop = rect.top + window.scrollY;
    const targetY = deckTop + idx * window.innerHeight;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetY, {
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
      });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Slide deck — each section sticks to the top of the viewport and
          the next one slides over it as you scroll. */}
      <div ref={deckRef} className="relative">
        {/* Progress sidebar: vertical rail with 4 dots over the slide deck.
            Fixed in the viewport, only visible while the deck is in view. */}
        <nav
          aria-label="Events progress"
          className={`pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-500 sm:bottom-8 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Horizontal dot rail with a thin connecting line */}
            <div className="relative flex items-center gap-6 sm:gap-8">
              {/* Line behind the dots */}
              <span
                aria-hidden
                className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2"
                style={{ backgroundColor: FG_LABEL, opacity: 0.3 }}
              />
              {events.map((ev, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => scrollToEvent(i)}
                    className="pointer-events-auto relative z-10"
                    aria-label={`Go to ${ev.name}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {/* Fixed 16×16 wrapper keeps every dot on the same
                        Y axis regardless of inner dot's size. */}
                    <span
                      aria-hidden
                      className="flex h-4 w-4 items-center justify-center"
                    >
                      <span
                        className="block rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: isActive ? 14 : 8,
                          height: isActive ? 14 : 8,
                          backgroundColor: isActive
                            ? FG_TITLE
                            : "transparent",
                          border: `1.5px solid ${FG_TITLE}`,
                          boxShadow: isActive
                            ? `0 0 0 4px rgba(255, 244, 224, 0.15)`
                            : "none",
                        }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {events.map((ev) => {
          const bgImage = EVENT_BG_IMAGES[ev.id];
          const bgColor = EVENT_BG_FALLBACK[ev.id] ?? "#f0e4cc";
          const hi = EVENT_HI[ev.id] ?? ev.name;
          const theme = EVENT_THEMES[ev.id] ?? {
            color: FG_TITLE,
            accent: FG_TITLE,
            name: "",
          };
          return (
            <section
              key={ev.id}
              className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6 sm:px-10 md:px-14"
              style={{
                backgroundColor: bgColor,
                backgroundImage: bgImage
                  ? `linear-gradient(120deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.35) 100%), url(${bgImage})`
                  : "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-start text-left">
                <span
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center sm:mb-6 sm:h-20 sm:w-20 md:h-24 md:w-24"
                  aria-hidden
                  style={{ color: FG_TITLE }}
                >
                  <EventIcon id={ev.id} size={96} color={FG_TITLE} />
                </span>
                <p
                  className="flex flex-col gap-y-1 text-sm uppercase sm:flex-row sm:flex-wrap sm:gap-x-2 sm:text-base md:text-lg"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: FG_LABEL,
                    letterSpacing: "0.2em",
                    fontWeight: 600,
                  }}
                >
                  <span>{formatDate(ev.date)}</span>
                  <span aria-hidden className="hidden sm:inline">
                    ·
                  </span>
                  <span>{ev.time}</span>
                </p>

                {/* Hindi name (primary) */}
                <span
                  className="mt-3 block leading-none sm:mt-4"
                  lang="hi"
                  style={{
                    fontFamily: "var(--font-hindi)",
                    color: FG_TITLE,
                    fontSize: "clamp(3rem, 12vw, 10rem)",
                    lineHeight: 1,
                  }}
                >
                  {hi}
                </span>

                {/* English subtitle (smaller, caps) */}
                <span
                  className="mt-3 text-sm uppercase sm:mt-4 sm:text-base md:text-lg"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: FG_LABEL,
                    letterSpacing: "0.4em",
                    fontWeight: 600,
                  }}
                >
                  {ev.name}
                </span>

                {/* Theme motif + dress-code caption — the ornament and
                    "· WE CELEBRATE IN … ·" label together communicate
                    the event's palette as a guest cue. Responsive size
                    so the motif reads prominently on larger viewports. */}
                <div className="mt-6 flex items-center gap-4 sm:mt-7 sm:gap-5">
                  <span
                    className="block shrink-0"
                    style={{
                      width: "clamp(72px, 10vw, 96px)",
                      height: "clamp(72px, 10vw, 96px)",
                    }}
                  >
                    <ThemeMotif color={theme.color} size="100%" />
                  </span>
                  <span
                    className="flex flex-col gap-y-0.5 text-xs uppercase sm:flex-row sm:gap-x-2 sm:text-sm md:text-base"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: FG_LABEL,
                      letterSpacing: "0.3em",
                      fontWeight: 600,
                    }}
                  >
                    <span>We celebrate</span>
                    <span>in {theme.name}</span>
                  </span>
                </div>

                <p
                  className="mt-6 max-w-2xl text-base leading-relaxed sm:mt-8 sm:text-lg md:text-xl lg:text-2xl"
                  style={{ color: FG_BODY }}
                >
                  {ev.description}
                </p>
                <p
                  className="mt-6 text-sm uppercase sm:mt-8 sm:text-base md:text-lg"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: FG_LABEL,
                    letterSpacing: "0.18em",
                    fontWeight: 600,
                  }}
                >
                  Venue · {ev.venue}
                </p>

                {/* Action buttons: directions + points of contact */}
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                  <EventButton
                    as={ev.directionsUrl ? "a" : "button"}
                    href={ev.directionsUrl}
                    disabled={!ev.directionsUrl}
                    ariaLabel={
                      ev.directionsUrl
                        ? `Open directions to ${ev.name}`
                        : `Directions to ${ev.name} coming soon`
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                    Directions
                  </EventButton>
                  <EventButton
                    as="button"
                    onClick={() => setOpenEventId(ev.id)}
                    ariaLabel={`View points of contact for ${ev.name}`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Points of Contact
                  </EventButton>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <ContactsModal event={openEvent} onClose={() => setOpenEventId(null)} />
    </section>
  );
}

// Outlined cream button used for the two per-event actions. Renders as
// either a native button or an anchor depending on `as`.
type EventButtonProps = {
  children: React.ReactNode;
  as: "a" | "button";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

function EventButton({
  children,
  as,
  href,
  onClick,
  disabled,
  ariaLabel,
}: EventButtonProps) {
  const className =
    "tl-action-btn group inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] uppercase sm:gap-2.5 sm:px-5 sm:py-3 sm:text-xs";
  const style: React.CSSProperties = {
    letterSpacing: "0.22em",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
  };

  if (as === "a" && href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
