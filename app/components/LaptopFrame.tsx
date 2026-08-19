"use client";

import type { ReactNode } from "react";

/**
 * A laptop-hardware frame (screen bezel + base) instead of a flat
 * rectangle. Desktop views show real nav structure and layout, which
 * reads far more convincingly as an actual crafted website than a
 * photo-dominated mobile hero crop does.
 *
 * IMPORTANT: the screen area inside is fixed at aspect-ratio 16/10 with
 * object-cover on whatever image goes inside. Source photos MUST be shot
 * or generated landscape (~16:10, e.g. 1600x1000+) or object-cover will
 * crop out most of the top/bottom of a portrait photo and show an
 * arbitrary horizontal slice through the middle -- this is what made
 * Fresh Cut / Collage / Pastorale look bad before (their source images
 * were 1122x1402 and 825x1024, portrait, stuffed into a landscape frame).
 */
export default function LaptopFrame({ children, width = 360 }: { children: ReactNode; width?: number }) {
  return (
    <div className="relative mx-auto" style={{ width }}>
      {/* screen */}
      <div
        className="relative rounded-t-[14px] p-[10px] pb-3"
        style={{ background: "#1a1b1d", boxShadow: "0 40px 70px -25px rgba(0,0,0,0.5)" }}
      >
        <div className="relative rounded-[3px] overflow-hidden bg-black" style={{ aspectRatio: "16 / 10" }}>
          {children}
        </div>
      </div>
      {/* base */}
      <div
        className="relative h-[9px] rounded-b-[6px]"
        style={{ background: "linear-gradient(180deg, #2a2b2d 0%, #17181a 100%)" }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[70px] h-[4px] rounded-b-[4px]" style={{ background: "#0d0e0f" }} />
      </div>
    </div>
  );
}
