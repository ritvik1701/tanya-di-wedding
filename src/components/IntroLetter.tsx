"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Star } from "./Stars";

/**
 * Opening animation: closed envelope with wax seal → user taps →
 * seal cracks, flap lifts, card slides up out of envelope, overlay fades
 * to reveal the hero beneath. Fixed full-viewport, z-[100].
 */
export default function IntroLetter() {
  const [hidden, setHidden] = useState(false);
  const [opening, setOpening] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const flapShadowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Entrance animation for the closed envelope
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".il-reveal", {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.to(".il-breathe", {
        scale: 1.03,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const open = () => {
    if (opening) return;
    setOpening(true);

    const tl = gsap.timeline({
      onComplete: () => setHidden(true),
    });

    // 1. Hide the CTA and hint
    tl.to([ctaRef.current, hintRef.current], {
      autoAlpha: 0,
      y: 14,
      duration: 0.35,
      ease: "power2.out",
    });

    // 2. Seal pulses then breaks apart
    tl.to(sealRef.current, {
      scale: 1.12,
      duration: 0.2,
      ease: "power2.out",
    });
    tl.to(sealRef.current, {
      scale: 0.25,
      autoAlpha: 0,
      rotate: -25,
      y: 14,
      duration: 0.45,
      ease: "power2.in",
    });

    // 3. Flap opens (rotates backward around its top edge)
    tl.to(
      [flapRef.current, flapShadowRef.current],
      {
        rotateX: -170,
        duration: 1.1,
        ease: "power3.inOut",
      },
      "-=0.2"
    );

    // 4. Card rises out of the envelope
    tl.to(
      cardRef.current,
      {
        y: "-36%",
        scale: 1.04,
        duration: 1.1,
        ease: "power2.out",
      },
      "-=0.75"
    );

    // 5. Whole overlay fades, scale up a touch for "zoom through" feel
    tl.to(
      rootRef.current,
      {
        autoAlpha: 0,
        scale: 1.06,
        duration: 0.7,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      },
      "+=0.25"
    );
  };

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: "#f0e4cc" }}
    >
      {/* Decorative corners */}
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
        className="il-reveal absolute top-[12%] text-center text-xs uppercase sm:text-sm md:text-base"
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
        className="il-reveal il-breathe relative"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative"
          style={{
            width: "min(82vw, 380px)",
            aspectRatio: "3 / 2",
          }}
        >
          {/* Back of envelope (revealed when flap opens) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "#ebdbb4",
              border: "2px solid #9d4130",
              boxShadow: "inset 0 0 0 4px #ebdbb4, inset 0 0 0 5px #9d4130",
            }}
          />

          {/* Card inside — slides out when flap opens */}
          <div
            ref={cardRef}
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              inset: "10px",
              backgroundColor: "#faf0d8",
              border: "1px solid #9d4130",
              boxShadow: "inset 0 0 0 3px #faf0d8, inset 0 0 0 4px #9d4130",
              zIndex: 1,
            }}
          >
            <p
              className="text-[0.6rem] uppercase sm:text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "#5f6f4d",
                letterSpacing: "0.3em",
                fontWeight: 600,
              }}
            >
              · With the blessings of our families ·
            </p>
            <span
              lang="hi"
              className="mt-3 block sm:mt-4"
              style={{
                fontFamily: "var(--font-hindi)",
                color: "#9d4130",
                fontSize: "clamp(1.6rem, 5.2vw, 2.8rem)",
                lineHeight: 1.1,
              }}
            >
              तान्या &amp; हेमाभ
            </span>
            <div
              className="mt-3 h-px w-16 sm:mt-4 sm:w-20"
              style={{ backgroundColor: "#9d4130", opacity: 0.6 }}
            />
            <p
              className="mt-3 text-[0.6rem] uppercase sm:mt-4 sm:text-xs"
              style={{
                fontFamily: "var(--font-display)",
                color: "#2a1a15",
                letterSpacing: "0.35em",
                fontWeight: 600,
              }}
            >
              25 August 2026
            </p>
          </div>

          {/* Flap shadow — darker triangle behind the flap for depth */}
          <div
            ref={flapShadowRef}
            className="absolute inset-x-0 top-0"
            style={{
              height: "50%",
              backgroundColor: "#c9b88f",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 2,
            }}
          />

          {/* Flap — triangle that folds over the top half */}
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
              zIndex: 3,
            }}
          />

          {/* Wax seal — sits on the tip of the closed flap */}
          <img
            ref={sealRef}
            src="/assets/stamp-seal.png"
            alt=""
            draggable={false}
            aria-hidden
            className="pointer-events-none absolute left-1/2 select-none"
            style={{
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "clamp(52px, 12vw, 84px)",
              height: "auto",
              zIndex: 4,
            }}
          />
        </div>
      </div>

      {/* Tap to Open CTA */}
      <button
        ref={ctaRef}
        onClick={open}
        className="il-reveal absolute bottom-[14%] uppercase transition-colors hover:bg-[#9d4130] hover:text-[#f0e4cc]"
        style={{
          fontFamily: "var(--font-display)",
          color: "#9d4130",
          letterSpacing: "0.35em",
          fontWeight: 600,
          fontSize: "0.8rem",
          border: "1.5px solid #9d4130",
          padding: "0.85rem 2.25rem",
          backgroundColor: "transparent",
          cursor: "pointer",
        }}
      >
        Open the Invitation
      </button>

      {/* Tiny hint below */}
      <div
        ref={hintRef}
        className="il-reveal absolute bottom-[9%] flex items-center gap-3 opacity-70"
      >
        <span
          aria-hidden
          className="h-px w-6"
          style={{ backgroundColor: "#9d4130", opacity: 0.4 }}
        />
        <span
          className="text-[0.55rem] uppercase sm:text-[0.65rem]"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.3em",
            fontWeight: 600,
          }}
        >
          Tap to begin
        </span>
        <span
          aria-hidden
          className="h-px w-6"
          style={{ backgroundColor: "#9d4130", opacity: 0.4 }}
        />
      </div>
    </div>
  );
}
