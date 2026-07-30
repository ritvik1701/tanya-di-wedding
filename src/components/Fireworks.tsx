"use client";

// Occasional multicolour firework bursts for the Timeline's top blurred
// band — pairs with DriftingPetals below. Several independent emitters
// per card, each with its own position, spark pattern, size and cycle
// length, so bursts appear in different places with different colours
// and counts, and — since the cycles run at different periods — several
// can overlap at once rather than always firing in the same spot solo.
//
// Pure CSS (custom-property-driven transforms), no per-frame JS ticker:
// up to five cards' worth of these can be mounted at once across the
// deck, so a GSAP-style ticker per spark would be needless main-thread
// cost for something this small.

const SPARK_COLORS = [
  "#f2a83a", // marigold orange
  "#fbcb1a", // warm yellow
  "#ec4899", // pink
  "#f472b6", // rose
  "#e6b22b", // goldenrod
  "#fff4e0", // warm white
];

const rand = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;

type SparkDef = { color: string; dx: number; dy: number; size: number };
type EmitterDef = {
  leftPct: number;
  topPct: number;
  duration: number;
  delay: number;
  sparks: SparkDef[];
};

// All five Timeline cards stay mounted simultaneously (sticky stacking,
// not scroll-unmount), so this count is really "× 5" running at once —
// content-visibility on the section now skips the offscreen four, but
// keep the per-card count modest regardless.
const EMITTER_COUNT = 3;

function sparkDefs(seed: number, count: number, spread: number): SparkDef[] {
  // Each emitter draws its own random rotation and colour-cycle offset,
  // so two emitters with the same spark count still look different.
  const rotation = rand(seed * 41 + 5) * Math.PI * 2;
  const colorOffset = Math.floor(rand(seed * 61 + 9) * SPARK_COLORS.length);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rotation + rand(seed * 13 + i) * 0.35;
    const r1 = rand(seed * 31 + i * 7 + 3);
    const distance = spread * (0.55 + r1 * 0.45);
    return {
      color: SPARK_COLORS[(i + colorOffset) % SPARK_COLORS.length],
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      // A touch bigger than before to read as a spark on its own —
      // box-shadow gave the same effect cheaply for one spark, but its
      // per-element raster + layer cost adds up across a couple hundred.
      size: 3.5 + r1 * 3.5,
    };
  });
}

function emitterDefs(seedOffset: number): EmitterDef[] {
  return Array.from({ length: EMITTER_COUNT }, (_, e) => {
    const seed = seedOffset * 1000 + e * 97;
    const r1 = rand(seed + 1);
    const r2 = rand(seed + 2);
    const r3 = rand(seed + 3);
    const r4 = rand(seed + 4);
    const r5 = rand(seed + 5);
    const count = 5 + Math.floor(r4 * 4); // 5-8 sparks
    const spread = 22 + r5 * 34; // small pops to wide blooms
    const duration = 1.8 + r3 * 2.0; // 1.8s-3.8s — periods differ enough
    // that emitters drift in and out of phase rather than always firing
    // in lockstep, which is what actually produces overlapping bursts.
    return {
      leftPct: 6 + r1 * 88,
      topPct: 3 + r2 * 15,
      duration,
      // Spread starting phases across the full cycle so the layer never
      // opens with every emitter poised at the same beat.
      delay: -(rand(seed + 6) * duration),
      sparks: sparkDefs(seed + 11, count, spread),
    };
  });
}

export default function Fireworks({ seedOffset = 0 }: { seedOffset?: number }) {
  const emitters = emitterDefs(seedOffset);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {emitters.map((em, e) => (
        <div
          key={e}
          className="firework-burst absolute"
          style={{
            left: `${em.leftPct}%`,
            top: `${em.topPct}%`,
          }}
        >
          {em.sparks.map((s, i) => (
            <span
              key={i}
              className="firework-spark absolute rounded-full"
              style={
                {
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  backgroundColor: s.color,
                  animationDuration: `${em.duration}s`,
                  animationDelay: `${em.delay}s`,
                  "--spark-x": `${s.dx}px`,
                  "--spark-y": `${s.dy}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        .firework-spark {
          left: 0;
          top: 0;
          animation-name: firework-spark;
          animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1);
          animation-iteration-count: infinite;
        }
        @keyframes firework-spark {
          0%,
          6% {
            transform: translate(0, 0) scale(0.2);
            opacity: 0;
          }
          16% {
            opacity: 1;
          }
          46% {
            transform: translate(var(--spark-x), var(--spark-y)) scale(1);
            opacity: 0.9;
          }
          68%,
          100% {
            transform: translate(var(--spark-x), var(--spark-y)) scale(1);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .firework-spark {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
