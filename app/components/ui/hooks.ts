"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { afterIntro } from "../../lib/intro";

const noopSubscribe = () => () => {};

/** True once React is running on the client. Safe for portals. */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True once the user has asked the OS for less motion.
 * Read through useSyncExternalStore rather than set from an effect, so the
 * value is correct on the very first client render instead of one frame late.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}

/**
 * IntersectionObserver, never a scroll listener.
 * `once` freezes the result after the first entry, for animations that
 * should play a single time (count-ups, fill bars).
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -40px 0px",
  once = false,
}: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let release: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // hold the reveal until the intro has handed over
          release?.();
          release = afterIntro(() => setInView(true));
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      release?.();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
