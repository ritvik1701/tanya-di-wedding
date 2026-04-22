import type { Metadata } from "next";
import { Cormorant_Garamond, Tenor_Sans, Cinzel, Yatra_One } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StarsBackdrop from "@/components/StarsBackdrop";
import IntroLetter from "@/components/IntroLetter";

const displayFont = Cinzel({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hindiFont = Yatra_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tanya weds Hemabh — 25 August 2026",
  description:
    "Join us in celebration as Tanya and Hemabh begin their forever. 25th August 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${serifFont.variable} ${sansFont.variable} ${hindiFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-festive">
        <SmoothScroll />
        <StarsBackdrop />
        <div className="relative z-10">{children}</div>
        <IntroLetter />
      </body>
    </html>
  );
}
