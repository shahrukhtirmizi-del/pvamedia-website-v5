"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Item, Method, Stage } from "./types";
import { Notice, TextArea, TextField, fromLines, toLines } from "./ui";

type MethodDraft = { label: string; text: string };

/** The full editor for one topic. Every field a setter sees can be changed here. */
export function ItemEditor({
  item,
  tags,
  saving,
  onSave,
  onCancel,
}: {
  item: Item;
  tags: string[];
  saving: boolean;
  onSave: (item: Item) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [tag, setTag] = useState(item.tag);
  const [when, setWhen] = useState(item.when ?? "");
  const [say, setSay] = useState(fromLines(item.say));
  const [methods, setMethods] = useState<MethodDraft[]>(
    (item.methods ?? []).map((m) => ({ label: m.label, text: fromLines(m.say) })),
  );
  const [points, setPoints] = useState(fromLines(item.points));
  const [deeper, setDeeper] = useState(item.deeper ?? "");
  const [note, setNote] = useState(item.note ?? "");
  const [error, setError] = useState<string | null>(null);

  const setMethod = (i: number, patch: Partial<MethodDraft>) =>
    setMethods((all) => all.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  const save = () => {
    if (!title.trim()) {
      setError("Give the topic a title.");
      return;
    }
    const cleanMethods: Method[] = methods
      .map((m) => ({ label: m.label.trim() || "Method", say: toLines(m.text) }))
      .filter((m) => m.say.length > 0);
    const opt = (s: string) => (s.trim() ? s.trim() : undefined);
    const list = (s: string) => (toLines(s).length ? toLines(s) : undefined);
    onSave({
      id: item.id,
      title: title.trim(),
      tag: tag.trim() || "Topic",
      when: opt(when),
      say: list(say),
      methods: cleanMethods.length ? cleanMethods : undefined,
      points: list(points),
      deeper: opt(deeper),
      note: opt(note),
    });
  };

  const listId = `tags-${item.id}`;

  return (
    <div className="space-y-5 px-5 pb-6 pt-1 md:px-7 md:pb-7">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
        <TextField label="Title" value={title} onChange={setTitle} />
        <TextField label="Tag" value={tag} onChange={setTag} list={listId} hint="The small label on the card" />
        <datalist id={listId}>
          {tags.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <TextArea label="Use when" value={when} onChange={setWhen} rows={2} />

      <TextArea
        label="Say"
        value={say}
        onChange={setSay}
        rows={4}
        serif
        hint="One line per paragraph. Start a line with Setter:, Prospect:, Owner:, You: or Then: to show who's speaking."
      />

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--ink-60)" }}>
            Alternative scripts
          </p>
          <button
            type="button"
            onClick={() => setMethods((all) => [...all, { label: `Method ${String.fromCharCode(65 + all.length)}`, text: "" }])}
            className="inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-4"
          >
            <Plus size={14} strokeWidth={2} aria-hidden /> Add a script
          </button>
        </div>
        {methods.length === 0 ? (
          <p className="text-[13px]" style={{ color: "var(--ink-45)" }}>
            Use these when there are several ways to say it (Method A, Method B, SOP version).
          </p>
        ) : (
          <div className="space-y-3">
            {methods.map((m, i) => (
              <div key={i} className="rounded-[14px] p-4" style={{ background: "var(--bg-raised)" }}>
                <div className="flex items-end gap-2">
                  <TextField label="Label" value={m.label} onChange={(v) => setMethod(i, { label: v })} className="flex-1" />
                  <button
                    type="button"
                    onClick={() => setMethods((all) => all.filter((_, j) => j !== i))}
                    aria-label={`Remove ${m.label}`}
                    className="mb-1.5 grid h-10 w-10 place-items-center rounded-full hover:bg-[rgba(10,10,10,0.06)]"
                  >
                    <X size={16} strokeWidth={1.8} />
                  </button>
                </div>
                <TextArea
                  label="Lines"
                  value={m.text}
                  onChange={(v) => setMethod(i, { text: v })}
                  rows={3}
                  serif
                  className="mt-3"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <TextArea label="Bullet points" value={points} onChange={setPoints} rows={4} hint="One bullet per line." />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextArea label="Go deeper" value={deeper} onChange={setDeeper} rows={3} />
        <TextArea label="Watch out" value={note} onChange={setNote} rows={3} />
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={saving} className="btn btn-primary !px-6 !py-3 disabled:opacity-60">
          {saving ? "Saving" : "Save topic"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="btn btn-secondary !px-6 !py-3">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function StageEditor({
  stage,
  saving,
  onSave,
  onCancel,
}: {
  stage: Pick<Stage, "title" | "when">;
  saving: boolean;
  onSave: (patch: { title: string; when: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(stage.title);
  const [when, setWhen] = useState(stage.when);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="surface space-y-4 rounded-[24px] p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Stage name" value={title} onChange={setTitle} />
        <TextField label="When it applies" value={when} onChange={setWhen} placeholder="e.g. First 20 to 50 seconds" />
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => (title.trim() ? onSave({ title: title.trim(), when: when.trim() }) : setError("Give the stage a name."))}
          className="btn btn-primary !px-6 !py-3 disabled:opacity-60"
        >
          {saving ? "Saving" : "Save stage"}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="btn btn-secondary !px-6 !py-3">
          Cancel
        </button>
      </div>
    </div>
  );
}
