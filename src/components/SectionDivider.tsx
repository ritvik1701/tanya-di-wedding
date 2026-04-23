"use client";

// Horizontal scrolling motif band — sits between major page sections.
// Repeats a small marigold-and-line pattern that drifts sideways forever.

function Motif() {
  // Same 6-petal silhouette as the falling marigolds, in terracotta.
  return (
    <svg
      viewBox="0 0 40 40"
      width={22}
      height={22}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <g fill="#9d4130">
        {Array.from({ length: 6 }).map((_, i) => (
          <circle
            key={i}
            cx="20"
            cy="10"
            r="8"
            transform={`rotate(${i * 60} 20 20)`}
          />
        ))}
      </g>
      <circle cx="20" cy="20" r="3" fill="#f0e4cc" />
    </svg>
  );
}

function Dash() {
  return (
    <span
      aria-hidden
      className="block h-px w-10 shrink-0 sm:w-16"
      style={{ backgroundColor: "#9d4130", opacity: 0.45 }}
    />
  );
}

function Diamond() {
  // Small filled diamond between motifs for rhythm variety
  return (
    <svg
      viewBox="0 0 12 12"
      width={8}
      height={8}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path d="M 6 0 L 12 6 L 6 12 L 0 6 Z" fill="#9d4130" opacity="0.7" />
    </svg>
  );
}

/**
 * One repeating unit of the scrolling strip:
 *   · motif · dash · diamond · dash · motif · dash · diamond · dash ·
 */
function Unit({ prefix }: { prefix: string }) {
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    items.push(<Motif key={`${prefix}-m-${i}`} />);
    items.push(<Dash key={`${prefix}-d1-${i}`} />);
    items.push(<Diamond key={`${prefix}-dm-${i}`} />);
    items.push(<Dash key={`${prefix}-d2-${i}`} />);
  }
  return <>{items}</>;
}

type Props = {
  /** Scroll speed direction; default drifts to the left. */
  direction?: "left" | "right";
  /** Seconds for one full cycle. Higher = slower. */
  speed?: number;
  className?: string;
};

export default function SectionDivider({
  direction = "left",
  speed = 50,
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden py-6 sm:py-8 ${className}`}
      aria-hidden
    >
      {/* Thin rule above and below for composed feel */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ backgroundColor: "#9d4130", opacity: 0.2 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: "#9d4130", opacity: 0.2 }}
      />

      <div
        className={`sd-track flex items-center gap-4 whitespace-nowrap sm:gap-6 ${
          direction === "right" ? "sd-track-reverse" : ""
        }`}
        style={
          {
            ["--sd-speed" as string]: `${speed}s`,
          } as React.CSSProperties
        }
      >
        {/* Duplicate the unit twice for seamless loop (translateX -50%) */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Unit prefix="a" />
        </div>
        <div className="flex items-center gap-4 sm:gap-6" aria-hidden>
          <Unit prefix="b" />
        </div>
      </div>

      <style jsx>{`
        @keyframes sd-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes sd-scroll-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .sd-track {
          animation: sd-scroll var(--sd-speed, 50s) linear infinite;
          width: fit-content;
        }
        .sd-track-reverse {
          animation-name: sd-scroll-reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .sd-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
