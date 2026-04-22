// Lotus mandala SVG — solid flat fills, no gradients or shadows.
//
// Palette:
//   outer ring:   #9d4130 terracotta
//   checker:      #2a1a15 charcoal
//   disc:         #e8e1dd warm stone
//   outer petals: #9d4130 terracotta, stroked #5a1e14
//   inner petals: #b85a44 light terracotta, stroked #7a2818
//   centre:       #ab1b23 crimson, stroked #5a1e14

type Props = {
  size?: number;
  className?: string;
};

const PETAL_COUNT = 12;

export default function Ornament({ size = 400, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Outer terracotta ring */}
      <circle
        className="om-outer-ring"
        cx="200"
        cy="200"
        r="184"
        fill="none"
        stroke="#9d4130"
        strokeWidth="6"
      />

      {/* 2. Charcoal checkered band via dashed stroke */}
      <circle
        className="om-checker"
        cx="200"
        cy="200"
        r="168"
        fill="none"
        stroke="#2a1a15"
        strokeWidth="14"
        strokeDasharray="13 6"
      />
      {/* stone line between ring and checker for breathing room */}
      <circle
        className="om-checker-bg"
        cx="200"
        cy="200"
        r="176"
        fill="none"
        stroke="#ddd5d1"
        strokeWidth="2"
      />

      {/* 3. Warm stone inner disc */}
      <circle
        className="om-disc"
        cx="200"
        cy="200"
        r="158"
        fill="#e8e1dd"
      />

      {/* 4. Outer lotus petals */}
      <g className="om-outer-petals">
        {Array.from({ length: PETAL_COUNT }).map((_, i) => {
          const angle = (i * 360) / PETAL_COUNT;
          return (
            <g
              key={`outer-${i}`}
              className="om-petal om-petal-outer"
              transform={`rotate(${angle} 200 200)`}
            >
              <path
                d="M200 58
                   C 232 100, 232 150, 200 196
                   C 168 150, 168 100, 200 58 Z"
                fill="#9d4130"
                stroke="#5a1e14"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              {/* central vein */}
              <line
                x1="200"
                y1="72"
                x2="200"
                y2="186"
                stroke="#5a1e14"
                strokeWidth="1"
                opacity="0.6"
              />
            </g>
          );
        })}
      </g>

      {/* 5. Inner lotus petals */}
      <g className="om-inner-petals">
        {Array.from({ length: PETAL_COUNT }).map((_, i) => {
          const angle = (i * 360) / PETAL_COUNT + 15;
          return (
            <g
              key={`inner-${i}`}
              className="om-petal om-petal-inner"
              transform={`rotate(${angle} 200 200)`}
            >
              <path
                d="M200 112
                   C 228 140, 228 176, 200 204
                   C 172 176, 172 140, 200 112 Z"
                fill="#b85a44"
                stroke="#7a2818"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </g>

      {/* 6. Crimson centre */}
      <circle
        className="om-centre-ring"
        cx="200"
        cy="200"
        r="32"
        fill="#ab1b23"
        stroke="#5a1e14"
        strokeWidth="1.4"
      />
      <g className="om-centre-dots">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const x = 200 + Math.cos(angle) * 22;
          const y = 200 + Math.sin(angle) * 22;
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="1.8"
              fill="#e8e1dd"
            />
          );
        })}
      </g>
      <circle
        className="om-centre-core"
        cx="200"
        cy="200"
        r="6"
        fill="#e8e1dd"
      />
    </svg>
  );
}
