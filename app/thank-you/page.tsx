import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Reveal from "../components/ui/Reveal";
import { SITE } from "../lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry has reached PVA Media. We reply the same working day.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <section className="relative overflow-hidden">

      <div className="relative mx-auto flex min-h-[74vh] max-w-[760px] flex-col items-center justify-center px-5 py-24 text-center md:px-8">
        <Reveal>
          <span
            className="mb-9 grid h-14 w-14 place-items-center rounded-full"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            <Check size={24} strokeWidth={2} />
          </span>
        </Reveal>

        <Reveal delay={90}>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: "clamp(34px, 5.4vw, 60px)", lineHeight: 1.06 }}
          >
            That is with us
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p
            className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            We reply the same working day, usually within a couple of hours. If it is urgent, call
            or email and you will get a person.
          </p>
        </Reveal>

        <Reveal delay={230}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link href="/#work" className="btn btn-secondary">
              See the work
            </Link>
          </div>
        </Reveal>

        <Reveal delay={290}>
          <div
            className="mt-12 flex flex-col items-center gap-2 text-[15px] sm:flex-row sm:gap-8"
            style={{ color: "var(--ink-60)" }}
          >
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-[color:var(--ink)]">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneHref}`} className="transition-colors hover:text-[color:var(--ink)]">
              {SITE.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
