"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Reveal from "../ui/Reveal";
import HandWrittenTitle from "../motion/HandWrittenTitle";
import { PAIN_POINTS, PAIN_CLOSER } from "../../lib/site";

/**
 * Sticky stacking cards, adapted from the client-supplied reference. Each
 * pain point is a full-width card that pins below the nav; the next one
 * slides up over it while the ones underneath ease back (a slight scale and
 * lift), so the stack reads as pages being laid on top of each other.
 *
 * Changes from the reference, needed to drop it into this site:
 *  - Its :root variables and html/body/#root rules are gone; the layout
 *    variables live on the section and the progress maths reads them from
 *    there, so nothing leaks into the rest of the page.
 *  - Colours are monochrome greys and type uses the site's own fonts.
 *  - The sticky offset clears the fixed nav, and the reference's 6–8px
 *    mobile type (unreadable on a phone) is raised to legible sizes.
 */

/** One shade per card, darkest first, with the muted tone for line two. */
const SHADES = [
  { color: "#0A0A0A", muted: "#8A8A8A" },
  { color: "#141414", muted: "#969696" },
  { color: "#1E1E1E", muted: "#A0A0A0" },
  { color: "#282828", muted: "#AAAAAA" },
  { color: "#323232", muted: "#B2B2B2" },
  { color: "#3C3C3C", muted: "#BABABA" },
];

const CARDS = PAIN_POINTS.map((point, index) => ({
  ...point,
  ...SHADES[index % SHADES.length],
}));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type CardStyle = CSSProperties & {
  "--card-color": string;
  "--muted": string;
};

