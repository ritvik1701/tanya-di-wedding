import Hero from "@/components/Hero";
import Shlok from "@/components/Shlok";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
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
      <footer className="flex flex-col items-center px-6 py-16 text-center">
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
        <div
          className="mt-6 h-px w-20 sm:w-28"
          style={{ backgroundColor: "#9d4130", opacity: 0.4 }}
          aria-hidden
        />
        <p
          className="mt-6 text-sm sm:text-base"
          style={{ color: "#9d4130" }}
        >
          Made with love, Budhiraja Family
        </p>
      </footer>
    </main>
  );
}
