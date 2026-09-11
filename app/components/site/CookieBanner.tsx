"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pva-cookie-choice";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* storage blocked, do not nag on every page view */
      return;
    }
    if (stored) return;
    // let the intro finish before asking
    const t = window.setTimeout(() => setShow(true), 2600);
    return () => clearTimeout(t);
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* nothing to persist to, the banner still dismisses for this view */
    }
    setLeaving(true);
    window.setTimeout(() => setShow(false), 380);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[70] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-[420px]"
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.36s ease, transform 0.36s cubic-bezier(0.22,1,0.36,1)",
        animation: leaving ? undefined : "modal-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div
        className="surface p-5 md:p-6"
        style={{
          borderRadius: "var(--radius-card)",
          background: "rgba(13, 13, 13,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
          We use cookies to measure how the site is used. Decline and only the essentials run.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => choose("accepted")} className="btn btn-primary !px-5 !py-2.5 !text-[13px]">
            Accept
          </button>
          <button type="button" onClick={() => choose("declined")} className="btn btn-secondary !px-5 !py-2.5 !text-[13px]">
            Decline
          </button>
          <Link
            href="/privacy"
            className="ml-auto text-[13px] underline underline-offset-4 transition-colors hover:text-[color:var(--ink)]"
            style={{ color: "var(--ink-45)" }}
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
