"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, LogOut, Search, X } from "lucide-react";
import { logout } from "./actions";
import type { Item, Stage } from "./content";

type Props = {
  name: string;
  stages: Stage[];
  standard: { value: number; text: string };
  flow: { time: string; label: string; detail: string }[];
  bookingLink: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (stageId: string, i: number) => `${stageId}:${i}`;
const SPEAKER = /^(Setter|Prospect|Owner|You|Then):\s*(.*)$/;

function itemText(item: Item) {
  return [
    item.title,
    item.tag,
    item.when,
    item.deeper,
    item.note,
    ...(item.say ?? []),
    ...(item.points ?? []),
    ...(item.methods ?? []).flatMap((m) => [m.label, ...m.say]),
  ]
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase();
}

/** Wraps every case-insensitive match of the query in <mark>. */
function Hl({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q ? (
          <mark key={i} className="rounded-[4px] px-0.5" style={{ background: "rgba(10,10,10,0.12)", color: "var(--ink)" }}>
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono mb-2 text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-45)" }}>
      {children}
    </p>
  );
}

/** Spoken lines: set in the serif so a setter can tell at a glance what to say out loud. */
function Script({ lines, q, title }: { lines: string[]; q: string; title?: string }) {
  return (
    <div className="rounded-[14px] px-5 py-4 md:px-6 md:py-5" style={{ background: "var(--bg-raised)" }}>
      {title && (
        <p className="font-mono mb-3 text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "var(--ink)" }}>
          {title}
        </p>
      )}
      <div className="space-y-3">
        {lines.map((line, i) => {
          const m = line.match(SPEAKER);
          return (
            <p key={i} className="font-serif-display text-[17px] leading-[1.5] md:text-[18px]" style={{ color: "var(--ink)" }}>
              {m && (
                <span className="font-mono mr-2 align-[2px] text-[10.5px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-45)" }}>
                  {m[1]}
                </span>
              )}
              <Hl text={m ? m[2] : line} q={q} />
            </p>
          );
        })}
      </div>
    </div>
  );
}

