import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PVA Media — Websites & Marketing for Landscapers",
  description: "We take landscapers from 3 booked jobs a month to 12, without lifting a finger.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
