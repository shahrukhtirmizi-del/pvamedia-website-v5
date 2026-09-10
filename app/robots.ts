import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/thank-you" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
