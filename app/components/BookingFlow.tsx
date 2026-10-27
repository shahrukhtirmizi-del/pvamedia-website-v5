"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import BookingForm, { type LeadDetails } from "./BookingForm";
import CalendlyEmbed from "./CalendlyEmbed";
import { readUtm, submitLead, type Utm } from "../lib/leads";
import { trackMeta } from "../lib/tracking";

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono block text-[12px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-60)" }}>
      {children}
    </span>
  );
}

/**
 * The /bookings flow: details first, then the calendar opens beneath them,
 * prefilled. The lead is sent in the background, so booking never waits on it.
 */
export default function BookingFlow() {
  const [details, setDetails] = useState<LeadDetails | null>(null);
  const [utm, setUtm] = useState<Utm>({});
  const [editing, setEditing] = useState(false);
  const leadTracked = useRef(false);
  const stepTwo = useRef<HTMLHeadingElement>(null);

  const showCalendar = details !== null && !editing;

  useEffect(() => {
    const target = stepTwo.current;
    if (!showCalendar || !target) return;
    target.focus({ preventScroll: true });
    // the page just grew by a whole calendar, so let the smooth scroller re-measure first;
    // the html scroll-padding already clears the nav
    window.__lenis?.resize();
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: -12, duration: 1 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showCalendar, details]);

  function onDone(next: LeadDetails) {
    const fromAd = readUtm(window.location.search);
    submitLead({ ...next, utm: fromAd, pageUrl: window.location.href });
    if (!leadTracked.current) {
      leadTracked.current = true;
      trackMeta("Lead");
    }
    setUtm(fromAd);
    setDetails(next);
    setEditing(false);
  }

  return (
    <div>
      <div
        className="surface p-5 sm:p-8"
        style={{
          borderRadius: "var(--radius-card)",
          background: "rgba(244, 244, 242, 0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div hidden={showCalendar}>
          <h2 className="mb-5">
            <StepLabel>Step 1 of 2: your details</StepLabel>
          </h2>
          <BookingForm onDone={onDone} />
        </div>

        {showCalendar && (
          <div className="flex items-center gap-4">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              <Check size={16} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <StepLabel>Step 1 of 2 done</StepLabel>
              <p className="mt-1 truncate text-[15px]" style={{ color: "var(--ink-80)" }}>
                {details.firstName}, {details.business}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 p-2 text-[14px] underline underline-offset-4"
              style={{ color: "var(--ink-60)" }}
            >
              Change
            </button>
          </div>
        )}
      </div>

      {showCalendar && (
        <div className="mt-10">
          <h2 ref={stepTwo} tabIndex={-1} className="mb-5 outline-none">
            <StepLabel>Step 2 of 2: pick a time</StepLabel>
          </h2>
          <CalendlyEmbed prefill={{ name: details.firstName, email: details.email }} utm={utm} />
        </div>
      )}
    </div>
  );
}
