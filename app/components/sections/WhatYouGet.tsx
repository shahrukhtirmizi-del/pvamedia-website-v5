import Link from "next/link";
import Reveal from "../ui/Reveal";
import ScrollWords from "../ui/ScrollWords";
import { WHAT_YOU_GET, GUARANTEE } from "../../lib/site";

/**
 * The heading holds still while six large statements scroll past it, each
 * lighting up as it reaches the middle of the screen and dimming as it
 * leaves. The guarantee closes the run.
 */
export default function WhatYouGet() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <div className="lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2
              className="font-display max-w-[12ch] font-semibold"
              style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1.06 }}
            >
              What you get
            </h2>
            <p
              className="mt-6 max-w-[34ch] text-[15px] leading-relaxed"
              style={{ color: "var(--ink-60)" }}
            >
              Everything a landscaping company needs to be found, trusted and booked, handled by
              one team.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-0">
          {WHAT_YOU_GET.map((item, i) => (
            <div
              key={item.title}
              className={`border-t py-10 md:py-14 ${i === WHAT_YOU_GET.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "var(--line)" }}
            >
              <ScrollWords
                as="h3"
                text={item.title}
                className="font-display font-semibold"
                style={{ fontSize: "clamp(28px, 4.2vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.035em" }}
              />
              <ScrollWords
                text={item.body}
                className="mt-4 max-w-[46ch] text-[16px] leading-relaxed md:text-[18px]"
                style={{ color: "var(--ink-80)" }}
              />
            </div>
          ))}
        </div>
      </div>

      <Reveal delay={100}>
        <div
          className="surface mt-20 flex flex-col items-start gap-8 p-8 md:mt-28 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <p
            className="font-display max-w-[20ch] font-medium"
            style={{ fontSize: "clamp(24px, 3.2vw, 38px)", lineHeight: 1.16 }}
          >
            {GUARANTEE}
          </p>
          <Link href="/bookings" className="btn btn-primary shrink-0">
            Book a free call
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
