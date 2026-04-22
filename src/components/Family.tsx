"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "./Stars";

// Placeholder family data — replace with real names when ready.
type Person = { role: string; name: string };
type FamilySide = {
  sideLabel: string;
  hi: string;
  en: string;
  people: Person[];
};

const families: FamilySide[] = [
  {
    sideLabel: "The Bride's Family",
    hi: "तान्या का परिवार",
    en: "Tanya's Family",
    people: [
      { role: "Father", name: "[Father's Name]" },
      { role: "Mother", name: "[Mother's Name]" },
      { role: "Brother", name: "[Brother's Name]" },
      { role: "Sister", name: "[Sister's Name]" },
    ],
  },
  {
    sideLabel: "The Groom's Family",
    hi: "हेमाभ का परिवार",
    en: "Hemabh's Family",
    people: [
      { role: "Father", name: "[Father's Name]" },
      { role: "Mother", name: "[Mother's Name]" },
      { role: "Brother", name: "[Brother's Name]" },
      { role: "Sister", name: "[Sister's Name]" },
    ],
  },
];

export default function Family() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fam-heading > *", {
        scrollTrigger: {
          trigger: ".fam-heading",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 28,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".fam-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          autoAlpha: 0,
          x: i % 2 === 0 ? -40 : 40,
          y: 20,
          duration: 1.1,
          ease: "power3.out",
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative px-5 py-16 sm:px-8 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="fam-heading mb-12 flex flex-col items-center text-center sm:mb-16 md:mb-20">
          <p
            className="text-sm uppercase sm:text-sm md:text-base"
            style={{
              fontFamily: "var(--font-display)",
              color: "#5f6f4d",
              letterSpacing: "0.28em",
              fontWeight: 600,
            }}
          >
            · With the blessings of ·
          </p>

          <span
            className="mt-6 block sm:mt-8"
            lang="hi"
            style={{
              fontFamily: "var(--font-hindi)",
              color: "#9d4130",
              fontSize: "clamp(2.8rem, 9vw, 6rem)",
              lineHeight: 1,
            }}
          >
            हमारा परिवार
          </span>

          <h2
            className="mt-4 text-2xl uppercase sm:mt-5 sm:text-3xl md:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "#5f6f4d",
              letterSpacing: "0.24em",
              fontWeight: 600,
            }}
          >
            Our Families
          </h2>

          <div
            className="mt-8 h-px w-36 sm:w-44"
            style={{ backgroundColor: "#9d4130" }}
          />
        </div>

        {/* Two family cards side by side */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-4 lg:gap-10">
          {/* Bride's family */}
          <FamilyCard side={families[0]} />

          {/* Central decorative divider between the two families */}
          <div
            className="flex items-center justify-center md:flex-col"
            aria-hidden
          >
            <span
              className="h-px w-16 sm:w-24 md:h-full md:w-px md:min-h-[200px]"
              style={{ backgroundColor: "#9d4130", opacity: 0.3 }}
            />
            <span className="mx-3 my-3 md:mx-0 md:my-3">
              <Star size={16} color="#9d4130" />
            </span>
            <span
              className="h-px w-16 sm:w-24 md:h-full md:w-px md:min-h-[200px]"
              style={{ backgroundColor: "#9d4130", opacity: 0.3 }}
            />
          </div>

          {/* Groom's family */}
          <FamilyCard side={families[1]} />
        </div>

        {/* Outro */}
        <div className="mt-12 flex flex-col items-center text-center sm:mt-16">
          <div
            className="h-px w-28 sm:w-40"
            style={{ backgroundColor: "#9d4130" }}
          />
          <p
            className="mt-6 text-sm uppercase sm:text-sm md:text-base"
            style={{
              fontFamily: "var(--font-display)",
              color: "#5f6f4d",
              letterSpacing: "0.3em",
              fontWeight: 600,
            }}
          >
            · Two families, one celebration ·
          </p>
        </div>
      </div>
    </section>
  );
}

function FamilyCard({ side }: { side: FamilySide }) {
  return (
    <div className="fam-card relative flex flex-col items-center border-2 p-1.5 sm:p-2"
      style={{ borderColor: "#9d4130" }}
    >
      <div
        className="flex w-full flex-col items-center border px-6 py-8 text-center sm:px-8 sm:py-10 md:px-10 md:py-12"
        style={{
          borderColor: "#9d4130",
          backgroundColor: "#faf0d8",
        }}
      >
        <p
          className="text-xs uppercase sm:text-sm md:text-sm"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.3em",
            fontWeight: 600,
          }}
        >
          {side.sideLabel}
        </p>

        <span
          className="mt-4 block sm:mt-5"
          lang="hi"
          style={{
            fontFamily: "var(--font-hindi)",
            color: "#9d4130",
            fontSize: "clamp(1.8rem, 5.5vw, 3.2rem)",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {side.hi}
        </span>

        <div
          className="my-5 h-px w-20 sm:my-6 sm:w-28"
          style={{ backgroundColor: "#9d4130", opacity: 0.55 }}
        />

        <ul className="flex w-full flex-col gap-4 sm:gap-5">
          {side.people.map((p) => (
            <li
              key={p.role}
              className="flex flex-col items-center"
            >
              <span
                className="text-xs uppercase sm:text-sm md:text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#5f6f4d",
                  letterSpacing: "0.3em",
                  fontWeight: 600,
                }}
              >
                {p.role}
              </span>
              <span
                className="mt-1 text-lg sm:text-xl md:text-2xl"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#9d4130",
                  fontWeight: 500,
                }}
              >
                {p.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
