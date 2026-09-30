"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────
   Settle — a pinned scroll sequence where a single cover card flips over to
   reveal a stack of cards, which then peel away upward one by one with a tilt.

   Driven by one normalised progress value p ∈ [0,1]:
     • [0 .. 0.18]  the deck rises into frame while the headline lifts away
     • [~0.34]      the cover card flips (rotateY 0→180) and the back cards
                    flip in (rotateY -180→0) with a settle tilt
     • [0.52 .. 1]  each back card dismisses upward (reverse order) with a
                    growing tilt, peeling the stack apart

   Zero animation libraries: one rAF loop reads scroll progress on the
   standalone page (a tall wrapper + position:sticky stage), and auto-plays a
   looping timeline inside the gallery card (?card, which can't scroll). All
   transforms are written straight to the DOM.
   ──────────────────────────────────────────────────────────────────────── */

export type SettleStackCard = {
  title: string;
  kicker?: string;
  body: string;
  flipTilt: number; // rotationZ when the stack settles
  dismissTilt: number; // rotationZ at the top of its exit
  bg: string;
  fg: string;
  icon: string; // inline SVG path data drawn in a 24-box
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mapRange = (a: number, b: number, x: number) => clamp01((x - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// a touch of overshoot so the flip lands with a little spring
const easeOutBack = (t: number) => {
  const c = 1.7;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

const FLIP_START = 0.3;
const FLIP_END = 0.46;
const DISMISS_START = 0.52;

export interface SettleStackProps {
  cards: SettleStackCard[];
  headline: string;
  frontTitle?: string;
  frontTag?: string;
  frontBody?: string;
  markLabel?: string;
  metaLabel?: string;
  hintLabel?: string;
}

export default function SettleStack({
  cards,
  headline,
  frontTitle = "First Frame",
  frontTag = "Start here",
  frontBody = "A single moment, held in place before everything begins to move.",
  markLabel = "PVA Media",
  metaLabel,
  hintLabel = "Scroll to settle the stack",
}: SettleStackProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cardMode = new URLSearchParams(window.location.search).has("card");
    const count = cards.length;

    const apply = (p: number) => {
      // 1 — deck rises in, headline lifts away
      const enter = mapRange(0, 0.18, p);
      const deckY = lerp(46, -6, enter);
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translateY(${lerp(0, -120, enter)}%)`;
        headlineRef.current.style.opacity = `${1 - enter}`;
      }

      // 2 — the flip (cover turns away, stack turns in)
      const flip = easeOutBack(mapRange(FLIP_START, FLIP_END, p));
      if (frontRef.current) {
        frontRef.current.style.transform =
          `translate(-50%,calc(-50% + ${deckY}%)) rotateY(${lerp(0, 180, flip)}deg)`;
      }

      // 3 — per-card dismiss, reverse order (last revealed leaves first)
      const dismissWindow = (1 - DISMISS_START) / count;
      cards.forEach((c, i) => {
        const el = backRefs.current[i];
        if (!el) return;
        const order = count - 1 - i;
        const dStart = DISMISS_START + order * dismissWindow;
        const dismiss = smooth(mapRange(dStart, dStart + dismissWindow, p));
        const ry = lerp(-180, 0, flip);
        const y = deckY + lerp(0, -240, dismiss);
        const rz = lerp(c.flipTilt * clamp01(flip), c.dismissTilt, dismiss);
        el.style.transform =
          `translate(-50%,calc(-50% + ${y}%)) rotateY(${ry}deg) rotateZ(${rz}deg)`;
        el.style.opacity = `${1 - dismiss * dismiss}`;
      });
    };

    let raf = 0;

    if (reduced) {
      apply(0.5); // settled, stack revealed, nothing peeled
      return;
    }

    if (cardMode) {
      // auto-play a looping timeline (the card iframe can't scroll)
      let t = 0;
      const DURATION = 4200; // ms for a full 0→1 sweep
      const HOLD = 700; // ms paused at the end before looping
      let start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed < DURATION) t = elapsed / DURATION;
        else if (elapsed < DURATION + HOLD) t = 1;
        else {
          start = now;
          t = 0;
        }
        apply(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      const tick = () => {
        const rect = pin.getBoundingClientRect();
        const span = pin.offsetHeight - window.innerHeight;
        const p = clamp01(span > 0 ? -rect.top / span : 0);
        apply(p);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(raf);
  }, [cards]);

  return (
    <div className="st-root" ref={wrapRef}>
      <style>{css}</style>

      <div className="st-track" ref={pinRef}>
        <section className="st-stage">
          <div className="st-headline" ref={headlineRef}>
            <h1>{headline}</h1>
          </div>

          <header className="st-chrome st-top">
            <span className="st-mark">{markLabel}</span>
            {metaLabel && <span className="st-meta">{metaLabel}</span>}
          </header>

          <div className="st-deck">
            {/* cover card */}
            <div className="st-card st-front" ref={frontRef}>
              <h3>{frontTitle}</h3>
              <span className="st-tag">{frontTag}</span>
              <p>{frontBody}</p>
              <div className="st-icon st-icon--ring">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M8 10l4 4 4-4" />
                </svg>
              </div>
            </div>

            {/* revealed stack */}
            {cards.map((c, i) => (
              <div
                key={i}
                className="st-card st-back"
                ref={(el) => {
                  backRefs.current[i] = el;
                }}
                style={{ background: c.bg, color: c.fg, zIndex: 10 + i }}
              >
                {c.kicker && <span className="st-tag">{c.kicker}</span>}
                <h3>{c.title}</h3>
                <div
                  className="st-icon"
                  style={{ background: c.fg, color: c.bg }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={c.icon} />
                  </svg>
                </div>
                <p>{c.body}</p>
              </div>
            ))}
          </div>

          <footer className="st-chrome st-bottom">
            <span className="st-hint">{hintLabel}</span>
            <span className="st-meta">{String(cards.length).padStart(2, "0")} cards</span>
          </footer>
        </section>
      </div>
    </div>
  );
}

const css = `
  .st-root{position:relative;width:100%;background:#ffffff;
    font-family:var(--font-sans, "Inter", "Helvetica Neue", Arial, sans-serif);}

  /* tall scroll track; the sticky stage stays pinned while you scroll it */
  .st-track{position:relative;width:100%;height:420svh;}

  .st-stage{position:sticky;top:0;width:100%;height:100svh;overflow:hidden;
    background:#ffffff;
    color:#000000;perspective:1200px;}

  .st-headline{position:absolute;inset:0;display:flex;align-items:center;
    justify-content:center;will-change:transform,opacity;z-index:2;}
  .st-headline h1{width:62%;text-align:center;margin:0;text-transform:uppercase;
    font-weight:900;line-height:.85;
    font-size:clamp(2.6rem,5vw,6.4rem);letter-spacing:-0.02em;}

  .st-deck{position:absolute;inset:0;transform-style:preserve-3d;z-index:3;}

  .st-card{position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:25%;min-width:300px;aspect-ratio:4/5;padding:3.4rem 2rem;
    border-radius:0.5rem;display:flex;flex-direction:column;
    justify-content:space-between;align-items:center;text-align:center;
    backface-visibility:hidden;will-change:transform,opacity;
    box-shadow:0 30px 60px -28px rgba(0,0,0,.35);}

  .st-front{background:#000000;color:#ffffff;}
  .st-back{transform:translate(-50%,-50%) rotateY(-180deg);}

  .st-card h3{margin:0;text-transform:uppercase;
    font-weight:900;line-height:.9;font-size:clamp(1.4rem,2.2vw,2.2rem);}
  .st-card p{margin:0;font-size:1rem;font-weight:450;line-height:1.2;}
  .st-tag{text-transform:uppercase;font-size:.72rem;font-weight:700;
    letter-spacing:.08em;padding:.4rem .65rem;border-radius:.3rem;
    background:#ffffff;color:#000000;}

  .st-icon{width:4.4rem;height:4.4rem;border-radius:50%;display:flex;
    align-items:center;justify-content:center;}
  .st-icon svg{width:1.7rem;height:1.7rem;fill:none;stroke:currentColor;
    stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}
  .st-icon--ring{border:.14rem solid currentColor;background:transparent;}

  .st-chrome{position:absolute;left:0;right:0;z-index:6;display:flex;
    align-items:center;justify-content:space-between;
    padding:0 clamp(1.4rem,4vw,3rem);pointer-events:none;
    mix-blend-mode:difference;color:#ffffff;}
  .st-top{top:clamp(1.4rem,4vh,2.4rem);}
  .st-bottom{bottom:clamp(1.4rem,4vh,2.4rem);}
  .st-mark{font-weight:900;font-size:15px;}
  .st-meta,.st-hint{font-size:11px;font-weight:600;letter-spacing:.18em;
    text-transform:uppercase;}
  .st-hint::before{content:"";display:inline-block;width:22px;height:1px;
    background:currentColor;margin-right:10px;vertical-align:middle;}

  @media (max-width:1000px){
    .st-headline h1{width:86%;}
    .st-card{width:70%;min-width:0;}
  }
`;
