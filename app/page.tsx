import type { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  title: "PVA Media | Marketing for Trades and Home Services",
  description:
    "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger. Local SEO, paid ads and AI automation, backed by websites built to convert.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
