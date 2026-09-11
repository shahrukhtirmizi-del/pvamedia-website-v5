import type { Metadata } from "next";
import HomePage from "../components/HomePage";

/**
 * The home page, opened at its ai receptionist section. The section router
 * scrolls there on arrival and keeps the address in step from then on. The
 * canonical stays on the home page, since this is the same document.
 */
export const metadata: Metadata = {
  title: "AI Receptionist",
  description: "An AI receptionist that answers every call and web enquiry, qualifies the job and books it in.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
