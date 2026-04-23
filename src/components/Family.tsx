"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "./Stars";

// Placeholder family data — swap `photo` for a real image path (e.g.
// "/assets/family/tanya-father.jpg") when you have the photos ready.
type Person = { role: string; name: string; photo?: string };
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

      // Each photo pops in on scroll
      gsap.utils.toArray<HTMLElement>(".fam-photo").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          autoAlpha: 0,
          y: 20,
          scale: 0.94,
          duration: 0.8,
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
      <div className="mx-auto max-w-6xl">
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

        {/* Two family cards side by side (stack on mobile) */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-4 lg:gap-10">
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
    <div
      className="fam-card relative flex flex-col items-center border-2 p-1.5 sm:p-2"
      style={{ borderColor: "#9d4130" }}
    >
      <div
        className="flex w-full flex-col items-center border px-5 py-8 text-center sm:px-6 sm:py-10 md:px-8 md:py-12"
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
          className="my-6 h-px w-20 sm:my-8 sm:w-28"
          style={{ backgroundColor: "#9d4130", opacity: 0.55 }}
        />

        {/* Photo grid — 2 columns, 2 rows */}
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {side.people.map((p) => (
            <PersonCard key={p.role} person={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  const initial = person.name.replace(/[\[\]]/g, "").trim().charAt(0) || "·";

  return (
    <div className="fam-photo flex flex-col items-center">
      {/* Photo frame — portrait, with inner cream matte and terracotta border */}
      <div
        className="relative w-full border p-1 sm:p-1.5"
        style={{
          borderColor: "#9d4130",
          aspectRatio: "3 / 4",
          backgroundColor: "#9d4130",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ backgroundColor: "#ebdbb4" }}
        >
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            /* Placeholder — subtle cream panel with initial */
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#9d4130",
                  opacity: 0.35,
                  fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {initial}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Role + name beneath the photo */}
      <span
        className="mt-3 text-[0.7rem] uppercase sm:mt-4 sm:text-xs md:text-sm"
        style={{
          fontFamily: "var(--font-display)",
          color: "#5f6f4d",
          letterSpacing: "0.3em",
          fontWeight: 600,
        }}
      >
        {person.role}
      </span>
      <span
        className="mt-1 text-base sm:text-lg md:text-xl"
        style={{
          fontFamily: "var(--font-serif)",
          color: "#9d4130",
          fontWeight: 500,
        }}
      >
        {person.name}
      </span>
    </div>
  );
}
