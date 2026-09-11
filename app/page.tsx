import type { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  title: "PVA Media | Websites and Local SEO for Landscapers",
  description:
    "We take landscapers from 3 booked jobs a month to 12, without lifting a finger. Custom websites, local SEO, paid ads and AI receptionists, live in 5 days.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
