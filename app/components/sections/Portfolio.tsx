"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import OrbitHeading from "../fx/OrbitHeading";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import { PROJECTS, type Project } from "../../lib/site";

export default function Portfolio() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* the plates orbiting the headline carry the same four clients the
            cards below do, so the animation is the section, not decoration */}
        <OrbitHeading
          lineOne="FOUR CLIENTS,"
          lineTwo="REAL RESULTS."
          images={PROJECTS.map((p) => p.image)}
          className="mx-auto max-w-[1000px]"
        />

        <div className="mt-6 grid gap-5 md:mt-2 md:grid-cols-2 md:gap-6">
          {PROJECTS.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={(i % 2) * 90}
              className={i % 2 === 1 ? "md:mt-14" : ""}
            >
              <TiltCard maxTilt={4} lift={6} className="h-full">
                <button
                  type="button"
                  onClick={() => setActive(project)}
                  aria-haspopup="dialog"
                  className="surface card-lift group h-full w-full overflow-hidden p-3 text-left"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ borderRadius: "var(--radius-tile)", aspectRatio: "4 / 3" }}
                  >
                    <Image
                      src={project.image}
                      alt={`Landscaping work by ${project.client}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(5,11,31,0.2), rgba(5,11,31,0.72))",
                      }}
                    />
                  </div>

                  <div className="flex items-start justify-between gap-5 px-4 pb-4 pt-6">
                    <div>
                      <h3 className="font-display text-[19px] font-semibold md:text-[21px]">
                        {project.client}
                      </h3>
                      <p
                        className="font-mono mt-2 text-[10.5px] uppercase tracking-[0.16em]"
                        style={{ color: "var(--ink-45)" }}
                      >
                        {project.service}
                      </p>
                      <p className="mt-4 text-[15px]" style={{ color: "var(--ink-80)" }}>
                        {project.headline}
                      </p>
                    </div>

                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--bg)]"
                      style={{ borderColor: "var(--line-strong)" }}
                    >
                      <ArrowUpRight size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        label={active ? `${active.client} case study` : "Case study"}
      >
        {active && (
          <div>
            <div
              className="relative mb-8 overflow-hidden"
              style={{ borderRadius: "var(--radius-tile)", aspectRatio: "16 / 9" }}
            >
              <Image
                src={active.image}
                alt={`Landscaping work by ${active.client}`}
                fill
                sizes="720px"
                className="object-cover"
              />
            </div>

            <p
              className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--ink-45)" }}
            >
              {active.service}
            </p>

            <h3
              className="font-display mt-4 font-semibold"
              style={{ fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.12 }}
            >
              {active.client}
            </h3>

            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
              {active.summary}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {active.outcomes.map((outcome) => (
                <div
                  key={outcome.label}
                  className="p-4"
                  style={{
                    borderRadius: "var(--radius-tile)",
                    background: "rgba(242,238,223,0.05)",
                  }}
                >
                  <div className="font-display text-[24px] font-semibold md:text-[28px]">
                    {outcome.value}
                  </div>
                  <div
                    className="font-mono mt-2 text-[9.5px] uppercase leading-relaxed tracking-[0.14em]"
                    style={{ color: "var(--ink-45)" }}
                  >
                    {outcome.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {active.detail.map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
