import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its services section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "Services",
  description: "Specialist marketing, websites, an AI receptionist and AI automation agents for trades and home service companies.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
