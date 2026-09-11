"use client";

import { useEffect, useRef } from "react";
import { introPlaying } from "../../lib/intro";
import { isCoarse } from "../../lib/device";

/**
 * Pointer-reactive laser beams meeting at a vanishing point.
 *
 * This is the reference WebGL shader, ported to React with its math intact:
 * the same sdLine / lightning / noise functions, the same three beam
 * directions, the same travelling pulses and flicker term. Only the things
 * that had to change for this project changed:
 *
 *   - the canvas is sized to its own element and DPR, not the window
 *   - pointer coordinates are relative to the canvas
 *   - it stops rendering entirely when scrolled out of view
 *   - it renders one static frame under prefers-reduced-motion
 *   - the beam colour stays the reference cool blue-white, which is why
 *     this palette is Midnight Blue and Platinum rather than a warm accent
 */
export default function LaserBackground({
  className = "",
  /** Vanishing point in clip space. Negative x sits left of centre. */
  centerX = -0.75,
  centerY = -0.15,
  opacity = 1,
  scale = 0.6,
}: {
  className?: string;
  centerX?: number;
  centerY?: number;
  opacity?: number;
  /** render resolution as a fraction of the element; the beams are soft, 0.6 is invisible */
  scale?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = isCoarse();
    // phones render the beams at a third of the size and half the frames
    const renderScale = coarse ? Math.min(scale, 0.35) : scale;

    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_mouseActive;
      uniform vec2 u_center;

      float hash(float n) { return fract(sin(n)*753.5453123); }
      float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        f = f*f*(3.0-2.0*f);
        return mix(hash(i), hash(i+1.0), f);
      }

      vec2 sdLine(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return vec2(length(pa - ba * h), h);
      }

      float lightning(vec2 uv, vec2 a, vec2 b, float t) {
        vec2 ab = b - a;
        float len = length(ab);
        if(len < 0.01) return 0.0;
        vec2 dir = ab / len;

        vec2 pa = uv - a;
        float h = clamp(dot(pa, dir) / len, 0.0, 1.0);
        float dist = length(pa - dir * (h * len));

        float env = sin(h * 3.1415);

        float offset = (noise(h * 25.0 - t * 35.0) - 0.5) * 0.08 * env;
        offset += (noise(h * 70.0 + t * 50.0) - 0.5) * 0.02 * env;

        float d = abs(dist + offset);

        return (0.0002 / (d + 0.0002) + 0.00001 / (d*d + 0.00001)) * env;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;

        vec2 mouseUV = u_mouse / u_resolution.xy;
        mouseUV = mouseUV * 2.0 - 1.0;
        mouseUV.x *= u_resolution.x / u_resolution.y;

        vec2 center = u_center;
        center.x += sin(u_time * 0.4) * 0.03;
        center.y += cos(u_time * 0.3) * 0.03;

        vec2 dirUp = normalize(vec2(0.15, 1.0));
        vec2 dirRight = normalize(vec2(1.0, -0.25));
        vec2 dirDownLeft = normalize(vec2(-0.8, -0.6));

        vec2 l1 = sdLine(uv, center, center + dirUp * 5.0);
        vec2 l2 = sdLine(uv, center, center + dirRight * 5.0);
        vec2 l3 = sdLine(uv, center, center + dirDownLeft * 5.0);

        float intensity = 0.006;
        float glow = intensity / (l1.x + 0.001) +
                     intensity / (l2.x + 0.001) +
                     (intensity * 0.4) / (l3.x + 0.001);

        float pulse1 = smoothstep(0.1, 0.0, abs(l1.y - fract(u_time * 0.4))) * 0.03 / (l1.x + 0.001);
        float pulse2 = smoothstep(0.1, 0.0, abs(l2.y - fract(u_time * 0.5 + 0.3))) * 0.03 / (l2.x + 0.001);
        float pulse3 = smoothstep(0.1, 0.0, abs(l3.y - fract(u_time * 0.3 + 0.7))) * 0.015 / (l3.x + 0.001);
        glow += pulse1 + pulse2 + pulse3;

        vec2 p1 = center + dirUp * clamp(dot(mouseUV - center, dirUp), 0.0, 5.0);
        vec2 p2 = center + dirRight * clamp(dot(mouseUV - center, dirRight), 0.0, 5.0);
        vec2 p3 = center + dirDownLeft * clamp(dot(mouseUV - center, dirDownLeft), 0.0, 5.0);

        float lgt1 = lightning(uv, p1, mouseUV, u_time);
        float lgt2 = lightning(uv, p2, mouseUV, u_time + 10.0);
        float lgt3 = lightning(uv, p3, mouseUV, u_time + 20.0);

        float flicker = step(0.1, noise(u_time * 60.0)) * (noise(u_time * 150.0) * 0.8 + 0.2);

        float d1 = length(mouseUV - p1);
        float d2 = length(mouseUV - p2);
        float d3 = length(mouseUV - p3);

        glow += lgt1 * smoothstep(2.0, 0.0, d1) * u_mouseActive * flicker;
        glow += lgt2 * smoothstep(2.0, 0.0, d2) * u_mouseActive * flicker;
        glow += lgt3 * smoothstep(2.0, 0.0, d3) * u_mouseActive * flicker;

        float distToCenter = length(uv - center);
        glow += 0.04 / (distToCenter + 0.01);

        vec3 baseColor = vec3(0.62, 0.98, 0.86);
        vec3 finalColor = baseColor * glow;

        finalColor *= 0.85 + 0.15 * sin(u_time * 2.0 - distToCenter * 8.0);

        float vignette = 1.0 - smoothstep(0.4, 2.0, length(uv));
        finalColor *= vignette;

        float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
        finalColor += n * 0.02;

        float a = clamp(max(finalColor.r, max(finalColor.g, finalColor.b)), 0.0, 1.0);
        gl_FragColor = vec4(finalColor, a);
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const loc = {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      mouseActive: gl.getUniformLocation(program, "u_mouseActive"),
      center: gl.getUniformLocation(program, "u_center"),
    };

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      gl.STATIC_DRAW
    );

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let mouseX = -3000;
    let mouseY = -3000;
    let lastMouseMove = 0;
    let currentMouseActive = 0;
    let visible = true;
    let raf = 0;
    const startTime = Date.now();

    function onPointerMove(e: PointerEvent) {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * renderScale;
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (rect.height - (e.clientY - rect.top)) * dpr;
      lastMouseMove = Date.now();
    }

    // Pointer, not mouse: this also drives the effect from a touch drag.
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce && !raf) raf = requestAnimationFrame(render);
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    function resize() {
      const el = canvasRef.current;
      if (!el || !gl) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * renderScale;
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        return true;
      }
      return false;
    }

    function draw(timeSeconds: number) {
      if (!gl || !program) return;
      resize();
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(loc.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(loc.vertexPosition);

      const sinceMove = Date.now() - lastMouseMove;
      const targetActive =
        sinceMove < 150 ? 1 : Math.max(0, 1 - (sinceMove - 150) / 350);
      currentMouseActive += (targetActive - currentMouseActive) * 0.15;

      gl.uniform2f(loc.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(loc.time, timeSeconds);
      gl.uniform2f(loc.mouse, mouseX, mouseY);
      gl.uniform1f(loc.mouseActive, reduce ? 0 : currentMouseActive);
      gl.uniform2f(loc.center, centerX, centerY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    let lastDraw = 0;
    function render() {
      if (!visible) {
        raf = 0;
        return;
      }
      const now = Date.now();
      if (!introPlaying() && now - lastDraw >= (coarse ? 30 : 0)) {
        lastDraw = now;
        draw((now - startTime) * 0.001);
      }
      raf = requestAnimationFrame(render);
    }

    if (reduce) {
      // One still frame. The beams are the composition, so they stay visible.
      draw(2.4);
    } else {
      raf = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(() => {
      if (reduce) draw(2.4);
    });
    ro.observe(canvas);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [centerX, centerY, scale]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
    />
  );
}
