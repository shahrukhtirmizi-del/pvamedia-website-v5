"use client";

import { useRef } from "react";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "./hooks";

/**
 * The closing call to action. The same ivory pill the rest of the site uses,
 * at a larger size, with the shine sweep it already has, an arrow that moves
 * on hover, a soft halo behind it, and a gentle lean toward the pointer.
 * Nothing spins.
 */
export default function MagneticCTA({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.translate = `${(x * 14).toFixed(1)}px ${(y * 10).toFixed(1)}px`;
  }
  function reset() {
    const el = ref.current;
    if (el) el.style.translate = "0px 0px";
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={ref}
        className="relative"
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ transition: "translate 0.5s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* a soft halo so the button sits in light rather than on a line */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(199,206,220,0.16), rgba(199,206,220,0.04) 45%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <Link
          href={href}
          className="btn btn-primary group relative !gap-4 !px-9 !py-[22px] !text-[17px] md:!px-11 md:!py-6 md:!text-[19px]"
          style={{ boxShadow: "0 24px 60px -24px rgba(2,6,18,0.9), 0 0 90px -30px rgba(199,206,220,0.45)" }}
        >
          <span>{label}</span>
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 group-hover:translate-x-1"
            style={{ background: "rgba(5,11,31,0.1)" }}
          >
            <ArrowRight size={16} strokeWidth={2} />
          </span>
        </Link>
      </div>

      {note && (
        <p
          className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-45)" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
