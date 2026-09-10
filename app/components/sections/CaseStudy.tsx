import Image from "next/image";
import Reveal from "../ui/Reveal";
import CountUp from "../ui/CountUp";
import FillBar from "../ui/FillBar";
import LiveGraph from "../ui/LiveGraph";
import { CASE_STUDY } from "../../lib/site";

export default function CaseStudy() {
  return (
    <section
      className="border-y"
      style={{ borderColor: "var(--line)", background: "var(--bg-raised)" }}
    >
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* photo, with the live chart overlapping its lower corner */}
          <Reveal className="relative">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: "var(--radius-card)", aspectRatio: "4 / 5" }}
            >
              <Image
                src={CASE_STUDY.image}
                alt="A completed residential landscaping project by one of our clients"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(5,11,31,0.25), rgba(5,11,31,0.75))",
                }}
              />
            </div>

            <div
              className="surface relative z-10 mx-auto -mt-16 w-[86%] p-5 md:absolute md:-bottom-10 md:-right-8 md:mt-0 md:w-[62%] md:p-6"
              style={{
                borderRadius: "var(--radius-card)",
                background: "rgba(8,17,43,0.94)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <LiveGraph height={110} label="Enquiries after launch" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <blockquote
                className="font-display max-w-[46ch] font-medium"
                style={{ fontSize: "clamp(21px, 2.2vw, 30px)", lineHeight: 1.28 }}
              >
                {"“"}
                {CASE_STUDY.quote}
                {"”"}
              </blockquote>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-7 text-[15px]" style={{ color: "var(--ink-60)" }}>
                <span style={{ color: "var(--ink)" }}>{CASE_STUDY.name}</span>, {CASE_STUDY.detail}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {CASE_STUDY.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 100}>
                  <div>
                    <div
                      className="font-display font-semibold"
                      style={{ fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1 }}
                    >
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-3">
                      <FillBar
                        percent={stat.percent}
                        delay={i * 120}
                        label={`${stat.value}${stat.suffix} ${stat.label}`}
                      />
                    </div>
                    <div
                      className="font-mono mt-3 text-[10.5px] uppercase leading-relaxed tracking-[0.16em]"
                      style={{ color: "var(--ink-45)" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
