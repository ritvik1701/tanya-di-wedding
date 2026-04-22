// Fixed gold-star backdrop — sits behind all content, stays put as the page scrolls.
// Stars are distributed across the full viewport and remain static.

import { Star, HERO_STARS } from "./Stars";

export default function StarsBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {HERO_STARS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
            opacity: s.opacity,
          }}
        >
          <Star size={s.size} color="#c8942a" />
        </div>
      ))}
    </div>
  );
}
