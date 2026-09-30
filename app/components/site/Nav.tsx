"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import Logo from "../Logo";
import { NAV, SITE } from "../../lib/site";

/**
 * The bar: logo left; phone, the booking button and a MENU toggle right.
 *
 * The menu is a full-screen "drape": one SVG sheet falls from the top with a
 * soft bulge and settles flat, then the big link words slide in from the
 * right and the contact column rises. Closing pulls the sheet away the same
 * way. Adapted from the client-supplied Morphing Overlay reference, with its
 * GSAP-free morph kept (one rAF loop writes the path) and its demo fonts,
 * colours and placeholder links replaced with the site's own.
 */

const W = 1131;
const H = 861;
const CX = W / 2;
const MORPH_MS = 1050;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pow4in = (t: number) => t * t * t * t;
const pow4out = (t: number) => 1 - Math.pow(1 - t, 4);
const pow3in = (t: number) => t * t * t;
const pow3out = (t: number) => 1 - Math.pow(1 - t, 3);

// the sheet dropping in from the top: bottom edge and control point sweep down
const openPath = (t: number) => {
  let by: number, cy: number;
  if (t < 0.5) {
    const u = pow4in(t / 0.5);
    by = lerp(0, 345, u);
    cy = lerp(0, 620, u);
  } else {
    const u = pow4out((t - 0.5) / 0.5);
    by = lerp(345, H, u);
    cy = lerp(620, H, u);
  }
  return `M${W},${by.toFixed(1)} Q${CX},${cy.toFixed(1)} 0,${by.toFixed(1)} L0,0 L${W},0 Z`;
};

// the sheet retreating: top edge and control point sweep down to the floor
const closePath = (t: number) => {
  let ty: number, cy: number;
  if (t < 0.5) {
    const u = pow3in(t / 0.5);
    ty = lerp(0, 350, u);
    cy = lerp(0, 130, u);
  } else {
    const u = pow3out((t - 0.5) / 0.5);
    ty = lerp(350, H, u);
    cy = lerp(130, H, u);
  }
  return `M${W},${ty.toFixed(1)} Q${CX},${cy.toFixed(1)} 0,${ty.toFixed(1)} L0,${H} L${W},${H} Z`;
};

const HIDDEN = `M${W},0 Q${CX},0 0,0 L0,0 L${W},0 Z`;
const FULL = `M${W},${H} Q${CX},${H} 0,${H} L0,0 L${W},0 Z`;

const MENU_LINKS = [
  ...NAV.map((item) => ({ label: item.label.toLowerCase(), href: item.href })),
  { label: "book a call", href: "/bookings" },
];

type LenisLike = { stop?: () => void; start?: () => void };

