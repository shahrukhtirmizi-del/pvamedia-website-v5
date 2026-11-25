"use client";

import { useEffect } from "react";
import { isCoarse } from "../../lib/device";

/**
 * Slightly weighted scroll, site-wide. Lenis drives real window scroll from
 * a rAF loop, so sticky and fixed positioning keep working and nothing here
 * listens to the scroll event. Disabled outright under reduced motion.
 *
 * Phones scroll natively. Driving a touch scroll from script (syncTouch) puts
 * every dropped frame on screen as a stutter of the whole page, and the
 * pinned and fixed layers shake with it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isCoarse()) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        // gentle weight, not a heavy glide that fights the user
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
