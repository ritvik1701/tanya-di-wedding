"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Star } from "./Stars";
import { getLenis } from "./SmoothScroll";

// Deterministic pseudo-random so SSR and client match. 48 petals, each
// with its own burst angle / size / rotation / fall distance — tuned for
// a celebratory marigold shower that crosses the viewport.
const PETAL_COUNT = 48;
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
  angle: number;
  distance: number;
  rotation: number;
  fall: number;
  duration: number;
  delay: number;
  drift: number;
};

const PETAL_DEFS: PetalDef[] = Array.from({ length: PETAL_COUNT }, (_, i) => {
  const r1 = rand(i * 31 + 7);
  const r2 = rand(i * 17 + 53);
  const r3 = rand(i * 29 + 11);
  const r4 = rand(i * 47 + 19);
  return {
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    size: 14 + r1 * 16,
    // Even spread around the circle with a little jitter so the burst
    // doesn't look like a clock face.
    angle: (i / PETAL_COUNT) * Math.PI * 2 + (r2 - 0.5) * 0.5,
    distance: 160 + r3 * 220,
    rotation: (r4 - 0.5) * 1080,
    fall: 160 + r1 * 320,
    duration: 1.95 + r2 * 1.2,
    delay: r3 * 0.25,
    drift: (r4 - 0.5) * 120,
  };
});

/**
 * Opening sequence (plays on every page load):
 *   1. Letter flies in from above, rotated (like tossed onto a table)
 *   2. Brief hold
 *   3. Seal pulses + cracks away
 *   4. Flap lifts open
 *   5. Card peeks up out of the envelope (blank window side showing)
 *   6. Envelope (back, flap, shadow) drops off the bottom of the screen
 *   7. Card grows into the real hero-window position (pixel-accurate)
 *   8. Card flips in 3D to reveal the couple's names on its back face
 *   9. Marigold petals burst from the card and drift down
 *  10. Overlay fades, dispatching `th:hero-reveal` so Hero plays its
 *      entrance animation (lamps drop, motifs slide in — names are
 *      already visible from the flipped card / hero mount state).
 */
