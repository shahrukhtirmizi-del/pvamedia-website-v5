"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LogoMark from "../LogoMark";

/**
 * The wordmark assembles once on first load, then hands over to the page.
 *
 * The motion is the reference keynote study's opening beat, math intact: the
 * same seeded per-letter jitter, the same `eOut(clamp(seg(p,.02,.5)*1.5 -
 * j[2]*.5, 0, 1))` arrival curve, the same 1.24 to 1 scale settle, the same
 * chromatic three-way text-shadow separation collapsing as each letter lands,
 * and the mark fading up on `smooth(seg(p,.26,.5))` behind it.
 *
 * Changed for this project: the chromatic fringes are cool blue and platinum
 * rather than the reference's red and green neon, and the beat resolves into
 * the homepage instead of continuing into twenty more.
 */

const WORD = "PVA MEDIA";
const ASSEMBLE_MS = 2100;
const HOLD_MS = 380;
const FADE_MS = 620;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a || 1e-6), 0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** The reference's seeded PRNG, so the jitter is identical every load. */
function rng(s: number) {
  let a = s >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const noopSubscribe = () => () => {};

/** Plays on every full page load. Skipped only when the user has asked the OS for less motion. */
function shouldSkip() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function IntroReveal() {
  // read during render, not from an effect, so a reduced-motion visit never
  // paints the overlay at all
  const skip = useSyncExternalStore(noopSubscribe, shouldSkip, () => false);
  const [finished, setFinished] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (skip) return;

    document.documentElement.setAttribute("data-intro", "playing");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const R = rng(7719);
    const jit = WORD.split("").map(() => [R() * 2 - 1, R() * 2 - 1, R()]);

    let raf = 0;
    let leaveTimer = 0;
    let doneTimer = 0;
    const start = performance.now();

    function frame(now: number) {
      const p = clamp((now - start) / ASSEMBLE_MS, 0, 1);

      const mark = markRef.current;
      if (mark) {
        mark.style.opacity = String(smooth(seg(p, 0.26, 0.5)));
        mark.style.transform = `scale(${lerp(0.55, 1, eOut(seg(p, 0.26, 0.56))).toFixed(3)})`;
      }

      for (let i = 0; i < charRefs.current.length; i++) {
        const node = charRefs.current[i];
        if (!node) continue;
        const j = jit[i];
        const a = eOut(clamp(seg(p, 0.02, 0.5) * 1.5 - j[2] * 0.5, 0, 1));

        node.style.transform = `translate(${(j[0] * 62 * (1 - a)).toFixed(1)}px, ${(
          j[1] * 34 * (1 - a)
        ).toFixed(1)}px) scale(${lerp(1.24, 1, a).toFixed(3)})`;
        node.style.opacity = String(Math.min(1, a * 1.6));

        const sepv = (1 - a) * 11;
        node.style.textShadow =
          sepv > 0.4
            ? `${(-sepv).toFixed(1)}px 0 rgba(122,152,235,0.85),${sepv.toFixed(
                1
              )}px 0 rgba(199,206,220,0.8),0 ${(sepv * 0.55).toFixed(
                1
              )}px rgba(242,238,223,0.7)`
            : "none";
        node.style.filter = sepv > 0.7 ? `blur(${(sepv * 0.3).toFixed(2)}px)` : "none";
      }

      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        leaveTimer = window.setTimeout(() => {
          setLeaving(true);
          doneTimer = window.setTimeout(finish, FADE_MS);
        }, HOLD_MS);
      }
    }

    function finish() {
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-intro");
      setFinished(true);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-intro");
    };
  }, [skip]);

  if (skip || finished) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="intro-root fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{
        background: "var(--bg)",
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          ref={markRef}
          style={{ opacity: 0, color: "var(--accent)" }}
          className="will-change-transform"
        >
          <LogoMark className="h-9 w-9 md:h-11 md:w-11" />
        </div>

        <div
          className="font-display flex"
          style={{
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontSize: "clamp(34px, 8.5vw, 92px)",
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              ref={(node) => {
                charRefs.current[i] = node;
              }}
              className="inline-block will-change-transform"
              style={{ opacity: 0 }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
