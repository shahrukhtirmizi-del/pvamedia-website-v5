import type { Metadata } from "next";
import Hero from "./components/sections/Hero";
import Ticker from "./components/ui/Ticker";
import PainPoints from "./components/sections/PainPoints";
import CaseStudy from "./components/sections/CaseStudy";
import Portfolio from "./components/sections/Portfolio";
import Services from "./components/sections/Services";
import Pricing from "./components/sections/Pricing";
import WhatYouGet from "./components/sections/WhatYouGet";
import Testimonials from "./components/sections/Testimonials";
import FinalCTA from "./components/sections/FinalCTA";
import LaserBand from "./components/fx/LaserBand";
import { SITE, TICKER } from "./lib/site";

export const metadata: Metadata = {
  title: "PVA Media | Websites and Local SEO for Landscapers",
  description:
    "We take landscapers from 3 booked jobs a month to 12, without lifting a finger. Custom websites, local SEO, paid ads and AI receptionists, live in 5 days.",
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.domain,
  email: SITE.email,
  telephone: SITE.phone,
  description:
    "Web design, local SEO and AI receptionist services built exclusively for landscaping companies across the United States.",
  areaServed: { "@type": "Country", name: "United States" },
  slogan: SITE.tagline,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />
      <Ticker items={TICKER} />

      {/* the beams run behind two sections at a time and dissolve at each
          end of the band, so nothing ends on a line. Every other pair. */}
      <LaserBand centerX={0.55} centerY={-0.25} opacity={0.5}>
        <PainPoints />
        <CaseStudy />
      </LaserBand>

      <Portfolio />
      <Services />

      <LaserBand centerX={-0.6} centerY={0.3} opacity={0.42}>
        <Pricing />
        <WhatYouGet />
      </LaserBand>

      <Testimonials />
      <FinalCTA />
    </>
  );
}
