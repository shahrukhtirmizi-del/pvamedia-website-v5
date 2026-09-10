import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE.domain}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.domain}/bookings`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.domain}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.domain}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
