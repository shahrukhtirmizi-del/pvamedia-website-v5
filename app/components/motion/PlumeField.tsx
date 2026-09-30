"use client";

// Self-contained: the only dependency is `three` (npm i three), already a
// staple of this project. No images, no animation libraries — every style lives
// in the injected <style> block below. Paste into any React app.

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ───────────────────────────────────────────────────────────────────────────
   PLUME — a real-time fluid field that answers the cursor.

   A GPU fluid simulation (a small Navier–Stokes solver run entirely in WebGL
   render targets): the pointer injects velocity + dye, the solver advects it,
   removes divergence over a few pressure iterations and adds vorticity so the
   ink curls and plumes. The luminous dye is composited over the editorial hero
   with mix-blend-mode:difference, so every smear INVERTS the headline beneath
   it — drawing with the cursor reveals the type as cool inky trails.

   One requestAnimationFrame loop drives the whole solver — no per-frame React
   re-render. The standalone page is purely pointer-driven (move to draw). Inside
   the gallery card the route loads with ?card (no real pointer), so a virtual
   cursor traces a slow Lissajous path and feeds the solver itself. Honours
   prefers-reduced-motion by holding a calm, still hero with no fluid.
   ─────────────────────────────────────────────────────────────────────────── */

// Solver settings — the reference's exact values (white ink, hard-edged cut).
const CONFIG = {
  simResolution: 256, // velocity / pressure grid
  dyeResolution: 1024, // dye (ink) grid — what you see
  curl: 50, // vorticity strength — how much the ink swirls
  pressureIterations: 40, // Jacobi steps that make the flow incompressible
  velocityDissipation: 0.95,
  dyeDissipation: 0.95,
  splatRadius: 0.3,
  forceStrength: 8.5,
  pressureDecay: 0.75,
  threshold: 1.0,
  edgeSoftness: 0.0, // hard ink edge
  ink: new THREE.Color(1, 1, 1), // white ink → black trails via difference
};

// ── GLSL: a fullscreen quad plus the eight solver passes ──────────────────────
const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;
const P = `precision highp float;`;
const S = `precision mediump sampler2D;`;

