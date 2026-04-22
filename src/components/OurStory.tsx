"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function OurStory() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".os-heading > *", {
        scrollTrigger: {
          trigger: ".os-heading",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        y: 28,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex items-center justify-center px-5 py-14 sm:px-8 sm:py-18 md:py-22"
    >
      <div className="os-heading flex flex-col items-center text-center">
        <p
          className="text-sm uppercase sm:text-sm md:text-base"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.28em",
            fontWeight: 600,
          }}
        >
          · How we got here ·
        </p>

        <span
          className="mt-5 block sm:mt-6"
          lang="hi"
          style={{
            fontFamily: "var(--font-hindi)",
            color: "#9d4130",
            fontSize: "clamp(2rem, 5.5vw, 3.8rem)",
            lineHeight: 1,
          }}
        >
          हमारी कहानी
        </span>

        <div
          className="mt-6 h-px w-32 sm:mt-8 sm:w-44"
          style={{ backgroundColor: "#9d4130" }}
        />
      </div>
    </section>
  );
}
