"use client";

import { useEffect, useRef } from "react";
import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

/**
 * Subtle 3D tilt. On mouse devices it follows the cursor (as before).
 * On touch devices there's no cursor to follow, so instead it ties a
 * gentle rotateX to scroll position -- the card tilts slightly as it
 * moves through the viewport, easing flat as it nears center. Cheap
 * (one scroll listener, no rAF loop) and scoped only to touch devices,
 * so it never fights with or duplicates the mouse behaviour.
 */
export default function TiltCard({
  children,
  className = "",
  style,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useRef(false);

  useEffect(() => {
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse.current) return;

    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      const clamped = Math.max(-1, Math.min(1, centerOffset));
      el.style.transform = `perspective(900px) rotateX(${clamped * -maxTilt * 0.6}deg) translateZ(0)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxTilt]);

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (coarse.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg) translateZ(0)`;
  }

  function onLeave() {
    if (coarse.current) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s ease-out", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}
