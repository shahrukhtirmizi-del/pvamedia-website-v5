"use client";

import { Star } from "lucide-react";
import { useInView, useReducedMotion } from "./hooks";

/** Five stars filling one after another when the quote comes into view. */
export default function Stars({ count = 5, size = 15 }: { count?: number; size?: number }) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6, once: true });
  const shown = reduce || inView;

  return (
    <div ref={ref} className="flex gap-1" role="img" aria-label={`${count} out of ${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: "inline-flex",
            opacity: shown ? 1 : 0,
            transform: shown ? "scale(1)" : "scale(0.6)",
            transition: reduce
              ? undefined
              : `opacity 0.35s ease ${i * 110}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`,
          }}
        >
          <Star size={size} strokeWidth={1.5} fill="var(--accent)" color="var(--accent)" />
        </span>
      ))}
    </div>
  );
}
