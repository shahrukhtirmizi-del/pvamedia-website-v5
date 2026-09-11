"use client";

import { useEffect } from "react";
import { afterIntro } from "../../lib/intro";
import { SECTION_ROUTES, sectionForPath } from "../../lib/sections";

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
      resize: () => void;
    };
  }
}

/**
 * Scroll to a section, through Lenis when it is running. The nav offset comes
 * from the page's scroll-padding-top, which Lenis honours on its own, so no
 * offset is passed here.
 */
export function scrollToSection(id: string) {
  if (id === "top") {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    // after a route change the document height has changed under Lenis
    window.__lenis.resize();
    window.__lenis.scrollTo(el, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Ties the address bar to the home page's sections.
 *
 *  - Landing on /pricing (or any section route) scrolls to that section once
 *    the intro has handed over.
 *  - Clicking a link to a section route while the home page is on screen
 *    scrolls there instead of reloading, and writes the address.
 *  - As sections pass the middle of the viewport, the address updates to
 *    match, through replaceState so the back button is not spammed.
 */
export default function SectionRouter() {
  useEffect(() => {
    // 1. arrive at the right section
    const landing = sectionForPath(window.location.pathname);
    let cancelLanding: (() => void) | null = null;
    // the address is not rewritten by scrolling until any landing scroll has
    // finished, otherwise the hero would flip /pricing back to / on arrival
    let settled = !landing || landing.id === "top";
    let settleTimer = 0;
    if (landing && landing.id !== "top") {
      cancelLanding = afterIntro(() => {
        // give the page one frame to settle its layout
        requestAnimationFrame(() => {
          scrollToSection(landing.id);
          // once more after the first paint settles, in case images or fonts
          // have moved the section since the first measurement
          window.setTimeout(() => scrollToSection(landing.id), 500);
          settleTimer = window.setTimeout(() => {
            settled = true;
          }, 2000);
        });
      });
    }

    // 2. section links scroll rather than navigate
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const route = sectionForPath(url.pathname);
      if (!route) return;
      // capture phase, and stop here, so Next's Link handler never sees it
      e.preventDefault();
      e.stopPropagation();
      scrollToSection(route.id);
      if (window.location.pathname !== route.path) {
        window.history.replaceState(null, "", route.path);
      }
    }
    document.addEventListener("click", onClick, true);

    // 3. the address follows the scroll
    const targets: { path: string; el: HTMLElement }[] = [];
    for (const route of SECTION_ROUTES) {
      if (route.id === "top") continue;
      const el = document.getElementById(route.id);
      if (el) targets.push({ path: route.path, el });
    }

    let current: string = landing?.path ?? "/";
    const io = new IntersectionObserver(
      (entries) => {
        // the entry whose top sits highest inside the band wins
        let best: { path: string; top: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const path = targets.find((t) => t.el === entry.target)!.path;
          const top = entry.boundingClientRect.top;
          if (!best || top > best.top) best = { path, top };
        }
        if (!best || !settled) return;
        if (best.path !== current) {
          current = best.path;
          window.history.replaceState(null, "", best.path);
        }
      },
      { rootMargin: "-38% 0px -50% 0px", threshold: 0 }
    );
    for (const t of targets) io.observe(t.el);

    // the hero counts as "home": when nothing else is in the band we are at /
    const hero = document.querySelector("main > section");
    const heroIo = hero
      ? new IntersectionObserver(
          ([entry]) => {
            if (settled && entry.isIntersecting && current !== "/") {
              current = "/";
              window.history.replaceState(null, "", "/");
            }
          },
          { rootMargin: "-38% 0px -50% 0px", threshold: 0 }
        )
      : null;
    if (hero && heroIo) heroIo.observe(hero);

    return () => {
      cancelLanding?.();
      clearTimeout(settleTimer);
      document.removeEventListener("click", onClick, true);
      io.disconnect();
      heroIo?.disconnect();
    };
  }, []);

  return null;
}
