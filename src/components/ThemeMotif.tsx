// Theme marker for each Timeline event. Renders the exact SVG art at
// /public/assets/motifs/floral-mark.svg, recoloured per-event via CSS
// mask-image: the SVG acts as the shape, and `backgroundColor` drives
// the visible colour. This lets the same art serve all four events in
// lilac / green / indigo / crimson without touching the source file.

type Props = {
  color: string;
  // Pixel size (number) or any CSS length (string like "100%"). String
  // lets the caller drive size via a responsive wrapper's clamp().
  size?: number | string;
};

export default function ThemeMotif({ color, size = 96 }: Props) {
  const maskImage = "url(/assets/motifs/floral-mark.svg)";
  return (
    <span
      aria-hidden
      className="block"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
