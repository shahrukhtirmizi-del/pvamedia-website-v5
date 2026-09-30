"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ClientTestimonial } from "../../lib/site";

/**
 * Testimonials on a circular arc. Every card rides one shared circle; the
 * deck drifts on its own until someone drags, scrolls over it or clicks a
 * card, then springs one card at a time. The card in the centre of the arc
 * (slot 2) is the one being read.
 */

export interface CircularCardDeckProps {
  testimonials: ClientTestimonial[];
  kicker?: string;
  heading?: string;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function ArcCard({
  testimonial,
  index,
  total,
  slot,
  width,
  motion,
  isHovered,
  onHoverChange,
  onChoose,
}: {
  testimonial: ClientTestimonial;
  index: number;
  total: number;
  slot: number;
  width: number;
  motion: number;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onChoose: () => void;
}) {
  // Every card uses this one circle. No card has an independent x/y animation.
  const theta = (-20 + slot * 10.5) * Math.PI / 180;
  const radius = width * 1.868;
  const centerX = -width * 1.322;
  const centerY = width * 0.812;
  const x = centerX + radius * Math.cos(theta);
  const y = centerY + radius * Math.sin(theta);
  // Keep one complete card queued beyond each viewport edge. The scene clips
  // those cards while they are off-screen, so scrolling reveals an already
  // present card instead of fading a new one into the visible deck.
  const edge = Math.max(0, Math.abs(slot - 2) - 3.15);
  const visible = slot > -2.2 && slot < 6.2;

  // Cards peel and counter-rotate most strongly near the ends of the arc,
  // then softly settle back onto the track when the deck loses momentum.
  const side = clamp(Math.abs(slot - 2) / 2.6, 0, 1);
  const travel = clamp(motion, -1, 1);
  const travelStrength = Math.abs(travel) * (0.34 + side * 0.66);
  const slipX = travel * width * 0.009 * side;
  const peelY = -travelStrength * width * 0.014;
  const counterRotation = travel * (slot < 2 ? -1 : 1) * (0.7 + side * 1.8);
  const travelScale = 1 + travelStrength * 0.012;

  // alternate ink and paper faces around the deck
  const theme = index % 2 === 0 ? "ccd-ink" : "ccd-paper";

  return (
    <article
      className={`ccd-card ${theme}`}
      aria-label={`${testimonial.name}, ${testimonial.company}`}
      aria-hidden={!visible}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onChoose}
      style={{
        opacity: visible ? clamp(1 - edge * 0.52, 0, 1) : 0,
        filter: `blur(${edge * (2.5 + Math.abs(travel) * 1.4)}px)`,
        pointerEvents: visible ? "auto" : "none",
        zIndex: isHovered ? 1000 : Math.round((slot + 3) * 10),
        transform: `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${theta}rad)`,
      }}
    >
      <div
        className="ccd-motion"
        style={{ transform: `translate3d(${slipX}px,${peelY}px,0) rotate(${counterRotation}deg) scale(${travelScale})` }}
      >
        <div className="ccd-surface">
          <header>
            <span>{testimonial.category}</span>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </header>
          <blockquote>
            <p>{"“"}{testimonial.quote}{"”"}</p>
          </blockquote>
          <footer>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.company}</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

export default function CircularCardDeck({
  testimonials,
  kicker = "From our clients",
  heading = "What clients say",
}: CircularCardDeckProps) {
  const count = testimonials.length;
  const sceneRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const value = useRef(-1);
  const target = useRef(-1);
  const velocity = useRef(0);
  const visualMotion = useRef(0);
  const lastFrameValue = useRef(-1);
  const manual = useRef(false);
  const dragging = useRef(false);
  const dragged = useRef(false);
  const startY = useRef(0);
  const startValue = useRef(0);
  const lastWheel = useRef(0);
  const [position, setPosition] = useState(-1);
  const [motion, setMotion] = useState(0);
  const [stageWidth, setStageWidth] = useState(234);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => setStageWidth(stageRef.current?.clientWidth || 234);
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // the deck only animates, and only answers the wheel, while it is on screen
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    });
    io.observe(scene);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (count === 0) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!inView.current) return;

      if (!manual.current) {
        const time = ((now - started) % 5300) / 1000;
        let next = -1;
        if (time < 2.1) next = -1 + easeInOutCubic(time / 2.1);
        else if (time < 3.72) next = 0;
        else next = -easeInOutCubic((time - 3.72) / 1.58);
        value.current = next;
      } else if (!dragging.current) {
        const delta = target.current - value.current;
        velocity.current = (velocity.current + delta * 0.105) * 0.72;
        value.current += velocity.current;
        if (Math.abs(delta) < 0.0005 && Math.abs(velocity.current) < 0.0005) {
          value.current = target.current;
          velocity.current = 0;
        }
        if (Math.abs(value.current) > count) {
          const cycle = Math.round(value.current / count) * count;
          value.current -= cycle;
          target.current -= cycle;
        }
      }

      let frameDelta = value.current - lastFrameValue.current;
      frameDelta -= Math.round(frameDelta / count) * count;
      lastFrameValue.current = value.current;
      const requestedMotion = clamp(frameDelta * 28, -1, 1);
      const motionResponse = Math.abs(requestedMotion) > Math.abs(visualMotion.current) ? 0.38 : 0.115;
      visualMotion.current += (requestedMotion - visualMotion.current) * motionResponse;
      if (Math.abs(visualMotion.current) < 0.0005) visualMotion.current = 0;
      setPosition(value.current);
      setMotion(visualMotion.current);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  const takeControl = useCallback(() => {
    manual.current = true;
    target.current = value.current;
  }, []);

  const moveOne = useCallback((direction: number) => {
    takeControl();
    target.current = Math.round(target.current) + direction;
  }, [takeControl]);

  const onWheel = useCallback((event: WheelEvent) => {
    if (!inView.current || Math.abs(event.deltaY) < 4) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    // only while the deck fills most of the screen, not as it scrolls past
    if (!rect || rect.top > window.innerHeight * 0.25 || rect.bottom < window.innerHeight * 0.75) return;
    const now = performance.now();
    if (now - lastWheel.current < 420) return;
    lastWheel.current = now;
    moveOne(event.deltaY > 0 ? -1 : 1);
  }, [moveOne]);

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveOne(-1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveOne(1);
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    takeControl();
    dragging.current = true;
    dragged.current = false;
    startY.current = event.clientY;
    startValue.current = value.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = event.clientY - startY.current;
    if (Math.abs(delta) > 5) dragged.current = true;
    value.current = startValue.current + delta / (stageWidth * 0.34);
    target.current = value.current;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    target.current = Math.round(value.current);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (count === 0) return null;

  const logicalCards = Array.from({ length: 19 }, (_, index) => index - 7);

  return (
    <section ref={sceneRef} className="ccd-scene" aria-label={heading}>
      <div className="ccd-heading">
        <span>{kicker}</span>
        <h2 className="font-display">{heading}</h2>
      </div>

      <div
        ref={stageRef}
        className="ccd-stage"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials. Use the arrow keys to move through them."
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {logicalCards.map((logical) => {
          const dataIndex = ((logical % count) + count) % count;
          const slot = logical + position;
          return <ArcCard
            key={logical}
            testimonial={testimonials[dataIndex]}
            index={dataIndex}
            total={count}
            slot={slot}
            width={stageWidth}
            motion={motion}
            isHovered={hoveredCard === logical}
            onHoverChange={(hovered) => setHoveredCard(hovered ? logical : null)}
            onChoose={() => {
              if (!dragged.current) moveOne(2 - Math.round(slot));
            }}
          />;
        })}
      </div>
      <div className="ccd-hint" aria-hidden><span>DRAG</span><i /><span>SCROLL</span></div>

      <style>{`
        .ccd-scene, .ccd-scene * { box-sizing: border-box; }
        .ccd-scene button, .ccd-scene article { -webkit-tap-highlight-color: transparent; }
        .ccd-scene { position: relative; width: 100%; height: 100vh; height: 100dvh; min-height: 620px; overflow: hidden; background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 70%, #F4F4F2 118%); }
        .ccd-scene:after { content: ""; position: absolute; inset: auto 0 0; height: 22%; pointer-events: none; background: linear-gradient(transparent, rgba(10,10,10,.06)); }
        .ccd-heading { position: absolute; z-index: 1100; left: clamp(20px, 4vw, 64px); top: clamp(88px, 12vh, 128px); pointer-events: none; }
        .ccd-heading span { display: block; font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-45); }
        .ccd-heading h2 { margin: 12px 0 0; font-size: clamp(30px, 4.2vw, 56px); line-height: 1.02; font-weight: 700; color: var(--ink); max-width: 9ch; }
        .ccd-stage { position: absolute; left: 50%; top: 0; width: min(100vw, 64vh); height: 100%; transform: translateX(-50%); touch-action: none; user-select: none; cursor: grab; outline: none; }
        .ccd-stage:focus-visible { outline: 2px solid var(--ink); outline-offset: -6px; }
        .ccd-stage:active { cursor: grabbing; }
        .ccd-card { position: absolute; left: 0; top: 0; width: 91.5%; aspect-ratio: 1.5/1; container-type: inline-size; transform-origin: center; backface-visibility: hidden; will-change: transform,filter; transition: opacity .12s linear; cursor: pointer; }
        .ccd-motion { position: absolute; inset: 0; transform-origin: center; backface-visibility: hidden; will-change: transform; }
        .ccd-surface { position: absolute; inset: 0; overflow: hidden; border-radius: max(6px,1.6%); box-shadow: 0 1px 0 rgba(255,255,255,.4) inset, 0 9px 20px rgba(10,10,10,.1); transform: translateZ(0) scale(1); transform-origin: center; backface-visibility: hidden; will-change: transform,box-shadow; transition: transform .36s cubic-bezier(.2,.78,.2,1), box-shadow .36s cubic-bezier(.2,.78,.2,1); font-family: var(--font-sans), system-ui, sans-serif; }
        .ccd-card:hover .ccd-surface { transform: translateZ(0) scale(1.045); box-shadow: 0 1px 0 rgba(255,255,255,.55) inset, 0 24px 52px rgba(10,10,10,.22); }
        .ccd-surface header { position: absolute; z-index: 3; left: 6.5%; right: 6.5%; top: 7%; display: flex; justify-content: space-between; font-size: clamp(6px,1.7cqw,10px); font-weight: 600; letter-spacing: .12em; text-transform: uppercase; opacity: .6; }
        .ccd-surface blockquote { position: absolute; z-index: 3; margin: 0; left: 6.5%; right: 6.5%; top: 17%; bottom: 25%; overflow: hidden; }
        .ccd-surface blockquote p { margin: 0; font-size: clamp(8px, 2.45cqw, 15px); line-height: 1.4; letter-spacing: -.005em; display: -webkit-box; -webkit-line-clamp: 10; -webkit-box-orient: vertical; overflow: hidden; }
        .ccd-surface footer { position: absolute; z-index: 3; left: 6.5%; right: 6.5%; bottom: 7%; display: flex; flex-direction: column; gap: .2em; border-top: 1px solid currentColor; padding-top: 3.2%; font-size: clamp(7px, 2.2cqw, 13px); line-height: 1.2; }
        .ccd-surface footer strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-weight: 700; letter-spacing: -.01em; }
        .ccd-surface footer span { opacity: .6; }
        .ccd-ink .ccd-surface { color: #FFFFFF; background: #0A0A0A; border: 1px solid rgba(255,255,255,.08); }
        .ccd-ink .ccd-surface footer { border-color: rgba(255,255,255,.2); }
        .ccd-paper .ccd-surface { color: #0A0A0A; background: #FFFFFF; border: 1px solid rgba(10,10,10,.12); }
        .ccd-paper .ccd-surface footer { border-color: rgba(10,10,10,.14); }
        .ccd-hint { position: absolute; z-index: 1100; left: 50%; bottom: 3.2%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; color: var(--ink-45); font-size: 9px; letter-spacing: .16em; pointer-events: none; }
        .ccd-hint i { width: 16px; height: 1px; background: currentColor; }
        @media (max-width: 700px) {
          .ccd-heading { left: 0; right: 0; top: 64px; padding: 20px 20px 36px; background: linear-gradient(#FFFFFF 70%, rgba(255,255,255,0)); }
          .ccd-heading h2 { font-size: 30px; }
          .ccd-card { aspect-ratio: 1.15/1; }
          .ccd-surface blockquote p { font-size: clamp(9px, 3.3cqw, 13px); -webkit-line-clamp: 12; }
        }
        @media (hover: none) { .ccd-card:hover .ccd-surface { transform: translateZ(0) scale(1); box-shadow: 0 1px 0 rgba(255,255,255,.4) inset, 0 9px 20px rgba(10,10,10,.1); } }
        @media (prefers-reduced-motion: reduce) { .ccd-card, .ccd-motion, .ccd-surface { transition: none; } }
      `}</style>
    </section>
  );
}
