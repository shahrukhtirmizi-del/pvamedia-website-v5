import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its results section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Results",
  description:
    "What clients say about working with PVA Media as their growth partner, and the industry benchmarks behind the PVA Growth System.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
