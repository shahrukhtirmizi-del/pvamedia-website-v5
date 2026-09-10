"use client";

import { useEffect, useRef } from "react";

/**
 * Slow atmospheric dust. Particles drift upward and sideways, brightening as
 * they pass near the pointer, and cluster more densely toward the centre so
 * the hero frame reads as lit from within rather than evenly dusted.
 *
 * Cheap on purpose: one canvas, no per-particle DOM, and it stops entirely
 * when scrolled out of view or under reduced motion.
 */
export default function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let px = -9999;
    let py = -9999;

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; ph: number };
    let parts: P[] = [];

    function seed() {
      const target = Math.round(Math.min(150, Math.max(50, (W * H) / (dpr * dpr) / 12000)));
      parts = [];
      for (let i = 0; i < target; i++) {
        // bias toward the middle third so the frame sits in the densest air
        const bias = Math.random() < 0.55 ? 0.25 + Math.random() * 0.5 : Math.random();
        parts.push({
          x: bias * W,
          y: Math.random() * H,
          r: (0.5 + Math.random() * 1.6) * dpr,
          vx: (Math.random() - 0.5) * 0.09 * dpr,
          vy: -(0.06 + Math.random() * 0.22) * dpr,
          a: 0.16 + Math.random() * 0.5,
          tw: 0.4 + Math.random() * 1.5,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(cv.clientWidth * dpr));
      H = Math.max(1, Math.round(cv.clientHeight * dpr));
      cv.width = W;
      cv.height = H;
      seed();
    }

    function onPointerMove(e: PointerEvent) {
      if (!cv) return;
      const rect = cv.getBoundingClientRect();
      px = (e.clientX - rect.left) * dpr;
      py = (e.clientY - rect.top) * dpr;
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const reach = 150 * dpr;

      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -8) {
          p.y = H + 8;
          p.x = Math.random() * W;
        }
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;

        const twinkle = 0.65 + 0.35 * Math.sin(t * 0.001 * p.tw + p.ph);

        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        const near = d2 < reach * reach ? 1 - Math.sqrt(d2) / reach : 0;

        const alpha = Math.min(1, p.a * twinkle + near * 0.55);
        const radius = p.r * (1 + near * 0.9);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,206,220,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function frame(now: number) {
      if (disposed) return;
      if (!visible) {
        raf = 0;
        return;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    resize();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(cv);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce && !raf && !disposed) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "80px" }
    );
    io.observe(cv);

    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
