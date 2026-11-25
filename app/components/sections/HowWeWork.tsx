import Reveal from "../ui/Reveal";
import { STEPS, PROMISES } from "../../lib/site";

/** What working together looks like: four steps, then three promises. */
export default function HowWeWork() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <h2
          className="font-display max-w-[16ch] font-bold"
          style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.02 }}
        >
          How we work together
        </h2>
      </Reveal>

      <ol className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="border-t pt-6" style={{ borderColor: "var(--line-strong)" }}>
            <Reveal delay={i * 90}>
              <span
                aria-hidden
                className="font-mono text-[11px] tracking-[0.2em]"
                style={{ color: "var(--ink-45)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-[22px] font-semibold leading-tight">{step.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
                {step.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal delay={120}>
        <ul
          className="mt-16 grid gap-6 border-t pt-8 md:mt-20 md:grid-cols-3 md:gap-8"
          style={{ borderColor: "var(--line)" }}
        >
          {PROMISES.map((promise) => (
            <li
              key={promise}
              className="max-w-[34ch] text-[16px] font-medium leading-relaxed"
              style={{ color: "var(--ink-80)" }}
            >
              {promise}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
