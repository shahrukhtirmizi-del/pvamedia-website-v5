"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

/* Small building blocks shared by the academy screens, in the site's own
   language: ink on white, pills for actions, 14px tiles, 24px cards. */

export const INPUT =
  "w-full rounded-[14px] px-4 py-3 text-[15px] outline-none transition-colors focus:border-[color:var(--ink)]";
export const INPUT_STYLE = { background: "var(--bg)", border: "1px solid var(--line-strong)", color: "var(--ink)" } as const;

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${className}`} style={{ color: "var(--ink-45)" }}>
      {children}
    </p>
  );
}

export function FieldLabel({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="font-mono block text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-60)" }}>
        {children}
      </label>
      {hint && (
        <p className="mt-1 text-[12.5px] leading-snug" style={{ color: "var(--ink-45)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  list,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  list?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        list={list}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
        style={INPUT_STYLE}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 3,
  serif = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
  serif?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT} resize-y leading-relaxed ${serif ? "font-serif-display text-[16.5px]" : ""}`}
        style={INPUT_STYLE}
      />
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = {
    info: { background: "var(--bg-raised)", color: "var(--ink-80)" },
    success: { background: "var(--bg-raised)", color: "var(--ink)" },
    error: { background: "#FEF3F2", color: "#B42318" },
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className="rounded-[14px] px-4 py-3 text-[14px] leading-relaxed" style={styles}>
      {children}
    </div>
  );
}

/** A quiet text-style button for secondary actions inside cards. */
export function LinkButton({
  onClick,
  children,
  danger = false,
  disabled = false,
  title,
}: {
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[rgba(10,10,10,0.06)] disabled:pointer-events-none disabled:opacity-35"
      style={{ color: danger ? "#B42318" : "var(--ink-80)" }}
    >
      {children}
    </button>
  );
}

/** Asks for a second click before doing something that removes things. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Click again to confirm",
  disabled,
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmLabel?: string;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <LinkButton
      danger
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? confirmLabel : children}
    </LinkButton>
  );
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/London",
});
export const formatDate = (iso: string | null) => (iso ? fmt.format(new Date(iso)) : "Never");

export const toLines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
export const fromLines = (lines?: string[]) => (lines ?? []).join("\n");

export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
