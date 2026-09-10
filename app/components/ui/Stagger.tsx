"use client";

import type { ReactNode } from "react";
import { useInView, useReducedMotion } from "./hooks";

/**
 * Reveals children one at a time. Used for feature lists inside pricing tiers
 * and testimonials, where the sequence tells you the list is worth reading
 * rather than everything landing in one flat block.
 */
export default function Stagger({
  children,
  staggerMs = 80,
  className = "",
  itemClassName = "",
}: {
  children: ReactNode[];
  staggerMs?: number;
  className?: string;
  itemClassName?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15, once: true });
  const shown = reduce || inView;

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          className={itemClassName}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(10px)",
            transition: reduce
              ? undefined
              : `opacity 0.5s ease ${i * staggerMs}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${
                  i * staggerMs
                }ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
