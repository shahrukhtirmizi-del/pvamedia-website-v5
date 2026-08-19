"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the default cursor with a small ring that follows the mouse
 * with a slight lag, expands + inverts when hovering anything
 * interactive, and shows a short contextual label (from data-cursor-label)
 * next to it when hovering specific big elements like the case study card.
 * Hidden entirely on touch devices.
 *
 * BUGS FIXED:
 * 1. Colors used to be hardcoded to the original light theme (dark green
 *    dot, dark low-opacity ring) and were never updated when the site
 *    moved to the dark Glacier theme -- on a dark background that read as
 *    a barely-visible dark outline around a tiny dot. Now themeable via
 *    props like the rest of the theme-aware components.
 * 2. The dot/ring sat at z-index 9998-9999, the SAME layer as the card
 *    modal's backdrop -- so opening the modal visually covered the
 *    cursor, and since the real OS cursor is hidden site-wide (cursor:
 *    none), that meant no cursor at all while a modal was open. Pushed
 *    well above any known overlay so this can't recur.
 */
export default function CustomCursor({
  dotColor = "#3ED9B8",
  ringBorderColor = "rgba(240,244,242,0.4)",
  ringHoverBg = "rgba(62,217,184,0.12)",
  ringHoverBorder = "#3ED9B8",
  labelBg = "#3ED9B8",
  labelText = "#14191C",
}: {
  dotColor?: string;
  ringBorderColor?: string;
  ringHoverBg?: string;
  ringHoverBorder?: string;
  labelBg?: string;
  labelText?: string;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function onMove(e: MouseEvent) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    }

    function onOver(e: MouseEvent) {
      const el = e.target as HTMLElement;
      const labelHost = el.closest("[data-cursor-label]") as HTMLElement | null;
      if (labelHost) {
        ringRef.current?.classList.add("cursor-hover");
        if (labelRef.current) {
          labelRef.current.textContent = labelHost.dataset.cursorLabel || "";
          labelRef.current.classList.add("visible");
        }
      } else if (el.closest("a, button, [data-cursor-hover]")) {
        ringRef.current?.classList.add("cursor-hover");
      }
    }
    function onOut(e: MouseEvent) {
      const el = e.target as HTMLElement;
      if (el.closest("[data-cursor-label]")) {
        labelRef.current?.classList.remove("visible");
      }
      if (el.closest("a, button, [data-cursor-hover], [data-cursor-label]")) {
        ringRef.current?.classList.remove("cursor-hover");
      }
    }

    let raf: number;
    function tick() {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    }

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          a, button { cursor: none !important; }
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0; width: 6px; height: 6px;
          margin: -3px 0 0 -3px; border-radius: 50%; background: ${dotColor};
          pointer-events: none; z-index: 100000; will-change: transform;
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0; width: 32px; height: 32px;
          margin: -16px 0 0 -16px; border-radius: 50%; border: 1.5px solid ${ringBorderColor};
          pointer-events: none; z-index: 99999; will-change: transform;
          transition: width 0.25s ease, height 0.25s ease, margin 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .cursor-ring.cursor-hover {
          width: 52px; height: 52px; margin: -26px 0 0 -26px;
          background: ${ringHoverBg}; border-color: ${ringHoverBorder};
        }
        .cursor-label {
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99999;
          font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 10.5px;
          letter-spacing: 0.08em; text-transform: uppercase; color: ${labelText};
          background: ${labelBg}; padding: 6px 12px; border-radius: 999px;
          white-space: nowrap; opacity: 0; will-change: transform;
          transform-origin: left center;
          margin: 22px 0 0 8px;
          transition: opacity 0.2s ease;
        }
        .cursor-label.visible { opacity: 1; }
        @media (pointer: coarse) {
          .cursor-dot, .cursor-ring, .cursor-label { display: none; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label" />
    </>
  );
}
