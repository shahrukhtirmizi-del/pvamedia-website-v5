/**
 * JustCall API client for the scoreboard. Server-side only.
 *
 * Reads both call logs PVA uses: normal JustCall calls (/v2.1/calls) and
 * Sales Dialer campaign calls (/v2.1/sales_dialer/calls). Auth is the
 * "api_key:api_secret" header from JUSTCALL_API_KEY / JUSTCALL_API_SECRET.
 *
 * JustCall's docs don't pin down the list envelope or whether pages start
 * at 0 or 1, so paging follows next_page_link when given, otherwise counts
 * pages up and stops when a page brings nothing new.
 */

const BASE = process.env.JUSTCALL_API_BASE || "https://api.justcall.io";
const PER_PAGE = 100;
const MAX_PAGES = 60;

export type JcCall = {
  /** Unique across both logs: "c123" for JustCall calls, "s123" for Sales Dialer. */
  id: string;
  sid: string | null;
  agentId: string;
  agentName: string;
  /** When the call happened, UTC ISO. */
  at: string;
  outgoing: boolean;
  /** Seconds actually talking. */
  talk: number;
  answered: boolean;
  disposition: string;
  campaign: string | null;
};

export type JcAgent = { id: string; name: string; email: string };

export class JustCallError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export const justCallConfigured = () => Boolean(process.env.JUSTCALL_API_KEY && process.env.JUSTCALL_API_SECRET);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request(pathOrUrl: string, params?: Record<string, string | number>): Promise<unknown> {
  const url = new URL(pathOrUrl, BASE);
  if (url.origin !== new URL(BASE).origin) throw new JustCallError("Unexpected JustCall paging link.");
  for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, String(v));

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.JUSTCALL_API_KEY}:${process.env.JUSTCALL_API_SECRET}`,
      },
      cache: "no-store",
    });

    if (res.status === 429) {
      // wait for the per-minute window to reset, at most 20 seconds, then try again
      const reset = Number(res.headers.get("x-rate-limit-burst-reset")) * 1000;
      await sleep(Math.min(Math.max(reset - Date.now(), 2000), 20000));
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new JustCallError("JustCall rejected the API key. Check JUSTCALL_API_KEY and JUSTCALL_API_SECRET in Vercel.", res.status);
    }
    if (!res.ok) {
      const text = (await res.text()).slice(0, 200);
      throw new JustCallError(`JustCall returned ${res.status}${text ? `: ${text}` : ""}`, res.status);
    }

    // stay well inside the burst limit when paging through a lot of calls
    const burstLeft = Number(res.headers.get("x-rate-limit-burst-remaining"));
    if (Number.isFinite(burstLeft) && burstLeft < 3) {
      const reset = Number(res.headers.get("x-rate-limit-burst-reset")) * 1000;
      await sleep(Math.min(Math.max(reset - Date.now(), 1000), 20000));
    }
    return res.json();
  }
  throw new JustCallError("JustCall is rate-limiting requests. The scoreboard will catch up in a few minutes.", 429);
}

/** The rows in a list response, whatever the envelope looks like. */
function rowsOf(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) return body as Record<string, unknown>[];
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    for (const key of ["data", "calls", "users", "results", "items"]) {
      if (Array.isArray(b[key])) return b[key] as Record<string, unknown>[];
    }
  }
  return [];
}

const nextLink = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;
  const link = (body as Record<string, unknown>).next_page_link;
  return typeof link === "string" && link.startsWith("http") ? link : null;
};

async function listAll(path: string, params: Record<string, string | number>, idOf: (r: Record<string, unknown>) => string) {
  const out = new Map<string, Record<string, unknown>>();
  let link: string | null = null;
  let page = 0;
  let nothingNew = 0;
  for (let i = 0; i < MAX_PAGES; i++) {
    const body = link ? await request(link) : await request(path, { ...params, per_page: PER_PAGE, page });
    const rows = rowsOf(body);
    let added = 0;
    for (const r of rows) {
      const id = idOf(r);
      if (id && !out.has(id)) {
        out.set(id, r);
        added++;
      }
    }
    link = nextLink(body);
    // pages may count from 0 or 1; if they count from 1, page 0 and page 1 are
    // the same, so only give up after two pages in a row with nothing new
    nothingNew = added === 0 ? nothingNew + 1 : 0;
    if (!link && (rows.length < PER_PAGE || nothingNew >= 2)) break;
    page++;
  }
  return [...out.values()];
}

/* ------------------------------------------------------------- normalise */

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

/** "2026-11-23" + "17:00:46" in UTC → ISO, tolerating a missing time. */
function utcIso(date: unknown, time: unknown): string | null {
  const d = str(date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const t = /^\d{1,2}:\d{2}(:\d{2})?$/.test(str(time)) ? str(time).padStart(8, "0") : "00:00:00";
  const iso = `${d}T${t.length === 5 ? `${t}:00` : t}Z`;
  return Number.isNaN(Date.parse(iso)) ? null : new Date(iso).toISOString();
}

function fromCall(r: Record<string, unknown>): JcCall | null {
  const info = obj(r.call_info);
  const dur = obj(r.call_duration);
  const at = utcIso(r.call_date, r.call_time);
  if (!at || r.id === undefined) return null;
  const direction = str(info.direction ?? r.direction).toLowerCase();
  const type = str(info.type ?? r.type).toLowerCase();
  const talk = num(dur.conversation_time ?? dur.total_duration ?? r.duration);
  return {
    id: `c${str(r.id)}`,
    sid: str(r.call_sid) || null,
    agentId: str(r.agent_id),
    agentName: str(r.agent_name) || str(r.agent_email) || "Unknown",
    at,
    outgoing: direction.startsWith("out"),
    talk,
    answered: talk > 0 || (type.includes("answer") && !type.includes("unanswer")),
    disposition: str(info.disposition ?? r.disposition),
    campaign: null,
  };
}

function fromDialer(r: Record<string, unknown>): JcCall | null {
  const info = obj(r.call_info);
  const at = utcIso(r.call_date, r.call_time);
  const id = r.call_id ?? r.id;
  if (!at || id === undefined) return null;
  const type = str(info.type).toLowerCase();
  const by = str(info.call_answered_by).toLowerCase();
  const talk = num(info.duration);
  return {
    id: `s${str(id)}`,
    sid: str(r.call_sid) || null,
    agentId: str(r.agent_id),
    agentName: str(r.agent_name) || str(r.agent_email) || "Unknown",
    at,
    outgoing: true,
    talk,
    answered: type === "connected" || by.includes("human"),
    disposition: str(info.disposition),
    campaign: str(obj(r.campaign).name) || null,
  };
}

/**
 * Every call between two dates (inclusive, "yyyy-mm-dd"), from both logs,
 * with any call that appears in both counted once.
 */
export async function fetchCalls(from: string, to: string): Promise<JcCall[]> {
  const params = { from_datetime: `${from} 00:00:00`, to_datetime: `${to} 23:59:59`, sort: "datetime", order: "asc" };
  const [calls, dialer] = await Promise.all([
    listAll("/v2.1/calls", params, (r) => str(r.id)),
    listAll("/v2.1/sales_dialer/calls", params, (r) => str(r.call_id ?? r.id)).catch((err) => {
      // accounts without Sales Dialer get an error here; normal calls still count
      if (err instanceof JustCallError && err.status && [400, 403, 404].includes(err.status)) return [];
      throw err;
    }),
  ]);

  const out: JcCall[] = [];
  const sids = new Set<string>();
  for (const c of dialer.map(fromDialer)) {
    if (!c) continue;
    out.push(c);
    if (c.sid) sids.add(c.sid);
  }
  for (const c of calls.map(fromCall)) {
    if (c && !(c.sid && sids.has(c.sid))) out.push(c);
  }
  return out;
}

export async function fetchAgents(): Promise<JcAgent[]> {
  const rows = await listAll("/v2.1/users", {}, (r) => str(r.id ?? r.agent_id));
  return rows
    .map((r) => ({ id: str(r.id ?? r.agent_id), name: str(r.name ?? r.agent_name), email: str(r.email ?? r.agent_email) }))
    .filter((a) => a.id);
}
