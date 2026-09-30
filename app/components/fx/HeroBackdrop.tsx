"use client";

import { useEffect, useState } from "react";
import PlumeField from "../motion/PlumeField";

/**
 * The fluid ink field, fixed behind the whole page at z-index -1: under
 * every in-flow section, over the page ground. It runs everywhere, not just
 * behind the hero — any section painting its own opaque background (the
 * Cinematic Accordion, the dark CardStoryScroll cards, and so on) already
 * occludes it naturally at that z-index, so nothing extra is needed there.
 *
 * It stays full quality and full opacity only while the hero (#top) is in
 * view. Past that it drops to the same reduced-resolution solver used for
 * the gallery-card thumbnail and fades to a low opacity, so the rest of the
 * page still reads as mostly plain white with a faint moving texture,
 * without paying full hero-grade GPU cost the whole way down the page.
 *
 * `subtle` is for pages with no hero (the bookings page): the field runs in
 * that same low-opacity, reduced mode from the start.
 */
export default function HeroBackdrop({ subtle = false }: { subtle?: boolean }) {
  const [heroVisible, setHeroVisible] = useState(!subtle);

  useEffect(() => {
    if (subtle) return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [subtle]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        opacity: heroVisible ? 1 : 0.16,
        transition: "opacity 0.5s ease",
        isolation: "isolate",
      }}
    >
      <PlumeField active reduced={!heroVisible} />
    </div>
  );
}
