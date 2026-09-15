"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { SITE } from "../lib/site";

const ENDPOINT = "https://formspree.io/f/mljeqvqw";

/** the fields that must be filled before the form will send */
const REQUIRED: { name: string; label: string }[] = [
  { name: "business_name", label: "the business name" },
  { name: "business_phone", label: "the business phone number" },
  { name: "billing_name", label: "the billing contact name" },
  { name: "billing_email", label: "the billing email" },
];

type Errors = Record<string, string>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  for (const f of REQUIRED) {
    if (String(data.get(f.name) ?? "").trim().length === 0) {
      errors[f.name] = `Please add ${f.label}.`;
    }
  }
  const email = String(data.get("billing_email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.billing_email = "That email address does not look right.";
  }
  return errors;
}

export default function OnboardingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="surface flex flex-col items-center p-10 text-center md:p-14"
        style={{ borderRadius: "var(--radius-card)" }}
        role="status"
      >
        <span
          className="mb-7 grid h-14 w-14 place-items-center rounded-full"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <Check size={24} strokeWidth={2} />
        </span>
        <h2 className="font-display font-semibold" style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.1 }}>
          Thanks, we{"’"}ve received your details
        </h2>
        <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
          We will be in touch shortly. If you have a logo or photos to send, email them to{" "}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-4" style={{ color: "var(--ink)" }}>
            {SITE.email}
          </a>
          .
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <input type="hidden" name="_subject" value="New client onboarding" />

      {status === "failed" && (
        <div
          role="alert"
          className="flex items-start gap-3 p-5"
          style={{
            borderRadius: "var(--radius-tile)",
            background: "rgba(244, 244, 242, 0.06)",
            border: "1px solid var(--line-strong)",
          }}
        >
          <AlertCircle size={18} strokeWidth={1.7} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
            That did not send. Your answers are still here, so please try once more. If it keeps
            failing, email us at{" "}
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-4" style={{ color: "var(--ink)" }}>
              {SITE.email}
            </a>
            .
          </p>
        </div>
      )}

      <Card step={1} title="Business basics" intro="How the business is known and how to reach it.">
        <Grid>
          <Input label="Legal or trading business name" name="business_name" required error={errors.business_name} autoComplete="organization" placeholder="Cedar Grounds Co." />
          <Input label="Business phone number" name="business_phone" type="tel" required error={errors.business_phone} autoComplete="tel" placeholder="(512) 555 0148" />
          <Input label="Business address" name="business_address" autoComplete="street-address" placeholder="2130 Fern Street, Austin, TX 78704" className="sm:col-span-2" />
          <Input label="License or registration number" name="license_number" placeholder="TX LI 0027481" />
          <Input label="Website domain" name="domain" type="url" placeholder="https://cedargrounds.com" />
          <Textarea label="Business hours" name="business_hours" rows={3} placeholder="Mon to Fri 7am to 6pm, Sat 8am to 1pm, closed Sunday" className="sm:col-span-2" />
        </Grid>
      </Card>

      <Card step={2} title="Services and pricing rules" intro="What you do, what costs extra, and what should never be promised.">
        <Textarea label="Full list of services offered" name="services" rows={5} placeholder="Lawn maintenance, hardscaping, irrigation install and repair, seasonal clean-ups, landscape lighting" />
        <Textarea label="Services with special pricing rules" name="pricing_rules" rows={4} helper="Diagnostic fees, minimum charges, travel fees, anything a caller should be told up front." placeholder="Irrigation diagnostic is $95, waived if the repair goes ahead. $150 minimum on any call-out." />
        <Textarea label="Services NOT offered" name="services_not_offered" rows={3} helper="Anything the receptionist must never promise or quote for." placeholder="Tree removal over 20ft, pool construction, snow clearing" />
      </Card>

      <Card step={3} title="Service area" intro="Where you work, and where you do not.">
        <Textarea label="Towns, cities and ZIP codes covered" name="service_area" rows={4} placeholder="Austin, Round Rock, Cedar Park, Pflugerville. ZIPs 78701 to 78759, 78664, 78613" />
        <Textarea label="Areas explicitly not served" name="areas_not_served" rows={3} placeholder="Anything south of San Marcos, downtown parking-restricted blocks" />
      </Card>

      <Card step={4} title="Call handling preferences" intro="How the receptionist should sort, route and speak.">
        <Textarea label="How urgent calls should be identified" name="urgent_calls" rows={4} placeholder="Burst irrigation line, flooding, a tree down on a structure, anything the caller says is an emergency" />
        <Textarea label="Call types that should transfer to a human, and the number to transfer to" name="transfer_rules" rows={4} placeholder="Existing customers with a complaint, commercial contract enquiries, anything over $10k. Transfer to Marcus on (512) 555 0199." />
        <Textarea label="Preferred greeting, or phrasing to use and avoid" name="greeting" rows={4} placeholder={"Open with: Thanks for calling Cedar Grounds, how can I help? Say estimate, not quote. Never say cheap."} />
      </Card>

      <Card step={5} title="Calendar and booking" intro="Where bookings land and the rules around them.">
        <Grid>
          <Input label="Calendar system used" name="calendar_system" placeholder="Google Calendar, Jobber, Housecall Pro" />
          <Input label="Who needs booking visibility" name="booking_visibility" placeholder="Marcus (owner), Dana (office)" />
          <Textarea label="Booking rules" name="booking_rules" rows={4} helper="Minimum notice, buffers, days off, slot lengths." placeholder="24 hours minimum notice. Estimates are 45 minutes, no bookings before 8am or after 5pm, nothing on Sundays." className="sm:col-span-2" />
        </Grid>
      </Card>

      <Card step={6} title="Branding" intro="Colours, voice and assets.">
        <Grid>
          <Input label="Brand colours or hex codes" name="brand_colors" placeholder="#1F5233 green, #F4EFE6 cream" />
          <Input label="Tone preference" name="tone" placeholder="Warm and plain-spoken, not corporate" />
        </Grid>
        <Note>
          Logo and photos: email these separately to{" "}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-4" style={{ color: "var(--ink)" }}>
            {SITE.email}
          </a>
          . Full-size files please, straight from the camera or the designer.
        </Note>
      </Card>

      <Card step={7} title="Website details" intro="Access, hosting, and what carries over.">
        <Textarea label="Domain registrar and access details" name="registrar_access" rows={3} helper="Where the domain is held and who has the login. Do not paste passwords here; we will arrange access securely." placeholder="GoDaddy, account under marcus@cedargrounds.com" />
        <Input label="Current hosting provider" name="hosting" placeholder="Wix, Squarespace, GoDaddy hosting, none" />
        <Textarea label="Pages needed beyond the standard set" name="extra_pages" rows={3} helper="Standard: home, services, work, about, contact." placeholder="Commercial services, financing, careers" />
        <Textarea label="Content that must be reused" name="reuse_content" rows={3} placeholder="Our current about page copy, the reviews section, the FAQ" />
      </Card>

      <Card step={8} title="Billing" intro="Who the invoices go to.">
        <Grid>
          <Input label="Billing contact name" name="billing_name" required error={errors.billing_name} autoComplete="name" placeholder="Dana Whitfield" />
          <Input label="Billing contact email" name="billing_email" type="email" required error={errors.billing_email} autoComplete="email" placeholder="accounts@cedargrounds.com" />
          <Input label="Name on card for Stripe" name="card_name" autoComplete="cc-name" placeholder="Cedar Grounds Co. LLC" className="sm:col-span-2" />
        </Grid>
      </Card>

      <div className="flex flex-col items-start gap-4 pt-2">
        <button type="submit" disabled={sending} className="btn btn-primary w-full sm:w-auto">
          {sending && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
          {sending ? "Sending" : "Send onboarding details"}
        </button>
        <p className="text-[13px]" style={{ color: "var(--ink-45)" }}>
          Nothing here is shared outside PVA Media. Leave anything you are unsure of empty and we will cover it on the call.
        </p>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------------- */

const LABEL = "font-mono block text-[11px] uppercase tracking-[0.16em]";
const FIELD = "mt-2.5 w-full px-4 py-3.5 text-[15px] outline-none transition-colors";

function fieldStyle(error?: string) {
  return {
    borderRadius: "var(--radius-tile)",
    background: "rgba(244, 244, 242, 0.05)",
    border: `1px solid ${error ? "var(--accent)" : "var(--line-strong)"}`,
    color: "var(--ink)",
  } as const;
}

function Card({ step, title, intro, children }: { step: number; title: string; intro: string; children: ReactNode }) {
  return (
    <section
      className="surface p-6 md:p-9"
      style={{ borderRadius: "var(--radius-card)", background: "rgba(13, 13, 13, 0.85)" }}
      aria-labelledby={`step-${step}`}
    >
      <div className="mb-7 flex items-start gap-4">
        <span
          aria-hidden
          className="font-mono grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px]"
          style={{ border: "1px solid var(--line-strong)", color: "var(--ink-60)" }}
        >
          {String(step).padStart(2, "0")}
        </span>
        <div>
          <h2 id={`step-${step}`} className="font-display text-[22px] font-semibold leading-tight md:text-[24px]">
            {title}
          </h2>
          <p className="mt-1.5 text-[14.5px]" style={{ color: "var(--ink-60)" }}>
            {intro}
          </p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="p-4 text-[14px] leading-relaxed"
      style={{ borderRadius: "var(--radius-tile)", background: "rgba(244, 244, 242, 0.04)", color: "var(--ink-80)" }}
    >
      {children}
    </p>
  );
}

function Input({
  label, name, type = "text", required, error, helper, placeholder, autoComplete, className = "",
}: {
  label: string; name: string; type?: string; required?: boolean; error?: string; helper?: string;
  placeholder?: string; autoComplete?: string; className?: string;
}) {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div className={className}>
      <label htmlFor={name} className={LABEL} style={{ color: "var(--ink-60)" }}>
        {label}
        {!required && <span style={{ color: "var(--ink-30)" }}> (optional)</span>}
      </label>
      {helper && <p id={helperId} className="mt-1.5 text-[13px]" style={{ color: "var(--ink-45)" }}>{helper}</p>}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className={FIELD}
        style={fieldStyle(error)}
      />
      {error && <p id={errorId} className="mt-2 text-[13px]" style={{ color: "var(--accent)" }}>{error}</p>}
    </div>
  );
}

function Textarea({
  label, name, rows = 4, required, error, helper, placeholder, className = "",
}: {
  label: string; name: string; rows?: number; required?: boolean; error?: string; helper?: string;
  placeholder?: string; className?: string;
}) {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div className={className}>
      <label htmlFor={name} className={LABEL} style={{ color: "var(--ink-60)" }}>
        {label}
        {!required && <span style={{ color: "var(--ink-30)" }}> (optional)</span>}
      </label>
      {helper && <p id={helperId} className="mt-1.5 text-[13px]" style={{ color: "var(--ink-45)" }}>{helper}</p>}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className={`${FIELD} resize-y`}
        style={fieldStyle(error)}
      />
      {error && <p id={errorId} className="mt-2 text-[13px]" style={{ color: "var(--accent)" }}>{error}</p>}
    </div>
  );
}
