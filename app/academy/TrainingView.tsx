"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, ChevronDown, Copy, Pencil, Plus, Search, X } from "lucide-react";
import type { Content, Item, Stage } from "./types";
import { ItemEditor, StageEditor } from "./editors";
import { ConfirmButton, LinkButton, newId } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");
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
  const empty = !item.when && !item.say && !item.methods && !item.points && !item.deeper && !item.note;
  return (
    <div className="space-y-6 px-5 pb-6 md:px-7 md:pb-7">
      {empty && (
        <p className="text-[14.5px]" style={{ color: "var(--ink-45)" }}>
          Nothing here yet.
        </p>
      )}
      {item.when && (
        <div>
          <Label>Use when</Label>
          <p className="whitespace-pre-line text-[15.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
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
            {item.methods.map((m, i) => (
              <Script key={i} title={m.label} lines={m.say} q={q} />
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
              <p className="whitespace-pre-line text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
                <Hl text={item.deeper} q={q} />
              </p>
            </div>
          )}
          {item.note && (
            <div className="rounded-[14px] p-4" style={{ border: "1px solid var(--line)" }}>
              <Label>Watch out</Label>
              <p className="whitespace-pre-line text-[14.5px] leading-relaxed" style={{ color: "var(--ink-80)" }}>
                <Hl text={item.note} q={q} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type ItemTools = {
  first: boolean;
  last: boolean;
  stages: Stage[];
  stageIndex: number;
  onEdit: () => void;
  onMove: (dir: -1 | 1) => void;
  onMoveTo: (stageIndex: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  busy: boolean;
};

function ItemCard({
  item,
  open,
  onToggle,
  q,
  stageLabel,
  tools,
  editor,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
  q: string;
  stageLabel?: string;
  tools?: ItemTools;
  editor?: ReactNode;
}) {
  const panelId = `panel-${item.id}`;
  const expanded = open || Boolean(editor);
  return (
    <li
      className="rounded-[14px] transition-[border-color,box-shadow] duration-300"
      style={{
        background: "var(--bg)",
        border: `1px solid ${expanded ? "var(--line-strong)" : "var(--line)"}`,
        boxShadow: expanded ? "var(--shadow-soft)" : "none",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
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
          style={{ transform: expanded ? "rotate(180deg)" : "none", color: "var(--ink-60)" }}
          aria-hidden
        />
      </button>

      {tools && !editor && (
        <div className="-mt-2 flex flex-wrap items-center gap-1 px-3 pb-3 md:px-5">
          <LinkButton onClick={tools.onEdit} disabled={tools.busy}>
            <Pencil size={13} strokeWidth={1.8} aria-hidden /> Edit
          </LinkButton>
          <LinkButton onClick={() => tools.onMove(-1)} disabled={tools.busy || tools.first} title="Move up">
            <ArrowUp size={13} strokeWidth={1.8} aria-hidden /> Up
          </LinkButton>
          <LinkButton onClick={() => tools.onMove(1)} disabled={tools.busy || tools.last} title="Move down">
            <ArrowDown size={13} strokeWidth={1.8} aria-hidden /> Down
          </LinkButton>
          <label className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium" style={{ color: "var(--ink-80)" }}>
            <span className="sr-only">Move to stage</span>
            <select
              value=""
              disabled={tools.busy}
              onChange={(e) => e.target.value && tools.onMoveTo(Number(e.target.value))}
              className="cursor-pointer bg-transparent text-[13px] font-medium outline-none"
            >
              <option value="">Move to…</option>
              {tools.stages.map((s, i) =>
                i === tools.stageIndex ? null : (
                  <option key={s.id} value={i}>
                    {pad(i + 1)} {s.title}
                  </option>
                ),
              )}
            </select>
          </label>
          <LinkButton onClick={tools.onDuplicate} disabled={tools.busy}>
            <Copy size={13} strokeWidth={1.8} aria-hidden /> Duplicate
          </LinkButton>
          <ConfirmButton onConfirm={tools.onDelete} disabled={tools.busy} confirmLabel="Click again to delete">
            Delete
          </ConfirmButton>
        </div>
      )}

      {editor ? (
        <div id={panelId}>{editor}</div>
      ) : (
        open && (
          <div id={panelId} role="region" aria-label={item.title}>
            <ItemBody item={item} q={q} />
          </div>
        )
      )}
    </li>
  );
}

const BLANK_ITEM = (): Item => ({ id: newId("t"), title: "", tag: "SOP" });

export default function TrainingView({
  content,
  editing,
  saving,
  onCommit,
}: {
  content: Content;
  editing: boolean;
  saving: boolean;
  onCommit: (next: Content, note: string) => Promise<boolean>;
}) {
  const { stages } = content;
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [closedHits, setClosedHits] = useState<Set<string>>(() => new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [draft, setDraft] = useState<Item | null>(null);
  const [editingStage, setEditingStage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const stageIndex = Math.min(current, Math.max(stages.length - 1, 0));
  const stage = stages[stageIndex] as Stage | undefined;
  const q = query.trim().toLowerCase();

  const tags = useMemo(() => [...new Set(stages.flatMap((s) => s.items.map((i) => i.tag)))].sort(), [stages]);
  const results = useMemo(() => {
    if (!q) return [];
    return stages.flatMap((s, si) =>
      s.items.filter((item) => itemText(item).includes(q)).map((item) => ({ stage: s, stageIndex: si, item })),
    );
  }, [q, stages]);

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
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
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
      setEditingItem(null);
      setDraft(null);
      setEditingStage(false);
      if (stages[i]) history.replaceState(null, "", `#${stages[i].id}`);
      requestAnimationFrame(scrollToContent);
    },
    [stages, scrollToContent],
  );

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /* ------------------------------------------------------------- editing */

  const withStages = (next: Stage[]): Content => ({ ...content, stages: next });
  const setStageItems = (si: number, items: Item[]) => stages.map((s, i) => (i === si ? { ...s, items } : s));

  const saveItem = async (si: number, item: Item, isNew: boolean) => {
    const items = isNew ? [...stages[si].items, item] : stages[si].items.map((x) => (x.id === item.id ? item : x));
    const ok = await onCommit(withStages(setStageItems(si, items)), `${isNew ? "Added" : "Edited"} “${item.title}”`);
    if (ok) {
      setEditingItem(null);
      setDraft(null);
      setOpen((prev) => new Set(prev).add(item.id));
    }
  };

  const moveItem = (si: number, ii: number, dir: -1 | 1) => {
    const items = [...stages[si].items];
    const [it] = items.splice(ii, 1);
    items.splice(ii + dir, 0, it);
    void onCommit(withStages(setStageItems(si, items)), `Moved “${it.title}” ${dir < 0 ? "up" : "down"}`);
  };

  const moveItemTo = (si: number, ii: number, target: number) => {
    const it = stages[si].items[ii];
    const next = stages.map((s, i) => {
      if (i === si) return { ...s, items: s.items.filter((_, j) => j !== ii) };
      if (i === target) return { ...s, items: [...s.items, it] };
      return s;
    });
    void onCommit(withStages(next), `Moved “${it.title}” to ${stages[target].title}`);
  };

  const duplicateItem = (si: number, ii: number) => {
    const it = stages[si].items[ii];
    const items = [...stages[si].items];
    items.splice(ii + 1, 0, { ...structuredClone(it), id: newId("t"), title: `${it.title} (copy)` });
    void onCommit(withStages(setStageItems(si, items)), `Duplicated “${it.title}”`);
  };

  const deleteItem = (si: number, ii: number) => {
    const it = stages[si].items[ii];
    void onCommit(withStages(setStageItems(si, stages[si].items.filter((_, j) => j !== ii))), `Deleted “${it.title}”`);
  };

  const saveStage = async (patch: { title: string; when: string }) => {
    const ok = await onCommit(
      withStages(stages.map((s, i) => (i === stageIndex ? { ...s, ...patch } : s))),
      `Edited stage “${patch.title}”`,
    );
    if (ok) setEditingStage(false);
  };

  const moveStage = (dir: -1 | 1) => {
    const next = [...stages];
    const [s] = next.splice(stageIndex, 1);
    next.splice(stageIndex + dir, 0, s);
    void onCommit(withStages(next), `Moved stage “${s.title}” ${dir < 0 ? "up" : "down"}`).then((ok) => ok && setCurrent(stageIndex + dir));
  };

  const deleteStage = () => {
    const s = stages[stageIndex];
    void onCommit(withStages(stages.filter((_, i) => i !== stageIndex)), `Deleted stage “${s.title}”`).then(
      (ok) => ok && setCurrent(Math.max(0, stageIndex - 1)),
    );
  };

  const addStage = async () => {
    const s: Stage = { id: newId("stage"), title: "New stage", when: "", items: [] };
    const ok = await onCommit(withStages([...stages, s]), "Added a stage");
    if (ok) {
      setCurrent(stages.length);
      setQuery("");
      setEditingStage(true);
    }
  };

  /* -------------------------------------------------------------- render */

  const allOpen = stage ? stage.items.every((it) => open.has(it.id)) : false;
  const setStageOpen = (value: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      stage?.items.forEach((it) => (value ? next.add(it.id) : next.delete(it.id)));
      return next;
    });

  const { page, standard, flow } = content;

  return (
    <>
      <h1 className="font-display mt-8 max-w-[18ch] font-semibold" style={{ fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.02 }}>
        {page.title}
      </h1>
      {page.intro && (
        <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed md:text-[17px]" style={{ color: "var(--ink-60)" }}>
          {page.intro}
        </p>
      )}

      {(standard.value || standard.text || flow.length > 0) && (
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {(standard.value || standard.text) && (
            <div className="flex items-center gap-6 rounded-[24px] p-7 md:p-8" style={{ background: "var(--ink)", color: "var(--bg)" }}>
              {standard.value && (
                <span className="font-display shrink-0 font-semibold" style={{ fontSize: "clamp(64px, 9vw, 96px)", lineHeight: 0.85 }}>
                  {standard.value}
                </span>
              )}
              <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                {standard.text}
              </p>
            </div>
          )}
          {flow.length > 0 && (
            <div className="surface rounded-[24px] p-6 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                  {content.flowTitle}
                </p>
                {content.bookingLink && (
                  <a
                    href={content.bookingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
                  >
                    <CalendarDays size={14} strokeWidth={1.8} aria-hidden />
                    {content.bookingLabel || "Booking calendar"}
                  </a>
                )}
              </div>
              <ol className={`mt-5 grid grid-cols-2 gap-x-5 gap-y-5 ${flow.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {flow.map((f, i) => (
                  <li key={i}>
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
          )}
        </div>
      )}

      {/* search */}
      <div className="relative mt-10">
        <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-45)" }} aria-hidden />
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

      <div className="mt-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        {/* mobile: a sticky strip of pills */}
        <nav
          aria-label="Call stages"
          className="sticky top-[64px] z-40 -mx-5 px-5 py-3 md:top-[72px] md:-mx-8 md:px-8 lg:hidden"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}
        >
          <ol className="no-bar flex gap-2 overflow-x-auto">
            {stages.map((s, i) => {
              const active = !q && i === stageIndex;
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
            {editing && (
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={addStage}
                  disabled={saving}
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[13.5px] font-medium"
                  style={{ border: "1px dashed var(--line-strong)" }}
                >
                  <Plus size={14} strokeWidth={2} aria-hidden /> Stage
                </button>
              </li>
            )}
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
                const active = !q && i === stageIndex;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "true" : undefined}
                      className="group flex w-full items-baseline gap-3 rounded-[14px] px-4 py-3 text-left transition-colors"
                      style={active ? { background: "var(--ink)", color: "var(--bg)" } : { color: "var(--ink)" }}
                    >
                      <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: active ? "rgba(255,255,255,0.6)" : "var(--ink-45)" }}>
                        {pad(i + 1)}
                      </span>
                      <span className="flex-1">
                        <span className={`block text-[15px] font-medium ${active ? "" : "group-hover:underline"} underline-offset-4`}>{s.title}</span>
                        {s.when && (
                          <span className="mt-0.5 block text-[12.5px] leading-snug" style={{ color: active ? "rgba(255,255,255,0.6)" : "var(--ink-45)" }}>
                            {s.when}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {editing && (
              <button
                type="button"
                onClick={addStage}
                disabled={saving}
                className="mt-3 flex w-full items-center gap-2 rounded-[14px] px-4 py-3 text-[14px] font-medium transition-colors hover:bg-[rgba(10,10,10,0.04)]"
                style={{ border: "1px dashed var(--line-strong)" }}
              >
                <Plus size={15} strokeWidth={2} aria-hidden /> Add a stage
              </button>
            )}
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
                  Try a shorter word, like “price”, “busy” or “email”.
                </p>
              ) : (
                <ul className="mt-7 space-y-2.5">
                  {results.map((r) => (
                    <ItemCard
                      key={r.item.id}
                      item={r.item}
                      q={q}
                      stageLabel={`${pad(r.stageIndex + 1)} · ${r.stage.title}`}
                      open={!closedHits.has(r.item.id)}
                      onToggle={() =>
                        setClosedHits((prev) => {
                          const next = new Set(prev);
                          if (next.has(r.item.id)) next.delete(r.item.id);
                          else next.add(r.item.id);
                          return next;
                        })
                      }
                    />
                  ))}
                </ul>
              )}
            </>
          ) : !stage ? (
            <div className="rounded-[24px] p-8" style={{ border: "1px dashed var(--line-strong)" }}>
              <p className="font-display text-[22px] font-semibold">No stages yet</p>
              <p className="mt-2 text-[15px]" style={{ color: "var(--ink-60)" }}>
                {editing ? "Add a stage to start building the training." : "Check back soon."}
              </p>
            </div>
          ) : (
            <>
              {editing && editingStage ? (
                <StageEditor key={`${stage.id}-${content.revision}`} stage={stage} saving={saving} onSave={saveStage} onCancel={() => setEditingStage(false)} />
              ) : (
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
                      Stage {pad(stageIndex + 1)} of {pad(stages.length)}
                      {stage.when ? ` · ${stage.when}` : ""}
                    </p>
                    <h2 className="font-display mt-3 text-[34px] font-semibold leading-tight md:text-[44px]">{stage.title}</h2>
                  </div>
                  {stage.items.length > 0 && !editing && (
                    <button
                      type="button"
                      onClick={() => setStageOpen(!allOpen)}
                      className="text-[13.5px] font-medium underline underline-offset-4"
                      style={{ color: "var(--ink-60)" }}
                    >
                      {allOpen ? "Collapse all" : "Expand all"}
                    </button>
                  )}
                </div>
              )}

              {editing && !editingStage && (
                <div className="mt-4 flex flex-wrap items-center gap-1 rounded-full px-2 py-1" style={{ background: "var(--bg-raised)", width: "fit-content" }}>
                  <LinkButton onClick={() => setEditingStage(true)} disabled={saving}>
                    <Pencil size={13} strokeWidth={1.8} aria-hidden /> Rename stage
                  </LinkButton>
                  <LinkButton onClick={() => moveStage(-1)} disabled={saving || stageIndex === 0}>
                    <ArrowUp size={13} strokeWidth={1.8} aria-hidden /> Earlier
                  </LinkButton>
                  <LinkButton onClick={() => moveStage(1)} disabled={saving || stageIndex === stages.length - 1}>
                    <ArrowDown size={13} strokeWidth={1.8} aria-hidden /> Later
                  </LinkButton>
                  <ConfirmButton
                    onConfirm={deleteStage}
                    disabled={saving}
                    confirmLabel={stage.items.length ? `Delete stage and its ${stage.items.length} topics?` : "Click again to delete"}
                  >
                    Delete stage
                  </ConfirmButton>
                </div>
              )}

              <ul className="mt-7 space-y-2.5">
                {stage.items.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    q=""
                    open={open.has(item.id)}
                    onToggle={() => (editingItem === item.id ? undefined : toggle(item.id))}
                    tools={
                      editing
                        ? {
                            first: i === 0,
                            last: i === stage.items.length - 1,
                            stages,
                            stageIndex,
                            busy: saving,
                            onEdit: () => {
                              setDraft(null);
                              setEditingItem(item.id);
                            },
                            onMove: (dir) => moveItem(stageIndex, i, dir),
                            onMoveTo: (t) => moveItemTo(stageIndex, i, t),
                            onDuplicate: () => duplicateItem(stageIndex, i),
                            onDelete: () => deleteItem(stageIndex, i),
                          }
                        : undefined
                    }
                    editor={
                      editing && editingItem === item.id ? (
                        <ItemEditor
                          key={`${item.id}-${content.revision}`}
                          item={item}
                          tags={tags}
                          saving={saving}
                          onSave={(it) => saveItem(stageIndex, it, false)}
                          onCancel={() => setEditingItem(null)}
                        />
                      ) : undefined
                    }
                  />
                ))}

                {editing && draft && (
                  <li className="rounded-[14px]" style={{ background: "var(--bg)", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow-soft)" }}>
                    <p className="font-display px-5 pt-5 text-[18px] font-semibold md:px-7">New topic</p>
                    <ItemEditor item={draft} tags={tags} saving={saving} onSave={(it) => saveItem(stageIndex, it, true)} onCancel={() => setDraft(null)} />
                  </li>
                )}
              </ul>

              {editing && !draft && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setDraft(BLANK_ITEM());
                  }}
                  disabled={saving}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] px-5 py-4 text-[14.5px] font-medium transition-colors hover:bg-[rgba(10,10,10,0.03)]"
                  style={{ border: "1px dashed var(--line-strong)" }}
                >
                  <Plus size={16} strokeWidth={2} aria-hidden /> Add a topic to {stage.title}
                </button>
              )}

              {!editing && (
                <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                  {stageIndex > 0 ? (
                    <button type="button" onClick={() => goTo(stageIndex - 1)} className="btn btn-secondary">
                      <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
                      {stages[stageIndex - 1].title}
                    </button>
                  ) : (
                    <span />
                  )}
                  {stageIndex < stages.length - 1 && (
                    <button type="button" onClick={() => goTo(stageIndex + 1)} className="btn btn-primary">
                      Next: {stages[stageIndex + 1].title}
                      <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {page.footer && (
        <p className="mt-20 text-[13px]" style={{ color: "var(--ink-45)" }}>
          {page.footer}
        </p>
      )}
    </>
  );
}
