/**
 * Film grain, kept near-invisible on purpose.
 *
 * Deliberately NOT mix-blend-mode. A fixed, viewport-sized blended layer makes
 * the browser re-blend the whole page every scroll frame, which showed up as
 * stale, half-painted tiles while scrolling. A flat low-opacity noise texture
 * reads the same on a near-black ground and composites on its own layer.
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        opacity: 0.055,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