function lockScroll(locked: boolean) {
  const lenis = window.__lenis as unknown as LenisLike | undefined;
  if (locked) {
    lenis?.stop?.();
    document.body.style.overflow = "hidden";
  } else {
    lenis?.start?.();
    document.body.style.overflow = "";
  }
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef(0);
  const busyRef = useRef(false);
  const openRef = useRef(false);

  // one morph, open or close, written straight to the path
  const morph = useCallback((opening: boolean) => {
    cancelAnimationFrame(rafRef.current);
    const el = pathRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("d", opening ? FULL : HIDDEN);
      busyRef.current = false;
      return;
    }
    busyRef.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp01((now - start) / MORPH_MS);
      el.setAttribute("d", opening ? openPath(t) : closePath(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else {
        if (!opening) el.setAttribute("d", HIDDEN);
        busyRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const setMenu = useCallback(
    (next: boolean, force = false) => {
      if (next === openRef.current) return;
      if (busyRef.current && !force) return;
      openRef.current = next;
      setOpen(next);
      lockScroll(next);
      morph(next);
    },
    [morph],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false, true);
    };
    // Links in the menu close it before anything else sees the click. The
    // section router handles section links in the document's capture phase
    // and stops them there, so listening on window (which captures first)
    // is the only way to hear them; the scroll lock is released before the
    // router starts its scroll.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest("[data-menu-link]")) setMenu(false, true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick, true);
    };
  }, [open, setMenu]);

  // never leave the page locked if the nav unmounts mid-open
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      if (openRef.current) lockScroll(false);
    },
    [],
  );

  let charIndex = 0;

  return (
    <header
      data-site-nav
      data-menu-open={open || undefined}
      className="sticky top-0 z-50"
      style={{
        // a fade from the page ground rather than a bar: the nav stays
        // legible over anything that scrolls under it and still reads as
        // part of the page. Dropped while the menu sheet is down.
        background: open
          ? "transparent"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(255, 255, 255, 0) 100%)",
        paddingBottom: 14,
        marginBottom: -14,
        pointerEvents: "none",
        transition: "background 0.3s ease",
        // while open, sit above the cookie banner (z-70) but still under the
        // custom cursor layers (z-115/120)
        zIndex: open ? 110 : undefined,
      }}
    >
      <style>{css}</style>

      <div
        className="relative z-10 mx-auto flex h-[64px] max-w-[1240px] items-center justify-between px-5 md:h-[72px] md:px-8"
        style={{ pointerEvents: "auto" }}
      >
        <Link
          href="/"
          aria-label="PVA Media, back to home"
          data-menu-link={open || undefined}
          className="shrink-0 transition-[opacity,color] duration-300 hover:opacity-70"
          style={{ color: open ? "#FFFFFF" : "var(--ink)" }}
        >
          <Logo className="h-[18px] w-auto md:h-5" />
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden items-center gap-2 text-[13px] font-medium transition-colors duration-300 md:inline-flex"
            style={{ color: open ? "#FFFFFF" : "var(--ink-80)" }}
          >
            <Phone size={14} strokeWidth={1.8} aria-hidden />
            {SITE.phone}
          </a>

          <Link
            href="/bookings"
            data-menu-link={open || undefined}
            className="btn hidden !px-5 !py-3 !text-[13px] sm:inline-flex"
            style={
              open
                ? { background: "#FFFFFF", color: "#0A0A0A" }
                : { background: "var(--ink)", color: "var(--bg)" }
            }
          >
            Book a free call
          </Link>

          <button
            type="button"
            className={`dm-toggle${open ? " is-open" : ""}`}
            onClick={() => setMenu(!openRef.current)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="dm-toggle-open" aria-hidden>
              Menu
            </span>
            <span className="dm-toggle-close" aria-hidden>
              Close
            </span>
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        className={`dm-menu${open ? " is-open" : ""}`}
        inert={!open}
        aria-hidden={!open}
      >
        <svg className="dm-bg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
          <path ref={pathRef} d={HIDDEN} fill="#0A0A0A" />
        </svg>

        <div className="dm-inner">
          <div className="dm-col dm-info">
            <p>Get in touch</p>
            <h3>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </h3>
            <h3>
              <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            </h3>
            <h6>{SITE.name}</h6>
            <h6>Marketing for trades and home services</h6>
          </div>

          <nav className="dm-col dm-links" aria-label="Site">
            {MENU_LINKS.map((link) => (
              <Link key={link.href} href={link.href} data-menu-link aria-label={link.label}>
                {link.label.split("").map((ch, i) => {
                  const delay = 0.45 + charIndex++ * 0.012;
                  return (
                    <span
                      key={i}
                      className="dm-char"
                      aria-hidden
                      // delays only on the way in, so closing is immediate
                      style={{ transitionDelay: open ? `${delay}s` : "0s" }}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  );
                })}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

const css = `
  .dm-toggle{position:relative;width:4.4rem;height:2rem;padding:0;border:0;
    background:none;cursor:pointer;text-transform:uppercase;font-family:inherit;
    font-size:.72rem;font-weight:700;letter-spacing:.22em;}
  .dm-toggle span{position:absolute;top:50%;right:0;transform:translateY(-50%);
    transition:opacity .25s ease;}
  .dm-toggle-open{color:var(--ink);}
  .dm-toggle-close{color:#FFFFFF;opacity:0;}
  .dm-toggle.is-open .dm-toggle-open{opacity:0;}
  .dm-toggle.is-open .dm-toggle-close{opacity:1;transition-delay:.25s;}
  .dm-toggle:focus-visible{outline:1px solid currentColor;outline-offset:6px;}

  .dm-menu{position:fixed;inset:0;z-index:0;color:#FFFFFF;pointer-events:none;}
  .dm-menu.is-open{pointer-events:auto;}
  .dm-bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}

  .dm-inner{position:absolute;inset:0;display:flex;gap:2rem;
    padding:6.5rem clamp(1.25rem,4vw,2.5rem) clamp(1.5rem,4vw,2.5rem);}
  .dm-col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;min-width:0;}

  .dm-info p{margin:0 0 1rem;text-transform:uppercase;font-size:.7rem;font-weight:600;
    letter-spacing:.25em;color:rgba(255,255,255,.5);}
  .dm-info h3{margin:0;font-family:var(--font-display),var(--font-sans),sans-serif;
    font-weight:500;font-size:clamp(1.3rem,2.6vw,2.5rem);line-height:1.3;letter-spacing:-.02em;}
  .dm-info h3 a{color:inherit;text-decoration:none;transition:opacity .2s ease;}
  .dm-info h3 a:hover{opacity:.7;}
  .dm-info h6{margin:0;font-weight:400;font-size:clamp(.95rem,1.2vw,1.25rem);line-height:1.4;
    color:rgba(255,255,255,.6);}
  .dm-info h6:first-of-type{margin-top:1.4rem;}
  .dm-info p,.dm-info h3,.dm-info h6{opacity:0;transform:translateY(60px);
    transition:opacity .35s ease, transform .5s cubic-bezier(.16,1,.3,1);}
  .dm-menu.is-open .dm-info p{transition-delay:.5s;}
  .dm-menu.is-open .dm-info h3:nth-of-type(1){transition-delay:.57s;}
  .dm-menu.is-open .dm-info h3:nth-of-type(2){transition-delay:.64s;}
  .dm-menu.is-open .dm-info h6:nth-of-type(1){transition-delay:.71s;}
  .dm-menu.is-open .dm-info h6:nth-of-type(2){transition-delay:.78s;}
  .dm-menu.is-open .dm-info p,
  .dm-menu.is-open .dm-info h3,
  .dm-menu.is-open .dm-info h6{opacity:1;transform:translateY(0);
    transition:opacity .6s ease, transform .75s cubic-bezier(.16,1,.3,1);}

  .dm-links{align-items:flex-end;}
  .dm-links a{display:block;width:max-content;max-width:100%;color:#FFFFFF;text-decoration:none;
    font-family:var(--font-display),var(--font-sans),sans-serif;font-weight:700;
    font-size:clamp(2.6rem,6vw,5.6rem);line-height:1.12;letter-spacing:-.045em;
    overflow:hidden;transition:opacity .2s ease;}
  .dm-links a:hover{opacity:.6;}
  .dm-char{display:inline-block;transform:translateX(420%);opacity:0;
    transition:transform .45s ease, opacity .25s ease;}
  .dm-menu.is-open .dm-char{transform:translateX(0);opacity:1;
    transition:transform 1.15s cubic-bezier(.2,1.35,.28,1), opacity .55s ease;}

  @media (max-width:1000px){
    .dm-inner{flex-direction:column-reverse;justify-content:flex-end;gap:2.5rem;}
    .dm-links{flex:1.5;}
    .dm-info{flex:0 0 auto;}
  }

  @media (max-width:640px){
    .dm-links a{font-size:clamp(2.4rem,12vw,3.4rem);}
  }
`;
