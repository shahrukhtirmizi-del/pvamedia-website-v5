"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Check, History, KeyRound, Loader2, LogOut, Pencil, Settings2, Users } from "lucide-react";
import { logout, reloadContent, saveContent } from "./actions";
import TrainingView from "./TrainingView";
import { AccountPanel, HistoryPanel, SettingsPanel, TeamPanel } from "./panels";
import type { Content, Member, Viewer } from "./types";
import { Eyebrow } from "./ui";

type Tab = "training" | "settings" | "team" | "history" | "account";
type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; text: string; conflict: boolean };

const TABS: { id: Tab; label: string; icon: typeof BookOpen; admin: boolean }[] = [
  { id: "training", label: "Training", icon: BookOpen, admin: false },
  { id: "settings", label: "Settings", icon: Settings2, admin: true },
  { id: "team", label: "Team", icon: Users, admin: true },
  { id: "history", label: "History", icon: History, admin: true },
  { id: "account", label: "Account", icon: KeyRound, admin: false },
];

export default function Academy({
  viewer: initialViewer,
  content: initialContent,
  members: initialMembers,
}: {
  viewer: Viewer;
  content: Content;
  members: Member[] | null;
}) {
  const [viewer, setViewer] = useState(initialViewer);
  const [content, setContent] = useState(initialContent);
  const [members, setMembers] = useState(initialMembers ?? []);
  const [tab, setTab] = useState<Tab>("training");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const admin = viewer.role === "admin";

  useEffect(() => {
    if (status.kind !== "saved") return;
    const t = setTimeout(() => setStatus({ kind: "idle" }), 2200);
    return () => clearTimeout(t);
  }, [status]);

  const commit = useCallback(
    async (next: Content, note: string) => {
      setStatus({ kind: "saving" });
      const res = await saveContent(next, content.revision, note);
      if (res.ok) {
        setContent(res.data);
        setStatus({ kind: "saved" });
        return true;
      }
      setStatus({ kind: "error", text: res.error, conflict: res.error.startsWith("Someone else") });
      return false;
    },
    [content.revision],
  );

  const reload = async () => {
    const res = await reloadContent();
    if (res.ok) {
      setContent(res.data);
      setStatus({ kind: "idle" });
    }
  };

  const go = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-10 md:px-8 md:pt-14">
        {/* bar: who's here, tabs, log out */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>
            {content.page.eyebrow || "Setter Academy"} · Team only
          </Eyebrow>
          <form action={logout} className="flex items-center gap-3">
            <span className="text-[13.5px]" style={{ color: "var(--ink-60)" }}>
              Signed in as <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{viewer.name}</strong>
              {admin && " · Admin"}
            </span>
            <button type="submit" className="btn btn-secondary !px-4 !py-2.5 !text-[13px]">
              <LogOut size={14} strokeWidth={1.8} aria-hidden />
              Log out
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <nav aria-label="Academy sections" className="no-bar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
            {TABS.filter((t) => admin || !t.admin).map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(t.id)}
                  aria-current={active ? "page" : undefined}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors"
                  style={active ? { background: "var(--ink)", color: "var(--bg)" } : { border: "1px solid var(--line-strong)" }}
                >
                  <Icon size={15} strokeWidth={1.8} aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </nav>
          {admin && tab === "training" && (
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              aria-pressed={editing}
              className={`btn ${editing ? "btn-primary" : "btn-secondary"} !px-5 !py-2.5 !text-[14px] sm:ml-auto`}
            >
              {editing ? <Check size={15} strokeWidth={2} aria-hidden /> : <Pencil size={15} strokeWidth={1.8} aria-hidden />}
              {editing ? "Done editing" : "Edit training"}
            </button>
          )}
        </div>

        {viewer.starter && tab !== "account" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5" style={{ background: "var(--bg-raised)" }}>
            <p className="text-[14px]" style={{ color: "var(--ink-80)" }}>
              You’re still using the password you were given. Change it to one only you know.
            </p>
            <button type="button" onClick={() => go("account")} className="text-[14px] font-semibold underline underline-offset-4">
              Change password
            </button>
          </div>
        )}

        {editing && tab === "training" && (
          <div className="mt-6 rounded-[14px] px-5 py-3.5 text-[14px]" style={{ border: "1px dashed var(--line-strong)", color: "var(--ink-80)" }}>
            Editing is on. Every change saves straight away and goes live for the team. Made a mistake? Restore any earlier version from History.
          </div>
        )}

        {tab === "training" && <TrainingView content={content} editing={admin && editing} saving={status.kind === "saving"} onCommit={commit} />}
        {tab === "settings" && admin && <SettingsPanel key={content.revision} content={content} saving={status.kind === "saving"} onCommit={commit} />}
        {tab === "team" && admin && <TeamPanel viewer={viewer} members={members} setMembers={setMembers} />}
        {tab === "history" && admin && (
          <HistoryPanel
            content={content}
            onRestored={(c) => {
              setContent(c);
              setStatus({ kind: "saved" });
            }}
          />
        )}
        {tab === "account" && <AccountPanel viewer={viewer} onChanged={() => setViewer({ ...viewer, starter: false })} />}
      </div>

      {/* save status: bottom-left so it never covers the cookie banner or the content being edited */}
      {status.kind !== "idle" && (
        <div className="fixed bottom-5 left-5 z-[80] max-w-[min(440px,calc(100vw-40px))]" role="status" aria-live="polite">
          <div
            className="flex items-start gap-3 rounded-[14px] px-4 py-3 text-[14px] leading-snug"
            style={
              status.kind === "error"
                ? { background: "#FEF3F2", color: "#B42318", boxShadow: "var(--shadow-soft)" }
                : { background: "var(--ink)", color: "var(--bg)", boxShadow: "var(--shadow-soft)" }
            }
          >
            {status.kind === "saving" && <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin" aria-hidden />}
            {status.kind === "saved" && <Check size={16} className="mt-0.5 shrink-0" aria-hidden />}
            <div>
              {status.kind === "saving" && "Saving…"}
              {status.kind === "saved" && "Saved. It’s live for the team."}
              {status.kind === "error" && (
                <>
                  {status.text}
                  <div className="mt-2 flex gap-4">
                    {status.conflict && (
                      <button type="button" onClick={reload} className="font-semibold underline underline-offset-4">
                        Load the latest
                      </button>
                    )}
                    <button type="button" onClick={() => setStatus({ kind: "idle" })} className="underline underline-offset-4">
                      Dismiss
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
