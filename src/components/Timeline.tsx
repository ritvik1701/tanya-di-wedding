"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { events } from "@/config/wedding";
import EventIcon from "./EventIcon";
import { getLenis } from "./SmoothScroll";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

// Background art per event. All five are portrait 1410x2000 illustrations
// with their subjects near the bottom edge, which is why the cards anchor
// the image to the bottom: a centred cover crops the couple out entirely
// on wide screens.
const EVENT_BG_IMAGES: Record<string, string | null> = {
  kirtan: "/assets/backgrounds/kirtan-vertical.jpg",
  sagan: "/assets/backgrounds/ring-ceremony-vertical.jpg",
  "mehendi-sangeet": "/assets/backgrounds/sangeet-vertical.jpg",
  haldi: "/assets/backgrounds/haldi-vertical.jpg",
  wedding: "/assets/backgrounds/wedding-vertical.jpg",
};

// Flat colour showing behind each image while it loads.
const EVENT_BG_FALLBACK: Record<string, string> = {
  kirtan: "#efe6d4",
  sagan: "#f3eef2",
  "mehendi-sangeet": "#1d1a2b",
  haldi: "#f4c15b",
  wedding: "#e8ddc9",
};

// Four of the five illustrations are light, so those cards run dark ink
// over a cream veil. Sangeet is a night photograph and keeps the original
// dark scrim with cream text.
type Tone = "light" | "dark";

const EVENT_TONE: Record<string, Tone> = {
  kirtan: "light",
  sagan: "light",
  "mehendi-sangeet": "dark",
  haldi: "light",
  wedding: "light",
};

// Nothing is laid over the artwork itself, so the text carries its own
// legibility. The dark card is a photograph with bright lanterns behind
// the type, which is the one place a shadow is needed.
const TONES = {
  dark: {
    title: "#fff4e0",
    body: "#fff4e0",
    label: "#e8dbb4",
    glow: "rgba(255, 244, 224, 0.15)",
    shadow: "0 2px 14px rgba(0, 0, 0, 0.85), 0 0 3px rgba(0, 0, 0, 0.7)",
  },
  light: {
    title: "#9d4130",
    body: "#2a1a15",
    label: "#5f6f4d",
    glow: "rgba(157, 65, 48, 0.15)",
    shadow: "none",
  },
} as const;

const toneOf = (id: string) => TONES[EVENT_TONE[id] ?? "dark"];

// Where the type may sit on each illustration, as CSS inset percentages of
// the card. Measured directly off these images (a per-row luminance/
// gradient scan, not carried over from the previous artwork): the
// decorative border and any ring/chandelier motifs fix the top, the couple
// (or, for Haldi/Sangeet, the busiest decorative band) fixes the bottom.
// Values are plain percentages measured from the top of the card — NOT
// CSS `bottom` insets (which measure from the container's bottom edge;
// converted to that at the point of use, in bandStyle below).
const EVENT_TEXT_BAND: Record<string, { top: number; bottom: number }> = {
  // Vines + florals clear by ~16%; couple enters at a measured ~68%.
  kirtan: { top: 12, bottom: 52 },
  // Ring + chandeliers clear by ~28%; couple's hair actually starts at a
  // precisely measured 69% (not the ~48% the artwork first suggested —
  // most of what looks like "couple" below that is pale clothing, not
  // dark silhouette). This is the tightest of the five: the clear
  // corridor between the ring and the couple is only ~40% of the card,
  // which is why this card also carries the strongest type-scale-down.
  sagan: { top: 19, bottom: 59 },
  // Night photograph — dark sky only, no couple. Centred low enough that
  // the block doesn't spill above the card's own top edge; the bottom of
  // the block does run into the string-light clutter, which is exactly
  // what the tone's heavy text-shadow is there to survive.
  "mehendi-sangeet": { top: 14, bottom: 48 },
  // No couple in this one — marigold border top and bottom, open field
  // between. Generous band, held off the decorative edges.
  haldi: { top: 16, bottom: 58 },
  // Fireworks clear by ~26%; couple (in the rickshaw) enters at ~76%.
  wedding: { top: 23, bottom: 63 },
};

const bandOf = (id: string) =>
  EVENT_TEXT_BAND[id] ?? { top: 18, bottom: 34 };

