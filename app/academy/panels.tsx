"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, Plus, RotateCcw, Upload, X } from "lucide-react";
import { addMember, changePassword, getVersions, removeMember, resetPassword, restoreVersion, updateMember } from "./actions";
import type { Content, Member, Role, Version, Viewer } from "./types";
import { ConfirmButton, Eyebrow, LinkButton, Notice, TextArea, TextField, formatDate } from "./ui";

function PanelHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 mt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-display mt-4 font-semibold" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05 }}>
        {title}
      </h1>
      {intro && (
        <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
          {intro}
        </p>
      )}
    </div>
  );
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`surface rounded-[24px] p-6 md:p-8 ${className}`}>{children}</section>
);
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display mb-5 text-[22px] font-semibold leading-tight">{children}</h2>
);

/* ================================================================ settings */

export function SettingsPanel({
  content,
  saving,
  onCommit,
}: {
  content: Content;
  saving: boolean;
  onCommit: (next: Content, note: string) => Promise<boolean>;
}) {
  const [page, setPage] = useState(content.page);
  const [standard, setStandard] = useState(content.standard);
  const [flowTitle, setFlowTitle] = useState(content.flowTitle);
  const [flow, setFlow] = useState(content.flow);
  const [bookingLabel, setBookingLabel] = useState(content.bookingLabel);
  const [bookingLink, setBookingLink] = useState(content.bookingLink);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);


  const setStep = (i: number, patch: Partial<Content["flow"][number]>) =>
    setFlow((all) => all.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const moveStep = (i: number, dir: -1 | 1) =>
    setFlow((all) => {
      const next = [...all];
      const [s] = next.splice(i, 1);
      next.splice(i + dir, 0, s);
      return next;
    });

  const save = async () => {
    if (bookingLink && !/^https:\/\/\S+$/.test(bookingLink.trim())) {
      setMessage({ tone: "error", text: "The booking link has to start with https://" });
      return;
    }
    const ok = await onCommit(
      { ...content, page, standard, flowTitle, flow: flow.filter((f) => f.label.trim()), bookingLabel, bookingLink: bookingLink.trim() },
      "Edited the page settings",
    );
    if (ok) setMessage(null);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `setter-academy-revision-${content.revision}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed?.stages)) throw new Error("no stages");
      const ok = await onCommit({ ...parsed, revision: content.revision }, `Uploaded ${file.name}`);
      if (ok) setMessage(null);
    } catch {
      setMessage({ tone: "error", text: "That file isn’t a Setter Academy copy. Use a file downloaded from this page." });
    }
  };

  return (
    <>
      <PanelHeading eyebrow="Admin · Settings" title="Page settings" intro="Everything at the top of the training page. Stages and topics are edited on the Training tab." />
      <div className="space-y-4">
        <Card>
          <CardTitle>Heading</CardTitle>
          <div className="grid gap-4">
            <TextField label="Small label above the heading" value={page.eyebrow} onChange={(v) => setPage({ ...page, eyebrow: v })} />
            <TextField label="Heading" value={page.title} onChange={(v) => setPage({ ...page, title: v })} />
            <TextArea label="Intro" value={page.intro} onChange={(v) => setPage({ ...page, intro: v })} rows={3} />
            <TextField label="Footer line" value={page.footer} onChange={(v) => setPage({ ...page, footer: v })} />
          </div>
        </Card>

        <Card>
          <CardTitle>Daily standard</CardTitle>
          <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
            <TextField label="Number" value={standard.value} onChange={(v) => setStandard({ ...standard, value: v })} />
            <TextArea label="Text" value={standard.text} onChange={(v) => setStandard({ ...standard, text: v })} rows={2} />
          </div>
        </Card>

        <Card>
          <CardTitle>Call at a glance</CardTitle>
          <TextField label="Box title" value={flowTitle} onChange={setFlowTitle} className="mb-5" />
          <div className="space-y-3">
            {flow.map((f, i) => (
              <div key={i} className="rounded-[14px] p-4" style={{ background: "var(--bg-raised)" }}>
                <div className="grid gap-3 sm:grid-cols-[100px_160px_minmax(0,1fr)]">
                  <TextField label="Time" value={f.time} onChange={(v) => setStep(i, { time: v })} />
                  <TextField label="Step" value={f.label} onChange={(v) => setStep(i, { label: v })} />
                  <TextField label="Detail" value={f.detail} onChange={(v) => setStep(i, { detail: v })} />
                </div>
                <div className="mt-2 flex gap-1">
                  <LinkButton onClick={() => moveStep(i, -1)} disabled={i === 0}>
                    <ArrowUp size={13} strokeWidth={1.8} aria-hidden /> Up
                  </LinkButton>
                  <LinkButton onClick={() => moveStep(i, 1)} disabled={i === flow.length - 1}>
                    <ArrowDown size={13} strokeWidth={1.8} aria-hidden /> Down
                  </LinkButton>
                  <LinkButton danger onClick={() => setFlow((all) => all.filter((_, j) => j !== i))}>
                    <X size={13} strokeWidth={1.8} aria-hidden /> Remove
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
          {flow.length < 8 && (
            <button
              type="button"
              onClick={() => setFlow((all) => [...all, { time: "", label: "", detail: "" }])}
              className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium underline underline-offset-4"
            >
              <Plus size={14} strokeWidth={2} aria-hidden /> Add a step
            </button>
          )}
        </Card>

        <Card>
          <CardTitle>Booking link</CardTitle>
          <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
            <TextField label="Link text" value={bookingLabel} onChange={setBookingLabel} />
            <TextField label="Link" value={bookingLink} onChange={setBookingLink} placeholder="https://calendly.com/..." />
          </div>
        </Card>

        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        <button type="button" onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving" : "Save settings"}
        </button>

        <Card className="mt-10">
          <CardTitle>Backup</CardTitle>
          <p className="mb-5 max-w-[60ch] text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
            Download a copy of the whole academy (settings, stages and every topic). Uploading a copy replaces the current training with it; the
            version it replaces stays in History.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={download} className="btn btn-secondary">
              <Download size={16} strokeWidth={1.8} aria-hidden /> Download a copy
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={saving} className="btn btn-secondary">
              <Upload size={16} strokeWidth={1.8} aria-hidden /> Upload a copy
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

/* ==================================================================== team */

type Draft = { name: string; username: string; role: Role };
const usernameFrom = (name: string) => name.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, "") ?? "";

function RoleSelect({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <div>
      <p className="font-mono mb-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-60)" }}>
        Role
      </p>
      <div className="flex gap-2">
        {(["setter", "admin"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            aria-pressed={value === r}
            className="rounded-full px-4 py-2.5 text-[14px] font-medium capitalize"
            style={
              value === r
                ? { background: "var(--ink)", color: "var(--bg)", border: "1px solid var(--ink)" }
                : { border: "1px solid var(--line-strong)" }
            }
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TeamPanel({ viewer, members, setMembers }: { viewer: Viewer; members: Member[]; setMembers: (m: Member[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [adding, setAdding] = useState<Draft & { password: string }>({ name: "", username: "", role: "setter", password: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>({ name: "", username: "", role: "setter" });
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetTo, setResetTo] = useState("");

  const run = async <T,>(fn: () => Promise<{ ok: true; data: T } | { ok: false; error: string }>, done: (data: T) => string) => {
    setBusy(true);
    setMessage(null);
    const res = await fn();
    setBusy(false);
    if (res.ok) setMessage({ tone: "success", text: done(res.data) });
    else setMessage({ tone: "error", text: res.error });
    return res.ok;
  };

  const suggested = adding.name ? `${adding.name.trim().split(/\s+/)[0].replace(/^./, (c) => c.toUpperCase())}123` : "";

  return (
    <>
      <PanelHeading
        eyebrow="Admin · Team"
        title="Team"
        intro="Add people, change roles and reset passwords. Admins can change everything in the academy; setters can read it and change their own password."
      />

      {message && (
        <div className="mb-4">
          <Notice tone={message.tone}>{message.text}</Notice>
        </div>
      )}

      <ul className="space-y-2.5">
        {members.map((m) => (
          <li key={m.id} className="rounded-[14px] p-5 md:px-7" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            {editing === m.id ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
                  <TextField label="Username" value={edit.username} onChange={(v) => setEdit({ ...edit, username: v })} />
                </div>
                <RoleSelect value={edit.role} onChange={(r) => setEdit({ ...edit, role: r })} />
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={busy}
                    className="btn btn-primary !px-6 !py-3"
                    onClick={() =>
                      run(
                        () => updateMember(m.id, edit),
                        (data) => {
                          setMembers(data);
                          setEditing(null);
                          return `Saved ${edit.name}.`;
                        },
                      )
                    }
                  >
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary !px-6 !py-3" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="font-display text-[19px] font-semibold">{m.name}</p>
                  <span className="font-mono rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.14em]" style={m.role === "admin" ? { background: "var(--ink)", color: "var(--bg)" } : { border: "1px solid var(--line)", color: "var(--ink-60)" }}>
                    {m.role}
                  </span>
                  {m.id === viewer.id && (
                    <span className="text-[13px]" style={{ color: "var(--ink-45)" }}>
                      You
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[14px]" style={{ color: "var(--ink-60)" }}>
                  Username <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{m.username}</strong> · Last login {formatDate(m.lastLoginAt)} ·{" "}
                  {m.starter ? "Still on the password they were given" : "Has set their own password"}
                </p>

                {resetFor === m.id ? (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <TextField
                      label="New password"
                      value={resetTo}
                      onChange={setResetTo}
                      placeholder={`Leave blank for ${m.name.split(/\s+/)[0]}123`}
                      className="min-w-[240px] flex-1"
                    />
                    <button
                      type="button"
                      disabled={busy}
                      className="btn btn-primary !px-6 !py-3"
                      onClick={() =>
                        run(
                          () => resetPassword(m.id, resetTo),
                          (data) => {
                            setMembers(data.members);
                            setResetFor(null);
                            setResetTo("");
                            return `${m.name}’s password is now ${data.password}. They’ve been logged out everywhere; send them the new password.`;
                          },
                        )
                      }
                    >
                      Reset
                    </button>
                    <button type="button" className="btn btn-secondary !px-6 !py-3" onClick={() => setResetFor(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="-ml-3 mt-3 flex flex-wrap gap-1">
                    <LinkButton
                      disabled={busy}
                      onClick={() => {
                        setEditing(m.id);
                        setEdit({ name: m.name, username: m.username, role: m.role });
                      }}
                    >
                      Edit
                    </LinkButton>
                    <LinkButton disabled={busy} onClick={() => setResetFor(m.id)}>
                      <RotateCcw size={13} strokeWidth={1.8} aria-hidden /> Reset password
                    </LinkButton>
                    {m.id !== viewer.id && (
                      <ConfirmButton
                        disabled={busy}
                        confirmLabel={`Remove ${m.name}?`}
                        onConfirm={() =>
                          run(
                            () => removeMember(m.id),
                            (data) => {
                              setMembers(data);
                              return `${m.name} has been removed and can no longer log in.`;
                            },
                          )
                        }
                      >
                        Remove
                      </ConfirmButton>
                    )}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <Card className="mt-8">
        <CardTitle>Add someone</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            value={adding.name}
            onChange={(v) =>
              setAdding((a) => ({ ...a, name: v, username: a.username && a.username !== usernameFrom(a.name) ? a.username : usernameFrom(v) }))
            }
          />
          <TextField label="Username" value={adding.username} onChange={(v) => setAdding({ ...adding, username: v })} hint="What they type to log in" />
          <TextField
            label="Starting password"
            value={adding.password}
            onChange={(v) => setAdding({ ...adding, password: v })}
            placeholder={suggested ? `Leave blank for ${suggested}` : "Leave blank for Name123"}
          />
          <RoleSelect value={adding.role} onChange={(r) => setAdding({ ...adding, role: r })} />
        </div>
        <button
          type="button"
          disabled={busy}
          className="btn btn-primary mt-6"
          onClick={() =>
            run(
              () => addMember({ name: adding.name, username: adding.username, role: adding.role }, adding.password),
              (data) => {
                setMembers(data.members);
                const name = adding.name;
                const username = adding.username.trim().toLowerCase();
                setAdding({ name: "", username: "", role: "setter", password: "" });
                return `${name} is in. Username ${username}, password ${data.password}. They can change it under Account.`;
              },
            )
          }
        >
          <Plus size={16} strokeWidth={2} aria-hidden /> Add to the team
        </button>
      </Card>
    </>
  );
}

/* ================================================================= history */

export function HistoryPanel({
  content,
  onRestored,
}: {
  content: Content;
  onRestored: (c: Content) => void;
}) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getVersions().then((res) => {
      if (!live) return;
      if (res.ok) setVersions(res.data);
      else setError(res.error);
    });
    return () => {
      live = false;
    };
  }, [content.revision]);

  const restore = async (v: Version) => {
    setBusy(true);
    setError(null);
    setDone(null);
    const res = await restoreVersion(v.id, content.revision);
    setBusy(false);
    if (res.ok) {
      onRestored(res.data);
      setDone(`Restored revision ${v.revision}. The version you replaced is still here if you need it back.`);
    } else setError(res.error);
  };

  return (
    <>
      <PanelHeading
        eyebrow="Admin · History"
        title="History"
        intro="Every save is kept, newest first. Restoring a version makes it the live training again; nothing is lost, because the version you replace is saved too."
      />
      <p className="mb-5 text-[14px]" style={{ color: "var(--ink-60)" }}>
        Live now: revision {content.revision}
        {content.updatedBy ? `, saved by ${content.updatedBy} on ${formatDate(content.updatedAt)}` : " (the original training)"}.
      </p>
      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {done && (
        <div className="mb-4">
          <Notice tone="success">{done}</Notice>
        </div>
      )}
      {versions === null && !error ? (
        <p className="text-[15px]" style={{ color: "var(--ink-45)" }}>
          Loading…
        </p>
      ) : versions && versions.length === 0 ? (
        <Notice>No changes yet. Once someone edits the training, every version shows up here.</Notice>
      ) : (
        <ul className="space-y-2">
          {versions?.map((v) => {
            const live = v.revision === content.revision;
            return (
              <li key={v.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[14px] px-5 py-4" style={{ border: "1px solid var(--line)" }}>
                <span className="font-mono w-14 text-[12px]" style={{ color: "var(--ink-45)" }}>
                  #{v.revision}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{v.note}</span>
                  <span className="block text-[13px]" style={{ color: "var(--ink-60)" }}>
                    {v.savedBy} · {formatDate(v.savedAt)}
                  </span>
                </span>
                {live ? (
                  <span className="font-mono rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.14em]" style={{ background: "var(--ink)", color: "var(--bg)" }}>
                    Live
                  </span>
                ) : (
                  <ConfirmButton disabled={busy} confirmLabel={`Restore #${v.revision}?`} onConfirm={() => restore(v)}>
                    Restore
                  </ConfirmButton>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ================================================================= account */

export function AccountPanel({ viewer, onChanged }: { viewer: Viewer; onChanged: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (next !== confirm) {
      setMessage({ tone: "error", text: "The new passwords don’t match." });
      return;
    }
    setBusy(true);
    const res = await changePassword(current, next);
    setBusy(false);
    if (res.ok) {
      setCurrent("");
      setNext("");
      setConfirm("");
      setMessage({ tone: "success", text: "Password changed. Any other device you were logged in on has been logged out." });
      onChanged();
    } else setMessage({ tone: "error", text: res.error });
  };

  return (
    <>
      <PanelHeading eyebrow="Account" title={`Hi ${viewer.name}`} />
      <Card className="max-w-[640px]">
        <p className="text-[15px]" style={{ color: "var(--ink-60)" }}>
          You log in as <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{viewer.username}</strong>
          {viewer.role === "admin" ? ", with admin access." : "."}
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <h2 className="font-display text-[22px] font-semibold">Change your password</h2>
          {viewer.starter && (
            <Notice>You’re still using the password you were given. Pick one only you know: at least 8 characters.</Notice>
          )}
          <TextField label="Current password" type="password" value={current} onChange={setCurrent} autoComplete="current-password" />
          <TextField label="New password" type="password" value={next} onChange={setNext} autoComplete="new-password" hint="At least 8 characters" />
          <TextField label="New password again" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          {message && <Notice tone={message.tone}>{message.text}</Notice>}
          <button type="submit" disabled={busy || !current || !next} className="btn btn-primary disabled:opacity-60">
            {busy ? "Saving" : "Change password"}
          </button>
        </form>
      </Card>
    </>
  );
}