const SHADERS = {
  // deposit a soft gaussian blob of `color` into `uTarget`
  splat: [
    VERT,
    `${P} ${S}
    uniform sampler2D uTarget; uniform float aspect, radius; uniform vec3 color; uniform vec2 point; varying vec2 vUv;
    void main(){ vec2 d = vUv - point; d.x *= aspect; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + exp(-dot(d,d)/radius) * color, 1.0); }`,
  ],
  // move a field along the velocity field (semi-Lagrangian advection)
  advection: [
    VERT,
    `${P} ${S}
    uniform sampler2D uVelocity, uSource; uniform vec2 texel; uniform float dt, dissipation; varying vec2 vUv;
    void main(){ vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texel; gl_FragColor = vec4(dissipation * texture2D(uSource, coord).rgb, 1.0); }`,
  ],
  divergence: [
    VERT,
    `${P} ${S}
    uniform sampler2D uVelocity; uniform vec2 texel; varying vec2 vUv;
    vec2 vel(vec2 uv){ vec2 s = vec2(1.0); if(uv.x<0.0){uv.x=0.0;s.x=-1.0;} if(uv.x>1.0){uv.x=1.0;s.x=-1.0;} if(uv.y<0.0){uv.y=0.0;s.y=-1.0;} if(uv.y>1.0){uv.y=1.0;s.y=-1.0;} return s*texture2D(uVelocity,uv).xy; }
    void main(){ vec2 L=vUv-vec2(texel.x,0.0),R=vUv+vec2(texel.x,0.0),T=vUv+vec2(0.0,texel.y),B=vUv-vec2(0.0,texel.y); gl_FragColor = vec4(0.5*(vel(R).x-vel(L).x+vel(T).y-vel(B).y),0.0,0.0,1.0); }`,
  ],
  curl: [
    VERT,
    `${P} ${S}
    uniform sampler2D uVelocity; uniform vec2 texel; varying vec2 vUv;
    void main(){ vec2 L=vUv-vec2(texel.x,0.0),R=vUv+vec2(texel.x,0.0),T=vUv+vec2(0.0,texel.y),B=vUv-vec2(0.0,texel.y); gl_FragColor = vec4(texture2D(uVelocity,R).y-texture2D(uVelocity,L).y-texture2D(uVelocity,T).x+texture2D(uVelocity,B).x,0.0,0.0,1.0); }`,
  ],
  vorticity: [
    VERT,
    `${P} ${S}
    uniform sampler2D uVelocity, uCurl; uniform vec2 texel; uniform float strength, dt; varying vec2 vUv;
    void main(){ vec2 L=vUv-vec2(texel.x,0.0),R=vUv+vec2(texel.x,0.0),T=vUv+vec2(0.0,texel.y),B=vUv-vec2(0.0,texel.y); vec2 f = normalize(vec2(abs(texture2D(uCurl,T).x)-abs(texture2D(uCurl,B).x), abs(texture2D(uCurl,R).x)-abs(texture2D(uCurl,L).x))+0.0001) * strength * texture2D(uCurl,vUv).x; gl_FragColor = vec4(texture2D(uVelocity,vUv).xy + f*dt, 0.0, 1.0); }`,
  ],
  pressure: [
    VERT,
    `${P} ${S}
    uniform sampler2D uPressure, uDivergence; uniform vec2 texel; varying vec2 vUv;
    void main(){ vec2 L=clamp(vUv-vec2(texel.x,0.0),0.0,1.0),R=clamp(vUv+vec2(texel.x,0.0),0.0,1.0),T=clamp(vUv+vec2(0.0,texel.y),0.0,1.0),B=clamp(vUv-vec2(0.0,texel.y),0.0,1.0); gl_FragColor = vec4((texture2D(uPressure,L).x+texture2D(uPressure,R).x+texture2D(uPressure,T).x+texture2D(uPressure,B).x-texture2D(uDivergence,vUv).x)*0.25,0.0,0.0,1.0); }`,
  ],
  gradientSubtract: [
    VERT,
    `${P} ${S}
    uniform sampler2D uPressure, uVelocity; uniform vec2 texel; varying vec2 vUv;
    void main(){ float pL=texture2D(uPressure,clamp(vUv-vec2(texel.x,0.0),0.0,1.0)).x, pR=texture2D(uPressure,clamp(vUv+vec2(texel.x,0.0),0.0,1.0)).x, pT=texture2D(uPressure,clamp(vUv+vec2(0.0,texel.y),0.0,1.0)).x, pB=texture2D(uPressure,clamp(vUv-vec2(0.0,texel.y),0.0,1.0)).x; gl_FragColor = vec4(texture2D(uVelocity,vUv).xy - vec2(pR-pL, pT-pB), 0.0, 1.0); }`,
  ],
  clear: [
    VERT,
    `${P} ${S}
    uniform sampler2D uTexture; uniform float value; varying vec2 vUv;
    void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`,
  ],
  // threshold the dye into a soft-edged ink mask painted in `ink`
  display: [
    VERT,
    `${P}
    uniform sampler2D uTexture; uniform float threshold, softness; uniform vec3 ink; varying vec2 vUv;
    void main(){ float d = clamp(length(texture2D(uTexture,vUv).rgb),0.0,1.0); float a = softness>0.0 ? smoothstep(threshold-softness*0.5, threshold+softness*0.5, d) : step(threshold,d);
    // premultiply: the canvas is premultiplied-alpha, so empty pixels must be
    // (0,0,0,0) — true transparent — or they composite as solid white and the
    // difference blend inverts the whole page (black bg / white type) by default.
    gl_FragColor = vec4(ink * a, a); }`,
  ],
};

const css = `
.pl-root{
  position:relative;
  width:100%;
  min-height:100vh;
  overflow:hidden;
  background:#ffffff;
  cursor:crosshair;
}
.pl-canvas{position:absolute;inset:0;z-index:3;display:block;width:100%;height:100%;
  pointer-events:none;mix-blend-mode:difference;}
`;

