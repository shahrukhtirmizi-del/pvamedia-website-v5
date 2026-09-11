"use client";

import { useEffect, useRef } from "react";
import { introPlaying } from "../../lib/intro";
import { isCoarse } from "../../lib/device";

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
    // phones get the same picture from far fewer particles and half the frames
    const coarse = isCoarse();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let disposed = false;
    let px = -9999;
    let py = -9999;

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; ph: number };
    type F = { t: number; v: number; jx: number; jy: number; r: number; a: number; tw: number; ph: number; ox: number; oy: number };
    let parts: P[] = [];
    let ring: F[] = [];
    let halo: { x: number; y: number; r: number; a: number; tw: number; ph: number }[] = [];
    let framePoint: ((t: number) => [number, number]) | null = null;
    /* on touch there is no pointer to scatter the light, so the frame and
       halo are baked into three shimmer layers once and crossfaded, instead
       of hundreds of sprites drawn every frame */
    let baked: HTMLCanvasElement[] = [];
    let starC = { x: 0, y: 0 };
    let starHome = { x: 0, y: 0 };
    let frameBox = { x0: 0, y0: 0, x1: 0, y1: 0 };

    function seedFree() {
      const target = Math.round(
        Math.min(520, Math.max(40, ((W * H) / (dpr * dpr) / 13000) * density * (coarse && fixed ? 0.6 : 1)))
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
      const count = Math.min(coarse ? 650 : 1600, Math.round(perim / ((coarse ? 2.4 : 1.15) * dpr)));

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

      framePoint = pointAt;
      for (let i = 0; i < count; i++) {
        // scatter: most hug the line, some drift a few px out
        const spread = Math.random() < 0.66 ? 1.6 : Math.random() < 0.7 ? 8 : 16;
        ring.push({
          t: i / count,
          // a slow crawl along the border, a few going the other way
          v: (0.00002 + Math.random() * 0.00005) * (Math.random() < 0.85 ? 1 : -1),
          jx: (Math.random() - 0.5) * spread * dpr,
          jy: (Math.random() - 0.5) * spread * dpr,
          r: (0.45 + Math.random() * 1.2) * dpr,
          a: 0.35 + Math.random() * 0.6,
          tw: 0.6 + Math.random() * 1.8,
          ph: Math.random() * Math.PI * 2,
          ox: 0,
          oy: 0,
        });
      }
      starHome = { x: x0 + w * 0.22, y: y0 + h * 0.09 };
      starC = { ...starHome };
      const inset = 26 * dpr;
      frameBox = { x0: x0 + inset, y0: y0 + inset, x1: x0 + w - inset, y1: y0 + h - inset };

      // a cloud of light gathered around the star, thickest at its centre
      halo = [];
      for (let i = 0; i < (coarse ? 90 : 180); i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.pow(Math.random(), 0.6) * 58 * dpr;
        halo.push({
          x: Math.cos(ang) * rad,
          y: Math.sin(ang) * rad * 0.9,
          r: (0.4 + Math.random() * 1.3) * dpr,
          a: 0.3 + Math.random() * 0.6,
          tw: 0.8 + Math.random() * 2,
          ph: Math.random() * Math.PI * 2,
        });
      }
      if (coarse) bakeLayers();
    }

    function resize() {
      if (!cv) return;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : maxDpr);
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
    let mintSprite: HTMLCanvasElement | null = null;
    const DOT = 16;
    function buildDot() {
      const c = document.createElement("canvas");
      c.width = c.height = DOT;
      const x = c.getContext("2d");
      if (!x) return;
      const g = x.createRadialGradient(DOT / 2, DOT / 2, 0, DOT / 2, DOT / 2, DOT / 2);
      g.addColorStop(0, "rgba(236,238,236,1)");
      g.addColorStop(0.45, "rgba(236,238,236,0.55)");
      g.addColorStop(1, "rgba(236,238,236,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, DOT, DOT);
      dotSprite = c;

      // the same dot in the accent, for the cloud around the star
      const m = document.createElement("canvas");
      m.width = m.height = DOT;
      const y = m.getContext("2d");
      if (!y) return;
      const g2 = y.createRadialGradient(DOT / 2, DOT / 2, 0, DOT / 2, DOT / 2, DOT / 2);
      g2.addColorStop(0, "rgba(150,240,205,1)");
      g2.addColorStop(0.45, "rgba(98,220,176,0.6)");
      g2.addColorStop(1, "rgba(98,220,176,0)");
      y.fillStyle = g2;
      y.fillRect(0, 0, DOT, DOT);
      mintSprite = m;
    }
    buildDot();
    function buildStar() {
      const s = 30 * dpr;
      const pad = 56 * dpr;
      const c = document.createElement("canvas");
      c.width = c.height = Math.ceil((s + pad) * 2);
      const x = c.getContext("2d");
      if (!x) return;
      x.translate(c.width / 2, c.height / 2);
      x.shadowColor = "rgba(98,220,176,0.95)";
      x.shadowBlur = 22 * dpr;
      x.fillStyle = "rgba(150,240,205,1)";
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

    function bakeLayers() {
      baked = [];
      if (!framePoint || !dotSprite) return;
      for (let k = 0; k < 3; k++) {
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        const x = c.getContext("2d");
        if (!x) continue;
        const phase = (k / 3) * Math.PI * 2;
        for (const f of ring) {
          const [bx, by] = framePoint(f.t);
          const tw = 0.55 + 0.45 * Math.sin(phase * f.tw + f.ph);
          const size = f.r * 2.4;
          x.globalAlpha = f.a * tw;
          x.drawImage(dotSprite, bx + f.jx - size / 2, by + f.jy - size / 2, size, size);
        }
        for (const h of halo) {
          const tw = 0.5 + 0.5 * Math.sin(phase * h.tw + h.ph);
          const size = h.r * 2.4;
          x.globalAlpha = h.a * tw;
          x.drawImage(mintSprite ?? dotSprite, starHome.x + h.x - size / 2, starHome.y + h.y - size / 2, size, size);
        }
        x.globalAlpha = 1;
        baked.push(c);
      }
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

      if (coarse && baked.length === 3) {
        // crossfade between the three shimmer layers, then the star on top
        const ph = ((t * 0.0005) % 3 + 3) % 3;
        const i = Math.floor(ph);
        const fr = ph - i;
        ctx.globalAlpha = 1 - fr;
        ctx.drawImage(baked[i], 0, 0);
        ctx.globalAlpha = fr;
        ctx.drawImage(baked[(i + 1) % 3], 0, 0);
        ctx.globalAlpha = 1;
        drawStar(t);
        return;
      }

      const repel = 110 * dpr;
      for (const f of ring) {
        if (!framePoint) break;
        f.t = (f.t + f.v * 16 + 1) % 1;
        const [bx, by] = framePoint(f.t);
        let x = bx + f.jx + Math.sin(t * 0.0007 + f.ph) * 0.6 * dpr;
        let y = by + f.jy + Math.cos(t * 0.0009 + f.ph) * 0.6 * dpr;

        // the pointer pushes the light aside and it eases back when it leaves
        const dx = x - px;
        const dy = y - py;
        const d = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;
        if (d < repel && d > 0.001) {
          const push = ((repel - d) / repel) * 34 * dpr;
          tx = (dx / d) * push;
          ty = (dy / d) * push;
        }
        f.ox += (tx - f.ox) * 0.12;
        f.oy += (ty - f.oy) * 0.12;
        x += f.ox;
        y += f.oy;

        const disturbed = Math.min(1, Math.hypot(f.ox, f.oy) / (18 * dpr));
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0012 * f.tw + f.ph);
        const size = f.r * 2.4 * (1 + disturbed * 0.8);
        ctx.globalAlpha = Math.min(1, f.a * twinkle + disturbed * 0.5);
        ctx.drawImage(dotSprite!, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // the star goes where the pointer goes, but only inside the frame;
      // outside it, it drifts back to its place at the head
      if (frame) {
        const inside = px > frameBox.x0 && px < frameBox.x1 && py > frameBox.y0 && py < frameBox.y1;
        const tx = inside ? px : starHome.x;
        const ty = inside ? py : starHome.y;
        starC.x += (tx - starC.x) * 0.08;
        starC.y += (ty - starC.y) * 0.08;
      }

      for (const h of halo) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.0014 * h.tw + h.ph);
        const size = h.r * 2.4;
        ctx.globalAlpha = h.a * twinkle;
        ctx.drawImage(mintSprite ?? dotSprite!, starC.x + h.x - size / 2, starC.y + h.y - size / 2, size, size);
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
      // 60 frames a second on desktop; phones draw every other frame
      const interval = coarse ? (fixed ? 50 : 30) : fixed ? 15 : 0;
      if (!introPlaying() && now - lastDraw >= interval) {
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
