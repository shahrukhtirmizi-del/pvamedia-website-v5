"use client";

import { useRef } from "react";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "./hooks";

/**
 * The circular call to action. A solid disc so whatever is drawn behind it
 * stays behind it, a thin ring, a slow conic sweep and a comet orbiting the
 * rim. It leans toward the pointer and the orbit quickens on hover.
 */
export default function OrbButton({
  href,
  label,
  sub,
}: {
  href: string;
  label: string;
  sub?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: ReactPointerEvent<HTMLAnchorElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.translate = `${(x * 18).toFixed(1)}px ${(y * 18).toFixed(1)}px`;
  }
  function reset() {
    const el = ref.current;
    if (el) el.style.translate = "0px 0px";
  }

  return (
    <Link
      ref={ref}
      href={href}
      className="orb"
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ transition: "translate 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}
    >
      <span className="orb__halo" aria-hidden />
      <span className="orb__ring" aria-hidden />
      <span className="orb__sweep" aria-hidden />
      <span className="orb__comet" aria-hidden />
      <span className="orb__disc" aria-hidden />
      <span className="orb__inner" aria-hidden />
      <span className="orb__label">
        <span className="font-display text-[17px] font-semibold leading-tight">{label}</span>
        {sub && (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-45)" }}>
            {sub}
          </span>
        )}
        <ArrowUpRight size={18} strokeWidth={1.6} className="orb__arrow mt-1" style={{ color: "var(--accent)" }} />
      </span>
    </Link>
  );
}
