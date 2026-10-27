"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "../lib/site";
import type { Utm } from "../lib/leads";
import { trackMeta } from "../lib/tracking";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void };
  }
}

type Props = {
  prefill?: { name?: string; email?: string };
  /** Passed through so each booking shows which ad it came from. */
  utm?: Utm;
};

let widgetScript: Promise<void> | null = null;

/** Calendly's widget script, added once per page load. */
function loadWidget(): Promise<void> {
  widgetScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      widgetScript = null;
      reject(new Error("Calendly widget failed to load"));
    };
    document.body.appendChild(s);
  });
  return widgetScript;
}

function calendlyUrl({ prefill, utm }: Props): string {
  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    background_color: "ffffff",
    text_color: "0a0a0a",
    primary_color: "0a0a0a",
  });
  if (prefill?.name) params.set("name", prefill.name);
  if (prefill?.email) params.set("email", prefill.email);
  for (const [key, value] of Object.entries(utm ?? {})) if (value) params.set(key, value);
  return `${SITE.calendly}?${params}`;
}

/**
 * Calendly's inline calendar, themed to the site, with a plain link beneath
 * it in case the embed is blocked.
 */
export default function CalendlyEmbed({ prefill, utm }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const url = calendlyUrl({ prefill, utm });

  // initialised explicitly, because the script only scans the page once and
  // this embed can mount long after that (step 2 of the booking form)
  useEffect(() => {
    let cancelled = false;
    loadWidget()
      .then(() => {
        const el = ref.current;
        if (cancelled || !el || !window.Calendly) return;
        el.innerHTML = "";
        window.Calendly.initInlineWidget({ url, parentElement: el });
        setReady(true);
      })
      .catch(() => {
        /* the link below still works */
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    let sent = false;
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com" || sent) return;
      if (e.data?.event !== "calendly.event_scheduled") return;
      sent = true;
      trackMeta("Schedule");
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{
          // Calendly only honours custom colours on paid plans, so the panel
          // is framed as a deliberate light card on the dark page
          borderRadius: "var(--radius-card)",
          background: "#ffffff",
          boxShadow: "0 40px 90px -30px rgba(10, 10, 10, 0.25), 0 0 0 1px rgba(10, 10, 10, 0.1)",
        }}
      >
        <div
          ref={ref}
          style={{ minWidth: 320, height: 720, opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      </div>
      <p className="mt-4 text-center text-[13px]" style={{ color: "var(--ink-45)" }}>
        Calendar not showing?{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
          style={{ color: "var(--ink-80)" }}
        >
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}
