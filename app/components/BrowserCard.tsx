"use client";

import { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

/**
 * A browser-window mockup card: chrome bar up top, real hero recreation
 * inside, with a cursor-following light-sweep, tilt, and scale on hover.
 * This is the actual "website portfolio" piece — it needs to read as a
 * website screenshot, not a photo, and it needs to feel alive under the
 * mouse since that's explicitly the whole point of this section.
 */
export default function BrowserCard({
  children,
  className = "",
  maxTilt = 6,
  scaleOnHover = 1.02,
  style,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const tiltX = (px - 0.5) * maxTilt;
    const tiltY = (py - 0.5) * -maxTilt;
    el.style.transform = `perspective(1200px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale(${scaleOnHover})`;
    setGlow({ x: px * 100, y: py * 100, active: true });
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)";
    setGlow((g) => ({ ...g, active: false }));
  }

  return (
    <div
      ref={ref}
      data-cursor-hover
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
      style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)", transformStyle: "preserve-3d", ...style }}
    >
      {children}
      {/* cursor-follow light sweep */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(340px circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.16) 0%, transparent 60%)`,
          opacity: glow.active ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
