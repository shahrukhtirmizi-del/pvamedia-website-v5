"use client";

/**
 * A continuously-moving line graph -- the line never stops animating,
 * unlike CountUp/AnimatedFillBar which fire once on scroll and settle.
 * Two layered paths (a solid trend line + a fainter "before" line) both
 * gently redraw on a loop, and a handful of data dots pulse independently
 * so the whole thing reads as "live" rather than a static chart image.
 */
export default function LiveGrowthGraph({
  color,
  fadeColor,
  bg = "transparent",
  height = 160,
  label = "Client growth after launch",
}: {
  color: string;
  fadeColor: string;
  bg?: string;
  height?: number;
  label?: string;
}) {
  // A rising, slightly irregular trend line (not a perfectly straight ramp --
  // reads as real data, not a decoration).
  const points = [
    [0, 78], [10, 74], [20, 76], [30, 66], [40, 60],
    [50, 52], [60, 48], [70, 34], [80, 26], [90, 16], [100, 8],
  ];
  const flatPoints = [
    [0, 84], [10, 85], [20, 82], [30, 86], [40, 83],
    [50, 85], [60, 82], [70, 84], [80, 83], [90, 85], [100, 84],
  ];
  const toPath = (pts: number[][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  const uid = "lgg-" + color.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div style={{ background: bg, borderRadius: 16, padding: "18px 6px 6px", position: "relative" }}>
      <div className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: fadeColor, paddingLeft: 8, marginBottom: 6 }}>
        {label}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <style>{`
            @keyframes ${uid}-draw {
              0% { stroke-dashoffset: 220; }
              70%, 100% { stroke-dashoffset: 0; }
            }
            @keyframes ${uid}-dot {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.6); opacity: 0.4; }
            }
            @keyframes ${uid}-shift {
              0% { transform: translateX(0); }
              100% { transform: translateX(-8px); }
            }
          `}</style>
        </defs>

        {/* faint flat "before" baseline, always gently drifting */}
        <path
          d={toPath(flatPoints)}
          fill="none"
          stroke={fadeColor}
          strokeWidth="1.4"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
          style={{ animation: `${uid}-shift 3s linear infinite` }}
        />

        {/* the rising trend line, fill under it */}
        <path d={`${toPath(points)} L100,100 L0,100 Z`} fill={`url(#${uid}-fill)`} stroke="none" />
        <path
          d={toPath(points)}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="220"
          style={{ animation: `${uid}-draw 3.4s ease-in-out infinite` }}
        />

        {/* pulsing live dots at a few points along the line */}
        {[points[3], points[6], points[10]].map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="2.2"
            fill={color}
            style={{
              transformOrigin: `${p[0]}px ${p[1]}px`,
              animation: `${uid}-dot 2.2s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
