import type { Content, Item, Method, Stage } from "./types";

/**
 * Admin saves come from the browser, so they are rebuilt field by field
 * here: anything that isn't the right shape is dropped or trimmed, so a bad
 * save can't break the page for everyone else.
 */

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").slice(0, max) : "");
const line = (v: unknown, max: number) => str(v, max).trim();

const lines = (v: unknown, maxItems = 80, max = 3000) =>
  Array.isArray(v) ? v.map((x) => line(x, max)).filter(Boolean).slice(0, maxItems) : [];

const opt = (v: string) => (v ? v : undefined);

function uniqueId(raw: unknown, fallback: string, taken: Set<string>) {
  let id = typeof raw === "string" && /^[a-z0-9-]{1,80}$/.test(raw) ? raw : fallback;
  if (!/^[a-z0-9-]{1,80}$/.test(id)) id = `x-${Math.random().toString(36).slice(2, 10)}`;
  let out = id;
  for (let n = 2; taken.has(out); n++) out = `${id}-${n}`;
  taken.add(out);
  return out;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "topic";

function item(raw: unknown, taken: Set<string>): Item | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const title = line(r.title, 200);
  if (!title) return null;

  const methods: Method[] = Array.isArray(r.methods)
    ? r.methods
        .map((m) => {
          const mm = (m ?? {}) as Record<string, unknown>;
          return { label: line(mm.label, 80) || "Method", say: lines(mm.say, 30) };
        })
        .filter((m) => m.say.length > 0)
        .slice(0, 12)
    : [];
  const say = lines(r.say, 40);
  const points = lines(r.points, 60);

  return {
    id: uniqueId(r.id, `t-${slug(title)}`, taken),
    title,
    tag: line(r.tag, 40) || "Topic",
    when: opt(line(r.when, 1000)),
    say: say.length ? say : undefined,
    methods: methods.length ? methods : undefined,
    points: points.length ? points : undefined,
    deeper: opt(line(r.deeper, 2000)),
    note: opt(line(r.note, 2000)),
  };
}

export function sanitizeContent(raw: unknown): Content | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.stages)) return null;

  const page = (r.page ?? {}) as Record<string, unknown>;
  const standard = (r.standard ?? {}) as Record<string, unknown>;
  const link = line(r.bookingLink, 500);

  const stageIds = new Set<string>();
  const itemIds = new Set<string>();
  const stages: Stage[] = r.stages
    .slice(0, 40)
    .map((s) => {
      const ss = (s ?? {}) as Record<string, unknown>;
      const title = line(ss.title, 120);
      if (!title) return null;
      return {
        id: uniqueId(ss.id, slug(title), stageIds),
        title,
        when: line(ss.when, 200),
        items: (Array.isArray(ss.items) ? ss.items : [])
          .slice(0, 300)
          .map((it) => item(it, itemIds))
          .filter((x): x is Item => x !== null),
      };
    })
    .filter((x): x is Stage => x !== null);

  return {
    revision: typeof r.revision === "number" ? r.revision : 0,
    updatedAt: null,
    updatedBy: null,
    page: {
      eyebrow: line(page.eyebrow, 80),
      title: line(page.title, 160) || "Setter Academy",
      intro: line(page.intro, 800),
      footer: line(page.footer, 300),
    },
    standard: { value: line(standard.value, 12), text: line(standard.text, 400) },
    flowTitle: line(r.flowTitle, 80),
    flow: (Array.isArray(r.flow) ? r.flow : [])
      .slice(0, 8)
      .map((f) => {
        const ff = (f ?? {}) as Record<string, unknown>;
        return { time: line(ff.time, 20), label: line(ff.label, 40), detail: line(ff.detail, 200) };
      })
      .filter((f) => f.label),
    bookingLabel: line(r.bookingLabel, 60),
    bookingLink: /^https:\/\/\S+$/.test(link) ? link : "",
    stages,
  };
}
