"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

/**
 * A button that gently shifts toward the cursor on hover, and eases back
 * to center on mouse leave. Small effect, but it's the kind of detail that
 * makes a site feel considered rather than templated.
 */
export default function MagneticButton({
  href,
  children,
  className = "",
  style,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: ReactMouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${className} active:scale-95`}
      style={{ transition: "transform 0.15s ease-out", ...style }}
    >
      {children}
    </a>
  );
}
