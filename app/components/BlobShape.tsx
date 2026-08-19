"use client";

import { useId } from "react";

/**
 * A soft organic blob that drifts slowly in place -- ambient background
 * motion, not attention-grabbing. Pure CSS animation, no JS per-frame work.
 *
 * BUG FIXED: the animation's unique keyframe name used to be generated with
 * Math.random() directly in the render body. That runs once when Next.js
 * statically builds the page (baking one random string into the HTML) and
 * again when React hydrates in the browser (computing a DIFFERENT random
 * string) -- a classic SSR/hydration mismatch, surfaced as React error
 * #418 in the console. Switched to useId(), which React guarantees
 * produces the identical value on the server render and the client
 * hydration pass.
 */
export default function BlobShape({
  color,
  size = 500,
  top,
  left,
  right,
  bottom,
  duration = 22,
  delay = 0,
  opacity = 0.5,
}: {
  color: string;
  size?: number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  duration?: number;
  delay?: number;
  opacity?: number;
}) {
  const reactId = useId();
  const id = `blob-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <>
      <style>{`
        @keyframes ${id} {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, -4%) scale(1.06); }
          66% { transform: translate(-2%, 3%) scale(0.97); }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: size,
          height: size,
          top,
          left,
          right,
          bottom,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
          opacity,
          pointerEvents: "none",
          zIndex: 0,
          animation: `${id} ${duration}s ease-in-out ${delay}s infinite`,
          willChange: "transform",
        }}
      />
    </>
  );
}
