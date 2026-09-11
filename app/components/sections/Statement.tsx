import Link from "next/link";
import CountUp from "../ui/CountUp";
import Reveal from "../ui/Reveal";
import { HERO_STATS } from "../../lib/site";

/**
 * The proposition, straight after the hero: the headline, one line under
 * it, the two buttons, then the three numbers.
 */
export default function Statement() {
  return (
    <section className="relative border-t" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-[1240px] px-5 pb-6 pt-24 md:px-8 md:pt-36">
        <Reveal>
          <h2
            className="font-display max-w-[14ch] font-semibold"
            style={{ fontSize: "clamp(40px, 7.2vw, 96px)", lineHeight: 1.02 }}
          >
            Websites that book the{" "}
            <span className="font-em" style={{ color: "var(--accent)" }}>
              jobs.
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <Reveal delay={100}>
            <p
              className="max-w-[46ch] text-[16px] leading-relaxed md:text-[18px]"
              style={{ color: "var(--ink-60)" }}
            >
              Custom websites and local SEO built specifically to turn searches into 12 booked
              jobs a month.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Link href="/bookings" className="btn btn-primary">
                Book a free call
              </Link>
              <Link href="/work" className="btn btn-secondary">
                See the work
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1240px] gap-px border-t px-5 md:mt-24 md:grid-cols-3 md:px-8" style={{ borderColor: "var(--line)" }}>
        {HERO_STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90}>
            <div className="py-8 md:py-11 md:pr-10">
              <div
                className="font-display font-semibold"
                style={{ fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1, color: "var(--ink)" }}
              >
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="font-mono mt-3 text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "var(--ink-45)" }}
              >
                {stat.label}
              </div>
              {i === 2 && (
                <p className="mt-2 text-[14px]" style={{ color: "var(--ink-60)" }}>
                  Money back if it fails.
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
