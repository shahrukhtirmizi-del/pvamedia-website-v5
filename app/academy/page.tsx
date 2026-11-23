import type { Metadata } from "next";
import { currentUser, toMember, toViewer } from "./auth";
import { readContent, readUsers } from "./store";
import AcademyLogin from "./AcademyLogin";
import Academy from "./Academy";

/**
 * Setter Academy: internal training for PVA's setters, editable by admins.
 *
 * Reached by direct link only. Not in the nav, footer or sitemap, blocked in
 * robots.txt and marked noindex. Everything is rendered on the server after
 * the login check, so a logged-out visitor gets the login form and nothing
 * else; the team list only reaches admins.
 */
export const metadata: Metadata = {
  title: "Setter Academy",
  description: "Internal training for the PVA Media team.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const user = await currentUser();
  if (!user) return <AcademyLogin />;

  const [content, members] = await Promise.all([
    readContent(),
    user.role === "admin" ? readUsers().then((r) => r.value.map(toMember)) : Promise.resolve(null),
  ]);

  return <Academy viewer={toViewer(user)} content={content} members={members} />;
}
