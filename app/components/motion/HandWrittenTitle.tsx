"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated hand-drawn title reveal, adapted from the client-supplied
 * reference: a loose pen loop draws itself around a statement as it scrolls
 * into view, then the words settle in underneath it.
 *
 * Changes from the reference, needed to use it as a section of this site:
 *  - Its global html/body/h1 rules and demo "Replay" button are gone; styles
 *    are scoped under .hw-* and use the site's tokens and fonts.
 *  - It plays when scrolled into view (once), not on page load.
 *  - The reference scaled a fixed 1200x600 drawing, which stretches the loop
 *    and its stroke on a tall phone card. Here the same loop is re-plotted
 *    from the card's measured size, so it wraps the text evenly at any width
 *    and the line keeps one weight.
 */

interface HandWrittenTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

// the reference loop, as fractions of its 1200x600 drawing
const LOOP: [number, number][][] = [
  [[950, 90]],
  [[1250, 300], [1050, 480], [600, 520]],
  [[250, 520], [150, 480], [150, 300]],
  [[150, 120], [350, 80], [600, 80]],
  [[850, 80], [950, 180], [950, 180]],
];

function loopPath(w: number, h: number) {
  const sx = w / 1200;
  const sy = h / 600;
  const p = ([x, y]: [number, number]) => `${(x * sx).toFixed(1)} ${(y * sy).toFixed(1)}`;
  const [start, ...curves] = LOOP;
  return `M ${p(start[0])} ` + curves.map((c) => `C ${c.map(p).join(", ")}`).join(" ");
}

export default function HandWrittenTitle({ title, subtitle, eyebrow }: HandWrittenTitleProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1100, h: 620 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const measure = () => setSize({ w: card.clientWidth, h: card.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  // On a tall phone card the loop is plotted a little wider than the card
  // (its far edge is clipped) so its flanks clear the text instead of
  // curling in over it.
  const narrow = size.w < 640;
  const insetX = narrow ? -size.w * 0.05 : Math.min(size.w, size.h) * 0.04;
  const insetY = Math.min(size.w, size.h) * (narrow ? 0.08 : 0.04);
  const drawW = size.w - insetX * 2;
  const drawH = size.h - insetY * 2;

  // One trigger for the whole reveal: the card entering view. (Letting each
  // piece watch its own visibility failed on phones, where the drawing is
  // wider than it is visible and never crossed its threshold.)
  const [inView, setInView] = useState(false);
  const shown = reduced || inView;
  const state = shown ? "visible" : "hidden";

  return (
    <div className="hw-wrapper">
      <style>{CSS}</style>
      <div className="hw-ambient hw-ambient-one" aria-hidden />
      <div className="hw-ambient hw-ambient-two" aria-hidden />

      <motion.div
        ref={cardRef}
        className="hw-card"
        initial={reduced ? false : { opacity: 0, scale: 0.97 }}
        animate={shown ? { opacity: 1, scale: 1 } : undefined}
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="hw-grain" aria-hidden />

        {/* sized by a plain wrapper: the drawing is re-plotted in pixels to
            the card's measured size */}
        <div className="hw-line" style={{ left: insetX, top: insetY, width: drawW, height: drawH }} aria-hidden>
        <motion.svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${Math.max(1, drawW)} ${Math.max(1, drawH)}`}
          initial={reduced ? "visible" : "hidden"}
          animate={state}
          style={{ overflow: "visible", display: "block" }}
        >
          <motion.path
            d={loopPath(drawW, drawH)}
            fill="none"
            stroke="currentColor"
            strokeWidth={Math.max(3, Math.min(7, size.w / 170))}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration: 2.6, ease: [0.43, 0.13, 0.23, 0.96] },
                  opacity: { duration: 0.4 },
                },
              },
            }}
          />
        </motion.svg>
        </div>

        <div className="hw-content">
          {eyebrow && (
            <motion.span
              className="hw-eyebrow"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={shown ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              {eyebrow}
            </motion.span>
          )}

          <motion.h2
            className="font-serif-display hw-title"
            initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={shown ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              className="hw-subtitle"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={shown ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const CSS = `
  .hw-wrapper, .hw-wrapper * { box-sizing: border-box; }

  .hw-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 3vw, 32px);
    isolation: isolate;
  }

  .hw-ambient {
    position: absolute;
    border-radius: 999px;
    filter: blur(80px);
    pointer-events: none;
    opacity: 0.7;
    z-index: -1;
  }
  .hw-ambient-one { width: 320px; height: 320px; top: -60px; left: -40px; background: rgba(255,255,255,.95); }
  .hw-ambient-two { width: 420px; height: 420px; right: -120px; bottom: -140px; background: rgba(10,10,10,.06); }

  .hw-card {
    position: relative;
    width: min(1100px, 100%);
    min-height: clamp(540px, 54vw, 740px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    isolation: isolate;
    border: 1px solid var(--line);
    border-radius: clamp(24px, 3vw, 36px);
    background: linear-gradient(135deg, rgba(255,255,255,.94), rgba(244,244,242,.86));
    box-shadow: 0 40px 100px rgba(10,10,10,.1), inset 0 1px 0 rgba(255,255,255,.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .hw-grain {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: .2;
    background-image: repeating-linear-gradient(0deg, rgba(10,10,10,.025) 0, rgba(10,10,10,.025) 1px, transparent 1px, transparent 4px);
    mix-blend-mode: multiply;
  }

  .hw-line {
    position: absolute;
    color: var(--ink);
    opacity: .9;
    pointer-events: none;
    overflow: visible;
  }

  .hw-content {
    position: relative;
    z-index: 2;
    width: min(720px, 62%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hw-eyebrow {
    display: inline-flex;
    margin-bottom: 22px;
    padding: 9px 14px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    color: var(--ink-60);
    background: rgba(255,255,255,.5);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .2em;
    text-transform: uppercase;
  }

  .hw-title {
    max-width: 22ch;
    margin: 0;
    color: var(--ink);
    font-size: clamp(1.9rem, 3.7vw, 3.5rem);
    line-height: 1.08;
    text-wrap: balance;
  }

  .hw-subtitle {
    max-width: 44ch;
    margin: 26px 0 0;
    color: var(--ink-60);
    font-size: clamp(.98rem, 1.5vw, 1.12rem);
    line-height: 1.65;
  }

  /* phones: the loop is tall and narrow here, so the text sits in its
     middle rather than across its edges */
  @media (max-width: 640px) {
    .hw-card { min-height: 580px; }
    .hw-content { width: 60%; }
    .hw-title { font-size: clamp(1.4rem, 6.4vw, 1.75rem); line-height: 1.12; }
    /* the supporting line would sit on the loop's lower curve here */
    .hw-subtitle { display: none; }
    .hw-eyebrow { margin-bottom: 14px; padding: 7px 11px; font-size: 9px; }
  }
`;
