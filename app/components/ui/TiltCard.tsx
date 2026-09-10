"use client";

import { useRef } from "react";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "./hooks";

/**
 * Tilts toward the cursor and lifts on hover. Transform only, driven straight
 * from the pointer event to the element's style so no React state changes on
 * pointer move. Fine pointers only: on touch there is no cursor to follow and
 * a scroll-linked tilt would be motion for its own sake.
 */
export default function TiltCard({
  children,
  className = "",
  style,
  maxTilt = 5,
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${(x * maxTilt).toFixed(2)}deg) rotateX(${(
      -y * maxTilt
    ).toFixed(2)}deg) translate3d(0, ${-lift}px, 0)`;
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translate3d(0,0,0)";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={className}
      style={{
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
