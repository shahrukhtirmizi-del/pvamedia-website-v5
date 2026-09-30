"use client";

import { useEffect, useState } from "react";
import PlumeField from "../motion/PlumeField";

/**
 * The fluid ink field, fixed behind the preloader and the hero so both share
 * one continuous background. It sits at z-index -1: under every in-flow
 * section, over the page ground. Once the hero (#top) has scrolled away the
 * field fades out and its solver stops, so the rest of the page reads on
 * plain white and no GPU time is spent on a layer nobody can see.
 */
export default function HeroBackdrop() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s ease",
        isolation: "isolate",
      }}
    >
      <PlumeField active={active} />
    </div>
  );
}
