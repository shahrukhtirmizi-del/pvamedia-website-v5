import { JustCallError, fetchCalls, justCallConfigured, type JcCall } from "./justcall";
import { readJsonFile, writeJsonFile, type StoredUser } from "./store";
import type { Scoreboard, ScoreDay, ScoreRow, ScoreSettings } from "./types";

/**
 * The weekly scoreboard. Server-side only.
 *
 * Calls come from JustCall and are cached per week in Blob storage, so the
 * page doesn't hit JustCall's rate limit: days that are over are fetched
 * once, and the last two days are refetched at most every REFRESH_MS while
 * someone is looking (dispositions can change after a call ends). Weeks run
 * Monday to Sunday, UK time.
 */

const TZ = "Europe/London";
const REFRESH_MS = 3 * 60 * 1000;
const SETTINGS = "academy/scoreboard-settings.json";
const weekKey = (monday: string) => `academy/scoreboard/week-${monday}.json`;

export const DEFAULT_SETTINGS: ScoreSettings = {
  targetPerDay: 3,
  workingDays: [1, 2, 3, 4, 5],
  conversationSeconds: 30,
  bookingWords: ["booked", "appointment set"],
  links: {},
};

type WeekCache = {
  calls: Record<string, JcCall>;
  /** When each day (yyyy-mm-dd, UK) was last fetched. */
  fetched: Record<string, string>;
};

/* ------------------------------------------------------------------ dates */

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
/** UK calendar date of an instant, "yyyy-mm-dd". */
export const ukDate = (d: Date | string) => dayFmt.format(new Date(d));

const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** 0 = Sunday ... 6 = Saturday, for a calendar date. */
const weekday = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay();

export function mondayOf(day: string) {
  const wd = weekday(day);
  return addDays(day, wd === 0 ? -6 : 1 - wd);
}

/* --------------------------------------------------------------- settings */

export async function readSettings(): Promise<ScoreSettings> {
  const found = await readJsonFile<ScoreSettings>(SETTINGS);
  return { ...DEFAULT_SETTINGS, ...(found ?? {}) };
}

export async function writeSettings(s: ScoreSettings) {
  await writeJsonFile(SETTINGS, s);
}

/** A person's JustCall users: the ones an admin linked, or a first-name match. */
function agentsFor(user: StoredUser, settings: ScoreSettings, agentNames: Map<string, string>): Set<string> {
  const linked = settings.links[user.id];
  if (linked && linked.length) return new Set(linked);
  const first = user.name.trim().split(/\s+/)[0]?.toLowerCase();
  const out = new Set<string>();
  if (!first) return out;
  // only auto-match an agent nobody has been linked to on purpose
  const claimed = new Set(Object.values(settings.links).flat());
  for (const [id, name] of agentNames) {
    if (!claimed.has(id) && name.trim().split(/\s+/)[0]?.toLowerCase() === first) out.add(id);
  }
  return out;
}

/* ------------------------------------------------------------------- sync */

/**
 * Brings the cached week up to date. The range sent to JustCall is padded a
 * day each side because JustCall reads dates in the account's own time zone.
 */
async function syncWeek(monday: string, today: string): Promise<{ cache: WeekCache; error: string | null }> {
  const cache = (await readJsonFile<WeekCache>(weekKey(monday))) ?? { calls: {}, fetched: {} };
  if (!justCallConfigured()) return { cache, error: "JustCall isn’t connected yet." };

  const now = Date.now();
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter((d) => d <= today);
  const recent = new Set([today, addDays(today, -1)]);
  const stale = days.filter((d) => {
    const at = cache.fetched[d];
    if (!at) return true;
    // a day is settled once it was fetched more than a day after it ended
    if (!recent.has(d) && Date.parse(at) > Date.parse(`${addDays(d, 2)}T00:00:00Z`)) return false;
    return now - Date.parse(at) > REFRESH_MS;
  });
  if (stale.length === 0) return { cache, error: null };

  const from = addDays(stale[0], -1);
  const to = addDays(stale[stale.length - 1], 1);
  try {
    const calls = await fetchCalls(from, to);
    const fresh = new Set(stale);
    // replace what we had for the refetched days, keep the rest
    for (const [id, c] of Object.entries(cache.calls)) if (fresh.has(ukDate(c.at))) delete cache.calls[id];
    for (const c of calls) if (fresh.has(ukDate(c.at))) cache.calls[c.id] = c;
    const stamp = new Date().toISOString();
    for (const d of stale) cache.fetched[d] = stamp;
    await writeJsonFile(weekKey(monday), cache);
    return { cache, error: null };
  } catch (err) {
    console.error("academy scoreboard sync", err);
    const message = err instanceof JustCallError ? err.message : "JustCall couldn’t be reached just now.";
    return { cache, error: `${message} Showing the last numbers we had.` };
  }
}

