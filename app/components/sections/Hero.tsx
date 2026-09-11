"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import ParticleField from "../fx/ParticleField";
import Reveal from "../ui/Reveal";

const WIDE = "(min-width: 768px)";
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * One image. The name across the full width in quiet grey, a tall frame of
 * light standing in front of it with a star at its head, three words and a
 * line beneath. Nothing else. The proposition and the buttons live in the
 * section that follows.
 */
export default function Hero() {
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true
  );

  const frame = wide
    ? { x: 0.5 - 0.065, y: 0.2, w: 0.13, h: 0.64, r: 0.02 }
    : { x: 0.5 - 0.2, y: 0.2, w: 0.4, h: 0.58, r: 0.03 };

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)]">
        {/* the light paints over the name, as it does in the reference */}
        <div className="absolute inset-0 z-10" aria-hidden>
          <ParticleField frame={frame} star density={0.5} maxDpr={1.5} />
        </div>

        <div className="relative z-0 flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-3 pb-10 text-center md:min-h-[calc(100dvh-72px)]">
          <Reveal className="w-full">
            <h1
              className="font-display w-full whitespace-nowrap font-bold uppercase"
              style={{
                fontSize: "clamp(44px, 15.2vw, 262px)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: "rgba(242,238,223,0.5)",
              }}
            >
              PVA Media
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p
              className="font-mono mt-7 text-[11px] uppercase tracking-[0.36em] md:mt-9 md:text-[12.5px]"
              style={{ color: "var(--ink-80)" }}
            >
              Websites · Local SEO · AI Receptionist
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="font-em mt-4 text-[22px] md:text-[26px]" style={{ color: "var(--ink)" }}>
              For landscapers.
            </p>
          </Reveal>
        </div>

        <a
          href="/work"
          aria-label="Continue to the page"
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transition-opacity hover:opacity-100"
          style={{ color: "var(--ink)", opacity: 0.55, animation: "hero-bob 2.6s ease-in-out infinite" }}
        >
          <ChevronDown size={22} strokeWidth={1.4} />
        </a>
      </div>
    </section>
  );
}
