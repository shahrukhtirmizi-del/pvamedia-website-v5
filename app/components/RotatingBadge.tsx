"use client";

import { useId } from "react";

/**
 * A circular ring of repeating text that slowly rotates around a fixed
 * center icon/mark. The center stays still; only the text ring spins.
 *
 * BUG FIXED: same Math.random() SSR/hydration mismatch as BlobShape --
 * fixed the same way, with useId().
 */
export default function RotatingBadge({
  text,
  size = 108,
  textColor = "rgba(15,14,12,0.55)",
  centerBg = "#1F5233",
  centerColor = "#FAFAF7",
  centerContent = "\u2193",
  ringColor = "rgba(15,14,12,0.18)",
  duration = 14,
}: {
  text: string;
  size?: number;
  textColor?: string;
  centerBg?: string;
  centerColor?: string;
  centerContent?: string;
  ringColor?: string;
  duration?: number;
}) {
  const reactId = useId();
  const pathId = `badgepath-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div
      style={{
        position: "relative", // must stay relative (not static) -- it's the
        // containing block for the absolutely-positioned rotating svg below;
        // losing this in a responsive override breaks the ring on that
        // breakpoint even though overflow:hidden is set (learned the hard
        // way from the same bug in the Collage template).
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${ringColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          animation: `spin-${pathId} ${duration}s linear infinite`,
        }}
      >
        <style>{`
          @keyframes spin-${pathId} { to { transform: rotate(360deg); } }
        `}</style>
        <defs>
          <path id={pathId} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="7.6" fill={textColor} letterSpacing="1.4">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <div
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: centerBg,
          color: centerColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.13,
          zIndex: 2,
        }}
      >
        {centerContent}
      </div>
    </div>
  );
}
