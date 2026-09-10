import Link from "next/link";
import ParticleField from "../fx/ParticleField";
import CountUp from "../ui/CountUp";
import Reveal from "../ui/Reveal";
import { HERO_STATS } from "../../lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* atmosphere sits behind everything and takes no pointer events */}
      <div className="absolute inset-0" aria-hidden>
        <ParticleField />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1240px] flex-col justify-center px-5 pb-16 pt-16 md:px-8 md:pb-20 md:pt-20">
        {/* the lit frame, offset right of the headline rather than centred */}
        <div
          aria-hidden
          className="frame-glow pointer-events-none absolute hidden md:block"
          style={{
            borderRadius: "var(--radius-card)",
            top: "13%",
            right: "4%",
            width: "min(400px, 28vw)",
            height: "72%",
          }}
        />
        <Reveal>
          <p
            className="font-mono mb-7 text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ink-45)" }}
          >
            Built only for landscapers
          </p>
        </Reveal>

        <Reveal delay={90}>
          <h1
            className="font-display max-w-[16ch] font-semibold"
            style={{ fontSize: "clamp(42px, 8.2vw, 100px)", lineHeight: 1.03 }}
          >
            Websites
            <br />
            That Book
            <br />
            the{" "}
            <span className="font-em" style={{ color: "var(--accent)" }}>
              jobs.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p
            className="mt-8 max-w-[46ch] text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            Custom websites and local SEO built specifically to turn searches into 12 booked jobs a
            month.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/bookings" className="btn btn-primary">
              Book a free call
            </Link>
            <Link href="#work" className="btn btn-secondary">
              See the work
            </Link>
          </div>
        </Reveal>
      </div>

      {/* the numbers get their own band, so the hero itself stays one moment */}
      <div className="relative border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto grid max-w-[1240px] gap-px px-5 md:grid-cols-3 md:px-8">
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
      </div>
    </section>
  );
}
