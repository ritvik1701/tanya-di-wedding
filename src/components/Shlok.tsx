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
      // fromTo, not from — see the note on the Countdown's reveal. Same
      // pattern, same way of stranding an element permanently invisible.
      gsap.fromTo(
        ".shlok-reveal > *",
        { autoAlpha: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: ".shlok-reveal",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-scroll-stop="" className="relative">
      {/* Bottom padding runs shorter than the top: the Countdown opens
          with the Open Invitations button rather than a heading, and the
          full symmetric padding left it stranded in a void. */}
      <div className="shlok-reveal relative flex flex-col items-center gap-8 px-5 pb-10 pt-14 text-center sm:gap-10 sm:px-8 sm:pb-12 sm:pt-18 md:gap-14 md:pb-14 md:pt-22">
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
