import type { Metadata } from "next";
import { Check } from "lucide-react";
import BookingFlow from "../components/BookingFlow";
import HeroBackdrop from "../components/fx/HeroBackdrop";
import Reveal from "../components/ui/Reveal";

const TITLE = "Book a free call";
const DESCRIPTION =
  "Book a free 30-minute call with our Lead Advisor. We’ll look at where your leads come from now and agree a lead target with you, backed by a 60-day money-back guarantee.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/bookings" },
  // set here so link previews do not fall back to the site-wide copy
  openGraph: { title: `${TITLE} | PVA Media`, description: DESCRIPTION, url: "/bookings" },
  twitter: { title: `${TITLE} | PVA Media`, description: DESCRIPTION },
};

const TICKS = [
  "Your ad accounts and data are yours from day one",
  "Month to month, 30 days’ notice",
  "Free 30-minute call",
];

export default function BookingsPage() {
  return (
    <section className="relative">
      {/* the same ink field as the rest of the site, in its quiet mode */}
      <HeroBackdrop subtle />

      {/* phones read headline, form, then reassurance; desktop puts the form in its own column */}
      <div className="relative mx-auto grid max-w-[1240px] gap-6 px-5 pt-6 pb-20 md:px-8 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-0">
        <Reveal className="min-w-0 lg:col-start-1 lg:row-start-1">
          <h1
            className="font-display max-w-[14ch] font-semibold"
            style={{ fontSize: "clamp(34px, 5.6vw, 64px)", lineHeight: 1.05 }}
          >
            More customers for your business.
          </h1>
          <p
            className="mt-3 max-w-[42ch] text-[16px] leading-relaxed md:mt-7 md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            Book a free 30-minute call with our Lead Advisor. We{"’"}ll look at where your leads come
            from now and agree a lead target with you.
          </p>
        </Reveal>

        <Reveal delay={80} className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <BookingFlow />
        </Reveal>

        <Reveal delay={140} className="min-w-0 lg:col-start-1 lg:row-start-2">
          <div
            className="max-w-[46ch] p-6 lg:mt-11"
            style={{ borderRadius: "var(--radius-tile)", border: "1px solid var(--line-strong)" }}
          >
            <h2 className="font-display text-[19px] font-semibold">60-day money-back guarantee</h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ink-60)" }}>
              On the call we agree a lead target with you and write it into your contract. A lead is a
              call, form or text from a potential customer. Miss it within 60 days of your ads going
              live and we refund every agency fee you{"’"}ve paid. Your ad spend goes from your card
              straight to Google and Meta, so it isn{"’"}t part of the refund. It applies to every
              package, and there{"’"}s nothing extra you need to do to qualify.
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {TICKS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px]">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-1 shrink-0"
                  style={{ color: "var(--accent)" }}
                />
                <span style={{ color: "var(--ink-80)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