/* ---------------------------------------------------------------- compute */

const emptyDay = (date: string): ScoreDay => ({ date, dials: 0, conversations: 0, talk: 0, bookings: 0 });

export async function buildScoreboard(
  users: StoredUser[],
  weekOffset: number,
  forAdmin: boolean,
): Promise<Scoreboard> {
  const today = ukDate(new Date());
  const monday = addDays(mondayOf(today), -7 * Math.max(0, Math.min(52, weekOffset)));
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const [settings, synced] = await Promise.all([readSettings(), syncWeek(monday, today)]);
  const calls = Object.values(synced.cache.calls).filter((c) => days.includes(ukDate(c.at)));

  const agentNames = new Map<string, string>();
  for (const c of calls) if (c.agentId) agentNames.set(c.agentId, c.agentName);

  const words = settings.bookingWords.map((w) => w.trim().toLowerCase()).filter(Boolean);
  const isBooking = (c: JcCall) => {
    const d = c.disposition.toLowerCase();
    return d !== "" && words.some((w) => d.includes(w));
  };

  const owner = new Map<string, string>();
  const rows: ScoreRow[] = users.map((u) => {
    for (const a of agentsFor(u, settings, agentNames)) owner.set(a, u.id);
    return {
      memberId: u.id,
      name: u.name,
      role: u.role,
      dials: 0,
      conversations: 0,
      talk: 0,
      bookings: 0,
      days: days.map(emptyDay),
    };
  });
  const byId = new Map(rows.map((r) => [r.memberId, r]));

  const unmatched = new Map<string, { agentId: string; name: string; calls: number }>();
  const dispositions = new Map<string, number>();

  for (const c of calls) {
    if (c.disposition) dispositions.set(c.disposition, (dispositions.get(c.disposition) ?? 0) + 1);
    const memberId = owner.get(c.agentId);
    const row = memberId ? byId.get(memberId) : undefined;
    if (!row) {
      const u = unmatched.get(c.agentId) ?? { agentId: c.agentId, name: c.agentName, calls: 0 };
      u.calls++;
      unmatched.set(c.agentId, u);
      continue;
    }
    const day = row.days[days.indexOf(ukDate(c.at))];
    const booked = isBooking(c);
    if (c.outgoing) {
      row.dials++;
      day.dials++;
    }
    if (c.answered && c.talk >= settings.conversationSeconds) {
      row.conversations++;
      day.conversations++;
    }
    row.talk += c.talk;
    day.talk += c.talk;
    if (booked) {
      row.bookings++;
      day.bookings++;
    }
  }

  const working = new Set(settings.workingDays);
  const workingDays = days.filter((d) => working.has(weekday(d)));
  const elapsed = workingDays.filter((d) => d <= today).length;

  const setters = rows
    .filter((r) => r.role === "setter")
    .sort((a, b) => b.bookings - a.bookings || b.conversations - a.conversations || b.dials - a.dials || a.name.localeCompare(b.name));

  const fetchedTimes = Object.entries(synced.cache.fetched)
    .filter(([d]) => days.includes(d))
    .map(([, t]) => t)
    .sort();

  return {
    weekStart: monday,
    weekOffset,
    days,
    today: days.includes(today) ? today : null,
    updatedAt: fetchedTimes.length ? fetchedTimes[fetchedTimes.length - 1] : null,
    error: synced.error,
    connected: justCallConfigured(),
    targetPerDay: settings.targetPerDay,
    weeklyTarget: settings.targetPerDay * workingDays.length,
    targetSoFar: settings.targetPerDay * elapsed,
    workingDays: settings.workingDays,
    setters,
    others: forAdmin ? rows.filter((r) => r.role !== "setter") : [],
    unmatched: forAdmin ? [...unmatched.values()].sort((a, b) => b.calls - a.calls) : [],
    dispositions: forAdmin ? [...dispositions.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count) : [],
    bookingWords: settings.bookingWords,
  };
}
