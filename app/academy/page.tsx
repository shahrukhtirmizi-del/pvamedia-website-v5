import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE, readSession } from "./auth";
import { BOOKING_LINK, CALL_FLOW, DAILY_STANDARD, STAGES } from "./content";
import AcademyLogin from "./AcademyLogin";
import Academy from "./Academy";

/**
 * Setter Academy: internal training for PVA's setters.
 *
 * Reached by direct link only. Not in the nav, footer or sitemap, blocked in
 * robots.txt and marked noindex. The training content is rendered on the
 * server and only sent once someone has logged in, so viewing the page
 * source while logged out shows the login form and nothing else.
 */
export const metadata: Metadata = {
  title: "Setter Academy",
  description: "Internal training for the PVA Media team.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const name = readSession((await cookies()).get(COOKIE)?.value);

  if (!name) return <AcademyLogin />;

  return (
    <Academy
      name={name}
      stages={STAGES}
      standard={DAILY_STANDARD}
      flow={CALL_FLOW}
      bookingLink={BOOKING_LINK}
    />
  );
}
