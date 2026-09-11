"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import OrbitHeading from "../fx/OrbitHeading";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import { MOCKUPS, type Mockup } from "../mockups";

const RING_IMAGES = MOCKUPS.map((m) => m.cover);

/**
 * Eight directions a landscaping site can take, drifting past on a rail that
 * stops under the pointer. Each opens larger, with a note on who it suits.
 */
export default function Portfolio() {
  const [active, setActive] = useState<Mockup | null>(null);

  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <OrbitHeading
          lineOne="HOW YOURS"
          lineTwo="COULD LOOK."
          images={RING_IMAGES}
          className="mx-auto max-w-[1000px]"
        />

        <Reveal>
          <p
            className="mx-auto -mt-2 max-w-[52ch] text-center text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            Eight directions a landscaping site can take. Every one is built around the crew{"’"}s
            own work, and none of them is a template.
          </p>
        </Reveal>
      </div>

      <div className="rail relative mt-14 overflow-hidden md:mt-20">
        <div className="rail-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6" aria-hidden={copy === 1}>
              {MOCKUPS.map((m) => (
                <button
                  key={`${copy}-${m.slug}`}
                  type="button"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => setActive(m)}
                  aria-haspopup="dialog"
                  aria-label={`${m.name}, ${m.direction}. Open larger.`}
                  className="surface card-lift group w-[78vw] shrink-0 p-2.5 text-left sm:w-[56vw] md:w-[520px]"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <m.Component />
                  <div className="flex items-center justify-between px-3 pb-2 pt-4">
                    <div>
                      <div className="font-display text-[16px] font-semibold">{m.name}</div>
                      <div
                        className="font-mono mt-1 text-[10px] uppercase tracking-[0.16em]"
                        style={{ color: "var(--ink-45)" }}
                      >
                        {m.direction}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--bg)]"
                      style={{ borderColor: "var(--line-strong)" }}
                    >
                      <ArrowUpRight size={15} strokeWidth={1.6} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24"
          style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-24"
          style={{ background: "linear-gradient(270deg, var(--bg), transparent)" }}
        />
      </div>

      <Reveal>
        <p
          className="font-mono mx-auto mt-10 max-w-[60ch] px-5 text-center text-[11px] uppercase leading-relaxed tracking-[0.16em] md:px-8"
          style={{ color: "var(--ink-30)" }}
        >
          Concept directions. Yours is designed from scratch around your photography.
        </p>
      </Reveal>

      <Modal open={active !== null} onClose={() => setActive(null)} label={active ? active.name : "Concept"}>
        {active && (
          <div>
            <div className="-mx-2 sm:-mx-3">
              <active.Component />
            </div>
            <p
              className="font-mono mt-7 text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--ink-45)" }}
            >
              {active.direction}
            </p>
            <h3
              className="font-display mt-3 font-semibold"
              style={{ fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.12 }}
            >
              {active.name}
            </h3>
            <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
              {active.note}
            </p>
            <Link href="/bookings" className="btn btn-primary mt-8 w-full sm:w-auto">
              Book a free call
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
