import type { ReactNode } from "react";
import LaserBackground from "./LaserBackground";

/**
 * One laser field running behind a run of sections rather than inside one.
 * The canvas spans the whole band and is masked so the beams dissolve into
 * the page above and below instead of stopping on a section edge.
 */
export default function LaserBand({
  children,
  centerX,
  centerY,
  opacity = 0.5,
  fade = 14,
}: {
  children: ReactNode;
  centerX: number;
  centerY: number;
  opacity?: number;
  /** percentage of the band's height over which the beams fade at each end */
  fade?: number;
}) {
  const mask = `linear-gradient(to bottom, transparent, black ${fade}%, black ${100 - fade}%, transparent)`;
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <LaserBackground centerX={centerX} centerY={centerY} opacity={opacity} scale={0.5} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
