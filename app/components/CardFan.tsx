"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import BrowserCard from "./BrowserCard";

/**
 * A fanned deck of mockups (desktop/tablet, lg+) with a separate swipeable
 * carousel for mobile (below lg).
 *
 * HOVER BUG, ROOT CAUSE (v2): the old version gave every card its own
 * oversized, independently-positioned hitbox. With cards spaced closer
 * together than the hitboxes were wide, every hitbox heavily overlapped
 * its neighbours' hitboxes. Z-index made the two outer cards render
 * *underneath* the inner ones, so their hitboxes were buried under the
 * inner cards' hitboxes across almost their entire area -- the mouse
 * physically could not reach them.
 *
 * FIX: hit-detection is now a set of adjacent, non-overlapping vertical
 * slices spanning the full fan width, one per card, assigned strictly by
 * left-to-right order. Because the slices never overlap, there is no
 * stacking contention to fight over, no matter how much the *visual*
 * cards overlap for the fan look. Z-index still controls only what's
 * drawn on top, never what receives the pointer.
 *
 * MOBILE: fixed-pixel fanned/rotated cards don't fit a phone viewport at
 * all (this is what broke the mobile homepage). Below lg, this renders as
 * a horizontal snap-scroll carousel of upright, full-size cards instead --
 * no absolute positioning, no overflow risk, real touch scrolling.
 *
 * MOBILE POSITIONING BUG (fixed): each card's actual content has its own
 * fixed pixel width (cardWidth, from how the dashboard cards are built in
 * page.tsx), but the mobile carousel's outer slot used to be sized
 * responsively ("78vw", maxWidth 320) instead of matching that exactly.
 * Since the content didn't stretch to fill its slot, it sat left-aligned
 * with empty space beside it, so cards never actually landed centered
 * under the snap-scroll -- they looked shifted/"off place". Fixed by
 * sizing each slot to the same cardWidth the content already uses, so
 * there's no leftover space to misalign against.
 *
 * CLICK-TO-EXPAND MODAL: removed. It worked in testing but proved
 * unreliable in real use, so rather than keep patching it, the feature
 * is gone -- clicking/tapping a card now only brings it forward, same as
 * hover, nothing more.
 */
export default function CardFan({
  items,
  cardWidth = 230,
  dotColor = "#0F0E0C20",
}: {
  items: { rotate: number; offsetX: number; content: ReactNode; label: ReactNode }[];
  cardWidth?: number;
  dotColor?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function activate(i: number) {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActive(i);
  }
  function deactivate() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setActive(null), 120);
  }

  const n = items.length;
  const scale = 1.1;
  const offsets = items.map((it) => it.offsetX);
  const minEdge = Math.min(...offsets) - (cardWidth * scale) / 2;
  const maxEdge = Math.max(...offsets) + (cardWidth * scale) / 2;
  const span = maxEdge - minEdge;
  const zoneWidth = span / n;
  const hitboxH = Math.ceil(cardWidth * 0.78) + 140;

  return (
    <>
      {/* ===== MOBILE / TABLET: swipe carousel, below lg ===== */}
      <div className="lg:hidden -mx-5">
        <div
          className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <div key={i} className="shrink-0 snap-center" style={{ width: cardWidth }}>
              <BrowserCard className="rounded-xl" maxTilt={0} scaleOnHover={1}>
                <div className="rounded-xl overflow-hidden" style={{ boxShadow: "0 20px 45px -20px rgba(15,14,12,0.35)" }}>
                  {item.content}
                </div>
              </BrowserCard>
              <div className="text-center mt-3">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-1">
          {items.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
          ))}
        </div>
        <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.12em] mt-2" style={{ color: dotColor }}>
          Swipe to see all {items.length} &rarr;
        </p>
      </div>

      {/* ===== DESKTOP / TABLET LANDSCAPE: fanned deck, lg and up ===== */}
      <div className="relative hidden lg:flex justify-center" style={{ height: hitboxH + 20 }}>
        {items.map((item, i) => {
          const isActive = active === i;
          const isAnyActive = active !== null;
          const zoneLeft = minEdge + i * zoneWidth;
          // Integer z-index only -- CSS silently drops fractional values (falls
          // back to "auto", meaning DOM order decides paint order instead of this
          // formula), which is what broke the "center card on top" stacking here.
          // Distance from the center card, in whole steps: 0, 1, 1, 2, 2...
          const distFromCenter = Math.abs(i - (n - 1) / 2);
          const restZ = 20 - Math.round(distFromCenter * 4);
          // Idle "breathing" -- a very subtle scale pulse so the deck doesn't
          // sit completely dead when nothing is hovered. Only touches the
          // visual content div's transform, never the hitbox/z-index above,
          // and is fully disabled the moment anything is hovered so it can
          // never fight with the existing hover transform.
          const breatheName = `cardfan-breathe-${i}`;
          return (
            <div
              key={i}
              data-cursor-hover
              onMouseEnter={() => activate(i)}
              onMouseLeave={deactivate}
              onClick={() => (isActive ? setActive(null) : activate(i))}
              className="absolute cursor-pointer"
              style={{
                width: zoneWidth,
                height: hitboxH,
                left: `calc(50% + ${zoneLeft}px)`,
                top: 0,
                // Each hit-zone is a non-overlapping slice (fixed above), but it's
                // also position:absolute with its own z-index, which makes it its
                // own stacking context -- meaning the INNER card's z-index (below)
                // only ever competed within its own zone, never against its
                // neighbours. Painting order between cards was actually being
                // decided by DOM order, not by "center on top" as intended. This
                // outer z-index has to carry the real fan-stacking value so
                // paint order matches the pyramid look for real.
                zIndex: isActive ? 50 : restZ,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 20,
              }}
            >
              <style>{`
                @keyframes ${breatheName} {
                  0%, 100% { transform: rotate(${item.rotate}deg) scale(1); }
                  50% { transform: rotate(${item.rotate}deg) scale(1.018); }
                }
              `}</style>
              <div
                style={{
                  width: cardWidth,
                  transform: isActive
                    ? "rotate(0deg) scale(1.1) translateY(-16px)"
                    : `rotate(${item.rotate}deg) scale(1)`,
                  transformOrigin: "bottom center",
                  opacity: isAnyActive && !isActive ? 0.5 : 1,
                  filter: isAnyActive && !isActive ? "blur(1.5px)" : "blur(0px)",
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, filter 0.3s ease",
                  animation: isAnyActive ? "none" : `${breatheName} 4.2s ease-in-out ${i * 0.35}s infinite`,
                  pointerEvents: "none",
                  position: "relative",
                }}
              >
                {item.content}
              </div>
              <div
                className="text-center mt-3"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
                  pointerEvents: "none",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
