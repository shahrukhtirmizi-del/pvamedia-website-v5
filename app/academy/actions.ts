"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE,
  checkPassword,
  cookieOptions,
  currentUser,
  hashPassword,
  isConfigured,
  normaliseUsername,
  sessionToken,
  toMember,
  validUsername,
} from "./auth";
import { sanitizeContent } from "./sanitize";
import { ConflictError, listVersions, readContent, readUsers, readVersion, updateUsers, writeContent, type StoredUser } from "./store";
import { JustCallError, fetchAgents, justCallConfigured, type JcAgent } from "./justcall";
import { buildScoreboard, readSettings, writeSettings } from "./scoreboard";
import type { Content, Member, Result, Role, Scoreboard, ScoreSettings, Version } from "./types";

/* Every action checks who is calling. Rendering a button only for admins is
   not a security boundary: anyone can post to an action directly. */

const fail = (error: string): Result<never> => ({ ok: false, error });
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
const CONFLICT = "Someone else saved a change a moment ago. Reload the page to get their version, then make your edit again.";

async function requireAdmin(): Promise<StoredUser | null> {
  const user = await currentUser();
  return user && user.role === "admin" ? user : null;
}

/* ------------------------------------------------------------------ login */

export type LoginState = { error: string | null; username: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const username = normaliseUsername(String(form.get("username") ?? ""));
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password.", username };
  if (!isConfigured()) return { error: "The academy isn’t switched on yet. Message your manager.", username };

  const { value: users } = await readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !(await checkPassword(password, user.password))) {
    // a short pause makes guessing slow without bothering a real person
    await pause(800);
    return { error: "That username or password isn’t right. Passwords are case-sensitive.", username };
  }

  try {
    await updateUsers((all) => all.map((u) => (u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u)));
  } catch {
    // last-login time is nice to have; never block a login over it
  }
  (await cookies()).set(COOKIE, sessionToken(user), cookieOptions);
  redirect("/academy");
}

export async function logout() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  redirect("/academy");
}

/* ---------------------------------------------------------------- account */

export async function changePassword(current: string, next: string): Promise<Result> {
  const user = await currentUser();
  if (!user) return fail("You’ve been logged out. Log in again.");
  if (!(await checkPassword(current, user.password))) {
    await pause(600);
    return fail("Your current password isn’t right.");
  }
  if (next.length < 8) return fail("Use at least 8 characters for the new password.");
  if (next.length > 200) return fail("That password is too long.");
  if (next === current) return fail("The new password has to be different from the current one.");

  const hash = await hashPassword(next);
  const users = await updateUsers((all) =>
    all.map((u) =>
      u.id === user.id ? { ...u, password: hash, starter: false, sessionVersion: u.sessionVersion + 1 } : u,
    ),
  );
  // other devices are signed out; this one gets a fresh cookie
  const updated = users.find((u) => u.id === user.id)!;
  (await cookies()).set(COOKIE, sessionToken(updated), cookieOptions);
  return { ok: true, data: undefined };
}

/* ---------------------------------------------------------------- content */

export async function saveContent(raw: unknown, baseRevision: number, note: string): Promise<Result<Content>> {
  const admin = await requireAdmin();
  if (!admin) return fail("Only admins can change the training.");
  const clean = sanitizeContent(raw);
  if (!clean) return fail("That change couldn’t be read. Reload the page and try again.");
  try {
    const saved = await writeContent(clean, baseRevision, admin.name, String(note).slice(0, 200) || "Edited the training");
    return { ok: true, data: saved };
  } catch (err) {
    if (err instanceof ConflictError) return fail(CONFLICT);
    console.error("academy saveContent", err);
    return fail("The change didn’t save. Try again in a moment.");
  }
}

export async function getVersions(): Promise<Result<Version[]>> {
  if (!(await requireAdmin())) return fail("Only admins can see the history.");
  try {
    return { ok: true, data: await listVersions() };
  } catch (err) {
    console.error("academy getVersions", err);
    return fail("The history couldn’t be loaded.");
  }
}

export async function getVersion(id: string): Promise<Result<Content>> {
  if (!(await requireAdmin())) return fail("Only admins can see the history.");
  const content = await readVersion(String(id));
  return content ? { ok: true, data: content } : fail("That version couldn’t be found.");
}

