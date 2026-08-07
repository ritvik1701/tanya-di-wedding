// The root URL is a gate, not an invitation. Nobody is given this
// address: every guest gets a link of their own, showing the events they
// are invited to. Deliberately static — no envelope intro, no reveals,
// nothing to wait through before reading the one sentence that matters.
export default function Page() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center">
      <p
        className="text-xs uppercase sm:text-sm"
        style={{
          fontFamily: "var(--font-display)",
          color: "#5f6f4d",
          letterSpacing: "0.35em",
          fontWeight: 600,
          textIndent: "0.35em",
        }}
      >
        Tanya weds Hemabh
      </p>

      <div
        className="mt-8 h-px w-20 sm:w-28"
        style={{ backgroundColor: "#9d4130", opacity: 0.4 }}
        aria-hidden
      />

      <h1
        className="mt-8 max-w-xl"
        style={{
          fontFamily: "var(--font-display)",
          color: "#9d4130",
          fontSize: "clamp(1.5rem, 5vw, 2.6rem)",
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        Please open the invitation link we sent you
      </h1>

      {/* Says nothing about what any link contains. An earlier draft
          mentioned that families get different events, which handed a
          stranger at the front door the one fact the whole scheme is
          meant to keep quiet. */}
      <p
        className="mt-6 max-w-md text-base leading-relaxed sm:text-lg"
        style={{ color: "#2a1a15" }}
      >
        It&apos;s in your WhatsApp somewhere, between the good-morning flowers
        and the forwarded jokes.
      </p>

      <p
        className="mt-8 max-w-md text-sm leading-relaxed"
        style={{ color: "#5f6f4d" }}
      >
        Still can&apos;t find it? Ask us and we&apos;ll send it again.
      </p>
    </main>
  );
}
