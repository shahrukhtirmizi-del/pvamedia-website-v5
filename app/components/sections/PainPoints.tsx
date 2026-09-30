"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Reveal from "../ui/Reveal";
import ScrollWords from "../ui/ScrollWords";
import { PAIN_POINTS, PAIN_CLOSER } from "../../lib/site";

/**
 * Full-Screen Cinematic Image Accordion, adapted from the client-supplied
 * reference component. Two structural changes from that reference, both
 * required to drop it into this site rather than run it as its own page:
 *
 *  - It was hardcoded for exactly 4 panels (25% idle / 4.7% closed / 85.9%
 *    active). PAIN_POINTS has 6 entries, so the widths below are recomputed
 *    from PANELS.length instead of hardcoded.
 *  - The reference set `:root` variables and `html, body { overflow: hidden }`
 *    directly, and pulled in its own Google Fonts import — demo-page globals
 *    that would leak into the rest of the site. Everything here is scoped
 *    under .pp-accordion and uses the site's own theme tokens and fonts.
 *
 * The reference also drives its own custom art-cursor (a circular image
 * preview that follows the pointer) and hides the system cursor over the
 * section. This site already replaces the system cursor everywhere with its
 * own dot+ring (Cursor.tsx). Rather than run both at once, this component
 * only tracks the pointer while it's actually over the section (the
 * reference tracked it via `window`, which would have shown its art-cursor
 * on every page, not just here) and hides Cursor.tsx's dot+ring for as long
 * as the pointer stays inside, via a `data-hide-site-cursor` attribute on
 * `<html>` rather than a global stylesheet change.
 */

const IMAGES = [
  "/images/pain-points/01-cant-find-you.png",
  "/images/pain-points/02-referrals-drying-up.png",
  "/images/pain-points/03-feast-or-famine.png",
  "/images/pain-points/04-ad-spend-disappears.png",
  "/images/pain-points/05-enquiries-go-cold.png",
  "/images/pain-points/06-leave-without-calling.png",
];

const PANELS = PAIN_POINTS.map((point, index) => ({ ...point, image: IMAGES[index] }));
const COUNT = PANELS.length;

// Idle (nothing hovered): panels split the row evenly.
const IDLE_WIDTH = (100 / COUNT).toFixed(4);
// Hovered: every other panel collapses to CLOSED_WIDTH, the active one takes
// the rest — (COUNT - 1) closed panels + 1 active panel must sum to 100.
const CLOSED_WIDTH = 3;
const ACTIVE_WIDTH = 100 - CLOSED_WIDTH * (COUNT - 1);

