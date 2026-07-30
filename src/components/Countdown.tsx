"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { wedding } from "@/config/wedding";

type TimeParts = { days: number; hours: number; minutes: number; seconds: number };

function diffParts(target: Date, now: Date): TimeParts {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

// A single digit column — ticks downward when the value changes.
function TickDigit({ char }: { char: string }) {
  return (
    <span
      className="relative inline-block overflow-hidden text-center tabular-nums"
      style={{
        width: "0.62em",
        height: "1em",
        lineHeight: 1,
        verticalAlign: "top",
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TickNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const padded = String(value).padStart(pad, "0");
  return (
    <span className="inline-flex tabular-nums">
      {padded.split("").map((char, i) => (
        <TickDigit key={i} char={char} />
      ))}
    </span>
  );
}

const WEEKDAY = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long" });
const MONTH_YEAR = (d: Date) =>
  d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
const DAY = (d: Date) => d.getDate();

export default function Countdown() {
  const root = useRef<HTMLDivElement>(null);
  // Starts null rather than computing from `new Date()` in the lazy
  // initializer: that ran on the server at one instant and on the client
  // at hydration a moment later, and whenever those landed in different
  // seconds the digit text mismatched and crashed the tree. Null renders
  // identically on both sides; the real value lands a tick later.
  const [t, setT] = useState<TimeParts | null>(null);

  useEffect(() => {
    const tick = () => setT(diffParts(wedding.date, new Date()));
    // Deferred to a microtask rather than called synchronously in the
    // effect body (react-hooks/set-state-in-effect) — still resolves
    // before the next paint, so there's no visible placeholder flash.
    queueMicrotask(tick);
    const i = window.setInterval(tick, 1000);
    return () => window.clearInterval(i);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cd-reveal", {
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const parts = t ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const units: { label: string; value: number; pad?: number }[] = [
    { label: "Days", value: parts.days, pad: 2 },
    { label: "Hours", value: parts.hours, pad: 2 },
    { label: "Min", value: parts.minutes, pad: 2 },
    { label: "Sec", value: parts.seconds, pad: 2 },
  ];

  return (
    <section
      ref={root}
      className="relative flex items-center justify-center px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 md:pb-24 md:pt-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Eyebrow */}
        <p
          className="cd-reveal text-center text-sm uppercase sm:text-base md:text-lg"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.28em",
            fontWeight: 600,
          }}
        >
          · Save the date ·
        </p>

        {/* Event name */}
        <h2
          className="cd-reveal mt-3 sm:mt-4"
          lang="hi"
          style={{
            fontFamily: "var(--font-hindi)",
            color: "#9d4130",
            fontSize: "clamp(1.9rem, 6vw, 3.4rem)",
            lineHeight: 1.1,
          }}
        >
          शुभ विवाह
        </h2>

        {/* Big date — centerpiece, flanked by gena phool (no frame here) */}
        <div className="cd-reveal mt-6 flex w-full items-center justify-center gap-3 sm:mt-8 sm:gap-6 md:gap-10">
          <img
            src="/assets/gena-phool-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(40px,9vw,130px)] shrink-0 select-none"
          />

          <div className="flex min-w-0 flex-col items-center">
            <span
              className="text-xs uppercase sm:text-sm md:text-base"
              style={{
                fontFamily: "var(--font-display)",
                color: "#5f6f4d",
                letterSpacing: "0.4em",
                fontWeight: 600,
              }}
            >
              {WEEKDAY(wedding.date)}
            </span>
            <span
              className="mt-3 block leading-none sm:mt-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "#9d4130",
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              {DAY(wedding.date)}
            </span>
            <span
              className="mt-3 uppercase sm:mt-4 text-sm sm:text-base md:text-xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "#9d4130",
                letterSpacing: "0.3em",
                fontWeight: 600,
              }}
            >
              {MONTH_YEAR(wedding.date)}
            </span>
          </div>

          <img
            src="/assets/gena-phool-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(40px,9vw,130px)] shrink-0 scale-x-[-1] select-none"
          />
        </div>

        {/* Retro double-bordered countdown frame — compact */}
        <div
          className="cd-reveal cd-frame relative mt-8 w-full max-w-[440px] border-2 p-1 sm:mt-10 sm:max-w-[480px] md:mt-12"
          style={{ borderColor: "#9d4130" }}
        >
          <div
            className="border p-3 sm:p-4 md:p-5"
            style={{
              borderColor: "#9d4130",
              backgroundColor: "#faf0d8",
            }}
          >
            <div className="flex items-start">
              {units.map((u, i) => (
                <div
                  key={u.label}
                  className="relative flex flex-1 flex-col items-center"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#9d4130",
                      fontSize: "clamp(1.15rem, 3.8vw, 2.4rem)",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                    }}
                  >
                    <TickNumber value={u.value} pad={u.pad} />
                  </span>
                  <span
                    className="mt-1.5 whitespace-nowrap text-[0.55rem] uppercase sm:mt-2 sm:text-[0.65rem] md:mt-2.5 md:text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5f6f4d",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {u.label}
                  </span>
                  {i < units.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute right-0 top-1 h-5 w-px sm:h-7 md:h-9"
                      style={{ backgroundColor: "#9d4130", opacity: 0.25 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p
          className="cd-reveal mt-10 max-w-xl px-4 text-center text-base leading-relaxed sm:mt-12 sm:text-lg md:mt-14 md:text-xl"
          style={{ color: "#2a1a15" }}
        >
          Until the day we&apos;ve all been waiting for.
        </p>
      </div>
    </section>
  );
}
