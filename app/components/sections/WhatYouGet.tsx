import Link from "next/link";
import Reveal from "../ui/Reveal";
import { WHAT_YOU_GET, GUARANTEE } from "../../lib/site";

export default function WhatYouGet() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <h2
          className="font-display max-w-[14ch] font-semibold"
          style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1.08 }}
        >
          What you get
        </h2>
      </Reveal>

      {/* one hairline between rows, not a box around every item */}
      <div className="mt-14 grid md:mt-20 md:grid-cols-2 md:gap-x-16">
        {WHAT_YOU_GET.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 80}>
            <div
              className="border-t py-7 md:py-9"
              style={{ borderColor: "var(--line)" }}
            >
              <h3 className="font-display text-[19px] font-semibold md:text-[21px]">
                {item.title}
              </h3>
              <p
                className="mt-2.5 max-w-[42ch] text-[15px] leading-relaxed"
                style={{ color: "var(--ink-60)" }}
              >
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <div
          className="surface mt-16 flex flex-col items-start gap-8 p-8 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div>
            <p
              className="font-display max-w-[20ch] font-medium"
              style={{ fontSize: "clamp(24px, 3.2vw, 38px)", lineHeight: 1.16 }}
            >
              {GUARANTEE}
            </p>
          </div>

          <Link href="/bookings" className="btn btn-primary shrink-0">
            Book a free call
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
