"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { getNextEvent, wedding } from "@/config/wedding";

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
// Old digit slides down out of the bottom; new digit arrives from the top.
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

// Two-digit ticker, each character animated independently.
function TickNumber({ value }: { value: number }) {
  const padded = String(value).padStart(2, "0");
  return (
    <span
      className="inline-flex"
      style={{
        fontFamily: "var(--font-display)",
        color: "#9d4130",
        fontSize: "clamp(1.7rem, 6vw, 4.5rem)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}
    >
      {padded.split("").map((char, i) => (
        <TickDigit key={i} char={char} />
      ))}
    </span>
  );
}

export default function Countdown() {
  const root = useRef<HTMLDivElement>(null);
  const [target] = useState(() => {
    const next = getNextEvent();
    return {
      date: next?.date ?? wedding.date,
      label: next?.name ?? "The Wedding",
    };
  });
  const [t, setT] = useState<TimeParts>(() => diffParts(target.date, new Date()));

  useEffect(() => {
    const i = window.setInterval(() => {
      setT(diffParts(target.date, new Date()));
    }, 1000);
    return () => window.clearInterval(i);
  }, [target.date]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cd-eyebrow, .cd-title, .cd-rule, .cd-frame, .cd-footer", {
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

  const units: { label: string; value: number }[] = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Sec", value: t.seconds },
  ];

  return (
    <section
      ref={root}
      className="relative flex items-center justify-center px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 md:pb-20 md:pt-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p
          className="cd-eyebrow text-center text-sm uppercase sm:text-sm md:text-base"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.28em",
            fontWeight: 600,
          }}
        >
          · The celebration begins in ·
        </p>

        <h2
          className="cd-title mt-3 text-3xl uppercase sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "#9d4130",
            letterSpacing: "0.12em",
            fontWeight: 600,
          }}
        >
          {target.label}
        </h2>

        <div
          className="cd-rule my-5 h-px w-28 sm:my-6 sm:w-36 md:my-7 md:w-40"
          style={{ backgroundColor: "#9d4130" }}
        />

        {/* Gena phool flanking stickers (always visible) + retro frame */}
        <div className="flex w-full items-center justify-center gap-2 sm:gap-4 md:gap-8">
          <img
            src="/assets/gena-phool-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 select-none"
          />

          {/* Retro double-bordered frame — echoes the hero window */}
          <div
            className="cd-frame relative min-w-0 flex-1 max-w-[640px] border-2 p-1 sm:p-1.5 md:p-2"
            style={{ borderColor: "#9d4130" }}
          >
            <div
              className="border p-4 sm:p-6 md:p-10"
              style={{
                borderColor: "#9d4130",
                backgroundColor: "#faf0d8",
              }}
            >
            <div className="grid grid-cols-4 items-start justify-items-center gap-2 sm:gap-6 md:gap-10">
              {units.map((u, i) => (
                <div
                  key={u.label}
                  className="relative flex flex-col items-center"
                >
                  <TickNumber value={u.value} />
                  <span
                    className="mt-2 whitespace-nowrap text-[0.65rem] uppercase sm:mt-3 sm:text-xs md:mt-4 md:text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5f6f4d",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {u.label}
                  </span>
                  {/* thin divider between units */}
                  {i < units.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute -right-1 top-1 h-6 w-px sm:-right-3 sm:top-2 sm:h-10 md:-right-5 md:h-14"
                      style={{ backgroundColor: "#9d4130", opacity: 0.25 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>

          <img
            src="/assets/gena-phool-sticker.png"
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none block h-auto w-[clamp(36px,9vw,130px)] shrink-0 scale-x-[-1] select-none"
          />
        </div>

        <p
          className="cd-footer mt-8 max-w-md px-4 text-center text-sm leading-relaxed sm:mt-10 md:mt-12"
          style={{ color: "#2a1a15" }}
        >
          Until the first of many joyful moments.
        </p>
      </div>
    </section>
  );
}
