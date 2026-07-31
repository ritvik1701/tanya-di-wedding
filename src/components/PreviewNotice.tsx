"use client";

import { useState } from "react";

// Only the root URL renders this. Guests open their own link, which shows
// their subset of events and no banner at all.
export default function PreviewNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 px-3 sm:gap-4 sm:px-6"
      style={{
        backgroundColor: "#faf0d8",
        borderBottom: "1px solid rgba(157, 65, 48, 0.35)",
        boxShadow: "0 2px 12px rgba(26, 12, 2, 0.12)",
      }}
    >
      <p
        className="py-2.5 text-center text-[0.58rem] uppercase leading-relaxed sm:text-[0.68rem]"
        style={{
          fontFamily: "var(--font-display)",
          color: "#9d4130",
          letterSpacing: "0.16em",
          fontWeight: 600,
        }}
      >
        Family insider preview · every event is shown here. Guests open their own
        link and see only the events they are invited to.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss preview notice"
        className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center"
        style={{ color: "#9d4130" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M1 1 L13 13 M13 1 L1 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
