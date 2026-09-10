"use client";

import { useId } from "react";

/**
 * A speedometer whose needle never quite settles. It sits near the top of the
 * sweep and oscillates around it indefinitely, which reads as a live reading
 * rather than a diagram of one.
 */
export default function Gauge({
  label,
  valueLabel,
  size = 190,
}: {
  label: string;
  valueLabel: string;
  size?: number;
}) {
  const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const radius = 42;
  const cx = 50;
  const cy = 52;

  const polar = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy - radius * Math.sin(rad)];
  };
  const [sx, sy] = polar(180);
  const [ex, ey] = polar(0);
  const arc = `M${sx},${sy} A${radius},${radius} 0 0 1 ${ex},${ey}`;

  return (
    <div className="text-center">
      <style>{`
        @keyframes ${uid}-needle {
          0%, 100% { transform: rotate(-7deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes ${uid}-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${uid}-needle, .${uid}-glow { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 100 68"
        role="img"
        aria-label={`${label}: ${valueLabel}`}
        style={{ width: size, height: size * 0.68, display: "block", margin: "0 auto" }}
      >
        <path d={arc} fill="none" stroke="rgba(242,238,223,0.12)" strokeWidth="6" strokeLinecap="round" />
        <path
          className={`${uid}-glow`}
          d={arc}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="132"
          strokeDashoffset="20"
          style={{ animation: `${uid}-glow 2.6s ease-in-out infinite` }}
        />
        <g
          className={`${uid}-needle`}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: `${uid}-needle 3s ease-in-out infinite`,
          }}
        >
          <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 9} stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="3.6" fill="var(--ink)" />
        </g>
      </svg>

      <div className="font-display text-[26px] font-semibold" style={{ marginTop: -8, color: "var(--ink)" }}>
        {valueLabel}
      </div>
      <div
        className="font-mono mt-1.5 text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "var(--ink-45)" }}
      >
        {label}
      </div>
    </div>
  );
}