const CSS = `
  .pp-accordion, .pp-accordion * { box-sizing: border-box; }

  .pp-accordion {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
    isolation: isolate;
    background: var(--bg);
    color: var(--ink);
  }

  @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .pp-accordion { cursor: none; }
  }

  .pp-masthead {
    position: absolute;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    padding: clamp(24px, 4vw, 56px);
  }

  .pp-eyebrow {
    margin: 0;
    font-family: var(--font-sans), sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-45);
    transition: color 420ms ease;
  }

  .pp-accordion.is-open .pp-eyebrow { color: rgba(255, 255, 255, 0.7); }

  .pp-headline {
    margin: 14px 0 0;
    max-width: 20ch;
    font-family: var(--font-display), var(--font-sans), sans-serif;
    font-weight: 600;
    font-size: clamp(24px, 3.4vw, 44px);
    line-height: 1.1;
    transition: color 420ms ease;
  }

  .pp-accordion.is-open .pp-headline { color: #fff; }

  .pp-row {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .pp-panel {
    position: relative;
    width: ${IDLE_WIDTH}%;
    height: 100%;
    min-width: 0;
    overflow: hidden;
    border-left: 1px solid var(--line);
    outline: none;
    background: var(--bg);
    transition: width 760ms cubic-bezier(0.77, 0, 0.175, 1);
    will-change: width;
  }

  .pp-panel:first-child { border-left: 0; }

  .pp-accordion.is-open .pp-panel { width: ${CLOSED_WIDTH}%; }
  .pp-accordion.is-open .pp-panel.is-active { width: ${ACTIVE_WIDTH}%; }

  .pp-panel-image {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
    opacity: 0;
    transform: scale(1.06);
    filter: grayscale(1) contrast(1.05);
    transition: opacity 340ms ease, transform 1400ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .pp-panel.is-active .pp-panel-image { opacity: 1; transform: scale(1); }

  .pp-panel-shade {
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(180deg, rgba(10, 10, 10, 0.08) 0%, rgba(10, 10, 10, 0.18) 45%, rgba(10, 10, 10, 0.74) 100%);
    transition: opacity 420ms ease;
  }

  .pp-panel.is-active .pp-panel-shade { opacity: 1; }

  .pp-panel h3 {
    position: absolute;
    left: clamp(14px, 2.2vw, 32px);
    right: clamp(14px, 2.2vw, 32px);
    bottom: clamp(16px, 2.6vw, 40px);
    margin: 0;
    font-family: var(--font-display), var(--font-sans), sans-serif;
    font-weight: 600;
    font-size: clamp(11px, 0.95vw, 15px);
    line-height: 1.08;
    letter-spacing: -0.01em;
    color: var(--ink);
    transition: color 260ms ease, opacity 220ms ease, font-size 620ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .pp-accordion.is-open .pp-panel:not(.is-active) h3 { opacity: 0; }

  .pp-panel.is-active h3 {
    color: #fff;
    font-size: clamp(19px, 2.3vw, 36px);
  }

  .pp-panel-body {
    position: absolute;
    right: clamp(18px, 3.6vw, 60px);
    bottom: clamp(22px, 2.8vw, 44px);
    width: min(30vw, 400px);
    margin: 0;
    color: #fff;
    font-family: var(--font-sans), sans-serif;
    font-size: clamp(12px, 0.82vw, 14px);
    line-height: 1.45;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 300ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .pp-panel.is-active .pp-panel-body { opacity: 0.92; transform: translateY(0); transition-delay: 340ms; }

  .pp-panel-index {
    position: absolute;
    right: clamp(14px, 2.2vw, 32px);
    bottom: clamp(14px, 2.2vw, 32px);
    display: flex;
    gap: 3px;
    color: #fff;
    font-family: var(--font-sans), sans-serif;
    font-size: 10px;
    letter-spacing: 0.06em;
    opacity: 0;
    transition: opacity 300ms ease 400ms;
  }

  .pp-panel.is-active .pp-panel-index { opacity: 0.75; }

  .pp-art-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 0;
    height: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 160ms ease;
    will-change: transform;
  }

  .pp-art-cursor.is-visible { opacity: 1; }

  .pp-cursor-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    background: #fff;
    mix-blend-mode: difference;
    transition: opacity 200ms ease, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .pp-art-cursor.is-preview .pp-cursor-dot { opacity: 0; transform: scale(0.2); }

  .pp-cursor-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: clamp(72px, 8vw, 120px);
    aspect-ratio: 1;
    border: 2px solid rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    filter: grayscale(1);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.15);
    transition: opacity 160ms ease, transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .pp-art-cursor.is-preview .pp-cursor-preview { opacity: 1; transform: translate(-50%, -50%) scale(1); }

  .pp-close {
    position: absolute;
    z-index: 30;
    top: 14px;
    right: 14px;
    display: none;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 999px;
    padding: 7px 12px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    font-family: var(--font-sans), sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @media (max-width: 760px), (hover: none) {
    .pp-accordion { cursor: auto; }
    .pp-art-cursor { display: none; }

    .pp-row {
      flex-direction: column;
      padding-top: 84px;
    }

    .pp-panel,
    .pp-accordion.is-open .pp-panel {
      width: 100%;
      height: ${IDLE_WIDTH}%;
      border-top: 1px solid var(--line);
      border-left: 0;
      transition: height 680ms cubic-bezier(0.77, 0, 0.175, 1);
    }

    .pp-accordion.is-open .pp-panel { height: ${CLOSED_WIDTH}%; }
    .pp-accordion.is-open .pp-panel.is-active { width: 100%; height: ${ACTIVE_WIDTH}%; }

    .pp-panel h3 { font-size: 13px; bottom: 12px; }
    .pp-panel.is-active h3 { font-size: 22px; }
    .pp-panel-body { right: 18px; bottom: 22px; width: 56vw; font-size: 11px; }
    .pp-panel-index { display: none; }
    .pp-accordion.is-open .pp-close { display: block; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pp-panel, .pp-panel-image, .pp-panel-shade, .pp-panel h3, .pp-panel-body, .pp-panel-index {
      transition-duration: 0.001ms !important;
    }
  }
`;

