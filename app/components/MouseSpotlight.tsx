"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the cursor with a slight lag, layered
 * behind the hero content. Uses CSS custom properties updated via
 * requestAnimationFrame rather than React state, so it never triggers a
 * re-render and stays smooth even on lower-end machines.
 */
export default function MouseSpotlight({ color = "#1F5233" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.35 });
  const current = useRef({ x: 0.5, y: 0.35 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el!.parentElement!.getBoundingClientRect();
      target.current.x = (e.clientX - rect.left) / rect.width;
      target.current.y = (e.clientY - rect.top) / rect.height;
    }

    let raf: number;
    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      if (el) {
        el.style.setProperty("--x", `${current.current.x * 100}%`);
        el.style.setProperty("--y", `${current.current.y * 100}%`);
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0"
      style={
        {
          "--x": "50%",
          "--y": "35%",
          background: `radial-gradient(600px circle at var(--x) var(--y), ${color}1F 0%, transparent 60%)`,
        } as React.CSSProperties
      }
    />
  );
}
