import { SITE } from "./site";

/**
 * Where a booking lead goes. Kept apart from the page so Formspree can be
 * swapped for GoHighLevel without touching the layout.
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Keys match the form's field names, which Formspree receives as-is. */
export type Lead = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

export function readUtm(search: string): Utm {
  const query = new URLSearchParams(search);
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = query.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

/** True for any formatting of a 10-digit number, with or without a leading +1. */
export function isPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

/**
 * Sends the lead and reports whether Formspree accepted it. Never throws,
 * and gives up after a few seconds so a slow Formspree cannot hold up booking.
 */
export async function submitLead(lead: Lead): Promise<boolean> {
  const body = new FormData();
  body.set("name", lead.name);
  body.set("company", lead.company);
  // Formspree uses a field called "email" as the reply-to address
  body.set("email", lead.email);
  body.set("phone", lead.phone);

  try {
    const res = await fetch(SITE.formEndpoint, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    return true;
  } catch (err) {
    console.warn("Lead was not delivered to Formspree", err);
    return false;
  }
}
