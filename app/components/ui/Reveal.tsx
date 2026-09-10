"use client";

import type { ReactNode } from "react";
import { useInView, useReducedMotion } from "./hooks";

/** Sections fade and lift as they enter the viewport. Static if motion is reduced. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12, once: true });

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: inView ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </Tag>
  );
}