function ItemBody({ item, q }: { item: Item; q: string }) {
  return (
    <div className="space-y-6 px-5 pb-6 md:px-7 md:pb-7">
      {item.when && (
        <div>
          <Label>Use when</Label>
          <p className="text-[15.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
            <Hl text={item.when} q={q} />
          </p>
        </div>
      )}

      {item.say && (
        <div>
          <Label>Say</Label>
          <Script lines={item.say} q={q} />
        </div>
      )}

      {item.methods && (
        <div>
          <Label>Say</Label>
          <div className="space-y-2.5">
            {item.methods.map((m) => (
              <Script key={m.label} title={m.label} lines={m.say} q={q} />
            ))}
          </div>
        </div>
      )}

      {item.points && (
        <ul className="space-y-2.5">
          {item.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
              <span className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: "var(--ink)" }} aria-hidden />
              <span>
                <Hl text={p} q={q} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {(item.deeper || item.note) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {item.deeper && (
            <div className="rounded-[14px] p-4" style={{ border: "1px solid var(--line)" }}>
              <Label>Go deeper</Label>
              <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
                <Hl text={item.deeper} q={q} />
              </p>
            </div>
          )}
          {item.note && (
            <div className="rounded-[14px] p-4" style={{ border: "1px solid var(--line)" }}>
              <Label>Watch out</Label>
              <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
                <Hl text={item.note} q={q} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemCard({
  id,
  item,
  open,
  onToggle,
  q,
  stageLabel,
}: {
  id: string;
  item: Item;
  open: boolean;
  onToggle: () => void;
  q: string;
  stageLabel?: string;
}) {
  const panelId = `panel-${id.replace(":", "-")}`;
  return (
    <li
      className="rounded-[14px] transition-[border-color,box-shadow] duration-300"
      style={{
        background: "var(--bg)",
        border: `1px solid ${open ? "var(--line-strong)" : "var(--line)"}`,
        boxShadow: open ? "var(--shadow-soft)" : "none",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 px-5 py-4 text-left md:px-7 md:py-5"
      >
        <span className="min-w-0 flex-1">
          {stageLabel && (
            <span className="font-mono mb-1 block text-[10.5px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-45)" }}>
              {stageLabel}
            </span>
          )}
          <span className="font-display block text-[17px] font-semibold leading-snug md:text-[18.5px]" style={{ letterSpacing: "-0.02em" }}>
            <Hl text={item.title} q={q} />
          </span>
        </span>
        <span
          className="font-mono mt-0.5 hidden shrink-0 rounded-full px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] sm:inline-block"
          style={{ border: "1px solid var(--line)", color: "var(--ink-60)" }}
        >
          {item.tag}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={1.7}
          className="mt-0.5 shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--ink-60)" }}
          aria-hidden
        />
      </button>
      {open && (
        <div id={panelId} role="region" aria-label={item.title}>
          <ItemBody item={item} q={q} />
        </div>
      )}
    </li>
  );
}

export default function Academy({ name, stages, standard, flow, bookingLink }: Props) {
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const stage = stages[current];

  const index = useMemo(
    () => stages.map((s) => s.items.map((item) => itemText(item))),
    [stages],
  );

  const results = useMemo(() => {
    if (!q) return [];
    const hits: { stage: Stage; stageIndex: number; item: Item; key: string }[] = [];
    stages.forEach((s, si) =>
      s.items.forEach((item, ii) => {
        if (index[si][ii].includes(q)) hits.push({ stage: s, stageIndex: si, item, key: keyOf(s.id, ii) });
      }),
    );
    return hits;
  }, [q, stages, index]);

  // deep links: /academy#objections opens that stage
  useEffect(() => {
    const fromHash = () => {
      const i = stages.findIndex((s) => `#${s.id}` === window.location.hash);
      if (i > -1) setCurrent(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [stages]);

  // "/" jumps to search, Escape clears it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollToContent = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 100 : 140);
    if (window.scrollY > top) window.scrollTo({ top, behavior: "auto" });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setCurrent(i);
      setQuery("");
      history.replaceState(null, "", `#${stages[i].id}`);
      requestAnimationFrame(scrollToContent);
    },
    [stages, scrollToContent],
  );

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const stageKeys = stage.items.map((_, i) => keyOf(stage.id, i));
  const allOpen = stageKeys.every((k) => open.has(k));
  const setStageOpen = (value: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      stageKeys.forEach((k) => (value ? next.add(k) : next.delete(k)));
      return next;
    });

  return (
    <section className="relative">
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-12 md:px-8 md:pt-16">
        {/* ---------------------------------------------------------------- header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
            Setter Academy &middot; Team only
          </p>
          <form action={logout} className="flex items-center gap-3">
            <span className="text-[13.5px]" style={{ color: "var(--ink-60)" }}>
              Signed in as <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{name}</strong>
            </span>
            <button type="submit" className="btn btn-secondary !px-4 !py-2.5 !text-[13px]">
              <LogOut size={14} strokeWidth={1.8} aria-hidden />
              Log out
            </button>
          </form>
        </div>

        <h1
          className="font-display mt-8 max-w-[18ch] font-semibold"
          style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.02 }}
        >
          Everything you need on a call.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed md:text-[17px]" style={{ color: "var(--ink-60)" }}>
          Pick where you are in the call, from the first ten seconds to the handoff. Every topic opens with what to
          say, how to go deeper and what to watch out for.
        </p>

        {/* ---------------------------------------------------- standard + flow */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex items-center gap-6 rounded-[24px] p-7 md:p-8" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            <span className="font-display shrink-0 font-semibold" style={{ fontSize: "clamp(64px, 9vw, 96px)", lineHeight: 0.85 }}>
              {standard.value}
            </span>
            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
              {standard.text}
            </p>
          </div>

          <div className="surface rounded-[24px] p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                The call at a glance
              </p>
              <a
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
              >
                <CalendarDays size={14} strokeWidth={1.8} aria-hidden />
                Dano&rsquo;s calendar
              </a>
            </div>
            <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4">
              {flow.map((f) => (
                <li key={f.label}>
                  <span className="font-mono text-[11px] tracking-[0.12em]" style={{ color: "var(--ink-45)" }}>
                    {f.time}
                  </span>
                  <span className="font-display mt-1 block text-[18px] font-semibold">{f.label}</span>
                  <span className="mt-1 block text-[13.5px] leading-snug" style={{ color: "var(--ink-60)" }}>
                    {f.detail}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* --------------------------------------------------------------- search */}
        <div className="relative mt-10">
          <Search
            size={18}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--ink-45)" }}
            aria-hidden
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything: budget, gatekeeper, no-show…"
            aria-label="Search the academy"
            className="w-full rounded-full py-4 pl-[52px] pr-14 text-[15.5px] outline-none transition-colors focus:border-[color:var(--ink)] [&::-webkit-search-cancel-button]:hidden"
            style={{ background: "var(--bg)", border: "1px solid var(--line-strong)", color: "var(--ink)" }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-[rgba(10,10,10,0.06)]"
            >
              <X size={16} strokeWidth={1.8} />
            </button>
          ) : (
            <kbd
              className="font-mono pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-[6px] px-2 py-0.5 text-[11px] md:block"
              style={{ border: "1px solid var(--line-strong)", color: "var(--ink-45)" }}
            >
              /
            </kbd>
          )}
        </div>

        {/* ----------------------------------------------------- stages + content */}
        <div className="mt-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          {/* mobile: a sticky strip of pills */}
          <nav
            aria-label="Call stages"
            className="sticky top-[64px] z-40 -mx-5 px-5 py-3 md:top-[72px] md:-mx-8 md:px-8 lg:hidden"
            style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}
          >
            <ol className="no-bar flex gap-2 overflow-x-auto">
              {stages.map((s, i) => {
                const active = !q && i === current;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "true" : undefined}
                      className="rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors"
                      style={
                        active
                          ? { background: "var(--ink)", color: "var(--bg)", border: "1px solid var(--ink)" }
                          : { background: "var(--bg)", color: "var(--ink)", border: "1px solid var(--line-strong)" }
                      }
                    >
                      {i + 1}. {s.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* desktop: a sticky sidebar */}
          <nav aria-label="Call stages" className="hidden lg:block">
            <div className="sticky top-[104px]">
              <p className="font-mono mb-4 text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                Call stages, start to finish
              </p>
              <ol className="space-y-1">
                {stages.map((s, i) => {
                  const active = !q && i === current;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={active ? "true" : undefined}
                        className="group flex w-full items-baseline gap-3 rounded-[14px] px-4 py-3 text-left transition-colors"
                        style={active ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--ink)" }}
                      >
                        <span
                          className="font-mono text-[11px] tracking-[0.1em]"
                          style={{ color: active ? "rgba(255,255,255,0.6)" : "var(--ink-45)" }}
                        >
                          {pad(i + 1)}
                        </span>
                        <span className="flex-1">
                          <span className={`block text-[15px] font-medium ${active ? "" : "group-hover:underline"} underline-offset-4`}>
                            {s.title}
                          </span>
                          <span
                            className="mt-0.5 block text-[12.5px] leading-snug"
                            style={{ color: active ? "rgba(255,255,255,0.6)" : "var(--ink-45)" }}
                          >
                            {s.when}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>

          <div ref={contentRef} className="min-w-0 pt-8 lg:pt-0" aria-live="polite">
            {q ? (
              <>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                  Search
                </p>
                <h2 className="font-display mt-3 text-[30px] font-semibold leading-tight md:text-[38px]">
                  {results.length === 0
                    ? "Nothing matches that"
                    : `${results.length} ${results.length === 1 ? "topic" : "topics"} for “${query.trim()}”`}
                </h2>
                {results.length === 0 ? (
                  <p className="mt-4 text-[15.5px]" style={{ color: "var(--ink-60)" }}>
                    Try a shorter word, like &ldquo;price&rdquo;, &ldquo;busy&rdquo; or &ldquo;email&rdquo;.
                  </p>
                ) : (
                  <ul className="mt-7 space-y-2.5">
                    {results.map((r) => (
                      <ItemCard
                        key={r.key}
                        id={r.key}
                        item={r.item}
                        q={q}
                        stageLabel={`${pad(r.stageIndex + 1)} · ${r.stage.title}`}
                        open={!open.has(`closed:${r.key}`)}
                        onToggle={() => toggle(`closed:${r.key}`)}
                      />
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                      Stage {pad(current + 1)} of {pad(stages.length)} &middot; {stage.when}
                    </p>
                    <h2 className="font-display mt-3 text-[34px] font-semibold leading-tight md:text-[44px]">{stage.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStageOpen(!allOpen)}
                    className="text-[13.5px] font-medium underline underline-offset-4"
                    style={{ color: "var(--ink-60)" }}
                  >
                    {allOpen ? "Collapse all" : "Expand all"}
                  </button>
                </div>

                <ul className="mt-7 space-y-2.5">
                  {stage.items.map((item, i) => {
                    const key = keyOf(stage.id, i);
                    return (
                      <ItemCard key={key} id={key} item={item} q="" open={open.has(key)} onToggle={() => toggle(key)} />
                    );
                  })}
                </ul>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                  {current > 0 ? (
                    <button type="button" onClick={() => goTo(current - 1)} className="btn btn-secondary">
                      <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
                      {stages[current - 1].title}
                    </button>
                  ) : (
                    <span />
                  )}
                  {current < stages.length - 1 && (
                    <button type="button" onClick={() => goTo(current + 1)} className="btn btn-primary">
                      Next: {stages[current + 1].title}
                      <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-20 text-[13px]" style={{ color: "var(--ink-45)" }}>
          PVA Media internal training. Please don&rsquo;t share it outside the team.
        </p>
      </div>
    </section>
  );
}
