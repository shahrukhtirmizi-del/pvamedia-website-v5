import { del, get, list, put, BlobPreconditionFailedError } from "@vercel/blob";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_CONTENT, SEED_USERS } from "./content";
import type { Content, Version } from "./types";

/**
 * Where the academy keeps its data. Server-side only.
 *
 * Production and previews use a private Vercel Blob store (BLOB_READ_WRITE_TOKEN,
 * added when the store was connected to the project). Local dev without that
 * token falls back to files in .academy-data/ so the editor can be tested.
 *
 *   academy/content.json          the live training
 *   academy/users.json            the team, with password hashes
 *   academy/history/<id>.json     a snapshot of every save, newest kept
 */

export type StoredUser = {
  id: string;
  username: string;
  name: string;
  role: "admin" | "setter";
  password: string;
  starter: boolean;
  /** Goes up when the password changes, which signs out every other device. */
  sessionVersion: number;
  createdAt: string;
  lastLoginAt: string | null;
};

const CONTENT = "academy/content.json";
const USERS = "academy/users.json";
const HISTORY = "academy/history/";
const KEEP_VERSIONS = 100;

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const LOCAL_DIR = path.join(process.cwd(), ".academy-data");
const localPath = (key: string) => path.join(LOCAL_DIR, key.replace(/\//g, "__"));

export class ConflictError extends Error {}

type Read<T> = { value: T; etag: string | null };

async function readJson<T>(key: string): Promise<Read<T> | null> {
  if (!blobEnabled()) {
    try {
      const raw = await readFile(localPath(key), "utf8");
      return { value: JSON.parse(raw) as T, etag: String(raw.length) + ":" + raw.slice(-24) };
    } catch {
      return null;
    }
  }
  const res = await get(key, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  const text = await new Response(res.stream).text();
  return { value: JSON.parse(text) as T, etag: res.blob.etag };
}

/** Writes only if the file is still the version we read (etag), or doesn't exist yet (null). */
async function writeJson(key: string, value: unknown, etag: string | null) {
  const body = JSON.stringify(value);
  if (!blobEnabled()) {
    const current = await readJson(key);
    if (current && etag !== null && current.etag !== etag) throw new ConflictError();
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(localPath(key), body);
    return;
  }
  try {
    await put(key, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      ...(etag ? { ifMatch: etag } : {}),
    });
  } catch (err) {
    if (err instanceof BlobPreconditionFailedError) throw new ConflictError();
    throw err;
  }
}

/* ------------------------------------------------------------------ users */

export async function readUsers(): Promise<Read<StoredUser[]>> {
  const found = await readJson<StoredUser[]>(USERS);
  if (found) return found;
  return { value: SEED_USERS.map((u) => ({ ...u })), etag: null };
}

/** Read, change, write; retried once if someone else wrote in between. */
export async function updateUsers(change: (users: StoredUser[]) => StoredUser[]) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { value, etag } = await readUsers();
    const next = change(structuredClone(value));
    try {
      await writeJson(USERS, next, etag);
      return next;
    } catch (err) {
      if (!(err instanceof ConflictError) || attempt === 1) throw err;
    }
  }
  throw new ConflictError();
}

/* ---------------------------------------------------------------- content */

export async function readContent(): Promise<Content> {
  const found = await readJson<Content>(CONTENT);
  return found ? found.value : structuredClone(DEFAULT_CONTENT);
}

/**
 * Saves new content as the next revision, refusing if the editor was working
 * from an older revision than the one stored now. Every save also goes into
 * history so it can be restored.
 */
export async function writeContent(next: Content, baseRevision: number, by: string, note: string): Promise<Content> {
  const found = await readJson<Content>(CONTENT);
  const current = found ? found.value : DEFAULT_CONTENT;
  if (current.revision !== baseRevision) throw new ConflictError();

  const saved: Content = {
    ...next,
    revision: current.revision + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: by,
  };

  // the version being replaced goes into history first, so the very first
  // edit can still be undone back to the original training
  if (!found) await snapshot(current, "Original training", "PVA Media");
  await writeJson(CONTENT, saved, found ? found.etag : null);
  await snapshot(saved, note, by);
  return saved;
}

async function snapshot(content: Content, note: string, by: string) {
  const savedAt = content.updatedAt ?? new Date().toISOString();
  const id = `${String(content.revision).padStart(6, "0")}-${Date.now()}`;
  const record = { id, revision: content.revision, savedAt, savedBy: by, note, content };
  await writeJson(`${HISTORY}${id}.json`, record, null);
  void prune();
}

async function historyKeys(): Promise<string[]> {
  if (!blobEnabled()) {
    try {
      const prefix = HISTORY.replace(/\//g, "__");
      return (await readdir(LOCAL_DIR))
        .filter((f) => f.startsWith(prefix))
        .map((f) => f.replace(/__/g, "/"));
    } catch {
      return [];
    }
  }
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: HISTORY, cursor, limit: 1000 });
    keys.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return keys;
}

async function prune() {
  try {
    const keys = (await historyKeys()).sort().reverse();
    const old = keys.slice(KEEP_VERSIONS);
    if (old.length === 0) return;
    if (blobEnabled()) await del(old);
    else await Promise.all(old.map((k) => rm(localPath(k), { force: true })));
  } catch {
    // pruning is housekeeping; never fail a save over it
  }
}

export async function listVersions(limit = 60): Promise<Version[]> {
  const keys = (await historyKeys()).sort().reverse().slice(0, limit);
  const records = await Promise.all(
    keys.map(async (k) => (await readJson<Version & { content: Content }>(k))?.value ?? null),
  );
  return records
    .filter((r): r is Version & { content: Content } => r !== null)
    .map(({ id, revision, savedAt, savedBy, note }) => ({ id, revision, savedAt, savedBy, note }));
}

export async function readVersion(id: string): Promise<Content | null> {
  if (!/^[0-9]{6}-[0-9]{10,}$/.test(id)) return null;
  const found = await readJson<{ content: Content }>(`${HISTORY}${id}.json`);
  return found ? found.value.content : null;
}

/* ---------------------------------------------------------- plain files */

/** Reads a JSON file that isn't concurrency-sensitive (caches, settings). */
export async function readJsonFile<T>(key: string): Promise<T | null> {
  try {
    return (await readJson<T>(key))?.value ?? null;
  } catch (err) {
    console.error("academy readJsonFile", key, err);
    return null;
  }
}

/** Overwrites a JSON file, last write wins. */
export async function writeJsonFile(key: string, value: unknown) {
  if (!blobEnabled()) {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(localPath(key), JSON.stringify(value));
    return;
  }
  await put(key, JSON.stringify(value), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
