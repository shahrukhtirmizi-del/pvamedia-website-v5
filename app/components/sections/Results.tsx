import Reveal from "../ui/Reveal";

/**
 * Benchmark bento, adapted from the client-supplied reference: four industry
 * benchmarks with their sources, and our own reply time in the feature tile.
 * The figures match the growth and systems calculators; keep them in step.
 */
const BENCHMARKS = [
  {
    label: "Average cost per inquiry from US search ads",
    value: "$67",
    source:
      "Source: WordStream by LocaliQ 2026 benchmarks, all industries ($66.69, 13,474 US Google and Microsoft search campaigns).",
  },
  {
    label: "From a $4,000 monthly search ad budget at that benchmark cost",
    value: "About 60",
    unit: "inquiries a month",
    source: "Worked out from the WordStream by LocaliQ 2026 benchmark.",
  },
  {
    label: "Business calls that never reach a person",
    value: "44",
    unit: "in 100",
    source:
      "Source: Invoca 2026 Lead Conversion Benchmarks (56% of calls answered by a person, 70M+ calls).",
  },
  {
    label: "US firms that never replied to a web inquiry",
    value: "23%",
    source: "Source: Harvard Business Review audit of 2,241 US firms.",
  },
];

const CALCULATOR = "https://pva-full-growth-calculator.vercel.app";

export default function Results() {
  return (
    <section id="results" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <p className="font-mono mb-5 text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
          Industry benchmarks
        </p>
        <h2
          className="font-display max-w-[16ch] font-bold"
          style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.02 }}
        >
          The numbers behind the system
        </h2>
        <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
          These are industry benchmarks, not client results. The 60 second reply is our own service.
        </p>
      </Reveal>

      <div className="rb-grid mt-12 md:mt-16">
        {BENCHMARKS.map((item) => (
          <article className="rb-card" key={item.value}>
            <p>{item.label}</p>
            <div className="rb-stat-bottom">
              <div className="rb-stat-value">
                <strong>{item.value}</strong>
                {item.unit && <span>{item.unit}</span>}
              </div>
              <small>{item.source}</small>
            </div>
          </article>
        ))}

        <article className="rb-feature">
          <div className="rb-feature-content">
            <p>
              How fast every chat, text and web inquiry gets a reply with PVA, day or night.
            </p>

            <div className="rb-feature-highlight">
              <strong>60</strong>
              <span>seconds</span>
            </div>
          </div>

          <svg className="rb-growth-arrow" viewBox="0 0 400 320" aria-hidden="true">
            <path
              d="M36 257L112 181L177 227L314 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="38"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M231 90H314V173"
              fill="none"
              stroke="currentColor"
              strokeWidth="38"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </article>
      </div>

      <div className="rb-foot">
        {/* a quiet eyebrow with a thin rule: no pill, no dot, no motion */}
        <p className="rb-eyebrow font-mono">Limited partner spots each month</p>
        <a href={CALCULATOR} target="_blank" rel="noopener noreferrer">
          Work out your own numbers
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <style>{`
        .rb-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.25fr;
          grid-template-rows: repeat(2, minmax(300px, auto));
          gap: 14px;
        }

        .rb-card, .rb-feature {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          background: var(--bg-raised);
          transition: transform 300ms cubic-bezier(.2,.8,.2,1), border-color 300ms ease, background 300ms ease;
        }

        .rb-card { padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 28px; }
        .rb-card:hover { transform: translateY(-4px); border-color: var(--line-strong); background: var(--bg); }


        .rb-card p { max-width: 260px; margin: 0; font-size: 16px; line-height: 1.45; color: var(--ink-80); }

        .rb-stat-bottom { display: flex; flex-direction: column; gap: 12px; }
        .rb-stat-value { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; line-height: 1; }
        .rb-stat-value strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-size: clamp(50px, 5vw, 70px); font-weight: 600; letter-spacing: -.06em; line-height: .9; }
        .rb-stat-value span { color: var(--ink-60); font-size: clamp(17px, 1.5vw, 21px); font-weight: 500; line-height: 1.1; }
        .rb-stat-bottom small { color: var(--ink-60); font-size: 12.5px; line-height: 1.45; }

        .rb-feature {
          grid-column: 3; grid-row: 1 / 3;
          min-height: 418px;
          padding: 34px;
          color: #FFFFFF;
          background: var(--ink);
          border-color: transparent;
          box-shadow: 0 24px 42px rgba(10,10,10,.22);
          transition: transform 350ms cubic-bezier(.2,.8,.2,1);
        }
        .rb-feature:hover { transform: translateY(-5px); }
        .rb-feature { display: flex; }
        .rb-feature-content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; }
        .rb-feature p { width: min(320px, 90%); margin: 0; color: rgba(255,255,255,.82); font-size: 17px; line-height: 1.5; }

        .rb-feature-highlight { display: flex; align-items: baseline; gap: 12px; }
        .rb-feature-highlight strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-size: clamp(88px, 10vw, 150px); font-weight: 600; letter-spacing: -.06em; line-height: .86; }
        .rb-feature-highlight span { font-size: clamp(20px, 2vw, 28px); color: rgba(255,255,255,.65); }

        .rb-growth-arrow { position: absolute; top: 70px; right: 0; width: 82%; color: rgba(255,255,255,.035); transform: rotate(-2deg); pointer-events: none; transition: color 450ms ease, transform 450ms cubic-bezier(.2,.8,.2,1); }
        .rb-feature:hover .rb-growth-arrow { color: rgba(255,255,255,.06); transform: translate(5px, -5px) rotate(-2deg); }

        .rb-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 32px; margin-top: 32px; }
        .rb-eyebrow { display: flex; align-items: center; gap: 14px; margin: 0; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-60); }
        .rb-eyebrow::before { content: ""; width: 32px; height: 1px; flex: 0 0 auto; background: var(--ink-45); }
        .rb-foot a { font-size: 14px; text-decoration: underline; text-underline-offset: 4px; color: var(--ink-60); transition: color 300ms ease; }
        .rb-foot a:hover { color: var(--ink); }

        @media (max-width: 900px) {
          .rb-grid { grid-template-columns: 1fr 1fr; grid-template-rows: none; }
          .rb-feature { grid-column: 1 / -1; grid-row: auto; min-height: 380px; }
        }

        @media (max-width: 620px) {
          .rb-grid { display: flex; flex-direction: column; }
          .rb-card { min-height: 240px; }
          .rb-feature { min-height: 380px; padding: 26px; }
          .rb-feature p { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rb-card, .rb-feature, .rb-growth-arrow { transition: none; animation: none; }
        }
      `}</style>
    </section>
  );
}
