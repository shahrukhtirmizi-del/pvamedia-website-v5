import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its work section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Work",
  description: "The work: eight landscaping site directions, each built around the crew's own photography.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
