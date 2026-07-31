import { getLenis } from "@/components/SmoothScroll";

// Marks a place a scroll jump can land: the hero, each standalone
// section, each event card, and the footer. Kept as an attribute rather
// than a list of ids so the stops follow whatever is actually rendered —
// a guest link shows two cards, the family view shows five.
export const SCROLL_STOP = "data-scroll-stop";

// Document-relative top taken from layout rather than from paint.
// getBoundingClientRect reports a stuck sticky card at 0, which is where
// it is drawn and not where it sits in the scroll, so the event deck
// needs this instead. offsetTop is a layout value and is unaffected.
export function absoluteTop(el: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

// Every scroll stop in the document, in order down the page.
export function scrollStops(): number[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`[${SCROLL_STOP}]`),
  )
    .map(absoluteTop)
    .sort((a, b) => a - b);
}

export function scrollToY(y: number, duration = 0.9) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(y, max));

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      duration,
      easing: (p: number) => 1 - Math.pow(1 - p, 3),
      lock: true,
    });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
