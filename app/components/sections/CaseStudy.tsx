import Reveal from "../ui/Reveal";
import CountUp from "../ui/CountUp";
import FillBar from "../ui/FillBar";
import ScrollWords from "../ui/ScrollWords";
import { CASE_STUDY } from "../../lib/site";

/**
 * One client, one quote, three numbers. No photograph, no chart: the words
 * light up as they pass the middle of the screen, and the numbers count in
 * beneath them.
 */
export default function CaseStudy() {
  return (
    <section className="border-y" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-[1240px] px-5 py-28 md:px-8 md:py-40">
        <ScrollWords
          as="blockquote"
          text={`“${CASE_STUDY.quote}”`}
          className="font-display mx-auto max-w-[22ch] text-center font-medium"
          style={{ fontSize: "clamp(28px, 4.6vw, 62px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
        />

        <Reveal delay={60}>
          <p className="mt-10 text-center text-[15px] md:mt-12" style={{ color: "var(--ink-60)" }}>
            <span style={{ color: "var(--ink)" }}>{CASE_STUDY.name}</span>, {CASE_STUDY.detail}
          </p>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-[960px] gap-10 sm:grid-cols-3 md:mt-28 md:gap-14">
          {CASE_STUDY.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 110}>
              <div>
                <div
                  className="font-display font-semibold"
                  style={{ fontSize: "clamp(48px, 6.4vw, 92px)", lineHeight: 1, letterSpacing: "-0.04em" }}
                >
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-5">
                  <FillBar
                    percent={stat.percent}
                    delay={i * 130}
                    height={3}
                    label={`${stat.value}${stat.suffix} ${stat.label}`}
                  />
                </div>
                <div
                  className="font-mono mt-4 text-[10.5px] uppercase leading-relaxed tracking-[0.16em]"
                  style={{ color: "var(--ink-45)" }}
                >
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
