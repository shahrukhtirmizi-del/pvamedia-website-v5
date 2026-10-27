import { SITE } from "./site";

/**
 * Where a booking lead goes. Kept apart from the page so Formspree can be
 * swapped for GoHighLevel without touching the layout.
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export type Lead = {
  firstName: string;
  business: string;
  phone: string;
  email: string;
  utm: Utm;
  pageUrl: string;
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
 * Sends the lead in the background. It never throws and nothing waits on
 * it, so a slow or failing Formspree never holds up the booking.
 */
export function submitLead(lead: Lead): void {
  const body = new FormData();
  body.set("first_name", lead.firstName);
  body.set("business_name", lead.business);
  body.set("phone", lead.phone);
  // Formspree uses a field called "email" as the reply-to address
  body.set("email", lead.email);
  for (const key of UTM_KEYS) body.set(key, lead.utm[key] ?? "");
  body.set("page_url", lead.pageUrl);
  body.set("_subject", `New booking lead: ${lead.business}`);

  fetch(SITE.formEndpoint, {
    method: "POST",
    body,
    headers: { Accept: "application/json" },
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
    })
    .catch((err) => console.warn("Lead was not delivered to Formspree", err));
}
