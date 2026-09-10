"use client";

import { useId } from "react";
import { ArrowDownRight } from "lucide-react";

/**
 * Text curved around a ring, turning slowly and continuously, with the mark in
 * the middle held still. The id is from useId rather than Math.random so the
 * server and client agree on it.
 */
export default function RotatingBadge({
  text,
  size = 112,
  duration = 18,
}: {
  text: string;
  size?: number;
  duration?: number;
}) {
  const uid = "badge" + useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid var(--line-strong)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes ${uid}-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .${uid}-ring { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        className={`${uid}-ring`}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          animation: `${uid}-spin ${duration}s linear infinite`,
        }}
      >
        <defs>
          <path id={uid} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="7.4" fill="var(--ink-45)" letterSpacing="1.5">
          <textPath href={`#${uid}`}>{text}</textPath>
        </text>
      </svg>

      <span
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: "var(--ink)",
          color: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <ArrowDownRight size={size * 0.15} strokeWidth={2} />
      </span>
    </div>
  );
}