export async function restoreVersion(id: string, baseRevision: number): Promise<Result<Content>> {
  const admin = await requireAdmin();
  if (!admin) return fail("Only admins can restore versions.");
  const old = await readVersion(String(id));
  if (!old) return fail("That version couldn’t be found.");
  try {
    const saved = await writeContent(old, baseRevision, admin.name, `Restored revision ${old.revision}`);
    return { ok: true, data: saved };
  } catch (err) {
    if (err instanceof ConflictError) return fail(CONFLICT);
    console.error("academy restoreVersion", err);
    return fail("The restore didn’t save. Try again in a moment.");
  }
}

/* ------------------------------------------------------------------- team */

type MemberInput = { name: string; username: string; role: Role };

function cleanMember(input: MemberInput): MemberInput | string {
  const name = String(input.name ?? "").trim().slice(0, 60);
  const username = normaliseUsername(String(input.username ?? ""));
  const role: Role = input.role === "admin" ? "admin" : "setter";
  if (!name) return "Add their name.";
  if (!validUsername(username)) return "Usernames are 2 to 32 characters: letters, numbers, dots, dashes or underscores.";
  return { name, username, role };
}

const adminsIn = (users: StoredUser[]) => users.filter((u) => u.role === "admin").length;

async function teamChange(change: (users: StoredUser[], admin: StoredUser) => StoredUser[] | string): Promise<Result<Member[]>> {
  const admin = await requireAdmin();
  if (!admin) return fail("Only admins can manage the team.");
  let problem = null as string | null;
  try {
    const users = await updateUsers((all) => {
      const out = change(all, admin);
      if (typeof out === "string") {
        problem = out;
        return all;
      }
      return out;
    });
    if (problem) return fail(problem);
    return { ok: true, data: users.map(toMember) };
  } catch (err) {
    console.error("academy team", err);
    return fail("That change didn’t save. Try again in a moment.");
  }
}

/** Starter password: their first name with a capital, then 123 (Dano123). */
const starterPassword = (name: string) => {
  const first = name.trim().split(/\s+/)[0].replace(/[^A-Za-z0-9]/g, "") || "Setter";
  return `${first.charAt(0).toUpperCase()}${first.slice(1)}123`;
};

export async function addMember(input: MemberInput, password: string): Promise<Result<{ members: Member[]; password: string }>> {
  if (!(await requireAdmin())) return fail("Only admins can manage the team.");
  const clean = cleanMember(input);
  if (typeof clean === "string") return fail(clean);
  const pw = String(password ?? "").trim() || starterPassword(clean.name);
  if (pw.length < 6) return fail("Use a password of at least 6 characters.");
  const hash = await hashPassword(pw);
  const res = await teamChange((all) => {
    if (all.some((u) => u.username === clean.username)) return `Someone already has the username “${clean.username}”.`;
    return [
      ...all,
      {
        id: `u-${randomUUID().slice(0, 8)}`,
        ...clean,
        password: hash,
        starter: true,
        sessionVersion: 1,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
      },
    ];
  });
  return res.ok ? { ok: true, data: { members: res.data, password: pw } } : res;
}

export async function updateMember(id: string, input: MemberInput): Promise<Result<Member[]>> {
  const clean = cleanMember(input);
  if (typeof clean === "string") return fail(clean);
  return teamChange((all) => {
    const target = all.find((u) => u.id === id);
    if (!target) return "That person isn’t on the team any more.";
    if (all.some((u) => u.id !== id && u.username === clean.username)) return `Someone already has the username “${clean.username}”.`;
    if (target.role === "admin" && clean.role !== "admin" && adminsIn(all) === 1) return "There has to be at least one admin.";
    return all.map((u) => (u.id === id ? { ...u, ...clean } : u));
  });
}

