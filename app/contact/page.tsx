import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its contact section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free 30 minute call with PVA Media.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
