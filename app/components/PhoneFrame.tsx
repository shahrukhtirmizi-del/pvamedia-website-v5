"use client";

import type { ReactNode } from "react";

/**
 * A real phone-hardware frame (bezel, notch, side buttons) rather than a
 * flat rectangle screenshot. Reads as premium/considered the way actual
 * Apple-style marketing imagery does, and gives mobile mockups room to
 * breathe instead of being crammed into a tiny desktop-browser box.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 240 }}>
      <div
        className="relative rounded-[38px] p-[9px]"
        style={{ background: "#111214", boxShadow: "0 40px 70px -25px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        {/* side buttons */}
        <div className="absolute -left-[2px] top-[70px] w-[2px] h-[26px] rounded-l-sm" style={{ background: "#111214" }} />
        <div className="absolute -left-[2px] top-[105px] w-[2px] h-[42px] rounded-l-sm" style={{ background: "#111214" }} />
        <div className="absolute -right-[2px] top-[95px] w-[2px] h-[52px] rounded-r-sm" style={{ background: "#111214" }} />

        <div className="relative rounded-[30px] overflow-hidden bg-black" style={{ aspectRatio: "9 / 19.5" }}>
          {children}
          {/* notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[86px] h-[22px] bg-black rounded-b-[14px] z-20" />
        </div>
      </div>
    </div>
  );
}
