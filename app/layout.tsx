import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
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

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * The one serif on the site, italic only, used for a single accent word inside
 * a headline and nowhere else.
 */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "PVA Media | Websites and Local SEO for Trades",
    template: "%s | PVA Media",
  },
  description:
    "Custom websites, local SEO and AI receptionists built for trades and home service companies. Live in 5 days, with a 60 day guarantee.",
  keywords: [
    "trades website design",
    "home service SEO",
    "local trades marketing",
    "AI receptionist for trades",
    "trades lead generation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.domain,
    siteName: SITE.name,
    title: "PVA Media | Websites and Local SEO for Trades",
    description:
      "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PVA Media | Websites and Local SEO for Trades",
    description:
      "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F2EAD3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body className="font-display">
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
