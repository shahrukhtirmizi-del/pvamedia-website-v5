"use client";

import { useId } from "react";

/**
 * A line graph that never fully stops. The trend line redraws on a loop, the
 * flat "before" baseline drifts underneath it, and three points along the line
 * pulse out of phase, so the card reads as something still happening rather
 * than a screenshot of a chart.
 */
export default function LiveGraph({
  height = 150,
  label = "Enquiries after launch",
}: {
  height?: number;
  label?: string;
}) {
  const uid = "lg" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const points = [
    [0, 78], [10, 74], [20, 76], [30, 66], [40, 60],
    [50, 52], [60, 48], [70, 34], [80, 26], [90, 16], [100, 8],
  ];
  const flat = [
    [0, 84], [10, 85], [20, 82], [30, 86], [40, 83],
    [50, 85], [60, 82], [70, 84], [80, 83], [90, 85], [100, 84],
  ];
  const toPath = (pts: number[][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  return (
    <div>
      <div
        className="font-mono mb-3 text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "var(--ink-45)" }}
      >
        {label}
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${label}, rising steadily`}
        style={{ width: "100%", height, display: "block" }}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes ${uid}-draw {
            0% { stroke-dashoffset: 220; }
            72%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes ${uid}-dot {
            0%, 100% { transform: scale(1); opacity: 0.95; }
            50% { transform: scale(1.7); opacity: 0.35; }
          }
          @keyframes ${uid}-drift {
            0% { transform: translateX(0); }
            100% { transform: translateX(-8px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .${uid}-anim { animation: none !important; stroke-dashoffset: 0 !important; }
          }
        `}</style>

        <path
          className={`${uid}-anim`}
          d={toPath(flat)}
          fill="none"
          stroke="rgba(242,238,223,0.28)"
          strokeWidth="1.3"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
          style={{ animation: `${uid}-drift 3.2s linear infinite` }}
        />

        <path d={`${toPath(points)} L100,100 L0,100 Z`} fill={`url(#${uid}-fill)`} stroke="none" />

        <path
          className={`${uid}-anim`}
          d={toPath(points)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="220"
          style={{ animation: `${uid}-draw 3.6s ease-in-out infinite` }}
        />

        {[points[3], points[6], points[10]].map((p, i) => (
          <circle
            key={i}
            className={`${uid}-anim`}
            cx={p[0]}
            cy={p[1]}
            r="2"
            fill="var(--ink)"
            style={{
              transformOrigin: `${p[0]}px ${p[1]}px`,
              animation: `${uid}-dot 2.4s ease-in-out ${i * 0.65}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
