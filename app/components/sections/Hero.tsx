"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import ParticleField from "../fx/ParticleField";
import Reveal from "../ui/Reveal";

const NAME = "PVA MEDIA";
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

  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  /* Light catches the letters near the pointer, from anywhere on the page.
     A frame loop eases each letter toward its target brightness, so the glow
     tracks the pointer with no transition lag, and the colour is the site's
     own: a platinum core blooming into cool blue. */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let px = -9999;
    let py = -9999;
    let raf = 0;
    const cur = new Array(letters.current.length).fill(0);
    let idle = 0;

    function onMove(e: PointerEvent) {
      px = e.clientX;
      py = e.clientY;
      idle = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onLeave() {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      let live = false;
      for (let i = 0; i < letters.current.length; i++) {
        const el = letters.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (px - cx) / (r.width * 1.7);
        const dy = (py - cy) / (r.height * 1.1);
        const target = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
        const g = cur[i] + (target - cur[i]) * 0.32;
        cur[i] = Math.abs(g) < 0.002 ? 0 : g;
        if (cur[i] > 0 || target > 0) live = true;

        const v = cur[i];
        const rC = Math.round(244 - 70 * v);
        const gC = 244;
        const bC = Math.round(242 - 30 * v);
        el.style.color = `rgba(${rC},${gC},${bC},${(0.5 + 0.5 * v).toFixed(3)})`;
        el.style.textShadow =
          v > 0.01
            ? `0 0 ${(16 * v).toFixed(1)}px rgba(98, 220, 176,${(0.95 * v).toFixed(3)}), ` +
              `0 0 ${(46 * v).toFixed(1)}px rgba(98, 220, 176,${(0.6 * v).toFixed(3)}), ` +
              `0 0 ${(110 * v).toFixed(1)}px rgba(98, 220, 176,${(0.32 * v).toFixed(3)})`
            : "none";
        el.style.transform = `translateY(${(-5 * v).toFixed(2)}px)`;
      }
      idle++;
      // keep easing while anything is lit or the pointer just moved
      if (live || idle < 2) raf = requestAnimationFrame(tick);
      else raf = 0;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const frame = wide
    ? { x: 0.5 - 0.065, y: 0.2, w: 0.13, h: 0.64, r: 0.02 }
    : { x: 0.5 - 0.2, y: 0.2, w: 0.4, h: 0.58, r: 0.03 };

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)]">
        {/* the light paints over the name, as it does in the reference */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <ParticleField frame={frame} star density={0.5} maxDpr={1.5} />
        </div>

        <div className="relative z-0 flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-3 pb-10 text-center md:min-h-[calc(100dvh-72px)]">
          <Reveal className="w-full">
            <h1
              className="font-display w-full whitespace-nowrap font-bold uppercase"
              aria-label={NAME}
              style={{
                fontSize: "clamp(44px, 15.2vw, 262px)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: "rgba(244, 244, 242,0.55)",
              }}
            >
              {NAME.split("").map((ch, i) => (
                <span
                  key={i}
                  aria-hidden
                  ref={(el) => {
                    letters.current[i] = el;
                  }}
                  className="inline-block will-change-transform"
                >
                  {ch === " " ? "\u00a0" : ch}
                </span>
              ))}
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
