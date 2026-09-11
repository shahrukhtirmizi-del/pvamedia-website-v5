"use client";

import { useEffect, useRef } from "react";

/**
 * A glowing trail that follows the pointer.
 *
 * This is the supplied GlowCursor shader, ported to TypeScript with its
 * fragment program intact: the same segment-distance loop over up to 64
 * trail points, the same taper, beam and core terms, the same pulse and
 * film-grain modulation. Changed for this site: it renders as a fixed
 * viewport layer that listens to the window rather than to a wrapper, it
 * uses the palette's platinum and cool blue, and it stays off on coarse
 * pointers and under reduced motion.
 */

const MAX_POINTS = 32;
/* the trail is a soft glow, so it renders at half resolution and scales up */
const RES = 0.5;

const VERTEX = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;
#define MAX_POINTS 32
uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uNormalBlend;
uniform float uTime;
uniform float uFade;
varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);
    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  vec3 additiveColor = color * luminance;
  float normalAlpha = clamp(strongest * uBrightness * uOpacity * uFade, 0.0, 1.0);
  vec3 normalColor = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongestCore) * uHotspot * 0.35);
  gl_FragColor = vec4(mix(additiveColor, normalColor, uNormalBlend), mix(alpha, normalAlpha, uNormalBlend));
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let v = hex.replace("#", "").trim();
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  const n = Number.parseInt(v || "000000", 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

const CONFIG = {
  color: "#c7cedc",
  secondaryColor: "#6d8be8",
  trailLength: 28,
  trailWidth: 5,
  trailTaper: 0.85,
  followSpeed: 0.18,
  glowIntensity: 1.4,
  glowSpread: 1.1,
  hotspot: 0.55,
  brightness: 1.1,
  opacity: 0.75,
  pulseSpeed: 1.0,
  noiseStrength: 0.03,
  idleTimeout: 650,
  fadeDuration: 900,
};

export default function GlowCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let destroyed = false;
    let cleanup: (() => void) | null = null;

    import("ogl").then(({ Renderer, Program, Mesh, Triangle }) => {
      if (destroyed) return;

      const renderer = new Renderer({
        canvas,
        alpha: true,
        dpr: 1,
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const pointData = new Array(MAX_POINTS * 2).fill(0);
      const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
      const target = { x: 0, y: 0 };
      const head = { x: 0, y: 0 };

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: {
          uResolution: { value: [1, 1] },
          uPoints: { value: pointData },
          uPointCount: { value: CONFIG.trailLength },
          uColor: { value: hexToRgb(CONFIG.color) },
          uSecondaryColor: { value: hexToRgb(CONFIG.secondaryColor) },
          uTrailWidth: { value: CONFIG.trailWidth },
          uTaper: { value: CONFIG.trailTaper },
          uGlowIntensity: { value: CONFIG.glowIntensity },
          uGlowSpread: { value: CONFIG.glowSpread },
          uHotspot: { value: CONFIG.hotspot },
          uBrightness: { value: CONFIG.brightness },
          uOpacity: { value: CONFIG.opacity },
          uPulseSpeed: { value: CONFIG.pulseSpeed },
          uNoiseStrength: { value: CONFIG.noiseStrength },
          uNormalBlend: { value: 0 },
          uTime: { value: 0 },
          uFade: { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      let width = 1;
      let height = 1;
      let initialized = false;
      let pointerInside = false;
      let fade = 0;
      let lastInputTime = performance.now();
      let lastFrameTime = performance.now();
      let raf = 0;

      const resize = () => {
        width = Math.max(window.innerWidth, 1);
        height = Math.max(window.innerHeight, 1);
        renderer.setSize(width * RES, height * RES);
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        program.uniforms.uResolution.value = [width * RES, height * RES];
      };

      const initializeTrail = (x: number, y: number) => {
        target.x = head.x = x;
        target.y = head.y = y;
        for (const p of points) {
          p.x = x;
          p.y = y;
        }
        initialized = true;
        fade = 1;
      };

      const onMove = (e: PointerEvent) => {
        const x = clamp(e.clientX, 0, width) * RES;
        const y = clamp(height - e.clientY, 0, height) * RES;
        if (!initialized) initializeTrail(x, y);
        target.x = x;
        target.y = y;
        pointerInside = true;
        lastInputTime = performance.now();
      };
      const onLeave = () => {
        pointerInside = false;
        lastInputTime = performance.now();
      };

      const render = (now: number) => {
        if (destroyed) return;
        const delta = Math.min((now - lastFrameTime) / 16.667, 3);
        lastFrameTime = now;

        if (initialized) {
          const headEase = 1 - Math.pow(1 - clamp(CONFIG.followSpeed, 0.01, 0.99), delta);
          const chainBase = clamp(0.28 + CONFIG.followSpeed * 0.35, 0.08, 0.92);
          const chainEase = 1 - Math.pow(1 - chainBase, delta);
          head.x += (target.x - head.x) * headEase;
          head.y += (target.y - head.y) * headEase;
          points[0].x = head.x;
          points[0].y = head.y;
          for (let i = 1; i < MAX_POINTS; i++) {
            points[i].x += (points[i - 1].x - points[i].x) * chainEase;
            points[i].y += (points[i - 1].y - points[i].y) * chainEase;
          }
          for (let i = 0; i < MAX_POINTS; i++) {
            pointData[i * 2] = points[i].x;
            pointData[i * 2 + 1] = points[i].y;
          }
        }

        const idleFor = now - lastInputTime;
        const shouldFade = !pointerInside || idleFor > CONFIG.idleTimeout;
        const fadeStep = (16.667 * delta) / Math.max(CONFIG.fadeDuration, 16);
        const fadeTarget = initialized && !shouldFade ? 1 : 0;
        fade += (fadeTarget - fade) * Math.min(1, fadeStep * 7);

        program.uniforms.uTime.value = now * 0.001;
        program.uniforms.uFade.value = fade;

        // the shader is per-pixel and the trail covers a sliver of the screen,
        // so clear everything cheaply and only shade a box around the points
        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (fade > 0.002 && initialized) {
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          const n = clamp(Math.round(CONFIG.trailLength), 2, MAX_POINTS);
          for (let i = 0; i < n; i++) {
            const pt = points[i];
            if (pt.x < minX) minX = pt.x;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.y > maxY) maxY = pt.y;
          }
          const pad = 90 * RES + CONFIG.trailWidth * 6;
          const cw = width * RES;
          const ch = height * RES;
          const x0 = Math.max(0, Math.floor(minX - pad));
          const y0 = Math.max(0, Math.floor(minY - pad));
          const x1 = Math.min(cw, Math.ceil(maxX + pad));
          const y1 = Math.min(ch, Math.ceil(maxY + pad));
          if (x1 > x0 && y1 > y0) {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x0, y0, x1 - x0, y1 - y0);
            renderer.render({ scene: mesh });
            gl.disable(gl.SCISSOR_TEST);
          }
        }

        raf = requestAnimationFrame(render);
      };

      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      resize();
      raf = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        mesh.geometry.remove();
        program.remove();
      };
    });

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[115]"
      // normal compositing: a screen blend on a full-viewport layer made the
      // browser re-blend the entire page every frame
      style={{ width: "100%", height: "100%" }}
    />
  );
}
