"use client";

// Ambient marigold petals for the Timeline's bottom blurred band — a
// calmer, continuous cousin of IntroLetter's petal burst. That one is a
// one-time reveal moment; replaying the same burst on every card as the
// reader scrolls would turn it into wallpaper. These drift slowly and
// loop forever instead, reusing the same shape and palette for
// continuity. Paired with Fireworks, which takes the top band.
//
// Pure CSS animation (transform only, no filter/box-shadow), not GSAP:
// up to five of these can be mounted at once across the Timeline deck,
// and a per-frame JS ticker — or a per-element blur filter, which forces
// its own raster+layer per petal — would be needless cost multiplied by
// 35 elements for something this small.
//
// The layer only spans the bottom ~58% of the section rather than the
// whole thing — most of that is hidden behind the card itself, so what
// actually reads is petals emerging from behind it and falling through
// the exposed band beneath, never appearing in the top band that
// Fireworks owns.

const PETAL_COLORS = [
  "#f2a83a", // marigold orange
  "#fbcb1a", // warm yellow
  "#e0820c", // deep orange
  "#c74a2b", // red-orange
  "#ab1b23", // crimson
  "#e6b22b", // goldenrod
];

const rand = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;

type PetalDef = {
  color: string;
  size: number;
  leftPct: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
};

const PETAL_COUNT = 7;

// One shared deterministic set — varied per card via `seedOffset` so the
// five sections don't all show the identical arrangement, without
// touching Math.random() (which would mismatch between server and
// client render, same class of bug as the Countdown hydration crash).
function petalDefs(seedOffset: number): PetalDef[] {
  return Array.from({ length: PETAL_COUNT }, (_, i) => {
    const n = i + seedOffset * PETAL_COUNT;
    const r1 = rand(n * 31 + 7);
    const r2 = rand(n * 17 + 53);
    const r3 = rand(n * 29 + 11);
    const r4 = rand(n * 47 + 19);
    return {
      color: PETAL_COLORS[(i + seedOffset) % PETAL_COLORS.length],
      size: 10 + r1 * 10,
      leftPct: 4 + r2 * 92,
      duration: 10 + r3 * 6,
      // Negative delay starts each petal already mid-fall, so the layer
      // never opens with every petal synchronised at the top.
      delay: -(r1 * 10 + r4 * 2),
      drift: (r4 - 0.5) * 60,
      rotation: 180 + r2 * 360,
    };
  });
}

export default function DriftingPetals({ seedOffset = 0 }: { seedOffset?: number }) {
  const defs = petalDefs(seedOffset);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height: "58%" }}
      aria-hidden
    >
      {defs.map((p, i) => (
        <span
          key={i}
          className="drift-petal absolute top-0 block select-none"
          style={
            {
              left: `${p.leftPct}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.4}px`,
              color: p.color,
              opacity: 0.55,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift-x": `${p.drift}px`,
              "--drift-rot": `${p.rotation}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 20 28"
            fill="currentColor"
            className="block h-full w-full"
            aria-hidden
          >
            <path d="M 10 0 C 4 8 3 20 10 28 C 17 20 16 8 10 0 Z" />
          </svg>
        </span>
      ))}

      <style jsx>{`
        .drift-petal {
          animation-name: petal-drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes petal-drift {
          0% {
            transform: translate(0, -10%) rotate(0deg);
          }
          100% {
            /* Container is 58% of the section's height; 70svh clears it
               with room to spare so the petal fully exits before looping. */
            transform: translate(var(--drift-x), 70svh) rotate(var(--drift-rot));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-petal {
            animation: none;
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
