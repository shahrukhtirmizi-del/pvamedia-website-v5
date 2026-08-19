"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A horizontal bar that fills from 0 to a target percentage when it
 * scrolls into view. Replays each time it re-enters, like ScrollReveal.
 */
export default function AnimatedFillBar({
  percent,
  color,
  trackColor = "rgba(0,0,0,0.08)",
  height = 6,
  delay = 0,
}: {
  percent: number;
  color: string;
  trackColor?: string;
  height?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height, borderRadius: 999, background: trackColor, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: visible ? `${percent}%` : "0%",
          background: color,
          borderRadius: 999,
          transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}
      />
    </div>
  );
}
