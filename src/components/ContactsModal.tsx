"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingEvent } from "@/config/wedding";
import { getLenis } from "./SmoothScroll";

// Hindi names mirror the Timeline map. Kept inline so the modal is
// self-contained and can be dropped elsewhere later if needed.
const EVENT_HI: Record<string, string> = {
  haldi: "हल्दी",
  mehendi: "मेहंदी",
  sangeet: "संगीत",
  wedding: "विवाह",
};

type Props = {
  event: WeddingEvent | null;
  onClose: () => void;
};

export default function ContactsModal({ event, onClose }: Props) {
  const open = !!event;

  // Lock scroll + close on Escape while the modal is open
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="contacts-modal"
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacts-modal-title"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default"
            style={{
              backgroundColor: "rgba(26, 16, 12, 0.72)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Card with retro double border */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="border-2 p-2 sm:p-3"
              style={{ borderColor: "#9d4130", backgroundColor: "#f0e4cc" }}
            >
              <div
                className="border p-6 sm:p-8"
                style={{ borderColor: "#9d4130", backgroundColor: "#faf0d8" }}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close contacts"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70 sm:right-6 sm:top-6"
                  style={{ color: "#9d4130" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 3L15 15M15 3L3 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Eyebrow + Hindi name + event title */}
                <div className="flex flex-col items-center text-center">
                  <span
                    className="text-xs uppercase sm:text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#5f6f4d",
                      letterSpacing: "0.35em",
                      fontWeight: 600,
                    }}
                  >
                    · Points of Contact ·
                  </span>
                  <span
                    className="mt-3 block leading-none"
                    lang="hi"
                    style={{
                      fontFamily: "var(--font-hindi)",
                      color: "#ab1b23",
                      fontSize: "clamp(2rem, 7vw, 3rem)",
                      lineHeight: 1,
                    }}
                  >
                    {EVENT_HI[event.id] ?? event.name}
                  </span>
                  <span
                    id="contacts-modal-title"
                    className="mt-2 text-xs uppercase sm:text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#9d4130",
                      letterSpacing: "0.35em",
                      fontWeight: 600,
                    }}
                  >
                    {event.name}
                  </span>
                </div>

                {/* Contact list */}
                <ul className="mt-6 flex flex-col divide-y sm:mt-8">
                  {event.contacts.map((c, i) => (
                    <motion.li
                      key={`${c.name}-${i}`}
                      className="flex items-center justify-between gap-4 py-4"
                      style={{ borderColor: "rgba(157, 65, 48, 0.25)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.07,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span
                          className="truncate text-base sm:text-lg"
                          style={{
                            fontFamily: "var(--font-serif)",
                            color: "#2a1a15",
                            fontWeight: 600,
                          }}
                        >
                          {c.name}
                        </span>
                        <span
                          className="mt-0.5 truncate text-[11px] uppercase sm:text-xs"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "#5f6f4d",
                            letterSpacing: "0.25em",
                            fontWeight: 600,
                          }}
                        >
                          {c.role}
                        </span>
                      </div>
                      <a
                        href={`tel:${c.phone.replace(/\s+/g, "")}`}
                        className="group inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-[11px] uppercase transition-colors sm:text-xs"
                        style={{
                          borderColor: "#9d4130",
                          color: "#9d4130",
                          letterSpacing: "0.2em",
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Call
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer note */}
                <p
                  className="mt-6 text-center text-xs sm:text-sm"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "#5f6f4d",
                    fontStyle: "italic",
                  }}
                >
                  Reach out anytime — we&apos;re here to help.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
