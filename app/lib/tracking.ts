/**
 * Meta Pixel plumbing shared by the pixel loader, the cookie banner, the
 * booking form and the Calendly embed.
 */

export const PIXEL_ID = "1752776152466453";

/** Where the cookie banner stores "accepted" or "declined". */
export const CONSENT_KEY = "pva-cookie-choice";

/** Fired on window by the cookie banner, with the choice as its detail. */
export const CONSENT_EVENT = "pva-consent";

/** Set by proxy.ts from Vercel's x-vercel-ip-country header. */
export const COUNTRY_COOKIE = "pva-country";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function readCountry(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function readChoice(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

/**
 * US visitors are opted in until they decline; everyone else, including
 * anyone whose country is unknown, only after they accept.
 */
export function pixelAllowed(): boolean {
  const choice = readChoice();
  if (choice === "accepted") return true;
  if (choice === "declined") return false;
  return readCountry() === "US";
}

/** Meta's base pixel snippet, written out. Safe to call more than once. */
export function loadPixel() {
  if (window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq ??= fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

/** A standard Meta event, sent only if the pixel is running. */
export function trackMeta(event: "Lead" | "Schedule") {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[meta] ${event}`, window.fbq ? "sent" : "skipped, pixel not loaded");
  }
  window.fbq?.("track", event);
}
