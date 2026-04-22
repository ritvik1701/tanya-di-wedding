import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import OurStory from "@/components/OurStory";
import Family from "@/components/Family";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Countdown />
      <Timeline />
      <Family />
      <OurStory />
      <footer className="px-6 py-16 text-center">
        <p
          className="text-xs uppercase sm:text-sm"
          style={{
            fontFamily: "var(--font-display)",
            color: "#5f6f4d",
            letterSpacing: "0.35em",
            fontWeight: 600,
          }}
        >
          Tanya &amp; Hemabh · 25 August 2026
        </p>
      </footer>
    </main>
  );
}
