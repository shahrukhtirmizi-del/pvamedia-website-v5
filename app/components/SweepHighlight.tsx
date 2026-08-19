"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Animates a colored underline/highlight sweeping in from left to right
 * beneath text as it scrolls into view, instead of the color just being
 * static. Used on the small accent phrases throughout the page.
 */
export default function SweepHighlight({
  children,
  color = "#1F5233",
}: {
  children: ReactNode;
  color?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 92%",
        backgroundSize: visible ? "100% 34%" : "0% 34%",
        transition: "background-size 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </span>
  );
}
