"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Wraps an icon badge; on hover it does a quick rotational wiggle instead
 * of a flat lift. Touch devices get the wiggle on tap (via onClick toggling
 * briefly) since there's no hover state to trigger it.
 */
export default function WiggleIcon({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => {
        setActive(true);
        setTimeout(() => setActive(false), 600);
      }}
      style={{
        display: "inline-flex",
        transform: active ? "rotate(-8deg) scale(1.08)" : "rotate(0deg) scale(1)",
        transition: active
          ? "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)"
          : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
