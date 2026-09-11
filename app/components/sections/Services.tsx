"use client";

import { useState } from "react";
import { Plus, Check, LayoutTemplate, MapPinned, Megaphone, PhoneCall, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import Stagger from "../ui/Stagger";
import { SERVICES, type Service } from "../../lib/site";

const ICONS: Record<string, LucideIcon> = {
  "website-design": LayoutTemplate,
  "local-seo": MapPinned,
  "paid-ads": Megaphone,
  "ai-receptionist": PhoneCall,
  "hosting-care": Server,
};

/**
 * Five services on a horizontal rail rather than a list. Breadth is the point
 * here, and a rail lets someone flick through them without the section turning
 * into five stacked rows.
 */
export default function Services() {
  const [active, setActive] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display max-w-[18ch] font-semibold"
            style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1.08 }}
          >
            Everything that gets a landscaper booked
          </h2>
        </Reveal>
      </div>

      <div className="no-bar mt-12 overflow-x-auto md:mt-16">
        <div className="flex snap-x snap-mandatory gap-5 px-5 pb-4 md:px-8">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 70}
              className="w-[82vw] max-w-[380px] shrink-0 snap-start sm:w-[48vw] lg:w-[330px]"
            >
              <button
                type="button"
                onClick={() => setActive(service)}
                aria-haspopup="dialog"
                className="surface card-lift group flex h-full min-h-[300px] w-full flex-col p-7 text-left md:min-h-[360px]"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                {(() => {
                  const Icon = ICONS[service.slug] ?? LayoutTemplate;
                  return (
                    <div className="mb-7 flex items-start justify-between">
                      {/* the service's mark in a lit disc */}
                      <span
                        aria-hidden
                        className="grid h-14 w-14 place-items-center rounded-full transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: "radial-gradient(circle at 35% 30%, rgba(98, 220, 176,0.22), rgba(98, 220, 176,0.05) 70%)",
                          border: "1px solid rgba(98, 220, 176,0.25)",
                          boxShadow: "0 0 40px -10px rgba(98, 220, 176,0.35)",
                          color: "var(--ink)",
                        }}
                      >
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <span
                        aria-hidden
                        className="grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 group-hover:rotate-90 group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--bg)]"
                        style={{ borderColor: "var(--line-strong)" }}
                      >
                        <Plus size={15} strokeWidth={1.6} />
                      </span>
                    </div>
                  );
                })()}

                <h3 className="font-display mt-auto text-[21px] font-semibold leading-tight">
                  {service.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
                  {service.short}
                </p>

                {/* the first three inclusions, so the card says what is in the box */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {service.includes.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="font-mono rounded-full px-2.5 py-1 text-[9.5px] uppercase tracking-[0.12em]"
                      style={{ border: "1px solid var(--line-strong)", color: "var(--ink-60)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            </Reveal>
          ))}

          {/* keeps the last card clear of the right edge when scrolled fully */}
          <div aria-hidden className="w-1 shrink-0 md:w-4" />
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        label={active ? active.name : "Service"}
      >
        {active && (
          <div>
            <h3
              className="font-display max-w-[18ch] font-semibold"
              style={{ fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.12 }}
            >
              {active.name}
            </h3>

            <div className="mt-6 space-y-4">
              {active.detail.map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
                  {para}
                </p>
              ))}
            </div>

            <h4
              className="font-mono mt-9 text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--ink-45)" }}
            >
              What is included
            </h4>

            <Stagger className="mt-5 space-y-3" staggerMs={70}>
              {active.includes.map((item) => (
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
          </div>
        )}
      </Modal>
    </section>
  );
}
