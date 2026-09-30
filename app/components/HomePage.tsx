import SplitCurtainPreloader from "./motion/SplitCurtainPreloader";
import ScrollExpandMedia from "./motion/ScrollExpansionHero";
import Statement from "./sections/Statement";
import Ticker from "./ui/Ticker";
import PainPoints from "./sections/PainPoints";
import CaseStudy from "./sections/CaseStudy";
import Portfolio from "./sections/Portfolio";
import CardStoryScroll from "./motion/CardStoryScroll";
import Pricing from "./sections/Pricing";
import WhatYouGet from "./sections/WhatYouGet";
import Testimonials from "./sections/Testimonials";
import CircularCardDeck from "./motion/CircularCardDeck";
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
    "Web design, local SEO and AI receptionist services built for trades and home service companies across the United States.",
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
      <SplitCurtainPreloader
        studio="PVA Media"
        cardTitle="PVA Media"
        tags={["Websites", "Local SEO", "AI Receptionist"]}
        heroImage="/images/portfolio/t7-hero.jpg"
        footerRight="Websites for trades and home service companies"
      />
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/portfolio/t7-hero.jpg"
        bgImageSrc="/images/mood/paper-sheets-angled.png"
        title="Live in 5 days"
      >
        <p>{SITE.tagline}</p>
      </ScrollExpandMedia>
      <Statement />
      <Ticker items={TICKER} />

      {/* the beams run behind two sections at a time and dissolve at each
          end of the band, so nothing ends on a line. Every other pair. */}
      <LaserBand centerX={0.55} centerY={-0.25} opacity={0.5}>
        <PainPoints />
        <CaseStudy />
      </LaserBand>

      <Portfolio />
      <CardStoryScroll />

      <LaserBand centerX={-0.6} centerY={0.3} opacity={0.42}>
        <Pricing />
        <WhatYouGet />
      </LaserBand>

      <Testimonials />
      <CircularCardDeck />
      <FinalCTA />
    </>
  );
}
