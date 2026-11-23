"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginState } from "./actions";

const initial: LoginState = { error: null, username: "" };

export default function AcademyLogin() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <section className="relative">
      <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-[1240px] items-center justify-center px-5 py-16 md:px-8">
        <form action={action} className="surface w-full max-w-[440px] rounded-[24px] p-8 md:p-10">
          <div
            className="mb-8 grid h-12 w-12 place-items-center rounded-full"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
            aria-hidden
          >
            <Lock size={18} strokeWidth={1.8} />
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
            PVA Media &middot; Team only
          </p>
          <h1 className="font-display mt-4 font-semibold" style={{ fontSize: "clamp(32px, 5vw, 44px)", lineHeight: 1.05 }}>
            Setter Academy
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
            Scripts, objection handling and call standards, all in one place. Log in with your username and password.
          </p>

          <label
            htmlFor="academy-username"
            className="font-mono mt-8 block text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-60)" }}
          >
            Username
          </label>
          <input
            id="academy-username"
            name="username"
            type="text"
            required
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            defaultValue={state.username}
            className="mt-2.5 w-full rounded-[14px] px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[color:var(--ink)]"
            style={{ background: "var(--bg)", border: "1px solid var(--line-strong)", color: "var(--ink)" }}
          />

          <label
            htmlFor="academy-password"
            className="font-mono mt-5 block text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-60)" }}
          >
            Password
          </label>
          <input
            id="academy-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "academy-error" : undefined}
            className="mt-2.5 w-full rounded-[14px] px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[color:var(--ink)]"
            style={{ background: "var(--bg)", border: "1px solid var(--line-strong)", color: "var(--ink)" }}
          />

          <p id="academy-error" role="alert" className="mt-3 min-h-[20px] text-[13.5px]" style={{ color: "#B42318" }}>
            {state.error}
          </p>

          <button type="submit" disabled={pending} className="btn btn-primary mt-3 w-full disabled:opacity-70">
            {pending && <Loader2 size={16} strokeWidth={2} className="animate-spin" />}
            {pending ? "Checking" : "Open the academy"}
          </button>

          <p className="mt-6 text-[13px] leading-relaxed" style={{ color: "var(--ink-45)" }}>
            Lost your password? Ask your manager for a new one.
          </p>
        </form>
      </div>
    </section>
  );
}
