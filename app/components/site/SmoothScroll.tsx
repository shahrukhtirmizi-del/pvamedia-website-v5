"use client";

import { useEffect } from "react";

/**
 * Slightly weighted scroll, site-wide. Lenis drives real window scroll from
 * a rAF loop, so sticky and fixed positioning keep working and nothing here
 * listens to the scroll event. Disabled outright under reduced motion.
 *
 * Touch gets the same treatment (syncTouch): the page tracks the finger 1:1
 * while dragging, and a flick ends in the same eased glide as the wheel
 * instead of a long native fling. Native momentum threw the pinned,
 * scroll-driven sections (services, what's inside, pain points) past in a
 * blur on phones; this makes them play at the pace they do on desktop.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void; velocity: number } | null = null;
    let raf = 0;
    let cancelled = false;

    // Lenis takes a flick's throw speed from the page's last frame of
    // movement, but a 1:1 drag has already settled by the time the finger
    // lifts, so it read zero and flicks stopped dead. Track the finger's own
    // speed over its last few moves and hand that to Lenis on release.
    let trail: { t: number; y: number }[] = [];
    const trackFinger = (event: Event) => {
      if (!event.type.startsWith("touch")) return true;
      const e = event as TouchEvent;
      if (e.type === "touchstart") trail = [];
      else if (e.type === "touchmove" && e.touches.length === 1) {
        trail.push({ t: e.timeStamp, y: e.touches[0].clientY });
        while (trail.length > 2 && e.timeStamp - trail[0].t > 100) trail.shift();
      } else if (e.type === "touchend" && lenis) {
        const first = trail[0];
        const last = trail[trail.length - 1];
        const held = !last || e.timeStamp - last.t > 100; // finger stopped before lifting
        const pxPerMs = held || last.t === first.t ? 0 : Math.abs(last.y - first.y) / (last.t - first.t);
        lenis.velocity = Math.min(pxPerMs * 16.7, 50); // Lenis works in px per frame
        trail = [];
      }
      return true;
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        // gentle weight, not a heavy glide that fights the user
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // touch: follow the finger exactly, then glide out gently
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertiaExponent: 1.7,
        touchMultiplier: 1,
        virtualScroll: ({ event }) => trackFinger(event),
      });
      // the section router scrolls through Lenis so it keeps the same feel
      window.__lenis = lenis as unknown as Window["__lenis"];

      function loop(time: number) {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