export default function PlumeField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCard = new URLSearchParams(window.location.search).has("card");
    // Reduced motion: leave the canvas blank so only the calm hero shows.
    if (reduce) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const sizeOf = () => {
      const r = root.getBoundingClientRect();
      return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
    };
    let { w: cssW, h: cssH } = sizeOf();
    renderer.setSize(cssW, cssH, false);
    const dpr = renderer.getPixelRatio();
    let width = cssW * dpr;
    let height = cssH * dpr;

    // fullscreen quad rendered with each pass's material in turn
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    scene.add(quad);

    // ── double-buffered render targets ──
    const aspect = width / height;
    const rtOpts = {
      type: THREE.HalfFloatType,
      depthBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    } as const;
    const single = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, rtOpts);
    const double = (w: number, h: number) => ({
      read: single(w, h),
      write: single(w, h),
      swap() {
        [this.read, this.write] = [this.write, this.read];
      },
    });

    // In the gallery card the field is shown ~380px wide, so the full-fat solver
    // grids are wasted work — shrink them (and the pressure iterations) for the
    // thumbnail. The standalone route (and any copied code) keeps full quality.
    const simRes = isCard ? 128 : CONFIG.simResolution;
    const dyeRes = isCard ? 384 : CONFIG.dyeResolution;
    const pressureIters = isCard ? 18 : CONFIG.pressureIterations;
    const simSize = {
      w: simRes,
      h: Math.round(simRes / aspect),
    };
    const dyeSize = {
      w: dyeRes,
      h: Math.round(dyeRes / aspect),
    };
    const velocity = double(simSize.w, simSize.h);
    const dye = double(dyeSize.w, dyeSize.h);
    const divergence = single(simSize.w, simSize.h);
    const curl = single(simSize.w, simSize.h);
    const pressure = double(simSize.w, simSize.h);
    const simTexel = new THREE.Vector2(1 / simSize.w, 1 / simSize.h);
    const dyeTexel = new THREE.Vector2(1 / dyeSize.w, 1 / dyeSize.h);

    // ── materials, one per pass ──
    const mk = ([vert, frag]: string[], uniforms: Record<string, { value: unknown }>) =>
      new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
    const tex = () => ({ value: null });
    const num = (v = 0) => ({ value: v });
    const vec2 = () => ({ value: new THREE.Vector2() });

    const mats = {
      splat: mk(SHADERS.splat, {
        uTarget: tex(),
        aspect: num(),
        radius: num(),
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
      }),
      advection: mk(SHADERS.advection, {
        uVelocity: tex(),
        uSource: tex(),
        texel: vec2(),
        dt: num(),
        dissipation: num(),
      }),
      divergence: mk(SHADERS.divergence, { uVelocity: tex(), texel: vec2() }),
      curl: mk(SHADERS.curl, { uVelocity: tex(), texel: vec2() }),
      vorticity: mk(SHADERS.vorticity, {
        uVelocity: tex(),
        uCurl: tex(),
        texel: vec2(),
        strength: num(),
        dt: num(),
      }),
      pressure: mk(SHADERS.pressure, {
        uPressure: tex(),
        uDivergence: tex(),
        texel: vec2(),
      }),
      gradientSubtract: mk(SHADERS.gradientSubtract, {
        uPressure: tex(),
        uVelocity: tex(),
        texel: vec2(),
      }),
      clear: mk(SHADERS.clear, { uTexture: tex(), value: num() }),
      display: mk(SHADERS.display, {
        uTexture: tex(),
        threshold: num(),
        softness: num(),
        ink: { value: new THREE.Color() },
      }),
    };

    const pass = (material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) => {
      quad.material = material;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
    };
    const set = (
      material: THREE.ShaderMaterial,
      values: Record<string, unknown>
    ) => {
      for (const [k, v] of Object.entries(values)) material.uniforms[k].value = v;
      return material;
    };

    // ── pointer → velocity + dye injection ──
    const mouse = { x: 0, y: 0, vx: 0, vy: 0, moved: false };
    const moveTo = (clientX: number, clientY: number) => {
      const r = root.getBoundingClientRect();
      const x = (clientX - r.left) * dpr;
      const y = (clientY - r.top) * dpr;
      mouse.vx = (x - mouse.x) * CONFIG.forceStrength;
      mouse.vy = (y - mouse.y) * CONFIG.forceStrength;
      mouse.x = x;
      mouse.y = y;
      mouse.moved = true;
    };
    const onPointer = (e: PointerEvent) => {
      if (isCard) return;
      moveTo(e.clientX, e.clientY);
    };
    if (!isCard) window.addEventListener("pointermove", onPointer);

    const splat = (x: number, y: number, vx: number, vy: number) => {
      set(mats.splat, {
        aspect: width / height,
        point: new THREE.Vector2(x / width, 1 - y / height),
        radius: CONFIG.splatRadius / 100,
      });
      set(mats.splat, {
        uTarget: velocity.read.texture,
        color: new THREE.Vector3(vx, -vy, 0),
      });
      pass(mats.splat, velocity.write);
      velocity.swap();
      set(mats.splat, {
        uTarget: dye.read.texture,
        color: new THREE.Vector3(3, 3, 3),
      });
      pass(mats.splat, dye.write);
      dye.swap();
    };

    const simulate = (dt: number) => {
      pass(set(mats.curl, { uVelocity: velocity.read.texture, texel: simTexel }), curl);
      pass(
        set(mats.vorticity, {
          uVelocity: velocity.read.texture,
          uCurl: curl.texture,
          texel: simTexel,
          strength: CONFIG.curl,
          dt,
        }),
        velocity.write
      );
      velocity.swap();
      pass(
        set(mats.divergence, { uVelocity: velocity.read.texture, texel: simTexel }),
        divergence
      );
      pass(
        set(mats.clear, { uTexture: pressure.read.texture, value: CONFIG.pressureDecay }),
        pressure.write
      );
      pressure.swap();
      set(mats.pressure, { uDivergence: divergence.texture, texel: simTexel });
      for (let i = 0; i < pressureIters; i++) {
        mats.pressure.uniforms.uPressure.value = pressure.read.texture;
        pass(mats.pressure, pressure.write);
        pressure.swap();
      }
      pass(
        set(mats.gradientSubtract, {
          uPressure: pressure.read.texture,
          uVelocity: velocity.read.texture,
          texel: simTexel,
        }),
        velocity.write
      );
      velocity.swap();
      set(mats.advection, {
        uVelocity: velocity.read.texture,
        uSource: velocity.read.texture,
        texel: simTexel,
        dt,
        dissipation: CONFIG.velocityDissipation,
      });
      pass(mats.advection, velocity.write);
      velocity.swap();
      set(mats.advection, {
        uSource: dye.read.texture,
        texel: dyeTexel,
        dissipation: CONFIG.dyeDissipation,
      });
      pass(mats.advection, dye.write);
      dye.swap();
    };

    const render = () => {
      set(mats.display, {
        uTexture: dye.read.texture,
        threshold: CONFIG.threshold,
        softness: CONFIG.edgeSoftness,
        ink: CONFIG.ink,
      });
      pass(mats.display, null);
    };

    // ── loop ──
    let raf = 0;
    let last = performance.now();
    let vt = 0; // virtual-cursor clock (card only)
    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.016);
      last = now;

      if (isCard) {
        // No real pointer in the card — trace a slow Lissajous figure and feed
        // its motion into the solver so the field draws itself.
        vt += dt;
        const cx = width * (0.5 + 0.33 * Math.sin(vt * 0.9));
        const cy = height * (0.5 + 0.22 * Math.sin(vt * 1.7 + 0.6));
        moveTo(
          cx / dpr + root.getBoundingClientRect().left,
          cy / dpr + root.getBoundingClientRect().top
        );
      }

      if (mouse.moved) {
        splat(mouse.x, mouse.y, mouse.vx, mouse.vy);
        mouse.moved = false;
      }
      simulate(dt);
      render();
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      const s = sizeOf();
      cssW = s.w;
      cssH = s.h;
      renderer.setSize(cssW, cssH, false);
      width = cssW * dpr;
      height = cssH * dpr;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      [velocity, dye, pressure].forEach((d) => {
        d.read.dispose();
        d.write.dispose();
      });
      [divergence, curl].forEach((t) => t.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      quad.geometry.dispose();
    };
  }, []);

  return (
    <div className="pl-root" ref={rootRef}>
      <style>{css}</style>
      <canvas className="pl-canvas" ref={canvasRef} />
    </div>
  );
}
