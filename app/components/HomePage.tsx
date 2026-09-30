import SplitCurtainPreloader from "./motion/SplitCurtainPreloader";
import ScrollExpandMedia from "./motion/ScrollExpansionHero";
import HeroBackdrop from "./fx/HeroBackdrop";
import PainPoints from "./sections/PainPoints";
import CardStoryScroll from "./motion/CardStoryScroll";
import ServiceIncludes from "./sections/ServiceIncludes";
import CircularCardDeck from "./motion/CircularCardDeck";
import Results from "./sections/Results";
import FinalCTA from "./sections/FinalCTA";
import SectionRouter from "./site/SectionRouter";
import { SITE, CLIENT_TESTIMONIALS } from "../lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  url: SITE.domain,
  email: SITE.email,
  telephone: SITE.phone,
  description:
    "A UK marketing agency for trades and home service companies: local SEO, paid advertising, AI receptionists and AI automation agents, backed by websites built to convert.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
  slogan: SITE.tagline,
};

/**
 * Marks the intro as playing before first paint, so the site nav starts
 * hidden behind the curtain instead of flashing over it. Same conditions the
 * preloader uses to decide whether to run at all.
 */
const introFlag = `try{if(location.pathname==="/"&&scrollY<10&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro","playing")}catch(e){}`;

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script dangerouslySetInnerHTML={{ __html: introFlag }} />
      {/* without scripting nothing would ever open the curtain */}
      <noscript>
        <style>{`.sf-overlay{display:none !important}`}</style>
      </noscript>

      <SectionRouter />
      <HeroBackdrop />

      {/* the preloader plays inside the hero's pinned stage and lands its
          image in the hero frame, so the two read as one reveal */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/hero/media-ink-v2.png"
        title="Found. Called. Booked."
        textBlend
        intro={
          <SplitCurtainPreloader
            overlay
            studio="PVA Media"
            numeral="VA"
            logo=""
            menuLabel=""
            cardTitle="PVA Media"
            tags={["Local SEO", "Paid ads", "AI automation"]}
            heroImage="/images/hero/preloader-bg.png"
            footerLeft="Scroll"
            footerRight="Marketing for trades and home services"
          />
        }
      />

      <CardStoryScroll />
      <ServiceIncludes />
      <PainPoints />
      <CircularCardDeck testimonials={CLIENT_TESTIMONIALS} />
      <Results />
      <FinalCTA />
    </>
  );
}
