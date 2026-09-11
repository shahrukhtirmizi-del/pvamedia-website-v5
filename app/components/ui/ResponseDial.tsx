"use client";

import { useId } from "react";

/**
 * A response-time dial drawn like a watch face: a fine tick ring, a 270
 * degree track, a platinum arc that runs nearly to the end, and a lit tip
 * that never quite settles. The reading sits in the centre.
 */
export default function ResponseDial({
  value = "<60s",
  label = "Average lead response",
  size = 260,
}: {
  value?: string;
  label?: string;
  size?: number;
}) {
  const uid = "rd" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const cx = 100;
  const cy = 100;
  const rTrack = 78;
  const rTicks = 92;
  const start = 135; // degrees, clockwise from 3 o'clock
  const sweep = 270;
  const fill = 0.9; // how far the arc runs

  // rounded to two decimals: server and browser trig can differ in the last
  // digit, which would show up as a hydration mismatch on every tick
  const polar = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    const round = (n: number) => Math.round(n * 100) / 100;
    return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))] as const;
  };

  const arcPath = (r: number, fromDeg: number, toDeg: number) => {
    const [x1, y1] = polar(r, fromDeg);
    const [x2, y2] = polar(r, toDeg);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  };

  const trackLen = (2 * Math.PI * rTrack * sweep) / 360;
  const endDeg = start + sweep * fill;

  const ticks = Array.from({ length: 55 }, (_, i) => {
    const deg = start + (sweep * i) / 54;
    const major = i % 9 === 0;
    const [x1, y1] = polar(rTicks - (major ? 7 : 3.5), deg);
    const [x2, y2] = polar(rTicks, deg);
    return { x1, y1, x2, y2, major };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <style>{`
        @keyframes ${uid}-tip {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes ${uid}-arc {
          0%, 100% { stroke-dashoffset: ${(trackLen * (1 - fill) + trackLen * 0.015).toFixed(2)}; }
          50% { stroke-dashoffset: ${(trackLen * (1 - fill) - trackLen * 0.011).toFixed(2)}; }
        }
        @keyframes ${uid}-breathe {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${uid}-anim { animation: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`${label}: ${value}`}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(199,206,220,0.35)" />
            <stop offset="100%" stopColor="#f2eedf" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* tick ring */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.major ? "rgba(242,238,223,0.55)" : "rgba(242,238,223,0.18)"}
            strokeWidth={t.major ? 1.2 : 0.8}
            strokeLinecap="round"
          />
        ))}

        {/* track and arc */}
        <path d={arcPath(rTrack, start, start + sweep)} fill="none" stroke="rgba(242,238,223,0.1)" strokeWidth="1.5" strokeLinecap="round" />
        <path
          className={`${uid}-anim`}
          d={arcPath(rTrack, start, start + sweep)}
          fill="none"
          stroke={`url(#${uid}-g)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={trackLen}
          strokeDashoffset={trackLen * (1 - fill)}
          style={{ animation: `${uid}-arc 3.4s ease-in-out infinite` }}
        />

        {/* lit tip, oscillating about the end of the arc */}
        <g
          className={`${uid}-anim`}
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: `${uid}-tip 3.4s ease-in-out infinite` }}
        >
          <circle cx={polar(rTrack, endDeg)[0]} cy={polar(rTrack, endDeg)[1]} r="5" fill="#f2eedf" opacity="0.6" filter={`url(#${uid}-glow)`} />
          <circle cx={polar(rTrack, endDeg)[0]} cy={polar(rTrack, endDeg)[1]} r="2.6" fill="#f2eedf" />
        </g>

        {/* inner rings */}
        <circle cx={cx} cy={cy} r="60" fill="none" stroke="rgba(242,238,223,0.08)" strokeWidth="1" />
        <circle
          className={`${uid}-anim`}
          cx={cx}
          cy={cy}
          r="52"
          fill="none"
          stroke="rgba(199,206,220,0.16)"
          strokeWidth="1"
          strokeDasharray="2 5"
          style={{ animation: `${uid}-breathe 4s ease-in-out infinite` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div
          className="font-display font-semibold tabular-nums"
          style={{ fontSize: size * 0.17, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--ink)" }}
        >
          {value}
        </div>
        <div
          className="font-mono mt-2 max-w-[10ch] text-[9.5px] uppercase leading-relaxed tracking-[0.16em]"
          style={{ color: "var(--ink-45)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
