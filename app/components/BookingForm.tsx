"use client";

import { useState } from "react";
import type { FocusEvent, FormEvent, HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { isPhone, type Lead } from "../lib/leads";

type Key = keyof Lead;
type Errors = Partial<Record<Key, string>>;

/** Each name doubles as the id and the key Formspree receives. */
const FIELDS: {
  name: Key;
  label: string;
  type: string;
  autoComplete: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}[] = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "company", label: "Business name", type: "text", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", inputMode: "tel" },
];

function check(key: Key, raw: string): string | undefined {
  const value = raw.trim();
  if (key === "name") return value ? undefined : "Please add your name.";
  if (key === "company") return value ? undefined : "Please add your business name.";
  if (key === "phone") return isPhone(value) ? undefined : "Please add a 10-digit phone number.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? undefined : "That email address does not look right.";
}

/** The booking form: four fields, checked as you go. */
export default function BookingForm({ onDone }: { onDone: (details: Lead) => Promise<void> }) {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  function recheck(key: Key, value: string, onlyIfShown: boolean) {
    setErrors((prev) => (onlyIfShown && !prev[key] ? prev : { ...prev, [key]: check(key, value) }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const details = Object.fromEntries(
      FIELDS.map((f) => [f.name, String(data.get(f.name) ?? "").trim()]),
    ) as Lead;

    const found: Errors = {};
    for (const f of FIELDS) {
      const error = check(f.name, details[f.name]);
      if (error) found[f.name] = error;
    }
    setErrors(found);

    const first = FIELDS.find((f) => found[f.name]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }

    setSending(true);
    await onDone(details);
    setSending(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-4">
        {FIELDS.map((f) => {
          const error = errors[f.name];
          const errorId = `${f.name}-error`;
          return (
            <div key={f.name}>
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
                  if (e.currentTarget.value.trim()) recheck(f.name, e.currentTarget.value, false);
                }}
                onInput={(e) => recheck(f.name, e.currentTarget.value, true)}
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

      <button
        type="submit"
        disabled={sending}
        className="btn btn-primary mt-6 min-h-[56px] w-full !text-[16px]"
      >
        {sending && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
        {sending ? "Sending" : "Book my free call"}
      </button>
      <p className="mt-4 text-center text-[13.5px]" style={{ color: "var(--ink-45)" }}>
        Takes 30 seconds. No obligation.
      </p>
    </form>
  );
}
