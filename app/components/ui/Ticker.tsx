"use client";

/**
 * The one marquee on the site. Proof points slide past continuously and stop
 * the moment the pointer or keyboard focus lands on them, so anything worth
 * reading can be read. The list is rendered twice so the loop has no seam.
 */
export default function Ticker({ items }: { items: string[] }) {
  return (
    <div
      className="ticker relative overflow-hidden border-y py-5"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="ticker-track" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span
                  className="font-mono whitespace-nowrap px-7 text-[12px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--ink-60)" }}
                >
                  {item}
                </span>
                <span
                  aria-hidden
                  className="h-3 w-px shrink-0"
                  style={{ background: "var(--line-strong)" }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* the same list, once, for assistive tech */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* edges fade into the page rather than being clipped */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
        style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
        style={{ background: "linear-gradient(270deg, var(--bg), transparent)" }}
      />
    </div>
  );
}
