"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import Stagger from "../ui/Stagger";
import CallTimeline from "../ui/CallTimeline";
import TiltCard from "../ui/TiltCard";
import { TIERS, type Tier } from "../../lib/site";

export default function Pricing() {
  const [active, setActive] = useState<Tier | null>(null);

  return (
    <section
      id="ai-receptionist"
      className="scroll-mt-24 border-y"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
          <div>
            <Reveal>
              <p
                className="font-mono mb-6 text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-45)" }}
              >
                AI Receptionist
              </p>
              <h2
                className="font-display max-w-[16ch] font-semibold"
                style={{ fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.08 }}
              >
                It picks up while you are on site
              </h2>
              <p
                className="mt-6 max-w-[42ch] text-[16px] leading-relaxed"
                style={{ color: "var(--ink-60)" }}
              >
                Every call and web enquiry gets answered, qualified against your criteria, and
                booked into your calendar. No voicemail, no callback race.
              </p>
            </Reveal>

            {/* the number, then the call it describes, replaying */}
            <Reveal delay={140}>
              <div className="mt-12">
                <CallTimeline value="<60s" label="Average lead response" />
              </div>
            </Reveal>
          </div>

          <div id="pricing" className="scroll-mt-24 grid gap-5 sm:grid-cols-2">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.slug} delay={i * 110} className="h-full">
                <TiltCard maxTilt={3} lift={5} className="h-full">
                  <div
                    className="surface card-lift relative flex h-full flex-col p-7 md:p-8"
                    style={{
                      borderRadius: "var(--radius-card)",
                      borderColor: tier.popular ? "var(--line-strong)" : "var(--line)",
                    }}
                  >
                    {tier.popular && (
                      <span
                        className="font-mono absolute right-6 top-6 rounded-full px-3 py-1.5 text-[9.5px] uppercase tracking-[0.16em]"
                        style={{ background: "var(--ink)", color: "var(--bg)" }}
                      >
                        Most popular
                      </span>
                    )}

                    <h3 className="font-display text-[20px] font-semibold">{tier.name}</h3>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span
                        className="font-display font-semibold"
                        style={{ fontSize: "clamp(36px, 4.4vw, 48px)", lineHeight: 1 }}
                      >
                        {tier.monthly}
                      </span>
                      <span className="text-[15px]" style={{ color: "var(--ink-45)" }}>
                        /mo
                      </span>
                    </div>

                    <p
                      className="font-mono mt-3 text-[10.5px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--ink-45)" }}
                    >
                      {tier.setup}
                    </p>

                    <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
                      {tier.summary}
                    </p>

                    <Stagger className="mt-7 space-y-3" staggerMs={80}>
                      {tier.headline.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-[14.5px]">
                          <Check
                            size={15}
                            strokeWidth={2}
                            className="mt-1 shrink-0"
                            style={{ color: "var(--accent)" }}
                          />
                          <span style={{ color: "var(--ink-80)" }}>{item}</span>
                        </div>
                      ))}
                    </Stagger>

                    <button
                      type="button"
                      onClick={() => setActive(tier)}
                      aria-haspopup="dialog"
                      className="mt-8 self-start text-[14px] underline underline-offset-4 transition-colors hover:text-[color:var(--ink)]"
                      style={{ color: "var(--accent)" }}
                    >
                      See all {tier.full.length} features
                    </button>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        label={active ? `${active.name} plan features` : "Plan features"}
      >
        {active && (
          <div>
            <h3
              className="font-display font-semibold"
              style={{ fontSize: "clamp(26px, 4vw, 34px)", lineHeight: 1.12 }}
            >
              {active.name}
            </h3>
            <p className="mt-3 text-[15px]" style={{ color: "var(--ink-60)" }}>
              {active.monthly} per month. {active.setup}.
            </p>

            <Stagger className="mt-8 space-y-3" staggerMs={55}>
              {active.full.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px]">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="mt-1 shrink-0"
                    style={{ color: "var(--accent)" }}
                  />
                  <span style={{ color: "var(--ink-80)" }}>{item}</span>
                </div>
              ))}
            </Stagger>

            <Link href="/bookings" className="btn btn-primary mt-9 w-full sm:w-auto">
              Book a free call
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
