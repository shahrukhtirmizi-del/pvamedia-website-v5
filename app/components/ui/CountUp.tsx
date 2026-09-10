"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";

/** Counts from zero to `to` the first time it scrolls into view. */
export default function CountUp({
  to,
  from = 0,
  duration = 1500,
  prefix = "",
  suffix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5, once: true });
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || reduce) return;
    started.current = true;

    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {reduce ? to : value}
      {suffix}
    </span>
  );
}
