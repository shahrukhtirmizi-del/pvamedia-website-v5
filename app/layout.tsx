import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import Nav from "./components/site/Nav";
import Footer from "./components/site/Footer";
import Grain from "./components/site/Grain";
import SmoothScroll from "./components/site/SmoothScroll";
import CookieBanner from "./components/site/CookieBanner";
import MetaPixel from "./components/site/MetaPixel";
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
    default: SITE.title,
    template: "%s | PVA Media, Your Growth Partner",
  },
  description: SITE.description,
  keywords: [
    "growth partner",
    "growth partner for service businesses",
    "advertising for service businesses",
    "websites built to convert",
    "24/7 virtual receptionist",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.domain,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  verification: { other: { "facebook-domain-verification": "4i5j5h8bgn3y19wydgvcgus33lvbbh" } },
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
        <MetaPixel />
        <Cursor />
        <GlowCursor />
        <Analytics />
      </body>
    </html>
  );
}
