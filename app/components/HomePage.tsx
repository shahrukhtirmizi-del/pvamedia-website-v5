import Hero from "./sections/Hero";
import Statement from "./sections/Statement";
import Ticker from "./ui/Ticker";
import PainPoints from "./sections/PainPoints";
import CaseStudy from "./sections/CaseStudy";
import Portfolio from "./sections/Portfolio";
import Services from "./sections/Services";
import Pricing from "./sections/Pricing";
import WhatYouGet from "./sections/WhatYouGet";
import Testimonials from "./sections/Testimonials";
import FinalCTA from "./sections/FinalCTA";
import LaserBand from "./fx/LaserBand";
import SectionRouter from "./site/SectionRouter";
import { SITE, TICKER } from "../lib/site";

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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SectionRouter />
      <Hero />
      <Statement />
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
