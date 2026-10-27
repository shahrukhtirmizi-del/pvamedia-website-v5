"use client";

import { useState } from "react";
import type { FocusEvent, FormEvent, HTMLAttributes } from "react";
import { isPhone, type Lead } from "../lib/leads";

export type LeadDetails = Pick<Lead, "firstName" | "business" | "phone" | "email">;
type Key = keyof LeadDetails;
type Errors = Partial<Record<Key, string>>;

const FIELDS: {
  key: Key;
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}[] = [
  { key: "firstName", name: "first_name", label: "First name", type: "text", autoComplete: "given-name" },
  { key: "business", name: "business_name", label: "Business name", type: "text", autoComplete: "organization" },
  { key: "phone", name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { key: "email", name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
];

function check(key: Key, raw: string): string | undefined {
  const value = raw.trim();
  if (key === "firstName") return value ? undefined : "Please add your first name.";
  if (key === "business") return value ? undefined : "Please add your business name.";
  if (key === "phone") return isPhone(value) ? undefined : "Please add a 10-digit mobile number.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? undefined : "That email address does not look right.";
}

/** Step 1 of the booking flow: four fields, checked as you go. */
export default function BookingForm({ onDone }: { onDone: (details: LeadDetails) => void }) {
  const [errors, setErrors] = useState<Errors>({});

  function recheck(key: Key, value: string, onlyIfShown: boolean) {
    setErrors((prev) => (onlyIfShown && !prev[key] ? prev : { ...prev, [key]: check(key, value) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const details = Object.fromEntries(
      FIELDS.map((f) => [f.key, String(data.get(f.name) ?? "").trim()]),
    ) as LeadDetails;

    const found: Errors = {};
    for (const f of FIELDS) {
      const error = check(f.key, details[f.key]);
      if (error) found[f.key] = error;
    }
    setErrors(found);

    const first = FIELDS.find((f) => found[f.key]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    onDone(details);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-4">
        {FIELDS.map((f) => {
          const error = errors[f.key];
          const errorId = `${f.name}-error`;
          return (
            <div key={f.key}>
              <label
                htmlFor={f.name}
                className="font-mono block text-[12px] uppercase tracking-[0.14em]"
                style={{ color: "var(--ink-60)" }}
              >
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                required
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                  if (e.currentTarget.value.trim()) recheck(f.key, e.currentTarget.value, false);
                }}
                onInput={(e) => recheck(f.key, e.currentTarget.value, true)}
                // 16px stops iOS zooming in on focus
                className="mt-2 w-full px-4 py-3.5 text-[16px] outline-none transition-colors"
                style={{
                  borderRadius: "var(--radius-tile)",
                  background: "rgba(10, 10, 10, 0.05)",
                  border: `1px solid ${error ? "var(--accent)" : "var(--line-strong)"}`,
                  color: "var(--ink)",
                }}
              />
              {error && (
                <p id={errorId} className="mt-2 text-[14px]" style={{ color: "var(--accent)" }}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button type="submit" className="btn btn-primary mt-6 min-h-[56px] w-full !text-[16px]">
        Pick a time <span aria-hidden="true">→</span>
      </button>
      <p className="mt-4 text-center text-[13.5px]" style={{ color: "var(--ink-45)" }}>
        Takes 20 seconds. Next you{"’"}ll pick a time for your call.
      </p>
    </form>
  );
}
