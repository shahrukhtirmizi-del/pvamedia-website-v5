"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Settings2 } from "lucide-react";
import { getScoreboard, getScoreSetup, saveScoreSettings, type ScoreSetup } from "./actions";
import type { Member, ScoreRow, Scoreboard, ScoreSettings, Viewer } from "./types";
import { Eyebrow, Notice, TextField, formatDate } from "./ui";

const POLL_MS = 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dayLabel = (d: string) => {
  const date = new Date(`${d}T12:00:00Z`);
  return { short: WEEKDAYS[date.getUTCDay()], num: date.getUTCDate() };
};
const weekTitle = (sb: Scoreboard) => {
  if (sb.weekOffset === 0) return "This week";
  if (sb.weekOffset === 1) return "Last week";
  const d = new Date(`${sb.weekStart}T12:00:00Z`);
  return `Week of ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`;
};
const talkTime = (sec: number) => {
  const mins = Math.round(sec / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "–");
const timeOnly = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[14px] p-5" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-45)" }}>
        {label}
      </p>
      <p className="font-display mt-2 text-[34px] font-semibold leading-none">{value}</p>
      {sub && (
        <p className="mt-2 text-[13px]" style={{ color: "var(--ink-60)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Bookings against the weekly target, with a tick where they should be by today. */
function Progress({ value, target, soFar }: { value: number; target: number; soFar: number }) {
  const max = Math.max(target, value, 1);
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-raised)" }} aria-hidden>
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(value / max) * 100}%`, background: "var(--ink)" }} />
      {soFar > 0 && soFar < max && (
        <div className="absolute top-0 h-full w-[2px]" style={{ left: `${(soFar / max) * 100}%`, background: "var(--ink-45)" }} />
      )}
    </div>
  );
}

function LeaderRow({ row, rank, sb, me }: { row: ScoreRow; rank: number; sb: Scoreboard; me: boolean }) {
  const behind = Math.round(sb.targetSoFar - row.bookings);
  const onPace = sb.targetSoFar > 0 ? behind <= 0 : null;
  return (
    <li className="rounded-[14px] p-5 md:px-7" style={{ background: "var(--bg)", border: `1px solid ${me ? "var(--line-strong)" : "var(--line)"}` }}>
      <div className="flex items-center gap-4 md:gap-6">
        <span className="font-mono w-7 shrink-0 text-[13px]" style={{ color: "var(--ink-45)" }}>
          {String(rank).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[20px] font-semibold leading-tight">
            {row.name}
            {me && (
              <span className="ml-2 align-middle text-[12.5px] font-normal" style={{ color: "var(--ink-45)" }}>
                You
              </span>
            )}
          </p>
          <p className="mt-1 text-[13.5px]" style={{ color: "var(--ink-60)" }}>
            {row.conversations} conversations · {row.dials} dials · {talkTime(row.talk)} talking
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-[34px] font-semibold leading-none">{row.bookings}</p>
          <p className="mt-1 text-[12px]" style={{ color: "var(--ink-45)" }}>
            of {sb.weeklyTarget} booked
          </p>
        </div>
      </div>
      <div className="mt-4 md:pl-[52px]">
        <Progress value={row.bookings} target={sb.weeklyTarget} soFar={sb.targetSoFar} />
        <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[12.5px]" style={{ color: "var(--ink-60)" }}>
          <span>
            Connect rate {pct(row.conversations, row.dials)} · Booking rate {pct(row.bookings, row.conversations)}
          </span>
          {onPace !== null && sb.weekOffset === 0 && (
            <span style={{ color: onPace ? "var(--ink)" : "var(--ink-60)", fontWeight: onPace ? 600 : 400 }}>
              {onPace ? "On pace" : `${behind} behind pace`}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function DailyGrid({ sb, rows }: { sb: Scoreboard; rows: ScoreRow[] }) {
  return (
    <div className="no-bar overflow-x-auto rounded-[14px]" style={{ border: "1px solid var(--line)" }}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            <th className="font-mono px-4 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--ink-45)" }}>
              Setter
            </th>
            {sb.days.map((d) => {
              const l = dayLabel(d);
              const today = d === sb.today;
              return (
                <th
                  key={d}
                  className="px-3 py-3 text-center text-[12.5px] font-medium"
                  style={{ color: today ? "var(--ink)" : "var(--ink-60)", background: today ? "var(--bg-raised)" : undefined }}
                >
                  {l.short} {l.num}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.memberId} style={{ borderTop: "1px solid var(--line)" }}>
              <td className="px-4 py-3 text-[14.5px] font-medium">{r.name}</td>
              {r.days.map((d) => {
                const today = d.date === sb.today;
                const future = sb.today ? d.date > sb.today : false;
                return (
                  <td key={d.date} className="px-3 py-3 text-center" style={{ background: today ? "var(--bg-raised)" : undefined }}>
                    {future ? (
                      <span style={{ color: "var(--ink-30)" }}>·</span>
                    ) : (
                      <>
                        <span className="font-display block text-[18px] font-semibold leading-none" style={{ color: d.bookings ? "var(--ink)" : "var(--ink-30)" }}>
                          {d.bookings}
                        </span>
                        <span className="mt-1 block text-[11.5px]" style={{ color: "var(--ink-45)" }}>
                          {d.dials} dials
                        </span>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================ settings */

function SetupPanel({ members, onSaved }: { members: Member[]; onSaved: () => void }) {
  const [setup, setSetup] = useState<ScoreSetup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ScoreSettings | null>(null);
  const [words, setWords] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let live = true;
    getScoreSetup().then((res) => {
      if (!live) return;
      if (!res.ok) return setError(res.error);
      setSetup(res.data);
      setForm(res.data.settings);
      setWords(res.data.settings.bookingWords.join(", "));
    });
    return () => {
      live = false;
    };
  }, []);

  if (error) return <Notice tone="error">{error}</Notice>;
  if (!setup || !form)
    return (
      <p className="text-[14px]" style={{ color: "var(--ink-45)" }}>
        Checking the JustCall connection…
      </p>
    );

  const toggleDay = (d: number) =>
    setForm({ ...form, workingDays: form.workingDays.includes(d) ? form.workingDays.filter((x) => x !== d) : [...form.workingDays, d] });
  const toggleLink = (memberId: string, agentId: string) => {
    const cur = form.links[memberId] ?? [];
    const next = cur.includes(agentId) ? cur.filter((x) => x !== agentId) : [...cur, agentId];
    setForm({ ...form, links: { ...form.links, [memberId]: next } });
  };

  const save = async () => {
    setBusy(true);
    setDone(false);
    setError(null);
    const res = await saveScoreSettings({ ...form, bookingWords: words.split(",").map((w) => w.trim()).filter(Boolean) });
    setBusy(false);
    if (res.ok) {
      setForm(res.data);
      setDone(true);
      onSaved();
    } else setError(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-[18px] font-semibold">JustCall connection</p>
        <div className="mt-2">
          {setup.agentsError ? (
            <Notice tone="error">{setup.agentsError}</Notice>
          ) : (
            <Notice tone="success">
              Connected. JustCall has {setup.agents.length} {setup.agents.length === 1 ? "user" : "users"}:{" "}
              {setup.agents.map((a) => a.name || a.email).join(", ") || "none found"}.
            </Notice>
          )}
        </div>
      </div>

      <div>
        <p className="font-display text-[18px] font-semibold">Who’s who in JustCall</p>
        <p className="mt-1 text-[13.5px]" style={{ color: "var(--ink-60)" }}>
          Pick the JustCall user each person dials from. If you leave someone blank, they’re matched by first name.
        </p>
        <div className="mt-3 space-y-2">
          {members.map((m) => (
            <div key={m.id} className="rounded-[14px] p-4" style={{ border: "1px solid var(--line)" }}>
              <p className="text-[14.5px] font-medium">
                {m.name}{" "}
                <span className="text-[12.5px] font-normal capitalize" style={{ color: "var(--ink-45)" }}>
                  {m.role}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {setup.agents.length === 0 && (
                  <span className="text-[13px]" style={{ color: "var(--ink-45)" }}>
                    No JustCall users to pick from yet.
                  </span>
                )}
                {setup.agents.map((a) => {
                  const on = (form.links[m.id] ?? []).includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleLink(m.id, a.id)}
                      className="rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                      style={on ? { background: "var(--ink)", color: "var(--bg)" } : { border: "1px solid var(--line-strong)" }}
                    >
                      {a.name || a.email}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Bookings per week, per setter"
          type="number"
          value={String(form.targetPerWeek)}
          onChange={(v) => setForm({ ...form, targetPerWeek: Number(v) })}
        />
        <TextField
          label="A conversation is a call of at least (seconds)"
          type="number"
          value={String(form.conversationSeconds)}
          onChange={(v) => setForm({ ...form, conversationSeconds: Number(v) })}
        />
      </div>

      <TextField
        label="A call counts as booked when its JustCall result contains"
        value={words}
        onChange={setWords}
        hint="Comma separated, not case-sensitive. “booked” catches “Meeting booked”."
      />

      <div>
        <p className="font-mono mb-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-60)" }}>
          Working days
        </p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const on = form.workingDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                onClick={() => toggleDay(d)}
                className="rounded-full px-4 py-2 text-[13.5px] font-medium"
                style={on ? { background: "var(--ink)", color: "var(--bg)" } : { border: "1px solid var(--line-strong)" }}
              >
                {WEEKDAYS[d]}
              </button>
            );
          })}
        </div>
      </div>

      {done && <Notice tone="success">Saved. The scoreboard has been recalculated.</Notice>}
      <button type="button" onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
        {busy ? "Saving" : "Save scoreboard settings"}
      </button>
    </div>
  );
}

/* =================================================================== panel */

export default function ScoreboardPanel({ viewer, members }: { viewer: Viewer; members: Member[] }) {
  const [offset, setOffset] = useState(0);
  const [sb, setSb] = useState<Scoreboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const admin = viewer.role === "admin";

  const apply = useCallback((res: Awaited<ReturnType<typeof getScoreboard>>) => {
    setLoading(false);
    if (res.ok) {
      setSb(res.data);
      setError(null);
    } else setError(res.error);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    void getScoreboard(offset).then(apply);
  }, [offset, apply]);

  useEffect(() => {
    let live = true;
    const run = () => getScoreboard(offset).then((res) => live && apply(res));
    void run();
    // the current week keeps itself up to date while the tab is open
    const t =
      offset === 0
        ? setInterval(() => {
            if (document.visibilityState === "visible") void run();
          }, POLL_MS)
        : undefined;
    return () => {
      live = false;
      if (t) clearInterval(t);
    };
  }, [offset, apply]);

  const changeWeek = (next: number) => {
    if (next === offset) return;
    setLoading(true);
    setOffset(next);
  };

  const setters = sb?.setters ?? [];
  const totals = setters.reduce(
    (t, r) => ({ dials: t.dials + r.dials, conversations: t.conversations + r.conversations, talk: t.talk + r.talk, bookings: t.bookings + r.bookings }),
    { dials: 0, conversations: 0, talk: 0, bookings: 0 },
  );

  return (
    <>
      <div className="mb-8 mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Scoreboard</Eyebrow>
          <h1 className="font-display mt-4 font-semibold" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05 }}>
            {sb ? weekTitle(sb) : "This week"}
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: "var(--ink-60)" }}>
            Straight from JustCall.{" "}
            {sb?.updatedAt ? `Updated ${timeOnly.format(new Date(sb.updatedAt))}` : ""}
            {offset === 0 ? " · refreshes every few minutes" : ""}
            {loading && <Loader2 size={13} className="ml-2 inline animate-spin align-[-2px]" aria-label="Loading" />}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeWeek(Math.min(52, offset + 1))}
            className="grid h-11 w-11 place-items-center rounded-full"
            style={{ border: "1px solid var(--line-strong)" }}
            aria-label="Previous week"
          >
            <ChevronLeft size={18} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => changeWeek(Math.max(0, offset - 1))}
            disabled={offset === 0}
            className="grid h-11 w-11 place-items-center rounded-full disabled:opacity-30"
            style={{ border: "1px solid var(--line-strong)" }}
            aria-label="Next week"
          >
            <ChevronRight size={18} strokeWidth={1.8} />
          </button>
          {admin && (
            <button type="button" onClick={() => setShowSetup((s) => !s)} className="btn btn-secondary !px-5 !py-2.5 !text-[14px]" aria-expanded={showSetup}>
              <Settings2 size={15} strokeWidth={1.8} aria-hidden /> Settings
            </button>
          )}
        </div>
      </div>

      {admin && showSetup && (
        <section className="surface mb-8 rounded-[24px] p-6 md:p-8">
          <SetupPanel members={members} onSaved={refresh} />
        </section>
      )}

      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {sb?.error && (
        <div className="mb-4">
          <Notice tone="error">{sb.error}</Notice>
        </div>
      )}

      {!sb && !error ? (
        <p className="text-[15px]" style={{ color: "var(--ink-45)" }}>
          Loading the scoreboard…
        </p>
      ) : sb ? (
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Bookings" value={String(totals.bookings)} sub={`Team target ${sb.weeklyTarget * setters.length}`} />
            <Stat label="Conversations" value={String(totals.conversations)} sub={`${pct(totals.bookings, totals.conversations)} booked`} />
            <Stat label="Dials" value={String(totals.dials)} sub={`${pct(totals.conversations, totals.dials)} connect rate`} />
            <Stat label="Talk time" value={talkTime(totals.talk)} />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-[26px] font-semibold">Leaderboard</h2>
              <p className="text-[13px]" style={{ color: "var(--ink-60)" }}>
                Target {sb.weeklyTarget} bookings a week. The tick shows where you should be by today.
              </p>
            </div>
            {setters.length === 0 ? (
              <Notice>No setters on the team yet. Add them under Team.</Notice>
            ) : (
              <ol className="space-y-2.5">
                {setters.map((r, i) => (
                  <LeaderRow key={r.memberId} row={r} rank={i + 1} sb={sb} me={r.memberId === viewer.id} />
                ))}
              </ol>
            )}
          </div>

          {setters.length > 0 && (
            <div>
              <h2 className="font-display mb-4 text-[26px] font-semibold">Day by day</h2>
              <DailyGrid sb={sb} rows={setters} />
              <p className="mt-2 text-[12.5px]" style={{ color: "var(--ink-45)" }}>
                Big number: bookings. Small: dials. Days run midnight to midnight UK time.
              </p>
            </div>
          )}

          {admin && (
            <div className="space-y-4">
              <h2 className="font-display text-[22px] font-semibold">Admin view</h2>
              {sb.others.some((r) => r.dials > 0) && (
                <p className="text-[14px]" style={{ color: "var(--ink-60)" }}>
                  Not on the leaderboard:{" "}
                  {sb.others
                    .filter((r) => r.dials > 0)
                    .map((r) => `${r.name} ${r.dials} dials, ${r.bookings} booked`)
                    .join(" · ")}
                </p>
              )}
              {sb.unmatched.length > 0 && (
                <Notice>
                  Calls from JustCall users not linked to anyone:{" "}
                  {sb.unmatched.map((u) => `${u.name} (${u.calls})`).join(", ")}. Link them in Settings so they count.
                </Notice>
              )}
              <div className="rounded-[14px] p-5" style={{ border: "1px solid var(--line)" }}>
                <p className="text-[14.5px] font-medium">Call results this week</p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--ink-60)" }}>
                  What setters picked in JustCall after each call. Results containing {sb.bookingWords.map((w) => `“${w}”`).join(" or ")} count as bookings.
                </p>
                {sb.dispositions.length === 0 ? (
                  <p className="mt-3 text-[13.5px]" style={{ color: "var(--ink-45)" }}>
                    No results picked yet this week.
                  </p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sb.dispositions.map((d) => {
                      const booking = sb.bookingWords.some((w) => d.name.toLowerCase().includes(w.toLowerCase()));
                      return (
                        <li
                          key={d.name}
                          className="rounded-full px-3 py-1.5 text-[13px]"
                          style={booking ? { background: "var(--ink)", color: "var(--bg)" } : { border: "1px solid var(--line)" }}
                        >
                          {d.name} · {d.count}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {sb.updatedAt && (
                <p className="text-[12.5px]" style={{ color: "var(--ink-45)" }}>
                  Last fetched from JustCall {formatDate(sb.updatedAt)}.
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
