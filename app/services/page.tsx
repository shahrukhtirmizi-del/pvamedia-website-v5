import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its packages section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Packages",
  description:
    "What each package from your growth partner includes: advertising, websites, a 24/7 virtual receptionist, instant replies and follow-up, and reporting, run as one system.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
