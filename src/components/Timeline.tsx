"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { events } from "@/config/wedding";
import EventIcon from "./EventIcon";
import { getLenis } from "./SmoothScroll";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLLIElement | null)[]>([]);

  const N = events.length;

  // Refs for auto-snap state
  const isProgScrolling = useRef(false);
  const currentSnapIdx = useRef(0);

  // Scroll to a specific event via Lenis (used by both click and auto-snap)
  const scrollToEvent = useCallback(
    (index: number, duration = 0.9) => {
      const pinned = pinnedRef.current;
      if (!pinned) return;

      const rect = pinned.getBoundingClientRect();
      const pinnedDocTop = rect.top + window.scrollY;
      const scrollRange = pinned.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      const clamped = Math.max(0, Math.min(N - 1, index));
      const targetProgress = clamped / (N - 1);
      const targetY = pinnedDocTop + targetProgress * scrollRange;

      isProgScrolling.current = true;
      currentSnapIdx.current = clamped;

      const lenis = getLenis();
      const done = () => {
        // Release a touch later so any trailing ScrollTrigger onUpdate events
        // from the programmatic scroll don't re-fire auto-snap.
        setTimeout(() => {
          isProgScrolling.current = false;
        }, 60);
      };

      if (lenis) {
        lenis.scrollTo(targetY, {
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          lock: true,
          onComplete: done,
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(done, duration * 1000);
      }
    },
    [N]
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state: first panel fully visible, others hidden below
      panelRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
      });
      railRefs.current.forEach((r, i) => {
        if (!r) return;
        r.classList.toggle("is-active", i === 0);
      });

      // Scrubbed master timeline — total length = (N - 1).
      // In every unit interval [i, i+1]:
      //   outgoing fades out [i+0.80 → i+0.90]  (duration 0.10)
      //   incoming fades in  [i+0.90 → i+1.00]  (duration 0.10)
      // The two tweens touch at i+0.9 with zero overlap and zero gap.
      // Crucially, since auto-snap fires as soon as the user moves PAST the
      // current snap point, this whole transition zone plays during the
      // programmatic Lenis scroll — the user never scrolls through it manually.
      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      });

      for (let i = 0; i < N - 1; i++) {
        const outgoing = panelRefs.current[i];
        const incoming = panelRefs.current[i + 1];
        if (!outgoing || !incoming) continue;

        master.to(
          outgoing,
          { opacity: 0, y: -40, duration: 0.1 },
          i + 0.8
        );
        master.fromTo(
          incoming,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.1 },
          i + 0.9
        );
      }

      // Custom auto-snap + rail highlight
      // Fires the moment the user moves past a small threshold from the
      // currently-held event, sweeping them to the next via Lenis.
      const AUTO_SNAP_THRESHOLD = 0.12; // 12% of a segment — snappy but not twitchy

      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const exact = self.progress * (N - 1);
          // Rail: highlight nearest-rounded index (so label flips at midpoint)
          const roundedIdx = Math.min(
            N - 1,
            Math.max(0, Math.round(exact))
          );
          railRefs.current.forEach((r, i) => {
            if (!r) return;
            r.classList.toggle("is-active", i === roundedIdx);
          });

          // Auto-snap: ignore while a programmatic scroll is running
          if (isProgScrolling.current) return;

          const cur = currentSnapIdx.current;
          const delta = exact - cur;

          if (delta > AUTO_SNAP_THRESHOLD && cur < N - 1) {
            scrollToEvent(cur + 1, 0.55);
          } else if (delta < -AUTO_SNAP_THRESHOLD && cur > 0) {
            scrollToEvent(cur - 1, 0.55);
          }
        },
      });

      // Heading entrance
      gsap.from(".tl-heading > *", {
        scrollTrigger: {
          trigger: ".tl-heading",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToEvent]);

  return (
    <section ref={sectionRef} className="relative">
      {/* Intro heading — shlok and "The Journey" title with comfortable rhythm */}
      <div className="tl-heading relative flex flex-col items-center gap-8 px-5 py-14 text-center sm:gap-10 sm:px-8 sm:py-18 md:gap-14 md:py-22">
        {/* Shlok group */}
        <div className="flex flex-col items-center">
          <span
            className="block"
            lang="hi"
            aria-hidden
            style={{
              fontFamily: "var(--font-hindi)",
              color: "#ab1b23",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            ॐ
          </span>
          <p
            className="mt-6 leading-[1.55] sm:mt-8"
            lang="hi"
            style={{
              fontFamily: "var(--font-hindi)",
              color: "#9d4130",
              fontSize: "clamp(1rem, 2.4vw, 1.6rem)",
            }}
          >
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ
            <br />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा
          </p>
          <p
            className="mt-5 max-w-md text-xs italic leading-relaxed sm:mt-6 sm:text-sm md:text-base"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#2a1a15",
              opacity: 0.75,
            }}
          >
            May this auspicious union be free of all obstacles.
          </p>
        </div>

        {/* Decorative midpoint divider */}
        <div
          className="h-px w-24 sm:w-32"
          style={{ backgroundColor: "#9d4130", opacity: 0.5 }}
          aria-hidden
        />

        {/* Journey title group */}
        <div className="flex flex-col items-center">
          <p
            className="text-sm uppercase sm:text-sm md:text-base"
            style={{
              fontFamily: "var(--font-display)",
              color: "#5f6f4d",
              letterSpacing: "0.28em",
              fontWeight: 600,
            }}
          >
            · A week of celebrations ·
          </p>
          <h2
            className="mt-5 text-3xl uppercase sm:mt-7 sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "#9d4130",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            The Journey
          </h2>
          <div
            className="mt-8 h-px w-28 sm:mt-10 sm:w-40"
            style={{ backgroundColor: "#9d4130" }}
          />
        </div>
      </div>

      {/* Pinned full-screen timeline experience */}
      <div
        ref={pinnedRef}
        className="relative"
        style={{ height: `${events.length * 100}svh` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 sm:px-8 md:px-12">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_minmax(0,1fr)] items-center gap-5 sm:gap-10 md:gap-16 lg:gap-20">
            {/* Left: static timeline rail */}
            <ul className="relative flex flex-col gap-6 sm:gap-10 md:gap-12">
              {/* continuous line behind the dots */}
              <span
                aria-hidden
                className="absolute left-[9px] top-2 h-[calc(100%-1rem)] w-px sm:left-[11px] md:left-[13px]"
                style={{ backgroundColor: "#9d4130", opacity: 0.25 }}
              />

              {events.map((ev, i) => (
                <li
                  key={ev.id}
                  ref={(el) => {
                    railRefs.current[i] = el;
                  }}
                  className="tl-rail-item group relative flex cursor-pointer items-center gap-0 sm:gap-4 md:gap-5"
                  onClick={() => scrollToEvent(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToEvent(i);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Jump to ${ev.name}`}
                >
                  <span
                    className="tl-rail-dot relative z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full transition-all duration-500 sm:h-[22px] sm:w-[22px] md:h-[26px] md:w-[26px]"
                    style={{
                      backgroundColor: "#f0e4cc",
                      border: "1.5px solid #9d4130",
                    }}
                  >
                    <span
                      className="tl-rail-dot-inner block rounded-full transition-all duration-500"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#9d4130",
                      }}
                    />
                  </span>
                  <span
                    className="tl-rail-label hidden whitespace-nowrap text-sm uppercase transition-all duration-500 group-hover:opacity-100 sm:inline md:text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#9d4130",
                      letterSpacing: "0.18em",
                      fontWeight: 600,
                    }}
                  >
                    {ev.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* Right: stacked event panels (grid-stack) — claims real vertical space */}
            <div className="relative grid min-h-[60svh] items-center md:min-h-[70svh]">
              {events.map((ev, i) => (
                <div
                  key={ev.id}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="col-start-1 row-start-1 flex min-w-0 flex-col justify-center"
                >
                  <span
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center sm:mb-6 sm:h-14 sm:w-14 md:mb-8 md:h-20 md:w-20 lg:h-24 lg:w-24"
                    aria-hidden
                  >
                    <EventIcon
                      id={ev.id}
                      size={84}
                      color="#9d4130"
                    />
                  </span>
                  <p
                    className="text-xs uppercase sm:text-sm md:text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5f6f4d",
                      letterSpacing: "0.2em",
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(ev.date)} · {ev.time}
                  </p>
                  <h3
                    className="mt-2 uppercase leading-none sm:mt-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#9d4130",
                      letterSpacing: "0.03em",
                      fontWeight: 600,
                      fontSize: "clamp(1.5rem, 7.5vw, 7rem)",
                    }}
                  >
                    {ev.name}
                  </h3>
                  <p
                    className="mt-4 max-w-md text-xs leading-relaxed sm:mt-6 sm:text-sm md:mt-8 md:max-w-xl md:text-base lg:text-lg"
                    style={{ color: "#2a1a15" }}
                  >
                    {ev.description}
                  </p>
                  <p
                    className="mt-4 text-xs uppercase sm:mt-6 sm:text-sm md:mt-8 md:text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5f6f4d",
                      letterSpacing: "0.18em",
                      fontWeight: 600,
                    }}
                  >
                    Venue · {ev.venue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outro divider */}
      <div className="flex flex-col items-center px-4 pb-12 pt-6 text-center sm:pb-16 md:pb-20">
        <div
          className="h-px w-28 sm:w-40"
          style={{ backgroundColor: "#9d4130" }}
        />
        <p
          className="mt-6 text-sm uppercase sm:text-sm md:text-base"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.28em",
            fontWeight: 600,
          }}
        >
          · More details coming soon ·
        </p>
      </div>

      {/* Rail active styles */}
      <style jsx>{`
        :global(.tl-rail-item .tl-rail-label) {
          opacity: 0.42;
        }
        :global(.tl-rail-item.is-active .tl-rail-label) {
          opacity: 1;
          transform: translateX(4px);
        }
        :global(.tl-rail-item .tl-rail-dot) {
          transform: scale(0.82);
        }
        :global(.tl-rail-item.is-active .tl-rail-dot) {
          transform: scale(1.15);
          background-color: #9d4130 !important;
        }
        :global(.tl-rail-item.is-active .tl-rail-dot-inner) {
          background-color: #f0e4cc !important;
        }
      `}</style>
    </section>
  );
}
