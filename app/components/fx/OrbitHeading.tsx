"use client";

import { useEffect, useRef } from "react";

/**
 * An oversized headline ringed by orbiting 4:3 plates.
 *
 * This is the reference canvas ring-projection, math intact: the same
 * U / V / AXIS plane basis, the same perspective `project()` divide, the
 * same per-tile setTransform from the projected tangent and axis edges,
 * the same painter's-algorithm z-sort with the headline drawn at the
 * moment the ring crosses behind it.
 *
 * What changed for this project:
 *   - the plates carry real client photography instead of procedural
 *     gradient wallpapers
 *   - the design frame is 1600x900 and scales to its container, not the
 *     whole window
 *   - the reference's corner labels are gone
 *   - it holds one still frame under prefers-reduced-motion, and stops
 *     rendering when scrolled out of view
 */

const DW = 1600;
const DH = 900;
const DASP = DW / DH;

const RING = {
  cx: 800,
  cy: 452,
  a: 385, // projected semi-major axis
  ratio: 0.492, // semi-minor / semi-major, a 60.5 degree plane tilt
  axis: 25.5, // screen angle of the major axis, degrees, y down
  n: 12, // plates
  tile: 187, // plate side in ring units where R = a
  radius: 0.22, // corner radius as a fraction of the side
  dist: 13, // camera distance in ring radii
  phase: 93, // psi of plate 0 at t = 0
};

const DUR = 26; // one revolution, a seamless loop
const TS = 420; // plate texture resolution

