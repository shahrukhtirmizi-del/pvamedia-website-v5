"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "../Logo";
import { NAV } from "../../lib/site";

/**
 * One line at every desktop width, 72px tall, collapsing to a full-height
 * sheet under md. Each link's underline draws itself in from the left on
 * hover rather than switching colour.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        // a fade from the page ground rather than a bar: the nav stays
        // legible over anything that scrolls under it and still reads as
        // part of the page. No blur, which also spares the GPU a
        // re-blur on every frame the atmosphere moves.
        background:
          "linear-gradient(180deg, rgba(7, 7, 7,0.92) 0%, rgba(7, 7, 7,0.7) 60%, rgba(7, 7, 7,0) 100%)",
        paddingBottom: 14,
        marginBottom: -14,
        pointerEvents: "none",
      }}
    >
      <div className="mx-auto flex h-[64px] max-w-[1240px] items-center justify-between px-5 md:h-[72px] md:px-8" style={{ pointerEvents: "auto" }}>
        <Link
          href="/"
          aria-label="PVA Media, back to home"
          className="shrink-0 transition-opacity hover:opacity-70"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-[18px] w-auto md:h-5" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/bookings" className="btn btn-primary hidden sm:inline-flex !px-5 !py-3 !text-[13px]">
            Book a free call
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border transition-colors lg:hidden"
            style={{ borderColor: "var(--line-strong)" }}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden"
        style={{
          pointerEvents: "auto",
          borderTop: "1px solid var(--line)",
          background: "rgba(7, 7, 7,0.98)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <nav className="mx-auto flex max-w-[1240px] flex-col px-5 py-6" aria-label="Mobile">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display border-b py-4 text-[22px] font-medium transition-opacity hover:opacity-60"
              style={{
                borderColor: "var(--line)",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.4s ease ${i * 55}ms, transform 0.4s ease ${i * 55}ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bookings"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-7 w-full"
          >
            Book a free call
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative py-1 text-[14px] transition-colors"
      style={{ color: hovered ? "var(--ink)" : "var(--ink-60)" }}
    >
      {label}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px"
        style={{
          width: hovered ? "100%" : "0%",
          background: "var(--accent)",
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </Link>
  );
}
