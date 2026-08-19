"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up from `from` to `to` once it scrolls into
 * view. Used in the hero's growth card so "3 booked jobs a month to 12"
 * is something you watch happen, not just read.
 */
export default function CountUp({
  from,
  to,
  duration = 1400,
  suffix = "",
}: {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(from + (to - from) * eased));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [from, to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