export default function PainPoints() {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const stack = stackRef.current;
      if (!stack) return;

      const rect = stack.getBoundingClientRect();
      const pageTop = rect.top + window.scrollY;
      const vars = getComputedStyle(stack);
      const stickyTop = parseFloat(vars.getPropertyValue("--sticky-top")) || 96;
      const step = parseFloat(vars.getPropertyValue("--stack-step")) || 400;
      const next = (window.scrollY - (pageTop - stickyTop)) / step;

      // written straight to each card, so scrolling never re-renders React
      const progress = clamp(next, 0, CARDS.length - 0.1);
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const depth = clamp(progress - index, 0, 3);
        card.style.setProperty("--card-scale", `${1 - depth * 0.022}`);
        card.style.setProperty("--depth", `${depth}`);
      });
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="ps-section" aria-label="What holds trades businesses back">
      <style>{CSS}</style>

      <div className="ps-head">
        <Reveal>
          <h2 className="font-display ps-headline">
            Most trades businesses don{"’"}t have a work problem. They have a marketing problem.
          </h2>
        </Reveal>
      </div>

      <div className="ps-stack" ref={stackRef}>
        {CARDS.map((card, index) => {
          const style: CardStyle = {
            "--card-color": card.color,
            "--muted": card.muted,
            zIndex: 10 + index,
          };

          return (
            <article
              className="ps-card"
              key={card.title}
              style={style}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <div className="ps-top">
                <h3 className="ps-title">
                  <span>{card.titleLines[0]}</span>
                  <span>{card.titleLines[1]}</span>
                </h3>
                <span className="ps-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="ps-bottom">
                <ul className="ps-tags" aria-label="Where it shows up">
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <div className="ps-description">
                  <span className="ps-spark" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M2 8h11M9 4l4 4-4 4" />
                    </svg>
                  </span>
                  <p>{card.body}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="ps-closer">
        <HandWrittenTitle
          eyebrow="The fix"
          title={PAIN_CLOSER}
          subtitle="We specialise in search, ads, follow-up and booking for trades, and run them as one joined-up system instead of five tools that never talk to each other."
        />
      </div>
    </section>
  );
}

const CSS = `
  .ps-section, .ps-section * { box-sizing: border-box; }

  .ps-section {
    --gutter: clamp(16px, 4.65vw, 30px);
    position: relative;
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
    padding: clamp(80px, 11vw, 140px) 0 0;
  }

  .ps-head {
    padding: 0 var(--gutter) clamp(36px, 5vw, 64px);
  }
  .ps-headline {
    margin: 0;
    max-width: 20ch;
    font-size: clamp(32px, 4.8vw, 64px);
    line-height: 1.04;
    font-weight: 700;
  }

  /* layout variables live here, not on :root, and the scroll maths reads
     them from this element */
  .ps-stack {
    --sticky-top: 84px;
    --stack-step: 340px;
    --card-height: 300px;
    --peek-lift: 12px;
    position: relative;
    padding: 0 var(--gutter) 18px;
  }

  .ps-card {
    position: sticky;
    top: var(--sticky-top);
    width: 100%;
    height: var(--card-height);
    margin-bottom: 40px;
    padding: 26px 22px 20px;
    overflow: hidden;
    border-radius: 18px;
    background: var(--card-color);
    color: #FFFFFF;
    transform-origin: 50% 0%;
    transform: translateY(calc(var(--depth, 0) * var(--peek-lift) * -1)) scale(var(--card-scale, 1));
    will-change: transform;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.04), 0 -18px 40px -24px rgba(0,0,0,.45);
  }

  .ps-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .ps-title {
    display: flex;
    flex-direction: column;
    margin: 0;
    font-family: var(--font-display), var(--font-sans), sans-serif;
    font-size: 34px;
    line-height: .95;
    font-weight: 500;
    letter-spacing: -.045em;
  }
  .ps-title span:last-child { color: var(--muted); }

  .ps-index {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .2em;
    color: rgba(255,255,255,.45);
    padding-top: 6px;
  }

  .ps-bottom {
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 20px;
  }

  .ps-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
    color: rgba(255,255,255,.72);
  }
  .ps-tags li {
    font-size: 10px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .ps-description {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr);
    gap: 8px;
    align-items: start;
  }
  /* a thin arrow leading into the line, sized and centred on its first row */
  .ps-spark {
    display: flex;
    align-items: center;
    height: 1.4em;
    font-size: 14px;
    color: rgba(255,255,255,.85);
  }
  .ps-spark svg {
    width: 1em;
    height: 1em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .ps-description p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -.01em;
    color: rgba(255,255,255,.92);
  }

  .ps-closer {
    padding: clamp(56px, 8vw, 120px) clamp(0px, 2vw, 24px) clamp(64px, 9vw, 130px);
  }

  @media (min-width: 850px) {
    .ps-section { --gutter: 4.65vw; }

    .ps-stack {
      --sticky-top: 96px;
      --card-height: clamp(360px, 39.4vw, 544px);
      --stack-step: clamp(400px, 44.4vw, 612px);
      --peek-lift: 20px;
    }

    .ps-card {
      border-radius: clamp(18px, 2.6vw, 36px);
      padding: 4vw 3.9vw 3.1vw;
      margin-bottom: 5.3vw;
    }

    .ps-title { font-size: clamp(42px, 5.75vw, 78px); }
    .ps-index { font-size: 12px; }

    .ps-bottom {
      left: 3.9vw;
      right: 3.9vw;
      bottom: 3.1vw;
    }

    .ps-tags {
      gap: 8px 4.8vw;
      margin-bottom: 2.4vw;
    }
    .ps-tags li { font-size: clamp(10px, .96vw, 13px); }

    .ps-description {
      grid-template-columns: 2vw 1fr;
      gap: .9vw;
    }
    .ps-spark { font-size: clamp(15px, 1.4vw, 20px); }
    .ps-description p {
      max-width: 62%;
      font-size: clamp(15px, 1.4vw, 20px);
    }
  }

  @media (max-width: 520px) {
    .ps-stack {
      --sticky-top: 80px;
      --card-height: 320px;
      --stack-step: 360px;
    }
    .ps-title { font-size: 30px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ps-card { transform: none !important; }
  }
`;