export async function resetPassword(id: string, password: string): Promise<Result<{ members: Member[]; password: string }>> {
  if (!(await requireAdmin())) return fail("Only admins can manage the team.");
  const { value: users } = await readUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return fail("That person isn’t on the team any more.");
  const pw = String(password ?? "").trim() || starterPassword(target.name);
  if (pw.length < 6) return fail("Use a password of at least 6 characters.");
  const hash = await hashPassword(pw);
  const res = await teamChange((all) =>
    all.map((u) => (u.id === id ? { ...u, password: hash, starter: true, sessionVersion: u.sessionVersion + 1 } : u)),
  );
  return res.ok ? { ok: true, data: { members: res.data, password: pw } } : res;
}

export async function removeMember(id: string): Promise<Result<Member[]>> {
  return teamChange((all, admin) => {
    const target = all.find((u) => u.id === id);
    if (!target) return "That person isn’t on the team any more.";
    if (target.id === admin.id) return "You can’t remove yourself. Ask another admin.";
    if (target.role === "admin" && adminsIn(all) === 1) return "There has to be at least one admin.";
    return all.filter((u) => u.id !== id);
  });
}

/** Reads the live content again, for an editor that hit a conflict. */
export async function reloadContent(): Promise<Result<Content>> {
  if (!(await currentUser())) return fail("You’ve been logged out. Log in again.");
  return { ok: true, data: await readContent() };
}

/* ------------------------------------------------------------- scoreboard */

export async function getScoreboard(weekOffset: number): Promise<Result<Scoreboard>> {
  const user = await currentUser();
  if (!user) return fail("You’ve been logged out. Log in again.");
  try {
    const { value: users } = await readUsers();
    const offset = Number.isInteger(weekOffset) ? weekOffset : 0;
    return { ok: true, data: await buildScoreboard(users, offset, user.role === "admin") };
  } catch (err) {
    console.error("academy getScoreboard", err);
    return fail("The scoreboard couldn’t be loaded. Try again in a moment.");
  }
}

export type ScoreSetup = { settings: ScoreSettings; agents: JcAgent[]; agentsError: string | null; connected: boolean };

export async function getScoreSetup(): Promise<Result<ScoreSetup>> {
  if (!(await requireAdmin())) return fail("Only admins can change the scoreboard.");
  const settings = await readSettings();
  if (!justCallConfigured()) return { ok: true, data: { settings, agents: [], agentsError: "JustCall isn’t connected yet.", connected: false } };
  try {
    return { ok: true, data: { settings, agents: await fetchAgents(), agentsError: null, connected: true } };
  } catch (err) {
    const message = err instanceof JustCallError ? err.message : "JustCall couldn’t be reached.";
    return { ok: true, data: { settings, agents: [], agentsError: message, connected: true } };
  }
}

export async function saveScoreSettings(input: ScoreSettings): Promise<Result<ScoreSettings>> {
  if (!(await requireAdmin())) return fail("Only admins can change the scoreboard.");
  const target = Number(input.targetPerDay);
  const seconds = Number(input.conversationSeconds);
  const days = Array.isArray(input.workingDays) ? [...new Set(input.workingDays.map(Number))].filter((d) => d >= 0 && d <= 6) : [];
  const words = Array.isArray(input.bookingWords)
    ? input.bookingWords.map((w) => String(w).trim().slice(0, 60)).filter(Boolean).slice(0, 20)
    : [];
  if (!(target >= 0 && target <= 100)) return fail("The daily target has to be between 0 and 100.");
  if (!(seconds >= 0 && seconds <= 3600)) return fail("The conversation length has to be between 0 and 3600 seconds.");
  if (days.length === 0) return fail("Pick at least one working day.");
  if (words.length === 0) return fail("Add at least one word that marks a booking.");
  const links: Record<string, string[]> = {};
  const { value: users } = await readUsers();
  for (const u of users) {
    const ids = input.links?.[u.id];
    if (Array.isArray(ids)) links[u.id] = ids.map((x) => String(x).slice(0, 40)).filter(Boolean).slice(0, 10);
  }
  const clean: ScoreSettings = { targetPerDay: target, conversationSeconds: Math.round(seconds), workingDays: days.sort(), bookingWords: words, links };
  try {
    await writeSettings(clean);
    return { ok: true, data: clean };
  } catch (err) {
    console.error("academy saveScoreSettings", err);
    return fail("The settings didn’t save. Try again in a moment.");
  }
}
