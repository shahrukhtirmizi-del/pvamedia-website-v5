"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A bar that animates from 0 to its target height once scrolled into
 * view, instead of just appearing at full height statically.
 */
export default function GrowBar({
  targetHeight,
  color,
  delay = 0,
}: {
  targetHeight: string;
  color: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setGrown(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="w-full rounded-t-lg" style={{ height: "100%", display: "flex", alignItems: "flex-end" }}>
      <div
        className="w-full rounded-t-lg"
        style={{
          height: grown ? targetHeight : "0%",
          background: color,
          transition: "height 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}
