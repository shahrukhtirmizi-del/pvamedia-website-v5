"use client";

import { useEffect, useRef } from "react";

/**
 * Dot on the pointer, ring lagging behind it, ring swelling over anything
 * interactive. Pointer values go straight to element transforms from a
 * single rAF loop, never through React state. Fine pointers only, and it
 * steps aside entirely under reduced motion.
 */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine || reduce || !dot || !ring) return;

    document.documentElement.classList.add("has-cursor");

    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let shown = false;

    function onMove(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        rx = tx;
        ry = ty;
        dot!.classList.remove("is-hidden");
        ring!.classList.remove("is-hidden");
      }
      const target = (e.target as Element | null)?.closest(INTERACTIVE);
      ring!.classList.toggle("is-hover", !!target);
    }

    function onDown() {
      ring!.classList.add("is-down");
    }
    function onUp() {
      ring!.classList.remove("is-down");
    }
    function onLeave() {
      dot!.classList.add("is-hidden");
      ring!.classList.add("is-hidden");
    }
    function onEnter() {
      if (shown) {
        dot!.classList.remove("is-hidden");
        ring!.classList.remove("is-hidden");
      }
    }

    function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      dot!.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ring!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot is-hidden" />
      <div ref={ringRef} aria-hidden className="cursor-ring is-hidden" />
    </>
  );
}
