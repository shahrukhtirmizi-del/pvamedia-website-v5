"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "../lib/site";

/**
 * Calendly's inline calendar, themed to the site, with a plain link beneath
 * it in case the embed is blocked. The widget script is added once.
 */
export default function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const url =
    SITE.calendly +
    "?hide_gdpr_banner=1&background_color=0d0d0d&text_color=f4f4f2&primary_color=62dcb0";

  useEffect(() => {
    const id = "calendly-widget-script";
    const done = () => setReady(true);
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      done();
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = done;
    document.body.appendChild(s);
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
          boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(244,244,242,0.1)",
        }}
      >
        <div
          ref={ref}
          className="calendly-inline-widget"
          data-url={url}
          style={{ minWidth: 320, height: 720, opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      </div>
      <p className="mt-4 text-center text-[13px]" style={{ color: "var(--ink-45)" }}>
        Calendar not showing?{" "}
        <a
          href={SITE.calendly}
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
