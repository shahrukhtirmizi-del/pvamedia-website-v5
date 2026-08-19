"use client";

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";

/**
 * A text link whose underline draws itself in from the left on hover
 * (width-based, GPU cheap) instead of a flat color/opacity change.
 *
 * BUG FIXED: the first version drove the underline width with an inline
 * style (width: 0%) and tried to override it on hover via an external
 * ".draw-link:hover .draw-link-underline { width: 100% }" CSS rule.
 * Inline styles always beat stylesheet rules regardless of selector
 * specificity, so that rule silently never applied -- confirmed via
 * getComputedStyle showing 0px even while :hover matched. Fixed by
 * driving the width from React state instead, same pattern already used
 * by WiggleIcon elsewhere in this codebase.
 */
export default function DrawLink({
  href,
  children,
  color = "currentColor",
  style,
  className = "",
}: {
  href: string;
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        textDecoration: "none",
        color,
        display: "inline-block",
        paddingBottom: 2,
        ...style,
      }}
    >
      {children}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1,
          width: hovered ? "100%" : "0%",
          background: color,
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </a>
  );
}
