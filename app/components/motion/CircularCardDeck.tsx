"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { ClientTestimonial } from "../../lib/site";

/**
 * A 3D coverflow of client testimonials, adapted from the client-supplied
 * OrbitCoverflow reference. Two real changes from that reference, not just a
 * re-skin:
 *
 *  - The reference is built around one photo per card (`image`/`alt`) with a
 *    caption overlay. These are text testimonials with no photos, so the
 *    card face is rebuilt around a blockquote + attribution instead — the
 *    coverflow's drag/keyboard/3D-position mechanic is what's reused, not
 *    its card markup.
 *  - It replaces the previous CircularCardDeck, which hijacked the window's
 *    wheel event to change cards — the reported "can't scroll the page over
 *    the testimonials" bug. Nothing here listens on `window`: pointer drag,
 *    a click on a card, the arrow keys and the progress dots are the only
 *    ways to move, so the page scrolls normally over this section.
 *
 * Per the client's decision: no category label, no "x / 10" index — only
 * the quote, the client's first name + surname initial (`displayName`,
 * never the full `name`), and the company name blurred with a short note
 * on why.
 */

export interface CircularCardDeckProps {
  testimonials: ClientTestimonial[];
  kicker?: string;
  heading?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrapIndex = (value: number, total: number) => ((value % total) + total) % total;

function getCircularDistance(itemIndex: number, activeIndex: number, total: number) {
  let distance = itemIndex - activeIndex;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

export default function CircularCardDeck({
  testimonials,
  kicker = "From our clients",
  heading = "What clients say",
}: CircularCardDeckProps) {
  const total = testimonials.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const locked = useRef(false);
  const unlockTimer = useRef<number | null>(null);

  const [rawActiveIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(1100);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => setStageWidth(stage.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Clamped at render time rather than mirrored into state via an effect —
  // `total` only ever changes if the testimonials list itself changes.
  const activeIndex = clamp(rawActiveIndex, 0, Math.max(total - 1, 0));

  useEffect(() => {
    return () => {
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    };
  }, []);

  const cardWidth = useMemo(() => Math.round(clamp(stageWidth * 0.4, 280, 440)), [stageWidth]);
  const cardHeight = Math.round(cardWidth * 1.18);
  const horizontalSpacing = useMemo(
    () => clamp(stageWidth * 0.24, 130, cardWidth * 0.76),
    [stageWidth, cardWidth],
  );

  const lockMovement = useCallback(() => {
    locked.current = true;
    if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      locked.current = false;
    }, 620);
  }, []);

  const moveBy = useCallback(
    (amount: number) => {
      if (locked.current || total < 2) return;
      lockMovement();
      setActiveIndex((current) => wrapIndex(current + amount, total));
    },
    [lockMovement, total],
  );

  const moveTo = useCallback(
    (nextIndex: number) => {
      if (locked.current || total < 2) return;
      lockMovement();
      setActiveIndex((current) => (current === nextIndex ? wrapIndex(current + 1, total) : wrapIndex(nextIndex, total)));
    },
    [lockMovement, total],
  );

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveBy(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveBy(-1);
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    swipeStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return;
    const travelled = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(travelled) < 45) return;
    moveBy(travelled < 0 ? 1 : -1);
  };

  if (total === 0) return null;

  return (
    <section className="ccd-scene" aria-label={heading}>
      <div className="ccd-heading">
        <span>{kicker}</span>
        <h2 className="font-display">{heading}</h2>
      </div>

      <div
        ref={stageRef}
        className="ccd-coverflow"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials. Drag, click a card, or use the arrow keys to move through them."
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          className="ccd-scene-3d"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
          <div className="ccd-track">
            {testimonials.map((testimonial, index) => {
              const position = getCircularDistance(index, activeIndex, total);
              const distance = Math.abs(position);
              const isActive = position === 0;
              const isVisible = distance <= 2;

              const translateX = position * horizontalSpacing;
              const translateZ = isActive ? 60 : -distance * 220;
              const rotateY = position * -12;
              const rotateZ = position * 5;
              const scale = Math.max(0.58, 1 - distance * 0.15);

              const transform = [
                "translate(-50%, -50%)",
                `translate3d(${translateX}px, 0, ${translateZ}px)`,
                `rotateY(${rotateY}deg)`,
                `rotateZ(${rotateZ}deg)`,
                `scale(${scale})`,
              ].join(" ");

              return (
                <button
                  key={testimonial.company + testimonial.displayName}
                  type="button"
                  className={`ccd-card${isActive ? " is-active" : ""}`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    transform,
                    opacity: isVisible ? (isActive ? 1 : 0.72) : 0,
                    filter: isActive ? "none" : `brightness(${Math.max(0.6, 0.85 - distance * 0.08)})`,
                    zIndex: 20 - distance,
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                  onClick={() => moveTo(index)}
                  aria-label={
                    isActive
                      ? `Testimonial from ${testimonial.displayName}. Select to view the next one.`
                      : `Show testimonial from ${testimonial.displayName}`
                  }
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={isVisible ? 0 : -1}
                >
                  <blockquote>
                    <p>{"“"}{testimonial.quote}{"”"}</p>
                  </blockquote>
                  <footer>
                    <strong>{testimonial.displayName}</strong>
                    <span className="ccd-company">
                      <span className="ccd-company-name" aria-hidden="true">
                        {testimonial.company}
                      </span>
                      <small>Client identity blurred by request</small>
                    </span>
                  </footer>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ccd-dots" aria-label="Choose a testimonial">
          {testimonials.map((testimonial, index) => (
            <button
              key={`dot-${testimonial.company}-${testimonial.displayName}`}
              type="button"
              className="ccd-dot"
              onClick={() => moveTo(index)}
              aria-label={`Show testimonial from ${testimonial.displayName}`}
              aria-current={activeIndex === index ? "true" : undefined}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <div className="ccd-hint" aria-hidden>
        <span>DRAG</span>
        <i />
        <span>ARROW KEYS</span>
      </div>

      <style>{`
        .ccd-scene, .ccd-scene * { box-sizing: border-box; }
        .ccd-scene button, .ccd-scene article { -webkit-tap-highlight-color: transparent; }
        .ccd-scene { position: relative; width: 100%; min-height: 100vh; min-height: 100dvh; padding: clamp(96px, 14vh, 150px) 0 clamp(64px, 8vh, 96px); overflow: hidden; background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 70%, #F4F4F2 118%); }
        .ccd-heading { position: relative; z-index: 10; max-width: 1240px; margin: 0 auto clamp(28px, 5vh, 56px); padding: 0 clamp(20px, 4vw, 64px); }
        .ccd-heading span { display: block; font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-45); }
        .ccd-heading h2 { margin: 12px 0 0; font-size: clamp(30px, 4.2vw, 56px); line-height: 1.02; font-weight: 700; color: var(--ink); max-width: 9ch; }

        .ccd-coverflow { position: relative; width: 100%; min-height: 560px; outline: none; }
        .ccd-scene-3d { position: relative; width: 100%; height: clamp(420px, 56vh, 620px); perspective: 1500px; perspective-origin: 50% 46%; cursor: grab; touch-action: pan-y; user-select: none; }
        .ccd-scene-3d:active { cursor: grabbing; }
        .ccd-track { position: absolute; inset: 0; transform-style: preserve-3d; }

        .ccd-card {
          position: absolute; top: 50%; left: 50%;
          display: flex; flex-direction: column; justify-content: space-between;
          container-type: inline-size;
          padding: clamp(22px, 3vw, 34px);
          border: 1px solid rgba(10,10,10,.1);
          border-radius: max(10px, 2%);
          background: #0A0A0A; color: #FFFFFF;
          text-align: left; appearance: none; cursor: pointer;
          transform-style: preserve-3d; transform-origin: center; backface-visibility: hidden;
          box-shadow: 0 24px 60px rgba(10,10,10,.22);
          transition: transform 640ms cubic-bezier(.22,1,.36,1), opacity 640ms cubic-bezier(.22,1,.36,1), filter 640ms cubic-bezier(.22,1,.36,1), box-shadow 640ms cubic-bezier(.22,1,.36,1);
          will-change: transform, opacity, filter;
        }
        .ccd-card.is-active { box-shadow: 0 40px 90px rgba(10,10,10,.32); }
        .ccd-card:focus-visible { outline: 2px solid #FFFFFF; outline-offset: -8px; }

        .ccd-card blockquote { margin: 0; overflow: hidden; }
        .ccd-card blockquote p {
          margin: 0; font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(13px, 1.15cqw, 17px); line-height: 1.5; letter-spacing: -.005em;
          display: -webkit-box; -webkit-line-clamp: 12; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ccd-card footer { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.2); }
        .ccd-card footer strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-size: clamp(13px, 1.05cqw, 16px); font-weight: 700; letter-spacing: -.01em; }
        .ccd-company { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .ccd-company-name { filter: blur(5px); user-select: none; font-size: 13px; opacity: .8; }
        .ccd-company small { font-size: 10.5px; letter-spacing: .02em; opacity: .55; }

        .ccd-dots { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: clamp(20px, 4vh, 40px); }
        .ccd-dot { width: 22px; height: 22px; display: grid; place-items: center; padding: 0; border: 0; background: transparent; cursor: pointer; }
        .ccd-dot span { width: 5px; height: 5px; border-radius: 999px; background: var(--ink-30); transition: width 420ms cubic-bezier(.22,1,.36,1), background 420ms ease; }
        .ccd-dot[aria-current="true"] span { width: 22px; background: var(--ink); }

        .ccd-hint { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; color: var(--ink-45); font-size: 9px; letter-spacing: .16em; pointer-events: none; }
        .ccd-hint i { width: 16px; height: 1px; background: currentColor; }

        @media (max-width: 700px) {
          .ccd-heading h2 { font-size: 30px; }
          .ccd-card blockquote p { font-size: 13px; -webkit-line-clamp: 10; }
        }
        @media (prefers-reduced-motion: reduce) { .ccd-card { transition: none; } }
      `}</style>
    </section>
  );
}
