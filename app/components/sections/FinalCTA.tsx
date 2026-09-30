import MagneticCTA from "../ui/MagneticCTA";
import Reveal from "../ui/Reveal";
import { SITE } from "../../lib/site";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative">
      {/* no background of its own: the ink field that runs behind the whole
          site carries on through the closing section */}
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1240px] flex-col items-center justify-center px-5 py-28 text-center md:px-8 md:py-36">
        <Reveal>
          <h2
            className="font-serif-display max-w-[14ch]"
            style={{ fontSize: "clamp(40px, 6.4vw, 92px)", lineHeight: 1.02 }}
          >
            Ready to see what{"’"}s possible?
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="mx-auto mt-7 max-w-[44ch] text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            Thirty minutes with a trades marketing specialist, no pitch. We look at where your
            enquiries come from now, and what it would take to fill next month.
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
