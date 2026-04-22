"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { wedding } from "@/config/wedding";

const formattedDate = wedding.date.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          ".hero-eyebrow",
          ".hero-bride-hi",
          ".hero-bride-en",
          ".hero-amp",
          ".hero-groom-hi",
          ".hero-groom-en",
          ".hero-rule",
          ".hero-date",
        ],
        { autoAlpha: 0 }
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-eyebrow", { autoAlpha: 1, y: 0, duration: 1.1 })
        .fromTo(
          ".hero-bride-hi",
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2 },
          "-=0.4"
        )
        .fromTo(
          ".hero-bride-en",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ".hero-amp",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-groom-hi",
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2 },
          "-=0.5"
        )
        .fromTo(
          ".hero-groom-en",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ".hero-rule",
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 1, transformOrigin: "50% 50%" },
          "-=0.3"
        )
        .to(".hero-date", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] flex-col overflow-hidden"
    >
      {/* Zone 1 — top stickers (reserved row, anchored flush to top) */}
      <div className="relative flex h-[15svh] min-h-[110px] items-start justify-center sm:h-[17svh] sm:min-h-[130px]">
        <div
          aria-hidden
          className="pointer-events-none flex items-start gap-1"
        >
          <img
            src="/assets/top-center-sticker.png"
            alt=""
            draggable={false}
            className="block h-auto w-[clamp(30px,8vw,56px)] select-none"
          />
          <img
            src="/assets/top-center-sticker.png"
            alt=""
            draggable={false}
            className="block h-auto w-[clamp(40px,10vw,72px)] select-none"
          />
          <img
            src="/assets/top-center-sticker.png"
            alt=""
            draggable={false}
            className="block h-auto w-[clamp(26px,7vw,50px)] select-none"
          />
        </div>
      </div>

      {/* Zone 2 — main content: eyebrow + window + date */}
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-4 pb-[12svh] sm:gap-6 sm:px-6 sm:pb-[14svh]">
        {/* Eyebrow */}
        <p
          className="hero-eyebrow translate-y-2 text-center text-sm uppercase sm:text-sm md:text-base"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.28em",
            fontWeight: 600,
          }}
        >
          · With the blessings of our families ·
        </p>

        {/* Window flanked by side motifs (always visible), names layered on top */}
        <div className="flex w-full items-center justify-center gap-2 sm:gap-4 md:gap-8">
          <img
            src="/assets/side-motifs-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 select-none"
          />

          <div className="relative flex items-center justify-center">
            <img
              src="/assets/hero-window.png"
              alt=""
              className="hero-window block h-auto max-h-[48svh] w-auto max-w-[clamp(180px,55vw,420px)] select-none"
              draggable={false}
              aria-hidden
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="hero-bride-hi"
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
                className="hero-bride-en mt-2 text-xs uppercase sm:mt-3 sm:text-sm md:text-base"
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
                className="hero-amp my-2 sm:my-3"
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
                className="hero-groom-hi"
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
                className="hero-groom-en mt-2 text-xs uppercase sm:mt-3 sm:text-sm md:text-base"
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

          <img
            src="/assets/side-motifs-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 scale-x-[-1] select-none"
          />
        </div>

        {/* Rule + date */}
        <div className="flex flex-col items-center">
          <div
            className="hero-rule mb-4 h-px w-28 sm:mb-5 sm:w-36"
            style={{ backgroundColor: "#9d4130" }}
          />
          <p
            className="hero-date translate-y-2 text-sm uppercase sm:text-sm md:text-base"
            style={{
              color: "#2a1a15",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.4em",
              fontWeight: 600,
            }}
          >
            {formattedDate}
          </p>
        </div>
      </main>
    </section>
  );
}
