import Hero from "@/components/Hero";
import Shlok from "@/components/Shlok";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import OurStory from "@/components/OurStory";
import Family from "@/components/Family";
import SectionDivider from "@/components/SectionDivider";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <SectionDivider />
      <Shlok />
      <Countdown />
      <SectionDivider direction="right" />
      <Timeline />
      <SectionDivider />
      <Family />
      <SectionDivider direction="right" />
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
