import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Setter Academy login. Server-side only: imported by page.tsx and
 * actions.ts, never by a client component.
 *
 * Each person has their own password. Vercel holds two env vars:
 *   ACADEMY_USERS   JSON map of sha256(password) -> display name
 *   ACADEMY_SECRET  random string (32+ chars) that signs the session cookie
 * To add or remove someone, see scripts/academy-password.mjs. Removing a
 * name from ACADEMY_USERS logs that person out on their next page load.
 */

export const COOKIE = "pva_academy";
export const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

function users(): Record<string, string> {
  try {
    const parsed = JSON.parse(process.env.ACADEMY_USERS ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function secret(): string | null {
  const s = process.env.ACADEMY_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function isConfigured() {
  return secret() !== null && Object.keys(users()).length > 0;
}

/** The display name for a password, or null if it isn't one of ours. */
export function nameForPassword(password: string): string | null {
  return users()[sha256(password)] ?? null;
}

const mac = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export function createSession(name: string): string {
  const key = secret();
  if (!key) throw new Error("ACADEMY_SECRET is not set");
  const payload = `${Buffer.from(name, "utf8").toString("base64url")}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${mac(payload, key)}`;
}

/** The logged-in name, or null if the cookie is missing, forged, expired or revoked. */
export function readSession(token: string | undefined): string | null {
  const key = secret();
  if (!token || !key) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedName, expires, signature] = parts;

  const expected = Buffer.from(mac(`${encodedName}.${expires}`, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (!(Number(expires) > Date.now())) return null;

  const name = Buffer.from(encodedName, "base64url").toString("utf8");
  return Object.values(users()).includes(name) ? name : null;
}
