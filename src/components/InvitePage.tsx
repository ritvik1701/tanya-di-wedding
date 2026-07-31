import Hero from "@/components/Hero";
import Shlok from "@/components/Shlok";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import SectionDivider from "@/components/SectionDivider";
import ScrollCue from "@/components/ScrollCue";
import type { WeddingEvent } from "@/config/wedding";

// The whole invitation, minus the decision of which events to show. The
// root URL passes every event, a guest link passes that guest's subset.
// Everything above the Timeline is the same for everyone: the couple, the
// blessing, and the countdown to the wedding day itself.
export default function InvitePage({ events }: { events: WeddingEvent[] }) {
  return (
    <main className="relative">
      <Hero />
      <SectionDivider />
      <Shlok />
      <Countdown />
      <SectionDivider direction="right" />
      <Timeline events={events} />
      <SectionDivider />
      <footer
        data-scroll-stop=""
        className="flex flex-col items-center px-6 py-16 text-center"
      >
        <p
          className="text-xs uppercase sm:text-sm"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.35em",
            fontWeight: 600,
            // The tracking hangs off the last glyph, which reads as an
            // off-centre line once there's nothing after it on the row.
            textIndent: "0.35em",
          }}
        >
          Tanya &amp; Hemabh
        </p>
        <p
          className="mt-3 text-xs uppercase sm:mt-4 sm:text-sm"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.35em",
            fontWeight: 600,
            textIndent: "0.35em",
          }}
        >
          25 August 2026
        </p>
        <div
          className="mt-6 h-px w-20 sm:w-28"
          style={{ backgroundColor: "#9d4130", opacity: 0.4 }}
          aria-hidden
        />
        <p className="mt-6 text-sm sm:text-base" style={{ color: "#9d4130" }}>
          Made with love, Budhiraja Family
        </p>
      </footer>

      <ScrollCue />
    </main>
  );
}
