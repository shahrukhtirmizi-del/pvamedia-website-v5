import Link from "next/link";
import Reveal from "./components/ui/Reveal";
import { NAV } from "./lib/site";

export const metadata = {
  title: "Page not found",
  description: "That page does not exist. Here is the way back.",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">

      <div className="relative mx-auto flex min-h-[78vh] max-w-[760px] flex-col items-center justify-center px-5 py-24 text-center md:px-8">
        <Reveal>
          <p
            className="font-mono mb-7 text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ink-45)" }}
          >
            Error 404
          </p>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: "clamp(34px, 5.6vw, 62px)", lineHeight: 1.05 }}
          >
            This page is not here
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p
            className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-relaxed md:text-[18px]"
            style={{ color: "var(--ink-60)" }}
          >
            The link may be out of date, or the address slightly off. Everything on the site is one
            click away below.
          </p>
        </Reveal>

        <Reveal delay={170}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link href="/bookings" className="btn btn-secondary">
              Book a free call
            </Link>
          </div>
        </Reveal>

        <Reveal delay={230}>
          <nav aria-label="Site sections" className="mt-14 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] underline underline-offset-4 transition-colors hover:text-[color:var(--ink)]"
                style={{ color: "var(--ink-45)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
