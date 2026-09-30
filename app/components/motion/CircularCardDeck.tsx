"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type CardData = {
  theme: "ink" | "paper" | "signal";
  type: "count" | "pulse" | "statement" | "brief";
  kicker: string;
  title: string;
};

const cards: CardData[] = [
  { theme: "signal", type: "count", kicker: "TRACK RECORD", title: "Proof, not promises" },
  { theme: "ink", type: "pulse", kicker: "BY THE NUMBERS", title: "What clients see" },
  { theme: "signal", type: "statement", kicker: "THE GUARANTEE", title: "No risk to start" },
  { theme: "paper", type: "brief", kicker: "WHY PVA", title: "Speed, proof, risk" },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function CardArt({ card }: { card: CardData }) {
  if (card.type === "count") {
    return <><div className="micro">WEBSITES BUILT FOR TRADES<br />AND HOME SERVICE COMPANIES</div><strong className="giant">200<small style={{ fontSize: "0.3em", verticalAlign: "top", letterSpacing: 0 }}>+</small></strong><i className="rule" /></>;
  }
  if (card.type === "pulse") {
    return <><div className="metrics"><b>200+</b><b>5</b><b>60%</b></div><div className="portrait"><i /></div><div className="swatches"><i /><i /><i /><i /></div><div className="cities">WHERE WE WORK<br />TEXAS<br />CALIFORNIA<br />SAN DIEGO</div></>;
  }
  if (card.type === "statement") {
    return <><div className="edgeNote">60% MORE ENQUIRIES<br />IN 90 DAYS</div><div className="word">guarantee</div></>;
  }
  return <><div className="briefNo">08.24</div><div className="columns"><p>SPEED<br /><b>LIVE IN 5 DAYS</b></p><p>PROOF<br /><b>200+ BUILT</b></p><p>RISK<br /><b>60% GUARANTEE</b></p></div></>;
}

function ArcCard({
  card,
  slot,
  width,
  motion,
  isHovered,
  onHoverChange,
  onChoose,
}: {
  card: CardData;
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

  // The reference has a second, quieter movement on each card. Cards peel and
  // counter-rotate most strongly near the ends of the arc, then softly settle
  // back onto the track when the deck loses momentum.
  const side = clamp(Math.abs(slot - 2) / 2.6, 0, 1);
  const travel = clamp(motion, -1, 1);
  const travelStrength = Math.abs(travel) * (0.34 + side * 0.66);
  const slipX = travel * width * 0.009 * side;
  const peelY = -travelStrength * width * 0.014;
  const counterRotation = travel * (slot < 2 ? -1 : 1) * (0.7 + side * 1.8);
  const travelScale = 1 + travelStrength * 0.012;

  return (
    <article
      className={`card ${card.theme} ${card.type}`}
      aria-label={card.title}
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
        className="cardMotion"
        style={{ transform: `translate3d(${slipX}px,${peelY}px,0) rotate(${counterRotation}deg) scale(${travelScale})` }}
      >
        <div className="cardSurface">
          <header><span>{card.kicker}</span><span>ARC / {String(cards.indexOf(card) + 1).padStart(2, "0")}</span></header>
          <h2>{card.title}</h2>
          <CardArt card={card} />
        </div>
      </div>
    </article>
  );
}

export default function CircularCardDeck() {
  const stageRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
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
        if (Math.abs(value.current) > cards.length) {
          const cycle = Math.round(value.current / cards.length) * cards.length;
          value.current -= cycle;
          target.current -= cycle;
        }
      }

      let frameDelta = value.current - lastFrameValue.current;
      frameDelta -= Math.round(frameDelta / cards.length) * cards.length;
      lastFrameValue.current = value.current;
      const requestedMotion = clamp(frameDelta * 28, -1, 1);
      const motionResponse = Math.abs(requestedMotion) > Math.abs(visualMotion.current) ? 0.38 : 0.115;
      visualMotion.current += (requestedMotion - visualMotion.current) * motionResponse;
      if (Math.abs(visualMotion.current) < 0.0005) visualMotion.current = 0;
      setPosition(value.current);
      setMotion(visualMotion.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const takeControl = useCallback(() => {
    manual.current = true;
    target.current = value.current;
  }, []);

  const moveOne = useCallback((direction: number) => {
    takeControl();
    target.current = Math.round(target.current) + direction;
  }, [takeControl]);

  const onWheel = useCallback((event: WheelEvent) => {
    if (Math.abs(event.deltaY) < 4) return;
    const now = performance.now();
    if (now - lastWheel.current < 420) return;
    lastWheel.current = now;
    moveOne(event.deltaY > 0 ? -1 : 1);
  }, [moveOne]);

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onWheel]);

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

  const logicalCards = Array.from({ length: 19 }, (_, index) => index - 7);

  return (
    <main className="scene">
      <div
        ref={stageRef}
        className="stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {logicalCards.map((logical) => {
          const dataIndex = ((logical % cards.length) + cards.length) % cards.length;
          const slot = logical + position;
          return <ArcCard
            key={logical}
            card={cards[dataIndex]}
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
      <div className="hint"><span>DRAG</span><i /><span>SCROLL</span></div>

      <style>{`
        * { box-sizing: border-box; }
        button, article { -webkit-tap-highlight-color: transparent; }
        .scene { position: relative; width: 100vw; height: 100vh; height: 100dvh; overflow: hidden; background: linear-gradient(180deg, #F2EAD3 0%, #F2EAD3 72%, #ECE0C8 118%); }
        .scene:after { content: ""; position: absolute; inset: auto 0 0; height: 22%; pointer-events: none; background: linear-gradient(transparent,rgba(67,71,74,.16)); }
        .stage { position: absolute; left: 50%; top: 0; width: min(100vw,62vh); height: 100%; transform: translateX(-50%); touch-action: none; user-select: none; cursor: grab; }
        .stage:active { cursor: grabbing; }
        .card { position: absolute; left: 0; top: 0; width: 91.5%; aspect-ratio: 1.75/1; container-type: inline-size; transform-origin: center; backface-visibility: hidden; will-change: transform,filter; transition: opacity .12s linear; cursor: pointer; }
        .cardMotion { position: absolute; inset: 0; transform-origin: center; backface-visibility: hidden; will-change: transform; }
        .cardSurface { position: absolute; inset: 0; overflow: hidden; border-radius: max(5px,1.35%); box-shadow: 0 1px 0 rgba(255,255,255,.4) inset,0 9px 20px rgba(20,24,27,.12); transform: translateZ(0) scale(1); transform-origin: center; backface-visibility: hidden; will-change: transform,box-shadow; transition: transform .36s cubic-bezier(.2,.78,.2,1),box-shadow .36s cubic-bezier(.2,.78,.2,1); }
        .card:hover .cardSurface { transform: translateZ(0) scale(1.055); box-shadow: 0 1px 0 rgba(255,255,255,.55) inset,0 24px 52px rgba(20,24,27,.3); }
        .card header { position: absolute; z-index: 3; left: 6.5%; right: 6.5%; top: 8%; display: flex; justify-content: space-between; font-size: clamp(4px,1.45cqw,8px); font-weight: 700; letter-spacing: .05em; opacity: .82; }
        .card h2 { position: absolute; z-index: 3; margin: 0; left: 6.5%; top: 22%; max-width: 48%; font-size: clamp(10px,5.8cqw,27px); line-height: .92; letter-spacing: -.055em; font-weight: 580; }
        .ink .cardSurface { color: #F2EAD3; background: #241811; border: 1px solid rgba(255,255,255,.09); }
        .ink .cardSurface:after { content: ""; position: absolute; inset: 0; opacity: .13; background: repeating-linear-gradient(0deg,transparent 0 12%,#fff 12.4% 12.8%); }
        .paper .cardSurface { color: #3A2418; background: #FAF6EC; border: 1px solid rgba(10,12,13,.11); }
        .signal .cardSurface { color: #F2EAD3; background: #3A2418; border: 1px solid rgba(217,192,140,0.25); }
        .micro { position: absolute; left: 7%; bottom: 12%; font-size: clamp(4px,1.55cqw,8px); line-height: 1.35; letter-spacing: .05em; }
        .giant { position: absolute; right: 7%; bottom: -17%; font-size: clamp(76px,44cqw,210px); line-height: 1; font-weight: 350; letter-spacing: -.1em; }
        .rule { position: absolute; left: 7%; right: 7%; bottom: 8%; border-bottom: 1px solid rgba(255,255,255,.5); }
        .steps { position: absolute; left: 19%; top: 34%; font-size: clamp(9px,5.1cqw,25px); line-height: .86; letter-spacing: -.04em; }
        .steps span { display: inline-block; width: 15%; margin-left: -15%; color: #727276; font-size: .55em; vertical-align: top; padding-top: .2em; }
        .bars { position: absolute; right: 7%; top: 27%; width: 26%; display: grid; gap: 12%; }
        .bars i { height: 3px; background: #55555a; border-radius: 9px; }
        .bars i:nth-child(2) { width: 70%; }.bars i:nth-child(3) { width: 89%; }.bars i:nth-child(4) { width: 48%; }
        .rows { position: absolute; left: 7%; right: 45%; bottom: 10%; font-size: clamp(4px,1.7cqw,9px); }
        .rows p { padding: 8% 0; margin: 0; display: flex; justify-content: space-between; border-top: 1px solid #d8d8d4; }.rows b { color: #a3a39e; }
        .portalArt { position: absolute; right: 6%; top: 26%; width: 33%; height: 64%; background: #171719; box-shadow: -13px 13px 23px rgba(0,0,0,.13); }
        .portalArt i { position: absolute; inset: 11% 21%; background: linear-gradient(115deg,#fff,#d7d7d3); box-shadow: 0 0 16px #fff; }
        .portalArt b { position: absolute; right: 22%; top: 43%; color: #18191a; font: 8px monospace; }
        .metrics { position: absolute; left: 7%; right: 7%; top: 26%; display: flex; justify-content: space-around; border-top: 1px solid #454549; padding-top: 4%; font-size: clamp(5px,2.7cqw,13px); }
        .portrait { position: absolute; left: 7%; bottom: 7%; width: 34%; height: 45%; background: radial-gradient(circle at 50% 35%,#c9cac7 0 7%,#19191b 8% 27%,transparent 28%),linear-gradient(135deg,#e8e8e4,#bfc1bf); overflow: hidden; }
        .portrait:after { content: ""; position: absolute; width: 48%; height: 8%; background: #D9C08C; top: 35%; left: 45%; box-shadow: 0 0 10px #D9C08C; }
        .portrait i { position: absolute; width: 58%; height: 52%; border-radius: 50% 50% 0 0; background: #111; left: 22%; bottom: -5%; }
        .swatches { position: absolute; left: 48%; top: 51%; display: flex; gap: 4px; }.swatches i { width: clamp(9px,5cqw,23px); aspect-ratio: 1; background: #D9C08C; }.swatches i:nth-child(2){background:#C9A968}.swatches i:nth-child(3){background:#eee}.swatches i:nth-child(4){background:#777}
        .cities { position: absolute; left: 49%; bottom: 7%; font-size: clamp(4px,1.9cqw,9px); line-height: .92; }
        .edgeNote { position: absolute; right: 7%; top: 19%; text-align: right; font-size: clamp(4px,1.45cqw,8px); line-height: 1.2; }
        .word { position: absolute; left: -3%; bottom: -18%; color: rgba(242,234,211,0.85); font-size: clamp(43px,29cqw,140px); line-height: 1; letter-spacing: -.09em; font-weight: 450; }
        .briefNo { position: absolute; left: 7%; bottom: 7%; color: #d0d0cb; font-size: clamp(28px,18cqw,88px); letter-spacing: -.08em; }
        .columns { position: absolute; left: 50%; right: 6%; top: 32%; font-size: clamp(4px,1.6cqw,8px); }.columns p { margin: 0; padding: 6% 0; border-top: 1px solid #ddd; color: #999; }.columns b { color: #202020; }
        .orbitArt { position: absolute; width: 47%; aspect-ratio: 1; right: 4%; bottom: -38%; border: 1px solid #555; border-radius: 50%; }.orbitArt i { position: absolute; inset: 12%; border: 1px solid #414145; border-radius: 50%; }.orbitArt i:nth-child(2){inset:27%}.orbitArt i:nth-child(3){inset:42%}.orbitArt b { position:absolute;width:9%;aspect-ratio:1;border-radius:50%;background:#ff4b32;left:4%;top:23%; }
        .route { position: absolute; left: 7%; bottom: 11%; font-size: clamp(4px,1.4cqw,8px); color: #a3a3a6; }
        .hint { position: absolute; z-index: 99; left: 50%; bottom: 3.2%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,.75); font-size: 7px; letter-spacing: .16em; pointer-events: none; }
        .hint i { width: 16px; height: 1px; background: currentColor; }
        @media (hover: none) { .card:hover .cardSurface { transform: translateZ(0) scale(1); box-shadow: 0 1px 0 rgba(255,255,255,.4) inset,0 9px 20px rgba(20,24,27,.12); } }
        @media (prefers-reduced-motion: reduce) { .card,.cardMotion,.cardSurface { transition: none; } }
      `}</style>
    </main>
  );
}
