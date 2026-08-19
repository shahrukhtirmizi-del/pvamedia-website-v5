"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Reveals its children one at a time (staggered) when the wrapper scrolls
 * into view, instead of everything appearing simultaneously. Use for lists
 * -- checkmarks, star ratings -- where a sequential reveal reads as more
 * alive than one flat fade of the whole block.
 */
export default function SequentialReveal({
  children,
  staggerMs = 90,
  className = "",
}: {
  children: ReactNode[];
  staggerMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
      rootMargin: "0px 0px -30px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-8px)",
            transition: `opacity 0.4s ease ${i * staggerMs}ms, transform 0.4s ease ${i * staggerMs}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
