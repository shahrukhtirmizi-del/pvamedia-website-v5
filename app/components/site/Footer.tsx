import Link from "next/link";
import Logo from "../Logo";
import { SITE, NAV } from "../../lib/site";

const LEGAL = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="PVA Media, back to home" className="inline-block transition-opacity hover:opacity-70">
              <Logo className="h-5 w-auto" />
            </Link>
            <p className="mt-5 max-w-[34ch] text-[15px]" style={{ color: "var(--ink-60)" }}>
              Websites, local SEO and AI receptionists built only for landscaping companies.
            </p>
          </div>

          <div>
            <h2 className="font-mono mb-5 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-45)" }}>
              Site
            </h2>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href="/bookings">Book a free call</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono mb-5 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--ink-45)" }}>
              Contact
            </h2>
            <ul className="space-y-3">
              <li>
                <FooterLink href={`mailto:${SITE.email}`}>{SITE.email}</FooterLink>
              </li>
              <li>
                <FooterLink href={`tel:${SITE.phoneHref}`}>{SITE.phone}</FooterLink>
              </li>
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-2 border-t pt-7 text-[13px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--line)", color: "var(--ink-45)" }}
        >
          <p>
            {"©"} {year} {SITE.name}. All rights reserved.
          </p>
          <p>Built for landscapers across the United States.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("mailto:") || href.startsWith("tel:");
  const className =
    "text-[15px] transition-colors hover:text-[color:var(--ink)]";
  const style = { color: "var(--ink-60)" } as const;

  if (external) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}
