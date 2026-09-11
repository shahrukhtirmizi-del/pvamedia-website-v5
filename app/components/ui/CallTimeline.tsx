"use client";

import { useId } from "react";
import { PhoneIncoming, Sparkles, ClipboardCheck, CalendarCheck } from "lucide-react";

/**
 * One enquiry, start to finish, replaying on a loop.
 *
 * Four moments light up in order down a line that fills as they happen,
 * with the clock on each. The headline number sits above it. Everything is
 * CSS keyframes on one shared cycle, so it costs nothing per frame and holds
 * still under reduced motion.
 */
const CYCLE = 11; // seconds

const STEPS = [
  { at: "2:14:07", label: "Homeowner calls", detail: "Saturday, while the crew is on a job", Icon: PhoneIncoming },
  { at: "2:14:08", label: "Answered on the first ring", detail: "No voicemail, no callback race", Icon: Sparkles },
  { at: "2:14:52", label: "Job qualified", detail: "Patio and lighting, budget confirmed", Icon: ClipboardCheck },
  { at: "2:15:41", label: "Booked in", detail: "Thursday, 9am, straight into the calendar", Icon: CalendarCheck },
];

/** where on the cycle each step lights, as a fraction */
const STARTS = [0.08, 0.2, 0.42, 0.66];

function keyframes(uid: string) {
  return STARTS.map((st, i) => {
    const a = (st * 100).toFixed(1);
    const b = (st * 100 + 5).toFixed(1);
    const c = (st * 100 + 12).toFixed(1);
    return `
      @keyframes ${uid}-step-${i} {
        0%, ${a}% { opacity: 0.22; transform: translateX(-6px); }
        ${b}% { opacity: 1; transform: translateX(0); }
        90% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0.22; transform: translateX(-6px); }
      }
      @keyframes ${uid}-dot-${i} {
        0%, ${a}% { box-shadow: 0 0 0 0 rgba(98, 220, 176,0); background: rgba(244, 244, 242,0.18); }
        ${b}% { box-shadow: 0 0 0 9px rgba(98, 220, 176,0.18); background: var(--ink); }
        ${c}% { box-shadow: 0 0 0 0 rgba(98, 220, 176,0); background: var(--ink); }
        90% { background: var(--ink); }
        100% { background: rgba(244, 244, 242,0.18); }
      }
      .${uid} .step-${i} { animation: ${uid}-step-${i} ${CYCLE}s cubic-bezier(0.22,1,0.36,1) infinite; }
      .${uid} .dot-${i} { animation: ${uid}-dot-${i} ${CYCLE}s ease infinite; }
    `;
  }).join("");
}

export default function CallTimeline({
  value = "<60s",
  label = "Average lead response",
}: {
  value?: string;
  label?: string;
}) {
  const uid = "ct" + useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div
      className="surface relative w-full max-w-[440px] overflow-hidden p-7 md:p-8"
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <style>{`
        @keyframes ${uid}-line {
          0%, 8% { transform: scaleY(0); opacity: 1; }
          72% { transform: scaleY(1); }
          92% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes ${uid}-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        ${keyframes(uid)}
        @media (prefers-reduced-motion: reduce) {
          .${uid} .step, .${uid} .dot, .${uid} .line, .${uid} .live {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
          .${uid} .dot { background: var(--ink); }
        }
      `}</style>

      <div className="flex items-end justify-between gap-6">
        <div>
          <div
            className="font-display font-semibold tabular-nums"
            style={{ fontSize: "clamp(44px, 5vw, 60px)", lineHeight: 1, letterSpacing: "-0.04em" }}
          >
            {value}
          </div>
          <div
            className="font-mono mt-2 text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-45)" }}
          >
            {label}
          </div>
        </div>
        <div
          className="font-mono flex items-center gap-2 pb-1 text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--ink-45)" }}
        >
          <span
            className="live h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)", animation: `${uid}-live 1.6s ease-in-out infinite` }}
          />
          Replaying
        </div>
      </div>

      <div className={`${uid} relative mt-8 pl-9`}>
        <div className="absolute bottom-3 left-[11px] top-3 w-px" style={{ background: "rgba(244, 244, 242,0.1)" }} />
        <div
          className="line absolute bottom-3 left-[11px] top-3 w-px origin-top"
          style={{
            background: "linear-gradient(180deg, var(--accent), var(--ink))",
            animation: `${uid}-line ${CYCLE}s linear infinite`,
          }}
        />

        <ol className="space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.label} className={`step step-${i} relative`}>
              <span
                className={`dot dot-${i} absolute -left-9 top-[5px] grid h-[23px] w-[23px] place-items-center rounded-full`}
                style={{ color: "var(--bg)" }}
              >
                <step.Icon size={12} strokeWidth={2.2} />
              </span>
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-display text-[15px] font-semibold leading-tight">{step.label}</div>
                <div className="font-mono shrink-0 text-[10.5px] tabular-nums" style={{ color: "var(--ink-45)" }}>
                  {step.at}
                </div>
              </div>
              <div className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
                {step.detail}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