export default function IntroLetter() {
  const [hidden, setHidden] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const envelopeBackRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const flapShadowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hidden) return;

    // Lock page scroll for the duration of the intro. Both html + body
    // overflow pin native scrolling; getLenis()?.stop() quiets the
    // smooth-scroll wrapper once it initialises (it mounts in a
    // regular useEffect, i.e. after this useLayoutEffect).
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const stopLenis = () => getLenis()?.stop();
    stopLenis();
    // Lenis initialises in a useEffect — stop it again on the next
    // tick once it's actually up.
    const lenisTimer = window.setTimeout(stopLenis, 0);

    const ctx = gsap.context(() => {
      // Corner stars + eyebrow fade-in
      gsap.from(".il-reveal", {
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.05,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          window.dispatchEvent(new Event("th:hero-reveal"));
          setHidden(true);
        },
      });

      // Card centring via GSAP (percentages separate from later pixel x/y)
      gsap.set(cardRef.current, { xPercent: -50, yPercent: -50 });

      // 1. Entry — envelope flies in from above with rotation + scale
      gsap.set(envelopeRef.current, {
        y: "-120vh",
        rotate: -22,
        scale: 0.78,
        autoAlpha: 0,
      });
      tl.to(envelopeRef.current, {
        y: 0,
        rotate: 4,
        scale: 1,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
      });

      // 2. Settle
      tl.to(envelopeRef.current, {
        rotate: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });

      // 3. Short hold
      tl.to({}, { duration: 0.45 });

      // 4. Seal pulse + crack
      tl.to(sealRef.current, {
        scale: 1.12,
        duration: 0.14,
        ease: "power2.out",
      });
      tl.to(sealRef.current, {
        scale: 0.3,
        autoAlpha: 0,
        rotate: -30,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });

      // 5. Flap opens (two halves, z-index swap at edge-on)
      tl.to(
        [flapRef.current, flapShadowRef.current],
        { rotateX: -90, duration: 0.35, ease: "power2.in" },
        "-=0.1"
      );
      tl.set([flapRef.current, flapShadowRef.current], { zIndex: 0 });
      tl.to([flapRef.current, flapShadowRef.current], {
        rotateX: -170,
        duration: 0.35,
        ease: "power2.out",
      });

      // 6. Window peeks out
      tl.to(
        cardRef.current,
        {
          y: () => -window.innerHeight * 0.05,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.3"
      );
      tl.to({}, { duration: 0.15 });

      // 7. Envelope drops off the bottom
      tl.to(
        [envelopeBackRef.current, flapRef.current, flapShadowRef.current],
        {
          y: "140vh",
          rotate: 8,
          duration: 0.6,
          ease: "power2.in",
        }
      );

      // 8. Snapshot the card's current dimensions and the target hero-
      //    window rect. We animate width/height (not scale!) so the names
      //    overlay inside the card keeps its viewport-based font sizes
      //    intact — at the end of the handoff the card is pixel-matched
      //    to the Hero's window and the names sit at the same size the
      //    Hero renders them.
      let targetX = 0;
      let targetY = 0;
      let targetW = 0;
      let targetH = 0;
      tl.call(
        () => {
          const cardEl = cardRef.current;
          const heroEl = document.querySelector(
            ".hero-window"
          ) as HTMLElement | null;
          if (!cardEl || !heroEl) return;

          const cardRect = cardEl.getBoundingClientRect();
          const heroRect = heroEl.getBoundingClientRect();
          if (
            cardRect.height === 0 ||
            cardRect.width === 0 ||
            heroRect.height === 0 ||
            heroRect.width === 0
          ) {
            return;
          }

          const currentX = Number(gsap.getProperty(cardEl, "x")) || 0;
          const currentY = Number(gsap.getProperty(cardEl, "y")) || 0;

          const cardCx = cardRect.left + cardRect.width / 2;
          const cardCy = cardRect.top + cardRect.height / 2;
          const heroCx = heroRect.left + heroRect.width / 2;
          const heroCy = heroRect.top + heroRect.height / 2;

          targetX = currentX + (heroCx - cardCx);
          targetY = currentY + (heroCy - cardCy);
          targetW = heroRect.width;
          targetH = heroRect.height;

          // Freeze the current dimensions as explicit inline px so GSAP
          // has a concrete starting value (instead of CSS height:100% /
          // aspect-ratio auto). Also drop maxWidth so it can't clip the
          // card once it grows past 86% of the envelope.
          gsap.set(cardEl, {
            width: cardRect.width,
            height: cardRect.height,
            maxWidth: "none",
          });
        },
        [],
        "-=0.35"
      );

      tl.to(cardRef.current, {
        x: () => targetX,
        y: () => targetY,
        width: () => targetW,
        height: () => targetH,
        duration: 0.85,
        ease: "power2.inOut",
      });

      // 9. Card flips in 3D — back face reveals the couple's names. The
      //    card is already at Hero-window size so the names render at
      //    their final viewport-based sizes, matching the Hero exactly.
      tl.to(cardRef.current, {
        rotateY: 180,
        duration: 0.9,
        ease: "power2.inOut",
      });

      // 9b. Marigold petals burst from the card as the flip lands. Each
      //     petal falls until it's below the viewport — no fade-out, so
      //     they stay fully visible right up to exit.
      const launchPetals = () => {
        const cardEl = cardRef.current;
        const petalsEl = petalsRef.current;
        if (!cardEl || !petalsEl) return;

        const cardRect = cardEl.getBoundingClientRect();
        const cx = cardRect.left + cardRect.width / 2;
        const cy = cardRect.top + cardRect.height / 2;
        const vh = window.innerHeight;

        const nodes = petalsEl.querySelectorAll<HTMLElement>(".il-petal");
        nodes.forEach((petal, i) => {
          const def = PETAL_DEFS[i];
          if (!def) return;

          const burstX = cx + Math.cos(def.angle) * def.distance;
          const burstY = cy + Math.sin(def.angle) * def.distance;
          // Land just past the bottom edge so every petal exits the
          // viewport regardless of its burst direction.
          const exitY = vh + 80;
          // Keep a roughly constant terminal speed so petals that burst
          // upward still reach the exit line naturally.
          const fallPx = Math.max(1, exitY - burstY);
          const fallDuration = Math.max(1.2, fallPx / 320);

          gsap.killTweensOf(petal);
          gsap.set(petal, {
            xPercent: -50,
            yPercent: -50,
            x: cx,
            y: cy,
            rotation: 0,
            scale: 0.3,
            autoAlpha: 0,
          });

          const ptl = gsap.timeline({ delay: def.delay });
          ptl
            .to(
              petal,
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.33,
                ease: "back.out(1.6)",
              },
              0
            )
            .to(
              petal,
              {
                x: burstX,
                y: burstY,
                rotation: def.rotation * 0.4,
                duration: 0.675,
                ease: "power2.out",
              },
              0
            )
            .to(
              petal,
              {
                x: burstX + def.drift,
                y: exitY,
                rotation: def.rotation,
                duration: fallDuration,
                ease: "power1.in",
              },
              0.675
            );
        });
      };

      // Trigger as the flip is nearing completion so petals burst at the
      // reveal beat, not after it.
      tl.call(launchPetals, [], "-=0.25");

      // 10. Fade the background + corner stars + eyebrow to reveal the
      //     Hero, but leave the petals layer fully opaque so they keep
      //     tumbling over the Hero until they exit the screen.
      tl.to(
        [".il-reveal", bgRef.current],
        { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
        "+=0.3"
      );

      // 11. Hold while the last petals fall past the viewport edge. The
      //     petal sub-timelines peak around 3.4s from launch — this hold
      //     sits on top of the bg fade to cover that full window.
      tl.to({}, { duration: 3.0 });
    }, rootRef);

    return () => {
      window.clearTimeout(lenisTimer);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      getLenis()?.start();
      ctx.revert();
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-5"
    >
      {/* Fadeable background — separate from the overlay root so the
          petals layer can stay fully opaque over the Hero after the bg
          fades away. */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ backgroundColor: "#f0e4cc" }}
        aria-hidden
      />

      {/* Decorative corner stars */}
      <div className="il-reveal pointer-events-none absolute left-6 top-6 opacity-80 sm:left-10 sm:top-10">
        <Star size={22} color="#9d4130" />
      </div>
      <div className="il-reveal pointer-events-none absolute right-6 top-6 opacity-80 sm:right-10 sm:top-10">
        <Star size={22} color="#9d4130" />
      </div>
      <div className="il-reveal pointer-events-none absolute bottom-6 left-6 opacity-80 sm:bottom-10 sm:left-10">
        <Star size={22} color="#9d4130" />
      </div>
      <div className="il-reveal pointer-events-none absolute bottom-6 right-6 opacity-80 sm:bottom-10 sm:right-10">
        <Star size={22} color="#9d4130" />
      </div>

      {/* Eyebrow */}
      <p
        className="il-reveal absolute top-[10%] text-center text-xs uppercase sm:text-sm md:text-base"
        style={{
          fontFamily: "var(--font-display)",
          color: "#5f6f4d",
          letterSpacing: "0.28em",
          fontWeight: 600,
        }}
      >
        · You are invited ·
      </p>

      {/* Envelope */}
      <div
        ref={envelopeRef}
        className="relative"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative"
          style={{
            width: "min(82vw, 380px)",
            aspectRatio: "3 / 2",
          }}
        >
          {/* Flip container — front shows the blank hero-window, back
              reveals the couple's names. Aspect-ratio is pinned to the
              source image so the bounding box is stable across all
              viewports (required for the pixel-accurate hand-off to
              the Hero window). */}
          <div
            ref={cardRef}
            className="absolute left-1/2 top-1/2 select-none"
            aria-hidden
            style={{
              height: "100%",
              aspectRatio: "634 / 1001",
              maxWidth: "86%",
              transformStyle: "preserve-3d",
              zIndex: 1,
            }}
          >
            {/* Front face — blank hero-window card */}
            <img
              src="/assets/hero-window.png"
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 block h-full w-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

            {/* Back face — same window, with couple's names pre-rendered.
                Rotated 180 so it sits behind the front; when the flip
                container rotates to 180, this face ends up facing the
                viewer. Sizes mirror the Hero's name overlay so the final
                fade-out cross-fades into the Hero's names cleanly. */}
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <img
                src="/assets/hero-window.png"
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 block h-full w-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  lang="hi"
                  style={{
                    fontFamily: "var(--font-hindi)",
                    color: "#9d4130",
                    fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  तान्या
                </span>
                <span
                  className="mt-2 text-xs uppercase sm:mt-3 sm:text-sm md:text-base"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#5f6f4d",
                    letterSpacing: "0.5em",
                    fontWeight: 600,
                  }}
                >
                  Tanya
                </span>
                <span
                  className="my-2 sm:my-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#ab1b23",
                    fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)",
                    lineHeight: 1,
                    fontWeight: 400,
                  }}
                >
                  &amp;
                </span>
                <span
                  lang="hi"
                  style={{
                    fontFamily: "var(--font-hindi)",
                    color: "#9d4130",
                    fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  हेमाभ
                </span>
                <span
                  className="mt-2 text-xs uppercase sm:mt-3 sm:text-sm md:text-base"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#5f6f4d",
                    letterSpacing: "0.5em",
                    fontWeight: 600,
                  }}
                >
                  Hemabh
                </span>
              </div>
            </div>
          </div>
          <div
            ref={envelopeBackRef}
            className="absolute inset-0"
            style={{
              backgroundColor: "#ebdbb4",
              border: "2px solid #9d4130",
              boxShadow: "inset 0 0 0 4px #ebdbb4, inset 0 0 0 5px #9d4130",
              zIndex: 2,
            }}
          />
          <div
            ref={flapShadowRef}
            className="absolute inset-x-0 top-0"
            style={{
              height: "50%",
              backgroundColor: "#c9b88f",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 3,
            }}
          />
          <div
            ref={flapRef}
            className="absolute inset-x-0 top-0"
            style={{
              height: "50%",
              backgroundColor: "#e0cfa4",
              border: "2px solid #9d4130",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 4,
            }}
          />
          <img
            ref={sealRef}
            src="/assets/stamp-seal-sticker.png"
            alt=""
            draggable={false}
            aria-hidden
            className="pointer-events-none absolute left-1/2 select-none"
            style={{
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "clamp(84px, 18vw, 140px)",
              height: "auto",
              zIndex: 5,
            }}
          />
        </div>
      </div>

      {/* Marigold petal burst — absolutely positioned within the overlay
          so GSAP's viewport-level x/y translates land on the card. Each
          petal starts invisible; launchPetals() fires at the flip beat. */}
      <div
        ref={petalsRef}
        className="pointer-events-none absolute inset-0 overflow-visible"
        aria-hidden
      >
        {PETAL_DEFS.map((p, i) => (
          <span
            key={i}
            className="il-petal absolute left-0 top-0 block select-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size * 1.4}px`,
              color: p.color,
              opacity: 0,
            }}
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
      </div>
    </div>
  );
}
