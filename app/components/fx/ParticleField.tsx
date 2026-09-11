"use client";

import { useEffect, useRef } from "react";
import { introPlaying } from "../../lib/intro";

/**
 * Slow atmospheric dust, optionally gathered into a frame.
 *
 * Free particles drift upward and brighten near the pointer. With `frame`
 * set, a second population is pinned along the perimeter of a rounded
 * rectangle (fractions of the canvas) and shimmers in place, which is what
 * draws the Milan-style bordered frame out of light rather than out of a
 * CSS border. A four-point star sits at the top of that frame and breathes.
 *
 * One canvas, no per-particle DOM. Stops entirely when scrolled out of view
 * or under reduced motion.
 */
export type FrameSpec = { x: number; y: number; w: number; h: number; r?: number };

export default function ParticleField({
  className = "",
  density = 1,
  frame,
  star = false,
  fixed = false,
  maxDpr = 2,
}: {
  className?: string;
  /** multiplier on the free-particle count */
  density?: number;
  /** rounded rectangle in canvas fractions, e.g. { x: .38, y: .12, w: .24, h: .68 } */
  frame?: FrameSpec;
  /** draw the breathing star at the top of the frame */
  star?: boolean;
  /** rendering behind a scrolling page: keep going even when "not visible" */
  fixed?: boolean;
  /** cap on device pixel ratio; the page-wide layer runs at 1 */
  maxDpr?: number;
}) {
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
    type F = { bx: number; by: number; jx: number; jy: number; r: number; a: number; tw: number; ph: number };
    let parts: P[] = [];
    let ring: F[] = [];
    let starC = { x: 0, y: 0 };

    function seedFree() {
      const target = Math.round(
        Math.min(320, Math.max(40, ((W * H) / (dpr * dpr) / 13000) * density))
      );
      parts = [];
      for (let i = 0; i < target; i++) {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: (0.4 + Math.pow(Math.random(), 2.2) * 1.9) * dpr,
          // a visible drift: sideways sway plus a steady rise
          vx: (Math.random() - 0.5) * 0.22 * dpr,
          vy: -(0.16 + Math.random() * 0.42) * dpr,
          a: 0.14 + Math.random() * 0.46,
          tw: 0.4 + Math.random() * 1.5,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    /** points along a rounded-rect perimeter, denser toward the corners */
    function seedFrame() {
      ring = [];
      if (!frame) return;
      const x0 = frame.x * W;
      const y0 = frame.y * H;
      const w = frame.w * W;
      const h = frame.h * H;
      const r = Math.min((frame.r ?? 0.08) * Math.min(w, h) * 2, w / 2, h / 2);
      const perim = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
      const count = Math.round(perim / (2.1 * dpr));

      // walk the perimeter: top edge, top-right arc, right edge, ... clockwise
      function pointAt(t: number): [number, number] {
        let d = t * perim;
        const seg = [
          { len: w - 2 * r, f: (u: number): [number, number] => [x0 + r + u, y0] },
          { len: (Math.PI / 2) * r, f: (u: number): [number, number] => { const a = -Math.PI / 2 + u / r; return [x0 + w - r + Math.cos(a) * r, y0 + r + Math.sin(a) * r]; } },
          { len: h - 2 * r, f: (u: number): [number, number] => [x0 + w, y0 + r + u] },
          { len: (Math.PI / 2) * r, f: (u: number): [number, number] => { const a = u / r; return [x0 + w - r + Math.cos(a) * r, y0 + h - r + Math.sin(a) * r]; } },
          { len: w - 2 * r, f: (u: number): [number, number] => [x0 + w - r - u, y0 + h] },
          { len: (Math.PI / 2) * r, f: (u: number): [number, number] => { const a = Math.PI / 2 + u / r; return [x0 + r + Math.cos(a) * r, y0 + h - r + Math.sin(a) * r]; } },
          { len: h - 2 * r, f: (u: number): [number, number] => [x0, y0 + h - r - u] },
          { len: (Math.PI / 2) * r, f: (u: number): [number, number] => { const a = Math.PI + u / r; return [x0 + r + Math.cos(a) * r, y0 + r + Math.sin(a) * r]; } },
        ];
        for (const s of seg) {
          if (d <= s.len) return s.f(d);
          d -= s.len;
        }
        return [x0 + r, y0];
      }

      for (let i = 0; i < count; i++) {
        const t = i / count;
        const [bx, by] = pointAt(t);
        // scatter: most hug the line, some drift a few px out
        const spread = Math.random() < 0.72 ? 1.2 : 6;
        ring.push({
          bx,
          by,
          jx: (Math.random() - 0.5) * spread * dpr,
          jy: (Math.random() - 0.5) * spread * dpr,
          r: (0.45 + Math.random() * 1.1) * dpr,
          a: 0.25 + Math.random() * 0.6,
          tw: 0.6 + Math.random() * 1.8,
          ph: Math.random() * Math.PI * 2,
        });
      }
      starC = { x: x0 + w * 0.62, y: y0 + h * 0.1 };
    }

    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      W = Math.max(1, Math.round(cv.clientWidth * dpr));
      H = Math.max(1, Math.round(cv.clientHeight * dpr));
      cv.width = W;
      cv.height = H;
      seedFree();
      seedFrame();
      if (star) buildStar();
    }

    function onPointerMove(e: PointerEvent) {
      if (!cv) return;
      const rect = cv.getBoundingClientRect();
      px = (e.clientX - rect.left) * dpr;
      py = (e.clientY - rect.top) * dpr;
    }

    /* the star's glow is a shadowBlur, which is expensive per frame, so it is
       drawn once to a sprite and only scaled while breathing */
    let starSprite: HTMLCanvasElement | null = null;

    /* one soft dot, blitted for every particle: drawImage is far cheaper than
       an arc + fill per particle per frame */
    let dotSprite: HTMLCanvasElement | null = null;
    const DOT = 16;
    function buildDot() {
      const c = document.createElement("canvas");
      c.width = c.height = DOT;
      const x = c.getContext("2d");
      if (!x) return;
      const g = x.createRadialGradient(DOT / 2, DOT / 2, 0, DOT / 2, DOT / 2, DOT / 2);
      g.addColorStop(0, "rgba(214,222,236,1)");
      g.addColorStop(0.45, "rgba(214,222,236,0.55)");
      g.addColorStop(1, "rgba(214,222,236,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, DOT, DOT);
      dotSprite = c;
    }
    buildDot();
    function buildStar() {
      const s = 13 * dpr;
      const pad = 30 * dpr;
      const c = document.createElement("canvas");
      c.width = c.height = Math.ceil((s + pad) * 2);
      const x = c.getContext("2d");
      if (!x) return;
      x.translate(c.width / 2, c.height / 2);
      x.shadowColor = "rgba(199,206,220,0.9)";
      x.shadowBlur = 22 * dpr;
      x.fillStyle = "rgba(226,232,242,0.95)";
      x.beginPath();
      // four-point star: long spikes, pinched waist
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4 - Math.PI / 2;
        const rad = i % 2 === 0 ? s : s * 0.22;
        const xx = Math.cos(ang) * rad;
        const yy = Math.sin(ang) * rad;
        if (i === 0) x.moveTo(xx, yy);
        else x.lineTo(xx, yy);
      }
      x.closePath();
      x.fill();
      starSprite = c;
    }

    function drawStar(t: number) {
      if (!ctx || !star || !frame || !starSprite) return;
      const breathe = 0.85 + 0.15 * Math.sin(t * 0.0016);
      const w = starSprite.width * breathe;
      ctx.drawImage(starSprite, starC.x - w / 2, starC.y - w / 2, w, w);
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const reach = 150 * dpr;

      for (const p of parts) {
        // each particle weaves a little as it rises, so the field reads as air
        p.x += p.vx + Math.sin(t * 0.0009 + p.ph) * 0.18 * dpr;
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
        const size = p.r * 2.6 * (1 + near * 0.9);
        ctx.globalAlpha = alpha;
        ctx.drawImage(dotSprite!, p.x - size / 2, p.y - size / 2, size, size);
      }

      for (const f of ring) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0012 * f.tw + f.ph);
        const x = f.bx + f.jx + Math.sin(t * 0.0007 + f.ph) * 0.6 * dpr;
        const y = f.by + f.jy + Math.cos(t * 0.0009 + f.ph) * 0.6 * dpr;
        const size = f.r * 2.4;
        ctx.globalAlpha = f.a * twinkle;
        ctx.drawImage(dotSprite!, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      drawStar(t);
    }

    let lastDraw = 0;
    function frameLoop(now: number) {
      if (disposed) return;
      if (!visible && !fixed) {
        raf = 0;
        return;
      }
      // nothing at all while the intro has the screen
      if (!introPlaying() && (!fixed || now - lastDraw >= 15)) {
        lastDraw = now;
        draw(now);
      }
      raf = requestAnimationFrame(frameLoop);
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
        if (visible && !reduce && !raf && !disposed) raf = requestAnimationFrame(frameLoop);
      },
      { rootMargin: "80px" }
    );
    if (!fixed) io.observe(cv);

    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      raf = requestAnimationFrame(frameLoop);
    }

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
    // frame is an object literal at call sites; compare by its parts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, star, fixed, frame?.x, frame?.y, frame?.w, frame?.h, frame?.r]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
