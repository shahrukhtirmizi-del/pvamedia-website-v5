"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { SITE } from "../lib/site";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const NEEDS = [
  "A new website",
  "Local SEO",
  "Paid ads and landing pages",
  "AI Receptionist",
  "The full package",
  "Not sure yet",
];

function validate(data: FormData): Errors {
  const errors: Errors = {};

  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "That email address does not look right.";
  if (phone.replace(/[^\d]/g, "").length < 7)
    errors.phone = "Please add a phone number we can reach you on.";
  if (message.length > 0 && message.length < 10)
    errors.message = "A little more detail would help, or leave this empty.";

  return errors;
}

export default function BookingForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // send focus to the first field that needs fixing
      const firstKey = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      router.push("/thank-you");
    } catch {
      setStatus("failed");
    }
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-12">
      {status === "failed" && (
        <div
          role="alert"
          className="mb-8 flex items-start gap-3 p-5"
          style={{
            borderRadius: "var(--radius-tile)",
            background: "rgba(244, 244, 242,0.06)",
            border: "1px solid var(--line-strong)",
          }}
        >
          <AlertCircle size={18} strokeWidth={1.7} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
            That did not send. Please try once more, or email us directly at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="underline underline-offset-4"
              style={{ color: "var(--ink)" }}
            >
              {SITE.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name} required autoComplete="name" />
        <Field label="Company name" name="company" autoComplete="organization" />
        <Field
          label="Email"
          name="email"
          type="email"
          error={errors.email}
          required
          autoComplete="email"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          error={errors.phone}
          required
          autoComplete="tel"
        />
        <Field
          label="Current website"
          name="website"
          helper="Leave empty if you do not have one yet."
          autoComplete="url"
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <label htmlFor="need" className="font-mono block text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-60)" }}>
            What you need
          </label>
          <select
            id="need"
            name="need"
            defaultValue={NEEDS[0]}
            className="mt-2.5 w-full px-4 py-3.5 text-[15px] outline-none transition-colors"
            style={{
              borderRadius: "var(--radius-tile)",
              background: "rgba(244, 244, 242,0.05)",
              border: "1px solid var(--line-strong)",
              color: "var(--ink)",
            }}
          >
            {NEEDS.map((option) => (
              <option key={option} value={option} style={{ background: "#121212", color: "#f4f4f2" }}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="font-mono block text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-60)" }}
          >
            Anything else
          </label>
          <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-45)" }}>
            Optional. What is not working right now is the most useful thing to know.
          </p>
          <textarea
            id="message"
            name="message"
            rows={4}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="mt-2.5 w-full resize-y px-4 py-3.5 text-[15px] outline-none transition-colors"
            style={{
              borderRadius: "var(--radius-tile)",
              background: "rgba(244, 244, 242,0.05)",
              border: `1px solid ${errors.message ? "var(--accent)" : "var(--line-strong)"}`,
              color: "var(--ink)",
            }}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-[13px]" style={{ color: "var(--accent)" }}>
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={sending} className="btn btn-primary mt-10 w-full sm:w-auto">
        {sending && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
        {sending ? "Sending" : "Book a free call"}
      </button>

      <p className="mt-5 text-[13px]" style={{ color: "var(--ink-45)" }}>
        We reply the same working day. No sales sequence, no automated chasing.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  helper,
  required,
  autoComplete,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="font-mono block text-[11px] uppercase tracking-[0.16em]"
        style={{ color: "var(--ink-60)" }}
      >
        {label}
        {!required && (
          <span style={{ color: "var(--ink-30)" }}> (optional)</span>
        )}
      </label>

      {helper && (
        <p id={helperId} className="mt-1.5 text-[13px]" style={{ color: "var(--ink-45)" }}>
          {helper}
        </p>
      )}

      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helper ? helperId : undefined}
        className="mt-2.5 w-full px-4 py-3.5 text-[15px] outline-none transition-colors"
        style={{
          borderRadius: "var(--radius-tile)",
          background: "rgba(244, 244, 242,0.05)",
          border: `1px solid ${error ? "var(--accent)" : "var(--line-strong)"}`,
          color: "var(--ink)",
        }}
      />

      {error && (
        <p id={errorId} className="mt-2 text-[13px]" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
