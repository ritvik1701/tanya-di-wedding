// Small decorative SVG icons for each event, drawn with thin terracotta strokes.
// Keeps the aesthetic flat, royal, and traditional.

type Props = {
  id: string;
  size?: number;
  color?: string;
};

export default function EventIcon({
  id,
  size = 28,
  color = "#9d4130",
}: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (id) {
    // Haldi — sun with radiating rays
    case "haldi":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 16 + Math.cos(a) * 8;
            const y1 = 16 + Math.sin(a) * 8;
            const x2 = 16 + Math.cos(a) * 12;
            const y2 = 16 + Math.sin(a) * 12;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      );

    // Mehendi — paisley / leaf
    case "mehendi":
      return (
        <svg {...common}>
          <path d="M 10 24 C 4 18, 8 8, 16 6 C 24 8, 26 16, 20 22 C 16 26, 12 26, 10 24 Z" />
          <path d="M 12 22 C 10 18, 12 12, 16 10" />
          <circle cx="16" cy="10" r="0.9" fill={color} />
          <circle cx="14" cy="14" r="0.7" fill={color} />
          <circle cx="13" cy="18" r="0.6" fill={color} />
        </svg>
      );

    // Sangeet — crescent with a small star (night of music)
    case "sangeet":
      return (
        <svg {...common}>
          <path d="M 22 8 A 10 10 0 1 0 22 24 A 8 8 0 1 1 22 8 Z" />
          <g transform="translate(24 10)">
            <line x1="0" y1="-2.5" x2="0" y2="2.5" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" />
            <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" />
            <line x1="-1.8" y1="1.8" x2="1.8" y2="-1.8" />
          </g>
        </svg>
      );

    // Wedding — sacred flame (diya)
    case "wedding":
      return (
        <svg {...common}>
          {/* diya bowl */}
          <path d="M 6 22 C 6 26, 26 26, 26 22 L 24 20 L 8 20 Z" />
          <line x1="6" y1="22" x2="26" y2="22" />
          {/* flame */}
          <path d="M 16 4 C 20 10, 20 14, 16 18 C 12 14, 12 10, 16 4 Z" />
          <line x1="16" y1="18" x2="16" y2="20" />
        </svg>
      );

    // Reception — 8-pointed star
    case "reception":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 8;
            const x1 = 16 + Math.cos(a) * 4;
            const y1 = 16 + Math.sin(a) * 4;
            const x2 = 16 + Math.cos(a) * 12;
            const y2 = 16 + Math.sin(a) * 12;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
            const x = 16 + Math.cos(a) * 8;
            const y = 16 + Math.sin(a) * 8;
            return <circle key={`d-${i}`} cx={x} cy={y} r="0.8" fill={color} />;
          })}
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="4" fill={color} />
        </svg>
      );
  }
}
