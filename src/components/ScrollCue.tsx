"use client";

import { useCallback, useEffect, useState } from "react";
import { scrollStops, scrollToY } from "@/lib/scroll";

// One cue for the whole page instead of one per section. It has to cross
// a dark hero photograph, the stone background and five illustrations of
// both tones, and no bare stroke reads on all of those, so it carries its
// own filled disc. A solid disc looks pressable, so it is: it advances a
// screen. It sits above where the Timeline's dot rail lands rather than
// on top of it, and clears out once there is nothing left to scroll to.
export default function ScrollCue() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const update = () => {
      const remaining =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setAtEnd(remaining < 160);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Lands on the next marked stop rather than one viewport further down.
  // A viewport-sized hop only lines up if you happened to already be on a
  // boundary, and the sections aren't a uniform height anyway. Reading the
  // stops from the DOM on each click also means no assumption about
  // viewport units: the cards are sized in svh, which is not the same as
  // window.innerHeight on a phone with a retracting toolbar.
  const advance = useCallback(() => {
    const stops = scrollStops();
    // 2px of slack absorbs sub-pixel rounding from the previous jump, so
    // the stop we are already sitting on doesn't read as the next one.
    const next = stops.find((y) => y > window.scrollY + 2);
    scrollToY(next ?? document.documentElement.scrollHeight);
  }, []);

  return (
    <button
      type="button"
      onClick={advance}
      aria-label="Scroll to the next section"
      aria-hidden={atEnd || undefined}
      tabIndex={atEnd ? -1 : undefined}
      className={`sc-cue fixed bottom-16 left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full sm:bottom-20 ${
        atEnd ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#9d4130",
        color: "#fff4e0",
        boxShadow: "0 4px 16px rgba(26, 12, 2, 0.35)",
        transition: "opacity 400ms ease, background-color 180ms ease",
      }}
    >
      <svg width="15" height="18" viewBox="0 0 18 22" fill="none" aria-hidden>
        <path
          d="M2 3 L9 9 L16 3"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path
          d="M2 12 L9 18 L16 12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style jsx>{`
        .sc-cue {
          animation: sc-bounce 1.8s ease-in-out infinite;
        }
        .sc-cue:hover {
          background-color: #823426;
        }
        /* Y only. Tailwind 4 compiles -translate-x-1/2 to the standalone
           translate property, which composes with transform rather than
           replacing it, so an -50% here would be applied twice. */
        @keyframes sc-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-cue {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
}
