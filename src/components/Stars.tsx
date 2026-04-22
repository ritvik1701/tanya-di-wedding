// Ornate 8-pointed gold stars for decorative backgrounds.
// Rays are tapered triangles — 4 long cardinal points + 4 shorter diagonal points.

type StarProps = {
  size?: number;
  className?: string;
  color?: string;
};

export function Star({ size = 48, className = "", color = "#c8942a" }: StarProps) {
  // viewBox 100×100, centre at 50,50
  // long cardinal rays reach to 0 and 100 (length 50)
  // short diagonal rays reach to ~18 and ~82 (length ~22)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Long rays: N, E, S, W */}
      <polygon
        points="50,0 46,50 50,54 54,50"
        fill={color}
      />
      <polygon
        points="100,50 50,46 46,50 50,54"
        fill={color}
      />
      <polygon
        points="50,100 54,50 50,46 46,50"
        fill={color}
      />
      <polygon
        points="0,50 50,54 54,50 50,46"
        fill={color}
      />

      {/* Short diagonal rays: NE, SE, SW, NW */}
      <polygon
        points="82,18 50,48 52,50 50,52"
        fill={color}
        opacity="0.85"
      />
      <polygon
        points="82,82 52,50 50,52 48,50"
        fill={color}
        opacity="0.85"
      />
      <polygon
        points="18,82 48,50 50,48 50,52"
        fill={color}
        opacity="0.85"
      />
      <polygon
        points="18,18 50,48 52,50 50,52"
        fill={color}
        opacity="0.85"
      />

      {/* Centre highlight */}
      <circle cx="50" cy="50" r="2.2" fill={color} />
    </svg>
  );
}

// Preset scatter for the hero background — fixed positions relative to the section
export const HERO_STARS = [
  // Left column
  { top: "6%", left: "5%", size: 46, rotate: 0, opacity: 0.32 },
  { top: "14%", left: "18%", size: 22, rotate: 15, opacity: 0.22 },
  { top: "26%", left: "8%", size: 32, rotate: -10, opacity: 0.28 },
  { top: "38%", left: "16%", size: 26, rotate: 20, opacity: 0.22 },
  { top: "48%", left: "3%", size: 40, rotate: 5, opacity: 0.3 },
  { top: "60%", left: "14%", size: 24, rotate: -15, opacity: 0.22 },
  { top: "72%", left: "6%", size: 36, rotate: 10, opacity: 0.28 },
  { top: "84%", left: "18%", size: 28, rotate: 0, opacity: 0.24 },
  { top: "92%", left: "8%", size: 22, rotate: 25, opacity: 0.2 },

  // Right column
  { top: "9%", left: "92%", size: 34, rotate: 10, opacity: 0.3 },
  { top: "18%", left: "82%", size: 24, rotate: -5, opacity: 0.22 },
  { top: "30%", left: "94%", size: 48, rotate: 15, opacity: 0.32 },
  { top: "42%", left: "86%", size: 26, rotate: -20, opacity: 0.22 },
  { top: "54%", left: "96%", size: 32, rotate: 5, opacity: 0.28 },
  { top: "66%", left: "84%", size: 28, rotate: 10, opacity: 0.24 },
  { top: "78%", left: "93%", size: 40, rotate: -10, opacity: 0.3 },
  { top: "88%", left: "82%", size: 22, rotate: 15, opacity: 0.22 },

  // Top & bottom near-centre accents
  { top: "3%", left: "40%", size: 20, rotate: 0, opacity: 0.2 },
  { top: "4%", left: "62%", size: 18, rotate: 20, opacity: 0.18 },
  { top: "95%", left: "38%", size: 22, rotate: -15, opacity: 0.2 },
  { top: "96%", left: "64%", size: 20, rotate: 5, opacity: 0.18 },
];