export default function PainPoints() {
  const [active, setActive] = useState<number | null>(null);
  const [cursorReady, setCursorReady] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);

  // Pointer tracking + the cursor-follow loop live in one effect, scoped to
  // this section's own element (not `window`) — the reference tracked the
  // pointer globally, which would have shown its art-cursor on every page,
  // not just here.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pointer = { x: -120, y: -120 };
    const rendered = { x: -120, y: -120 };
    let frame: number | null = null;

    function animateCursor() {
      const dx = pointer.x - rendered.x;
      const dy = pointer.y - rendered.y;
      rendered.x += dx * 0.22;
      rendered.y += dy * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${rendered.x}px, ${rendered.y}px, 0)`;
      }
      if (Math.abs(dx) + Math.abs(dy) > 0.08) {
        frame = requestAnimationFrame(animateCursor);
      } else {
        frame = null;
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      if (rendered.x < 0) {
        rendered.x = event.clientX;
        rendered.y = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setHasPointer(true);
      if (frame === null) frame = requestAnimationFrame(animateCursor);
    }

    function onPointerLeave() {
      setHasPointer(false);
      setActive(null);
      setCursorReady(false);
    }

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);

    return () => {
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  // Hide the site's own dot+ring cursor for as long as the pointer is over
  // this section; hand it back the instant it leaves.
  useEffect(() => {
    const html = document.documentElement;
    if (hasPointer) html.setAttribute("data-hide-site-cursor", "true");
    else html.removeAttribute("data-hide-site-cursor");
    return () => html.removeAttribute("data-hide-site-cursor");
  }, [hasPointer]);

  const activatePanel = (index: number) => {
    setActive(index);
    setCursorReady(false);
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setCursorReady(true), 600);
  };

  const closePanels = () => {
    setActive(null);
    setCursorReady(false);
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
  };

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (active === index) closePanels();
      else activatePanel(index);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <style>{`
        html[data-hide-site-cursor="true"] .cursor-dot,
        html[data-hide-site-cursor="true"] .cursor-ring,
        html[data-hide-site-cursor="true"] .glow-cursor-canvas { opacity: 0 !important; }
      `}</style>

      <section
        ref={sectionRef}
        className={`pp-accordion${active !== null ? " is-open" : ""}`}
        aria-label="What's holding trades businesses back"
      >
        <div className="pp-masthead" aria-hidden="true">
          <p className="pp-eyebrow">Pain points</p>
          <h2 className="pp-headline">
            Most trades businesses don{"’"}t have a work problem. They have a marketing problem.
          </h2>
        </div>

        <div className="pp-row">
          {PANELS.map((panel, index) => {
            const isActive = active === index;
            return (
              <article
                key={panel.title}
                className={`pp-panel${isActive ? " is-active" : ""}`}
                onMouseEnter={() => activatePanel(index)}
                onFocus={() => activatePanel(index)}
                onClick={() => (isActive ? closePanels() : activatePanel(index))}
                onKeyDown={(event) => handlePanelKeyDown(event, index)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
              >
                <div
                  className="pp-panel-image"
                  style={{ backgroundImage: `url("${panel.image}")` }}
                  aria-hidden="true"
                />
                <div className="pp-panel-shade" aria-hidden="true" />
                <h3>{panel.title}</h3>
                <p className="pp-panel-body">{panel.body}</p>
                <div className="pp-panel-index" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>/ {String(COUNT).padStart(2, "0")}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div
          ref={cursorRef}
          className={`pp-art-cursor${hasPointer ? " is-visible" : ""}${
            cursorReady && active !== null ? " is-preview" : ""
          }`}
          aria-hidden="true"
        >
          <span className="pp-cursor-dot" />
          <span
            className="pp-cursor-preview"
            style={active !== null ? { backgroundImage: `url("${PANELS[active].image}")` } : undefined}
          />
        </div>

        <button className="pp-close" type="button" onClick={closePanels}>
          Close
        </button>
      </section>

      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <ScrollWords
            text={PAIN_CLOSER}
            className="font-display mx-auto max-w-[22ch] text-center font-medium"
            style={{ fontSize: "clamp(26px, 4vw, 52px)", lineHeight: 1.14 }}
          />
        </Reveal>
      </div>
    </>
  );
}