// CSS `bottom` on an absolutely positioned box is an inset from the
// container's bottom edge, not a position measured from the top — so a
// band described as "top 16%, bottom 60% (from the top)" has to become
// `top: 16%, bottom: 40%` (100 - 60) in the actual style.
const bandStyle = (band: { top: number; bottom: number }) => ({
  top: `${band.top}%`,
  bottom: `${100 - band.bottom}%`,
});

// Every size in the block is a fraction of --cw, so one number per event
// scales the whole thing. Kirtan, Sagan and Wedding have a couple low
// enough in the frame that the full-size block (now taller, with date
// and time on separate lines) doesn't fit above it; Haldi and Sangeet
// have no couple to clear and stay at full size.
const EVENT_TYPE_SCALE: Record<string, number> = {
  kirtan: 0.84,
  sagan: 0.73,
  wedding: 0.85,
};

const scaleOf = (id: string) => EVENT_TYPE_SCALE[id] ?? 1;

// Hindi translations for each event — displayed large, with the English
// name as a smaller caps subtitle underneath (matching the hero treatment).
const EVENT_HI: Record<string, string> = {
  kirtan: "कीर्तन",
  sagan: "सगन",
  "mehendi-sangeet": "मेहंदी और संगीत",
  haldi: "हल्दी",
  wedding: "विवाह",
};

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Progress sidebar state
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  // Track which event section is currently in view so the sidebar dot
  // highlights as we scroll through the slide deck.
  useEffect(() => {
    const update = () => {
      const deck = deckRef.current;
      if (!deck) return;
      const rect = deck.getBoundingClientRect();
      const vh = window.innerHeight;

      // Show whenever the deck covers the middle of the viewport. The
      // old test was `rect.top > 0`, which kept the rail hidden through
      // the whole of the first card: the artwork is centred in the
      // section, so it reads as fully on screen while the deck's top
      // edge is still a hundred-odd pixels below zero.
      if (rect.top > vh * 0.5 || rect.bottom < vh * 0.5) {
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

  // The dot rail floats over whichever card is showing, so it takes that
  // card's tone or it disappears against the light illustrations.
  const railTone = toneOf(events[active]?.id ?? "");

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
                style={{
                  backgroundColor: railTone.label,
                  opacity: 0.3,
                  transition: "background-color 400ms ease",
                }}
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
                            ? railTone.title
                            : "transparent",
                          border: `1.5px solid ${railTone.title}`,
                          boxShadow: isActive
                            ? `0 0 0 4px ${railTone.glow}`
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
          const tone = toneOf(ev.id);
          const band = bandOf(ev.id);
          const hi = EVENT_HI[ev.id] ?? ev.name;
          return (
            <section
              key={ev.id}
              className="sticky top-0 h-[100svh] overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              {/* Blurred backdrop — the same artwork, blown past the
                  edges and blurred, so the bands the card can't reach
                  read as an extension of it rather than dead space.
                  Scaled well over 1 so the blur never feathers into a
                  soft rim at the section boundary. */}
              {bgImage && (
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(36px) saturate(1.2)",
                    transform: "scale(1.25)",
                  }}
                />
              )}

              {/* The card itself — always whole, never cropped. */}
              <div className="relative flex h-full items-center justify-center">
                <div
                  className="relative"
                  style={
                    {
                      // The card is height-driven on wide screens and
                      // width-driven on narrow ones, so its width is
                      // min(100vw, 100svh × 1410/2000). Every size below
                      // is a fraction of that, which keeps the type
                      // seated inside the artwork at any viewport.
                      "--cw": `calc(min(100vw, 70.5svh) * ${scaleOf(ev.id)})`,
                      boxShadow: "0 1.5rem 4rem rgba(26, 12, 2, 0.32)",
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={bgImage ?? ""}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="block max-h-[100svh] w-auto max-w-full select-none"
                  />

                  <div
                    className="absolute inset-x-0 flex flex-col items-center justify-center text-center"
                    style={{
                      ...bandStyle(band),
                      paddingLeft: "9%",
                      paddingRight: "9%",
                      textShadow: tone.shadow,
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                      aria-hidden
                      style={{
                        color: tone.title,
                        width: "calc(var(--cw) * 0.09)",
                        height: "calc(var(--cw) * 0.09)",
                        marginBottom: "calc(var(--cw) * 0.018)",
                      }}
                    >
                      <EventIcon id={ev.id} size={96} color={tone.title} />
                    </span>
                    {/* Date and time — the most prominent label on the
                        card after the Hindi name, so it reads at a glance
                        rather than being just another caps line. Stacked
                        rather than run together on one row. */}
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: tone.title,
                        letterSpacing: "0.22em",
                        fontWeight: 700,
                        fontSize:
                          "clamp(0.82rem, calc(var(--cw) * 0.04), 1.25rem)",
                      }}
                    >
                      {formatDate(ev.date)}
                    </p>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: tone.title,
                        letterSpacing: "0.2em",
                        fontWeight: 600,
                        fontSize:
                          "clamp(0.74rem, calc(var(--cw) * 0.036), 1.1rem)",
                        marginTop: "calc(var(--cw) * 0.008)",
                      }}
                    >
                      {ev.time}
                    </p>

                    {/* Hindi name (primary) */}
                    <span
                      className="block"
                      lang="hi"
                      style={{
                        fontFamily: "var(--font-hindi)",
                        color: tone.title,
                        // ~9% of the card width puts the longest name,
                        // मेहंदी और संगीत at 6.47em, at ~58% of the card.
                        fontSize:
                          "clamp(1.45rem, calc(var(--cw) * 0.074), 3.9rem)",
                        // Yatra One's ascent+descent is 1.48em, so
                        // Devanagari matras collide below this.
                        lineHeight: 1.5,
                        marginTop: "calc(var(--cw) * 0.02)",
                      }}
                    >
                      {hi}
                    </span>

                    {/* English subtitle (smaller, caps) */}
                    <span
                      className="uppercase"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: tone.label,
                        letterSpacing: "0.4em",
                        fontWeight: 600,
                        fontSize:
                          "clamp(0.64rem, calc(var(--cw) * 0.027), 0.95rem)",
                        // Trailing tracking on the last glyph otherwise
                        // reads as an off-centre block.
                        textIndent: "0.4em",
                      }}
                    >
                      {ev.name}
                    </span>

                    <p
                      className="leading-relaxed"
                      style={{
                        color: tone.body,
                        fontSize:
                          "clamp(0.86rem, calc(var(--cw) * 0.034), 1.25rem)",
                        marginTop: "calc(var(--cw) * 0.028)",
                        maxWidth: "34ch",
                      }}
                    >
                      {ev.description}
                    </p>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: tone.label,
                        letterSpacing: "0.18em",
                        fontWeight: 600,
                        fontSize:
                          "clamp(0.7rem, calc(var(--cw) * 0.03), 1.02rem)",
                        marginTop: "calc(var(--cw) * 0.028)",
                      }}
                    >
                      Venue · {ev.venue}
                    </p>
                    <p
                      className="leading-relaxed"
                      style={{
                        color: tone.body,
                        opacity: 0.85,
                        fontSize:
                          "clamp(0.68rem, calc(var(--cw) * 0.028), 0.92rem)",
                        marginTop: "calc(var(--cw) * 0.01)",
                        maxWidth: "34ch",
                      }}
                    >
                      {ev.address}
                    </p>

                    {/* Directions is the last element of the same centred
                        block, rather than parked separately: on the two
                        cards where the couple sits high (Sagan, Wedding)
                        there is no quiet corner left over once the text
                        clears the couple, so keeping it in-flow is what
                        actually stays off the photo. */}
                    <div
                      className="flex flex-wrap justify-center gap-3"
                      style={{ marginTop: "calc(var(--cw) * 0.03)" }}
                    >
                      <EventButton
                        as={ev.directionsUrl ? "a" : "button"}
                        href={ev.directionsUrl}
                        disabled={!ev.directionsUrl}
                        ink={EVENT_TONE[ev.id] === "light"}
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
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
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
  // Dark outline for cards running light artwork; cream is unreadable there.
  ink?: boolean;
};

function EventButton({
  children,
  as,
  href,
  onClick,
  disabled,
  ariaLabel,
  ink,
}: EventButtonProps) {
  const className = `tl-action-btn${ink ? " tl-action-btn--ink" : ""} group inline-flex min-h-[44px] items-center gap-2 border px-5 py-3 text-xs uppercase sm:gap-2.5 sm:text-xs`;
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
