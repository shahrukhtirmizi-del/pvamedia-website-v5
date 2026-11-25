import type { Metadata } from "next";
import HomePage from "./components/HomePage";
import { SITE } from "./lib/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
