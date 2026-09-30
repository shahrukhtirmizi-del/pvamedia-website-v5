import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import Nav from "./components/site/Nav";
import Footer from "./components/site/Footer";
import Grain from "./components/site/Grain";
import SmoothScroll from "./components/site/SmoothScroll";
import CookieBanner from "./components/site/CookieBanner";
import Atmosphere from "./components/site/Atmosphere";
import Cursor from "./components/site/Cursor";
import GlowCursor from "./components/fx/GlowCursor";
import { SITE } from "./lib/site";

/** Body copy, labels and UI. */
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Headlines and display numbers: bold, tight, editorial. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * A sober, upright serif for the few lines that should read as a statement
 * rather than a heading: the pain-points closer and the closing call. Loaded
 * with its optical-size axis so large settings get the display cut.
 */
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "PVA Media | Marketing for Trades and Home Services",
    template: "%s | PVA Media",
  },
  description:
    "Local SEO, paid ads and AI automation for trades and home service companies, with websites built to convert. 60% more enquiries in 90 days, or you don't pay.",
  keywords: [
    "trades marketing agency",
    "home service marketing",
    "local SEO for trades",
    "trades lead generation",
    "AI automation for trades",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.domain,
    siteName: SITE.name,
    title: "PVA Media | Marketing for Trades and Home Services",
    description:
      "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PVA Media | Marketing for Trades and Home Services",
    description:
      "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the home page's intro flag lands on <html> before hydration
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <SmoothScroll />
        <Atmosphere />
        <Grain />

        <Nav />
        <main id="main">{children}</main>
        <Footer />

        <CookieBanner />
        <Cursor />
        <GlowCursor />
        <Analytics />
      </body>
    </html>
  );
}