export default function OrbitHeading({
  lineOne,
  lineTwo,
  images,
  className = "",
}: {
  lineOne: string;
  lineTwo: string;
  images: string[];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let visible = true;

    let W = 0;
    let H = 0;
    let K = 1;
    let OX = 0;
    let OY = 0;
    let headLayer: HTMLCanvasElement | null = null;

    const front: HTMLCanvasElement[] = [];
    const back: HTMLCanvasElement[] = [];

    const d2sx = (x: number) => OX + x * K;
    const d2sy = (y: number) => OY + y * K;

    function mkc(w: number, h: number) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    }

    /* ---- ring plane basis. u / v span the plane, z points at the viewer ---- */
    const ax = (RING.axis * Math.PI) / 180;
    const cf = RING.ratio;
    const sf = Math.sqrt(1 - cf * cf);
    const U = [Math.cos(ax), Math.sin(ax), 0];
    const V = [-Math.sin(ax) * cf, Math.cos(ax) * cf, sf];
    const AXIS = [
      U[1] * V[2] - U[2] * V[1],
      U[2] * V[0] - U[0] * V[2],
      U[0] * V[1] - U[1] * V[0],
    ];

    function roundRectPath(x: CanvasRenderingContext2D, w: number, h: number, r: number) {
      x.beginPath();
      x.moveTo(-w / 2 + r, -h / 2);
      x.lineTo(w / 2 - r, -h / 2);
      x.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      x.lineTo(w / 2, h / 2 - r);
      x.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      x.lineTo(-w / 2 + r, h / 2);
      x.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      x.lineTo(-w / 2, -h / 2 + r);
      x.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      x.closePath();
    }

    /* ---- plate textures: cover-fit the photo, then a reversed dark side ---- */
    function buildTexture(img: HTMLImageElement) {
      const c = mkc(TS, TS);
      const x = c.getContext("2d");
      if (!x) return null;

      x.fillStyle = "#0a1533";
      x.fillRect(0, 0, TS, TS);

      const scale = Math.max(TS / img.width, TS / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      x.imageSmoothingQuality = "high";
      x.drawImage(img, (TS - w) / 2, (TS - h) / 2, w, h);

      // sit the photography inside the page's palette rather than beside it:
      // a cool multiply pulls the greens toward platinum, then a midnight
      // wash drops the overall level so the plates orbit rather than shout
      x.globalCompositeOperation = "multiply";
      x.fillStyle = "rgba(138,156,198,1)";
      x.fillRect(0, 0, TS, TS);
      x.globalCompositeOperation = "source-over";
      x.fillStyle = "rgba(5,11,31,0.4)";
      x.fillRect(0, 0, TS, TS);

      const d = mkc(TS, TS);
      const y = d.getContext("2d");
      if (y) {
        y.drawImage(c, 0, 0);
        y.globalCompositeOperation = "multiply";
        y.fillStyle = "rgba(10,21,51,0.82)";
        y.fillRect(0, 0, TS, TS);
      }
      return { front: c, back: d };
    }

    /* ---- headline layer ---- */

    /** Font size at which `str` inks exactly `targetW` wide. Uniform scale, so
     *  letterforms stay correct rather than being stretched to fit. */
    function sizeForWidth(
      x: CanvasRenderingContext2D,
      str: string,
      font: string,
      weight: string,
      targetW: number
    ) {
      const probe = 100;
      x.font = `${weight} ${probe}px ${font}`;
      const m = x.measureText(str);
      const inkW = (m.actualBoundingBoxRight || m.width) + (m.actualBoundingBoxLeft || 0);
      return inkW > 0 ? (probe * targetW) / inkW : probe;
    }

    function drawLine(
      x: CanvasRenderingContext2D,
      str: string,
      font: string,
      weight: string,
      size: number,
      cx: number,
      baseline: number,
      color: string
    ) {
      x.save();
      x.font = `${weight} ${size}px ${font}`;
      x.fillStyle = color;
      x.textBaseline = "alphabetic";
      x.textAlign = "center";
      x.fillText(str, cx, baseline);
      x.restore();
    }

    function buildHead(fontFamily: string) {
      headLayer = mkc(Math.max(1, W), Math.max(1, H));
      const x = headLayer.getContext("2d");
      if (!x) return;

      // the headline has to out-measure the ring, or the plates cross the
      // words instead of orbiting them
      const targetW = DW * 0.62 * K;
      const longer = lineOne.length >= lineTwo.length ? lineOne : lineTwo;
      const size = sizeForWidth(x, longer, fontFamily, "700", targetW);

      x.font = `700 ${size}px ${fontFamily}`;
      const cap = x.measureText("H").actualBoundingBoxAscent || size * 0.71;
      const gap = cap * 1.22;

      // two lines, centred on the ring centre
      const blockTop = d2sy(RING.cy) - (cap + gap) / 2;
      drawLine(x, lineOne, fontFamily, "700", size, d2sx(RING.cx), blockTop + cap, "#c7cedc");
      drawLine(x, lineTwo, fontFamily, "700", size, d2sx(RING.cx), blockTop + cap + gap, "#f2eedf");
    }

    function project(p: number[]) {
      const k = (RING.a * K * RING.dist) / (RING.dist - p[2]);
      return [d2sx(RING.cx) + k * p[0], d2sy(RING.cy) + k * p[1], k];
    }

    function drawTile(i: number, psi: number) {
      if (!ctx || front.length === 0) return;
      const c = Math.cos(psi);
      const s = Math.sin(psi);
      const C = [c * U[0] + s * V[0], c * U[1] + s * V[1], c * U[2] + s * V[2]];
      const T = [-s * U[0] + c * V[0], -s * U[1] + c * V[1], -s * U[2] + c * V[2]];
      const h = RING.tile / (2 * RING.a);
      const p0 = project(C);
      const pT = project([C[0] + T[0] * h, C[1] + T[1] * h, C[2] + T[2] * h]);
      const pA = project([
        C[0] + AXIS[0] * h,
        C[1] + AXIS[1] * h,
        C[2] + AXIS[2] * h,
      ]);
      const ex = pT[0] - p0[0];
      const ey = pT[1] - p0[1];
      const fx = pA[0] - p0[0];
      const fy = pA[1] - p0[1];
      if (Math.abs(ex * fy - ey * fx) < 0.4) return; // edge on

      const facing = C[2] > 0;
      const set = facing ? front : back;
      const img = set[i % set.length];
      if (!img) return;

      ctx.save();
      ctx.setTransform((ex * 2) / TS, (ey * 2) / TS, (fx * 2) / TS, (fy * 2) / TS, p0[0], p0[1]);
      roundRectPath(ctx, TS, TS, TS * RING.radius);
      ctx.clip();
      ctx.drawImage(img, -TS / 2, -TS / 2, TS, TS);
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function render(t: number) {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingQuality = "high";

      const spin = (t / DUR) * Math.PI * 2;
      const list: { i: number; psi: number; z: number }[] = [];
      for (let i = 0; i < RING.n; i++) {
        const psi =
          (RING.phase * Math.PI) / 180 - (i * 2 * Math.PI) / RING.n + spin;
        const c = Math.cos(psi);
        const s = Math.sin(psi);
        list.push({ i, psi, z: c * U[2] + s * V[2] });
      }
      list.sort((a, b) => a.z - b.z);

      let drawnText = false;
      for (let i = 0; i < list.length; i++) {
        if (!drawnText && list[i].z > 0 && headLayer) {
          ctx.drawImage(headLayer, 0, 0);
          drawnText = true;
        }
        drawTile(list[i].i, list[i].psi);
      }
      if (!drawnText && headLayer) ctx.drawImage(headLayer, 0, 0);
    }

    function resize() {
      if (!wrap || !cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(wrap.clientWidth * dpr));
      H = Math.max(1, Math.round(wrap.clientHeight * dpr));
      cv.width = W;
      cv.height = H;
      const S = Math.min(W, H * DASP);
      K = S / DW;
      OX = (W - DW * K) / 2;
      OY = (H - DH * K) / 2;
      buildHead(fontFamily);
    }

    let fontFamily = 'system-ui, sans-serif';
    let t0 = performance.now();
    let tNow = 0;

    function frame(now: number) {
      if (disposed) return;
      if (!visible) {
        raf = 0;
        return;
      }
      tNow = ((now - t0) / 1000) % DUR;
      render(tNow);
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce && !raf && !disposed) {
          t0 = performance.now() - tNow * 1000;
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(cv);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce || !raf) render(tNow);
    });

    async function start() {
      // canvas text needs the resolved family name from the loaded webfont
      fontFamily = getComputedStyle(wrap!).fontFamily || fontFamily;
      try {
        await document.fonts.ready;
      } catch {
        /* font loading API unavailable, the fallback stack still renders */
      }
      if (disposed) return;

      const loaded = await Promise.all(
        images.map(
          (src) =>
            new Promise<HTMLImageElement | null>((resolve) => {
              const im = new Image();
              im.onload = () => resolve(im);
              im.onerror = () => resolve(null);
              im.src = src;
            })
        )
      );
      if (disposed) return;

      for (const im of loaded) {
        if (!im) continue;
        const tex = buildTexture(im);
        if (tex) {
          front.push(tex.front);
          back.push(tex.back);
        }
      }

      resize();
      ro.observe(wrap!);
      if (reduce) {
        render(0);
      } else {
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    start();

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lineOne, lineTwo, images]);

  return (
    <div
      ref={wrapRef}
      className={`font-display relative w-full ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {/* the headline is painted into the canvas, so it is repeated here for
          screen readers and for anyone the canvas fails to render for */}
      <h2 className="sr-only">
        {lineOne} {lineTwo}
      </h2>
    </div>
  );
}
