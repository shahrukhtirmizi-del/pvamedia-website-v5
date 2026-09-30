"use client";

import { useMemo, useState } from "react";
import ScrollSwipeStack, { type SwipeStackSlide } from "../motion/ScrollSwipeStack";
import Reveal from "../ui/Reveal";
import { CLIENT_RESULTS, type ClientCategory } from "../../lib/site";

/**
 * One card per service line on the left, the clients behind it on the right.
 * Swiping the stack (or picking a line) swaps the list of results beside it.
 */
const CATEGORIES: { category: ClientCategory; title: string; image: string; alt: string }[] = [
  {
    category: "Marketing",
    title: "Marketing",
    image: "/images/results/marketing.png",
    alt: "An ink arrow climbing steeply upward",
  },
  {
    category: "Website",
    title: "Websites",
    image: "/images/results/website.png",
    alt: "A pencil sketch of a browser window",
  },
  {
    category: "AI Automation",
    title: "AI\nAutomation",
    image: "/images/results/automation.png",
    alt: "A network of connected nodes drawn in ink",
  },
];

const SLIDES: SwipeStackSlide[] = CATEGORIES.map((c) => {
  const clients = CLIENT_RESULTS.filter((r) => r.category === c.category).length;
  return {
    id: c.category,
    image: c.image,
    alt: c.alt,
    category: `${clients} clients`,
    title: c.title,
  };
});

export default function Results() {
  const [active, setActive] = useState<ClientCategory>(CATEGORIES[0].category);
  // Picking a line from the list rebuilds the stack with that card on top.
  // The nonce forces the rebuild even when the rotation itself is unchanged,
  // since a swipe reorders the stack without the parent knowing.
  const [rotation, setRotation] = useState({ start: 0, nonce: 0 });

  const slides = useMemo(
    () => [...SLIDES.slice(rotation.start), ...SLIDES.slice(0, rotation.start)],
    [rotation.start],
  );

  const results = CLIENT_RESULTS.filter((r) => r.category === active);

  const pick = (index: number) => {
    setRotation((r) => ({ start: index, nonce: r.nonce + 1 }));
    setActive(CATEGORIES[index].category);
  };

  return (
    <section id="results" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <p
          className="font-mono mb-5 text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "var(--ink-45)" }}
        >
          Results
        </p>
        <h2
          className="font-display max-w-[16ch] font-bold"
          style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.02 }}
        >
          What the work does for our clients
        </h2>
      </Reveal>

      {/* min-w-0 on both columns: the stack is scaled with a transform, which
          does not shrink its layout box, so without it the track would size
          to the unscaled stack and push the column past a phone's edge */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <div className="min-w-0">
          <div
            className="overflow-hidden"
            style={{ height: "clamp(520px, 64vh, 640px)", borderRadius: "var(--radius-card)" }}
          >
            <ScrollSwipeStack
              key={`${rotation.start}-${rotation.nonce}`}
              slides={slides}
              background="var(--bg-raised)"
              className="results-stack"
              enableWheel={false}
              showHint={false}
              onActiveChange={(slide) => setActive(slide.id as ClientCategory)}
            />
          </div>
          <p
            className="font-mono mt-4 text-center text-[10.5px] uppercase tracking-[0.18em]"
            style={{ color: "var(--ink-45)" }}
          >
            Drag, swipe or use the arrow keys
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service line">
            {CATEGORIES.map((c, i) => {
              const on = c.category === active;
              return (
                <button
                  key={c.category}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className="rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    borderColor: on ? "var(--ink)" : "var(--line-strong)",
                    background: on ? "var(--ink)" : "transparent",
                    color: on ? "var(--bg)" : "var(--ink-80)",
                  }}
                >
                  {c.title.replace("\n", " ")}
                </button>
              );
            })}
          </div>

          <ul className="mt-8" aria-live="polite">
            {results.map((r) => (
              <li key={r.company} className="border-t py-7" style={{ borderColor: "var(--line)" }}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-[22px] font-bold" style={{ letterSpacing: "-0.02em" }}>
                    {r.company}
                  </h3>
                  <span className="text-[13px]" style={{ color: "var(--ink-45)" }}>
                    {r.name}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {r.stats.map((stat) => (
                    <li
                      key={stat}
                      className="rounded-[var(--radius-tile)] px-4 py-3 text-[14px] leading-snug"
                      style={{ background: "var(--bg-raised)", color: "var(--ink-80)" }}
                    >
                      {stat}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .results-stack::after { display: none; }
        .results-stack .scroll-swipe-stack__title,
        .results-stack .scroll-swipe-stack__category {
          font-family: var(--font-display), var(--font-sans), sans-serif;
        }
      `}</style>
    </section>
  );
}
