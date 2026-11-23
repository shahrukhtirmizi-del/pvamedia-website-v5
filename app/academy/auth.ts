import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { readUsers, type StoredUser } from "./store";
import type { Member, Viewer } from "./types";

/**
 * Setter Academy accounts. Server-side only.
 *
 * Passwords are stored as scrypt hashes. The login cookie is signed with
 * ACADEMY_SECRET and carries the person's id and session version: changing
 * or resetting a password bumps the version, which signs out every other
 * device, and removing a person ends their session on the next page load.
 */

export const COOKIE = "pva_academy";
export const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const scrypt = promisify(scryptCb) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const hash = await scrypt(password, salt, 32);
  return `scrypt$${salt}$${hash.toString("base64url")}`;
}

export async function checkPassword(password: string, stored: string): Promise<boolean> {
  const [kind, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scrypt(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Lowercase letters, numbers, dots, dashes and underscores. */
export const normaliseUsername = (u: string) => u.trim().toLowerCase();
export const validUsername = (u: string) => /^[a-z0-9._-]{2,32}$/.test(u);

function secret(): string | null {
  const s = process.env.ACADEMY_SECRET;
  return s && s.length >= 32 ? s : null;
}
export const isConfigured = () => secret() !== null;

const mac = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export function sessionToken(user: StoredUser): string {
  const key = secret();
  if (!key) throw new Error("ACADEMY_SECRET is not set");
  const payload = `${Buffer.from(user.id).toString("base64url")}.${user.sessionVersion}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${mac(payload, key)}`;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/academy",
  maxAge: MAX_AGE,
};

function parse(token: string | undefined): { id: string; version: number } | null {
  const key = secret();
  if (!token || !key) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [id, version, expires, signature] = parts;
  const expected = Buffer.from(mac(`${id}.${version}.${expires}`, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (!(Number(expires) > Date.now())) return null;
  return { id: Buffer.from(id, "base64url").toString("utf8"), version: Number(version) };
}

/** The logged-in person, checked against the current team list. */
export async function currentUser(): Promise<StoredUser | null> {
  const session = parse((await cookies()).get(COOKIE)?.value);
  if (!session) return null;
  const { value: users } = await readUsers();
  const user = users.find((u) => u.id === session.id);
  return user && user.sessionVersion === session.version ? user : null;
}

export const toViewer = (u: StoredUser): Viewer => ({
  id: u.id,
  name: u.name,
  username: u.username,
  role: u.role,
  starter: u.starter,
});

export const toMember = (u: StoredUser): Member => ({
  id: u.id,
  username: u.username,
  name: u.name,
  role: u.role,
  starter: u.starter,
  createdAt: u.createdAt,
  lastLoginAt: u.lastLoginAt,
});
