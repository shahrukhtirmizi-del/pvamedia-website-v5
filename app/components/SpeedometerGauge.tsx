"use client";

import { useId } from "react";

/**
 * A speedometer-style gauge with a needle that never fully settles --
 * it sweeps up to a high value and gently oscillates around it forever,
 * reading as "live" rather than a static illustration. Inspired by
 * dashboard-style gauge UIs (fleet/ops tracking dashboards).
 */
export default function SpeedometerGauge({
  label,
  valueLabel,
  color,
  trackColor,
  bg = "transparent",
  size = 180,
}: {
  label: string;
  valueLabel: string;
  color: string;
  trackColor: string;
  bg?: string;
  size?: number;
}) {
  const uid = "gauge-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  // Gauge sweeps 180 degrees, from angle -180 (left) to 0 (right), through the top.
  const radius = 42;
  const cx = 50;
  const cy = 52;
  const startAngle = 180;
  const endAngle = 0;
  const polar = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy - radius * Math.sin(rad)];
  };
  const [sx, sy] = polar(startAngle);
  const [ex, ey] = polar(endAngle);
  const arcPath = `M${sx},${sy} A${radius},${radius} 0 0 1 ${ex},${ey}`;

  return (
    <div style={{ background: bg, borderRadius: 16, padding: 16, textAlign: "center" }}>
      <style>{`
        @keyframes ${uid}-needle {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes ${uid}-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
      <svg viewBox="0 0 100 68" style={{ width: size, height: size * 0.68, display: "block", margin: "0 auto" }}>
        <path d={arcPath} fill="none" stroke={trackColor} strokeWidth="7" strokeLinecap="round" />
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="132"
          strokeDashoffset="18"
          style={{ animation: `${uid}-glow 2.4s ease-in-out infinite` }}
        />
        {/* needle, pivoting from the center, oscillating near the high end */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: `${uid}-needle 2.8s ease-in-out infinite` }}>
          <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 8} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="4" fill={color} />
        </g>
      </svg>
      <div className="font-display font-bold" style={{ fontSize: 22, color, marginTop: -6 }}>{valueLabel}</div>
      <div className="font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: trackColor, marginTop: 4 }}>{label}</div>
    </div>
  );
}
