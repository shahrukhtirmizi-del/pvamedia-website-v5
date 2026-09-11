import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its pricing section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Pricing",
  description: "AI Receptionist plans: Standard at $647 a month and Premium at $797 a month.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
