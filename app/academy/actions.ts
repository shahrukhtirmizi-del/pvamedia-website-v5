"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, MAX_AGE, createSession, isConfigured, nameForPassword } from "./auth";

export type LoginState = { error: string | null };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/academy",
};

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const password = String(form.get("password") ?? "");
  if (!password) return { error: "Enter your password." };
  if (!isConfigured()) return { error: "The academy isn’t switched on yet. Message your manager." };

  const name = nameForPassword(password);
  if (!name) {
    // a short pause makes guessing slow without bothering a real person
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { error: "That password isn’t right. Try again." };
  }

  (await cookies()).set(COOKIE, createSession(name), { ...cookieOptions, maxAge: MAX_AGE });
  redirect("/academy");
}

export async function logout() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  redirect("/academy");
}
