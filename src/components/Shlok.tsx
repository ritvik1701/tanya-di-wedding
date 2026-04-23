"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ganesh invocation shlok — "vakratunda mahakaya…". Lives directly
// above the Countdown section, no divider between them.

export default function Shlok() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".shlok-reveal > *", {
        scrollTrigger: {
          trigger: ".shlok-reveal",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative">
      <div className="shlok-reveal relative flex flex-col items-center gap-8 px-5 py-14 text-center sm:gap-10 sm:px-8 sm:py-18 md:gap-14 md:py-22">
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
            className="mt-6 max-w-xl px-4 text-center text-base leading-relaxed sm:mt-8 sm:text-lg md:text-xl"
            style={{ color: "#2a1a15" }}
          >
            May this auspicious union be free of all obstacles.
          </p>
        </div>
      </div>
    </section>
  );
}
