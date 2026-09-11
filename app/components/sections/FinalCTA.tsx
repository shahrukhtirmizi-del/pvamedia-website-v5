import LaserBackground from "../fx/LaserBackground";
import MagneticCTA from "../ui/MagneticCTA";
import Reveal from "../ui/Reveal";
import { SITE } from "../../lib/site";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden">
      {/* the beams converge left of the headline and react to the pointer;
          z-0 keeps them behind everything, including the orb's solid disc */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 22%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 22%)",
        }}
      >
        <LaserBackground centerX={-0.78} centerY={-0.12} opacity={0.85} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1240px] flex-col items-center justify-center px-5 py-28 text-center md:px-8 md:py-36">
        <Reveal>
          <h2
            className="font-display max-w-[15ch] font-semibold"
            style={{ fontSize: "clamp(36px, 6.4vw, 82px)", lineHeight: 1.05 }}
          >
            Ready to see what{"’"}s{" "}
            <span className="font-em" style={{ color: "var(--accent)" }}>
              possible?
            </span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="mx-auto mt-7 max-w-[44ch] text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            Thirty minutes, no pitch. We look at what you rank for now, and what the site would need
            to do to fill next month.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-12">
            <MagneticCTA href="/bookings" label="Book a free call" note="Free 30 minutes. No pitch." />
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div
            className="mt-16 flex flex-col items-center gap-2 text-[15px] sm:flex-row sm:gap-8"
            style={{ color: "var(--ink-60)" }}
          >
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-[color:var(--ink)]">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneHref}`} className="transition-colors hover:text-[color:var(--ink)]">
              {SITE.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
