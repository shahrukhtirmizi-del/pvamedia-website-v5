"use client";

import { useInView, useReducedMotion } from "./hooks";

/** Fills from empty to `percent` the first time it enters the viewport. */
export default function FillBar({
  percent,
  delay = 0,
  height = 4,
  label,
}: {
  percent: number;
  delay?: number;
  height?: number;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5, once: true });
  const filled = reduce || inView;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      style={{
        width: "100%",
        height,
        borderRadius: 999,
        background: "rgba(244, 244, 242,0.09)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: filled ? `${percent}%` : "0%",
          borderRadius: 999,
          background: "var(--accent)",
          transition: reduce
            ? undefined
            : `width 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}
      />
    </div>
  );
}
