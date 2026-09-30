import Reveal from "../ui/Reveal";
// Figures below are computed by hand from CLIENT_RESULTS in lib/site.ts.

/**
 * Conversion Metrics Bento Grid, adapted from the client-supplied reference.
 * Per the client's decision, this keeps the reference's fixed bento shape
 * (two headline stat tiles, a status tile and a wide feature tile) rather
 * than listing clients one by one, and names no client counts or trades.
 *
 * Every number below is a real aggregate computed from CLIENT_RESULTS, not
 * invented to fit the template:
 *
 *  - Website conversion-rate lift: only the 3 website clients whose stats
 *    actually report a conversion-rate figure are averaged (Eddie +58%,
 *    Joshua +67%, Kamal +49% -> 58%). Bruno's stats report inquiries, not a
 *    conversion rate, so he's correctly left out of this particular average
 *    rather than mixed into a number he didn't report.
 *  - Marketing qualified-lead lift: every marketing client reports an
 *    increase in qualified leads (Matt +41%, Laughton +63%, Alasdair +44%;
 *    James reports the same measure as "+36% qualified inquiries"), so all
 *    four are averaged: 184 / 4 = 46%.
 *  - The client mix and client count are deliberately not shown: a small
 *    named sample read as "they only have ten clients".
 *  - The AI Automation category has only 2 clients and its stats don't share
 *    a common unit with each other (hours saved, response time, % handled),
 *    so rather than fabricate a blended average, the feature tile cites one
 *    real, single-client figure instead.
 */

const AVG_WEBSITE_CONVERSION_LIFT = 58; // see comment above
const AVG_MARKETING_QUALIFIED_LEAD_LIFT = 46; // see comment above
// "84% of routine inquiries handled automatically" below is Ravi S.'s
// (Central Texas HVAC) real figure from CLIENT_RESULTS — cited as one
// client's result, not blended into an average.

export default function Results() {
  return (
    <section id="results" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <p className="font-mono mb-5 text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
          Results
        </p>
        <h2
          className="font-display max-w-[16ch] font-bold"
          style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.02 }}
        >
          What the work does for our clients
        </h2>
      </Reveal>

      <div className="rb-grid mt-12 md:mt-16">
        <article className="rb-card rb-stat-a">
          <p>Average website conversion-rate lift, across clients that report one</p>
          <div className="rb-stat-bottom">
            <div className="rb-stat-value">
              <strong>{AVG_WEBSITE_CONVERSION_LIFT}</strong>
              <span>%</span>
            </div>
            <small>Website clients</small>
          </div>
        </article>

        <article className="rb-card rb-stat-b">
          <p>Average increase in qualified leads for our marketing clients</p>
          <div className="rb-stat-bottom">
            <div className="rb-stat-value">
              <strong>+{AVG_MARKETING_QUALIFIED_LEAD_LIFT}</strong>
              <span>%</span>
            </div>
            <small>Marketing clients</small>
          </div>
        </article>

        <article className="rb-card rb-availability">
          <span className="rb-status-dot" />
          <span>ACCEPTING NEW PROJECTS</span>
        </article>

        <article className="rb-feature">
          <div className="rb-feature-content">
            <p>
              Trades and home service businesses trust us with their marketing, websites and AI
              automation, and judge us on booked jobs.
            </p>

            <div className="rb-feature-row">
              <div className="rb-feature-highlight">
                <strong>84%</strong>
                <span>of routine inquiries handled automatically</span>
              </div>
              <div className="rb-feature-note">
                <span>Result from one of our AI automation clients.</span>
              </div>
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

      <style>{`
        .rb-grid {
          display: grid;
          grid-template-columns: 0.95fr 1fr 1.55fr;
          grid-template-rows: 96px 250px 66px;
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

        .rb-card { padding: 22px; }
        .rb-card:hover { transform: translateY(-4px); border-color: var(--line-strong); background: var(--bg); }


        .rb-stat-a { grid-column: 1; grid-row: 1 / 4; display: flex; flex-direction: column; justify-content: space-between; }
        .rb-stat-b { grid-column: 2; grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: space-between; }

        .rb-availability { grid-column: 2; grid-row: 3; display: flex; align-items: center; gap: 10px; padding-block: 16px; color: var(--ink-60); font-size: 11px; font-weight: 800; letter-spacing: .08em; }

        .rb-status-dot { width: 11px; height: 11px; flex: 0 0 auto; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 5px var(--line); animation: rb-pulse 2.2s ease-in-out infinite; }

        .rb-card p { max-width: 220px; margin: 0; font-size: 16px; line-height: 1.45; color: var(--ink-80); }

        .rb-stat-bottom { display: flex; flex-direction: column; gap: 6px; }
        .rb-stat-value { display: inline-flex; align-items: flex-end; gap: 2px; line-height: 1; }
        .rb-stat-value strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-size: clamp(50px, 5vw, 74px); font-weight: 600; letter-spacing: -.06em; line-height: .9; }
        .rb-stat-value span { color: var(--ink-45); font-size: clamp(28px, 2.2vw, 40px); font-weight: 500; line-height: .88; transform: translateY(-2px); }
        .rb-stat-bottom small { color: var(--ink-45); font-size: 13px; }

        .rb-feature {
          grid-column: 3; grid-row: 1 / 4;
          min-height: 418px;
          padding: 34px;
          color: #FFFFFF;
          background: var(--ink);
          border-color: transparent;
          box-shadow: 0 24px 42px rgba(10,10,10,.22);
          transition: transform 350ms cubic-bezier(.2,.8,.2,1);
        }
        .rb-feature:hover { transform: translateY(-5px); }
        .rb-feature-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; }
        .rb-feature p { width: min(320px, 90%); margin: 0; color: rgba(255,255,255,.82); font-size: 17px; line-height: 1.5; }

        .rb-feature-row { display: flex; flex-direction: column; gap: 10px; }
        .rb-feature-highlight { display: flex; align-items: baseline; gap: 8px; }
        .rb-feature-highlight strong { font-family: var(--font-display), var(--font-sans), sans-serif; font-size: clamp(40px, 4vw, 58px); font-weight: 600; letter-spacing: -.05em; }
        .rb-feature-highlight span { max-width: 20ch; font-size: 13px; color: rgba(255,255,255,.65); }
        .rb-feature-note { max-width: 30ch; font-size: 11px; letter-spacing: .02em; color: rgba(255,255,255,.45); }

        .rb-growth-arrow { position: absolute; top: 70px; right: 0; width: 82%; color: rgba(255,255,255,.035); transform: rotate(-2deg); pointer-events: none; transition: color 450ms ease, transform 450ms cubic-bezier(.2,.8,.2,1); }
        .rb-feature:hover .rb-growth-arrow { color: rgba(255,255,255,.06); transform: translate(5px, -5px) rotate(-2deg); }

        @keyframes rb-pulse { 0%, 100% { box-shadow: 0 0 0 5px var(--line); } 50% { box-shadow: 0 0 0 9px transparent; } }

        @media (max-width: 900px) {
          .rb-grid { grid-template-columns: 1fr 1fr; grid-template-rows: 96px 250px 66px auto; }
          .rb-feature { grid-column: 1 / -1; grid-row: 4; min-height: 380px; }
        }

        @media (max-width: 620px) {
          .rb-grid { display: flex; flex-direction: column; }
          .rb-stat-a, .rb-stat-b { min-height: 260px; }
          .rb-feature { min-height: 380px; padding: 26px; }
          .rb-feature p { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rb-card, .rb-feature, .rb-growth-arrow, .rb-status-dot { transition: none; animation: none; }
        }
      `}</style>
    </section>
  );
}
