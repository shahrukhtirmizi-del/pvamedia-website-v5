"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import ParticleField from "../fx/ParticleField";
import CountUp from "../ui/CountUp";
import Reveal from "../ui/Reveal";
import { HERO_STATS } from "../../lib/site";

const WIDE = "(min-width: 768px)";
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Centred composition: a tall frame drawn out of particles with a breathing
 * star at its head, the headline running across it, the eyebrow above and the
 * proposition and calls to action below. The frame is light, not a box.
 */
export default function Hero() {
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true
  );

  const frame = wide
    ? { x: 0.5 - 0.085, y: 0.13, w: 0.17, h: 0.66, r: 0.06 }
    : { x: 0.5 - 0.26, y: 0.16, w: 0.52, h: 0.6, r: 0.06 };

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[100dvh]">
        {/* the particles paint over the headline, as the frame does in the reference */}
        <div className="absolute inset-0 z-10" aria-hidden>
          <ParticleField frame={frame} star density={0.45} maxDpr={1.5} />
        </div>

        <div className="relative z-0 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col items-center justify-between px-5 pb-[7vh] pt-[9vh] text-center md:px-8">
          <Reveal>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.24em]"
              style={{ color: "var(--ink-45)" }}
            >
              Built only for landscapers
            </p>
          </Reveal>

          <Reveal delay={120} className="w-full">
            <h1 className="font-display font-semibold" style={{ lineHeight: 0.98 }}>
              <span
                className="block uppercase"
                style={{
                  fontSize: "clamp(38px, 8.4vw, 132px)",
                  letterSpacing: "-0.035em",
                  color: "rgba(242,238,223,0.86)",
                }}
              >
                Websites that book
              </span>
              <span
                className="font-em block"
                style={{
                  fontSize: "clamp(44px, 8.6vw, 136px)",
                  color: "var(--accent)",
                  marginTop: "0.04em",
                }}
              >
                the jobs.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <div className="flex flex-col items-center">
              <p
                className="max-w-[44ch] text-[15px] leading-relaxed md:text-[17px]"
                style={{ color: "var(--ink-60)" }}
              >
                Custom websites and local SEO built specifically to turn searches into 12 booked
                jobs a month.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/bookings" className="btn btn-primary">
                  Book a free call
                </Link>
                <Link href="#work" className="btn btn-secondary">
                  See the work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
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
