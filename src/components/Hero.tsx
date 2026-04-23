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
      // Hide everything that will be animated. The window stays visible
      // throughout (the intro letter hands the flipped card off to it)
      // and the couple's names stay visible too — the IntroLetter's
      // flipped back-face has already revealed them, and keeping them
      // mounted means the overlay fade cross-fades them cleanly.
      gsap.set(
        [
          ".hero-lamp",
          ".hero-motif-left",
          ".hero-motif-right",
          ".hero-eyebrow",
          ".hero-rule",
          ".hero-date",
        ],
        { autoAlpha: 0 },
      );

      // Pre-positions for entrance animations
      gsap.set(".hero-lamp", { y: -260 });
      gsap.set(".hero-motif-left", { x: -180 });
      gsap.set(".hero-motif-right", { x: 180 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      // 1. Lamps drop from above, staggered
      tl.to(
        ".hero-lamp",
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
        },
        0,
      )

        // 2. Side motifs slide in from the edges
        .to(
          ".hero-motif-left",
          { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
          0.2,
        )
        .to(
          ".hero-motif-right",
          { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
          0.2,
        )

        // 3. Supporting text — eyebrow, rule, date
        .to(".hero-eyebrow", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
        .fromTo(
          ".hero-rule",
          { scaleX: 0, autoAlpha: 0 },
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.7,
            transformOrigin: "50% 50%",
          },
          0.5,
        )
        .to(".hero-date", { autoAlpha: 1, y: 0, duration: 0.6 }, 0.65);

      // Wait for the intro letter to finish before playing. Fallback: if no
      // event arrives within 4s (e.g. in dev when the intro was dismissed),
      // play anyway so the hero isn't stuck invisible.
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        tl.play();
      };
      window.addEventListener("th:hero-reveal", play, { once: true });
      const fallback = window.setTimeout(play, 4000);

      return () => {
        window.removeEventListener("th:hero-reveal", play);
        window.clearTimeout(fallback);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] flex-col overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(26, 12, 2, 0.55), rgba(26, 12, 2, 0.65)), url(/assets/backgrounds/hero.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Lamps — absolutely positioned at the top of the section with a
          high z-index, so their full length (including tassels) can hang
          freely into the hero space without being covered by <main>. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-20 flex -translate-x-1/2 items-start gap-1"
      >
        <img
          src="/assets/top-center-sticker.png"
          alt=""
          draggable={false}
          className="hero-lamp block h-auto w-[clamp(44px,7vw,62px)] select-none"
        />
        <img
          src="/assets/top-center-sticker.png"
          alt=""
          draggable={false}
          className="hero-lamp block h-auto w-[clamp(58px,9vw,80px)] select-none"
        />
        <img
          src="/assets/top-center-sticker.png"
          alt=""
          draggable={false}
          className="hero-lamp block h-auto w-[clamp(40px,6vw,54px)] select-none"
        />
      </div>

      {/* Top spacer — reserves vertical room so content doesn't start
          flush against the top (the lamps occupy this region). */}
      <div
        className="flex-none"
        style={{ height: "clamp(110px, 15svh, 130px)" }}
        aria-hidden
      />

      {/* Zone 2 — main content: eyebrow + window + date */}
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-4 pb-[12svh] sm:gap-6 sm:px-6 sm:pb-[14svh]">
        {/* Eyebrow */}
        <p
          className="hero-eyebrow translate-y-2 text-center text-sm uppercase sm:text-sm md:text-base"
          style={{
            fontFamily: "var(--font-display)",
            color: "#f0d28a",
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
            className="hero-motif-left pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 select-none"
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
            className="hero-motif-right pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 scale-x-[-1] select-none"
          />
        </div>

        {/* Rule + date */}
        <div className="flex flex-col items-center">
          <div
            className="hero-rule mb-4 h-px w-28 sm:mb-5 sm:w-36"
            style={{ backgroundColor: "#c9a35d" }}
          />
          <p
            className="hero-date translate-y-2 text-sm uppercase sm:text-sm md:text-base"
            style={{
              color: "#f0d28a",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.4em",
              fontWeight: 600,
            }}
          >
            {formattedDate}
          </p>
        </div>
      </main>

      {/* Tiny scroll indicator — double chevron, gently bouncing */}
      <div
        className="hero-scroll-cue pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 sm:bottom-7"
        aria-hidden
      >
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2 L9 8 L16 2"
            stroke="#f0d28a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            d="M2 12 L9 18 L16 12"
            stroke="#f0d28a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style jsx>{`
        .hero-scroll-cue {
          animation: hero-scroll-bounce 1.8s ease-in-out infinite;
        }
        @keyframes hero-scroll-bounce {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, 6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scroll-cue {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
