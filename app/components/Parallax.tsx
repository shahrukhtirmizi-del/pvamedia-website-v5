"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Moves its children vertically at a fraction of scroll speed, so the
 * element drifts slower than the page, creating depth. Kept subtle
 * (small factor) so it reads as polish, not motion sickness.
 */
export default function Parallax({
  children,
  factor = 0.08,
  className = "",
}: {
  children: ReactNode;
  factor?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${-centerOffset * factor}px)`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
