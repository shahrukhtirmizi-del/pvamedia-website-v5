"use client";

import React, { useLayoutEffect, useRef } from "react";
import { INTRO_DONE } from "../../lib/intro";
import { PLUME_SPLAT, type PlumeSplat } from "./PlumeField";

type Triple = [string, string, string];

/** Dispatched by the skip button; the running timeline answers it exactly
 *  like a scroll — fade the curtain, then hand off to the hero. */
const SKIP_INTRO = "sf:skip-intro";

export interface SplitRevealHeroProps {
  studio?: string;
  numeral?: string;
  logo?: string;
  cardTitle?: string;
  tags?: Triple;
  heroImage?: string;
  menuLabel?: string;
  footerLeft?: string;
  footerRight?: string;
  className?: string;
  /**
   * Render as an overlay over the hero's sticky stage instead of as its own
   * section. After the card reveals, the full-bleed image shrinks into the
   * hero's media frame ([data-hero-media]) and cross-fades to it, then the
   * overlay removes itself. Skipped outright on deep links, reloads part way
   * down the page and under reduced motion.
   */
  overlay?: boolean;
}

/**
 * Where the studio name's first letter travels to while the numeral grows,
 * so it lands just left of the numeral as a small cap ("P" + "VA" reads
 * PVA). Tuned for the display face; [slide, settle] per breakpoint.
 */
const FIRST_SHIFT = {
  desktop: ["4.5rem", "4rem"],
  mobile: ["2.2rem", "2rem"],
};

const splitChars = (text: string, markFirst = false) =>
  Array.from(text).map((char, index) => (
    <span
      className={`sf-char${markFirst && index === 0 ? " sf-first" : ""}`}
      key={`${char}-${index}`}
    >
      <span>{char === " " ? " " : char}</span>
    </span>
  ));

const splitWords = (text: string) => {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span className="sf-word" key={`${word}-${index}`}>
      {word}
      {index < words.length - 1 ? " " : ""}
    </span>
  ));
};

export default function SplitRevealHero({
  studio = "Stillform Studio",
  numeral = "12",
  logo = "S12",
  cardTitle = "Stillform",
  tags = ["Quiet Structure", "Material Studies", "Light and Form"],
  heroImage =
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=90",
  menuLabel = "Menu",
  footerLeft = "Scroll Down",
  footerRight = "Independent Creative Studio",
  className = "",
  overlay = false,
}: SplitRevealHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animations: Animation[] = [];
    const timers: number[] = [];
    let frame = 0;
    let cancelled = false;
    let finished = false;
    const html = document.documentElement;

    // overlay mode: take the curtain away and hand the page to the hero
    const finish = () => {
      if (finished) return;
      finished = true;
      root.style.display = "none";
      html.removeAttribute("data-intro-phase");
      if (html.getAttribute("data-intro") === "playing") {
        html.removeAttribute("data-intro");
        window.dispatchEvent(new Event(INTRO_DONE));
      }
    };

    if (
      overlay &&
      (reducedMotion || window.location.pathname !== "/" || window.scrollY > 10)
    ) {
      finish();
      return;
    }

    if (overlay) html.setAttribute("data-intro", "playing");

    const mobile = root.clientWidth <= 1000;
    const ease = "cubic-bezier(.8,0,.3,1)";

    const select = <T extends Element = HTMLElement,>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));

    const animate = (
      targets: Element | Element[],
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const elements = Array.isArray(targets) ? targets : [targets];

      elements.forEach((element) => {
        const animation = element.animate(frames, {
          fill: "forwards",
          ...options,
        });

        animations.push(animation);
      });
    };

    const later = (delay: number, callback: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled && !finished) callback();
        }, delay),
      );
    };

    const covers = select<HTMLElement>(".sf-cover");
    const tagsLayer = root.querySelector<HTMLElement>(".sf-tags");
    const scene = root.querySelector<HTMLElement>(".sf-scene");
    const card = root.querySelector<HTMLElement>(".sf-card");

    if (reducedMotion) {
      covers.forEach((cover) => {
        cover.style.display = "none";
      });

      if (tagsLayer) tagsLayer.style.display = "none";
      if (scene) scene.style.clipPath = "inset(0)";
      if (card) card.style.clipPath = "inset(0)";

      select<HTMLElement>(".sf-card .sf-char > span").forEach((character) => {
        character.style.transform = "translate3d(0,0,0)";
      });

      return;
    }

    const startTimeline = () => {
      if (cancelled) return;

      const introCharacters = select(
        ".sf-cover .sf-intro .sf-char > span",
      );
      const remainingIntroCharacters = select(
        ".sf-cover .sf-intro .sf-char:not(.sf-first) > span",
      );
      const firstCharacters = select(".sf-cover .sf-intro .sf-first");
      const numeralCharacters = select(".sf-cover .sf-number .sf-char");
      const numeralInnerCharacters = select(
        ".sf-cover .sf-number .sf-char > span",
      );
      const tagWords = select(".sf-tag .sf-word");
      const cardCharacters = select(".sf-card .sf-char > span");
      const topCover = root.querySelector<HTMLElement>(".sf-top");
      const bottomCover = root.querySelector<HTMLElement>(".sf-bottom");

      tagWords.forEach((word, index) => {
        animate(
          word,
          [
            { transform: "translate3d(0,-110%,0)" },
            { transform: "translate3d(0,0,0)" },
          ],
          {
            duration: 720,
            delay: 420 + index * 85,
            easing: ease,
          },
        );
      });

      introCharacters.forEach((character, index) => {
        animate(
          character,
          [
            { transform: "translate3d(0,-110%,0)" },
            { transform: "translate3d(0,0,0)" },
          ],
          {
            duration: 720,
            delay: 420 + index * 45,
            easing: ease,
          },
        );
      });

      remainingIntroCharacters.forEach((character, index) => {
        animate(
          character,
          [
            { transform: "translate3d(0,0,0)" },
            { transform: "translate3d(0,110%,0)" },
          ],
          {
            duration: 720,
            delay: 1920 + index * 45,
            easing: ease,
          },
        );
      });

      numeralInnerCharacters.forEach((character, index) => {
        animate(
          character,
          [
            { transform: "translate3d(0,-110%,0)" },
            { transform: "translate3d(0,0,0)" },
          ],
          {
            duration: 720,
            delay: 2420 + index * 70,
            easing: ease,
          },
        );
      });

      firstCharacters.forEach((character) => {
        animate(
          character,
          [
            {
              transform: "translate3d(0,0,0) scale(1)",
              fontWeight: 600,
              offset: 0,
            },
            {
              transform: `translate3d(${mobile ? FIRST_SHIFT.mobile[0] : FIRST_SHIFT.desktop[0]},0,0) scale(1)`,
              fontWeight: 600,
              offset: 0.57,
            },
            {
              transform: `translate3d(${mobile ? FIRST_SHIFT.mobile[1] : FIRST_SHIFT.desktop[1]},${
                mobile ? "-0.15rem" : "-0.35rem"
              },0) scale(.75)`,
              fontWeight: 900,
              offset: 1,
            },
          ],
          {
            duration: 1700,
            delay: 3420,
            easing: ease,
          },
        );
      });

      numeralCharacters.forEach((character) => {
        animate(
          character,
          [
            {
              transform: "translate3d(0,0,0)",
              fontSize: "inherit",
              fontWeight: 600,
              offset: 0,
            },
            {
              transform: `translate3d(${mobile ? "-3rem" : "-8rem"},0,0)`,
              fontSize: "inherit",
              fontWeight: 600,
              offset: 0.57,
            },
            {
              transform: `translate3d(${mobile ? "-3rem" : "-8rem"},0,0)`,
              fontSize: mobile ? "6rem" : "14rem",
              fontWeight: 500,
              offset: 1,
            },
          ],
          {
            duration: 1700,
            delay: 3420,
            easing: ease,
          },
        );
      });

      later(4920, () => {
        if (topCover) topCover.style.clipPath = "inset(0 0 50% 0)";
        if (bottomCover) bottomCover.style.clipPath = "inset(50% 0 0 0)";

        if (scene) {
          animate(
            scene,
            [
              { clipPath: "polygon(0 48%,0 48%,0 52%,0 52%)" },
              { clipPath: "polygon(0 48%,100% 48%,100% 52%,0 52%)" },
            ],
            { duration: 980, easing: ease },
          );
        }
      });

      tagWords.forEach((word, index) => {
        animate(
          word,
          [
            { transform: "translate3d(0,0,0)" },
            { transform: "translate3d(0,110%,0)" },
          ],
          {
            duration: 720,
            delay: 5420 + index * 85,
            easing: ease,
          },
        );
      });

      later(5920, () => {
        if (topCover) {
          animate(
            topCover,
            [
              { transform: "translate3d(0,0,0)" },
              { transform: "translate3d(0,-50%,0)" },
            ],
            { duration: 980, easing: ease },
          );
        }

        if (bottomCover) {
          animate(
            bottomCover,
            [
              { transform: "translate3d(0,0,0)" },
              { transform: "translate3d(0,50%,0)" },
            ],
            { duration: 980, easing: ease },
          );
        }

        if (scene) {
          if (overlay) {
            // The parting halves already draw this edge. Opening the image
            // fully behind them keeps the reveal on the compositor alone, so
            // a busy main thread can never let the halves outrun a lagging
            // clip-path and flash the hero behind.
            animate(scene, [{ clipPath: "inset(0)" }, { clipPath: "inset(0)" }], {
              duration: 1,
            });
          } else {
            animate(
              scene,
              [
                { clipPath: "inset(48% 0)" },
                { clipPath: "inset(0)" },
              ],
              { duration: 980, easing: ease },
            );
          }
        }
      });

      later(6170, () => {
        if (card) {
          animate(
            card,
            [
              { clipPath: "inset(50% 0)" },
              { clipPath: "inset(0)" },
            ],
            { duration: 720, easing: ease },
          );
        }
      });

      cardCharacters.forEach((character, index) => {
        animate(
          character,
          [
            { transform: "translate3d(0,110%,0)" },
            { transform: "translate3d(0,0,0)" },
          ],
          {
            duration: 720,
            delay: 6420 + index * 45,
            easing: ease,
          },
        );
      });

      if (!overlay) return;

      /* ── hand-off to the hero ─────────────────────────────────────────
         The card sits exactly where the hero frame rests. Its lettering
         drops away, the full-bleed image closes in onto that frame while
         the white ink field opens up around it (with ink blooming off the
         frame's edges), and the image cross-fades to the hero media in
         place. Nothing moves in the hero itself, so there is no cut. */
      const exitAt = 6420 + cardCharacters.length * 45 + 720 + 380;

      cardCharacters.forEach((character, index) => {
        animate(
          character,
          [
            { transform: "translate3d(0,0,0)" },
            { transform: "translate3d(0,-110%,0)" },
          ],
          { duration: 520, delay: exitAt + index * 28, easing: ease },
        );
      });

      const shrinkAt = exitAt + 360;
      const shrinkFor = 1050;

      later(shrinkAt, () => {
        // wake the ink field: it idles while the curtain hides it
        html.setAttribute("data-intro-phase", "handoff");
        const media = document.querySelector<HTMLElement>("[data-hero-media]");
        const bounds = root.getBoundingClientRect();
        const target = media?.getBoundingClientRect();
        if (!scene || !target) {
          finish();
          return;
        }

        const top = target.top - bounds.top;
        const left = target.left - bounds.left;
        const right = bounds.right - target.right;
        const bottom = bounds.bottom - target.bottom;

        const shrink = scene.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px round 0px)" },
            { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 16px)` },
          ],
          { duration: shrinkFor, easing: ease, fill: "forwards" },
        );
        animations.push(shrink);

        // Cross-fade only once the image has actually landed on the frame.
        // clip-path runs on the main thread, so on a busy page it can finish
        // late; chaining off it (not a timer) keeps the two frames aligned.
        shrink.finished
          .then(() => {
            if (cancelled || finished) return;
            const fade = scene.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 560,
              easing: "ease-in-out",
              fill: "forwards",
            });
            animations.push(fade);
            return fade.finished;
          })
          .then(() => {
            if (!cancelled) finish();
          })
          .catch(() => {
            // cancelled on unmount
          });

        if (card) {
          animate(card, [{ opacity: 1 }, { opacity: 0 }], {
            duration: 520,
            easing: "ease-out",
          });
        }

        // ink blooms off the closing frame: a ring of pushes, outward from
        // its centre, placed along the frame as it travels inward
        const cx = target.left + target.width / 2;
        const cy = target.top + target.height / 2;
        const inOut = (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const bursts = 14;
        for (let i = 0; i < bursts; i++) {
          const at = (i / bursts) * shrinkFor * 0.9;
          later(shrinkAt + at, () => {
            const k = inOut(at / shrinkFor);
            const l = bounds.left + left * k;
            const t = bounds.top + top * k;
            const w = bounds.width - (left + right) * k;
            const h = bounds.height - (top + bottom) * k;
            const angle = (i / bursts) * Math.PI * 2 + 0.4;
            const x = Math.min(Math.max(cx + Math.cos(angle) * w, l), l + w);
            const y = Math.min(Math.max(cy + Math.sin(angle) * h, t), t + h);
            const len = Math.hypot(x - cx, y - cy) || 1;
            const detail: PlumeSplat = {
              x,
              y,
              vx: ((x - cx) / len) * 14,
              vy: ((y - cy) / len) * 14,
            };
            window.dispatchEvent(new CustomEvent(PLUME_SPLAT, { detail }));
          });
        }
      });

      // safety net: never leave the curtain up if an animation stalls
      later(shrinkAt + shrinkFor + 4000, finish);
    };

    // Scrolling during the intro, or clicking the skip button, both cut
    // straight to the hero: the curtain fades rather than making anyone sit
    // through the rest of it.
    const skip = () => {
      if (!overlay || finished) return;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SKIP_INTRO, skip);
      const fade = root.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 320,
        easing: "ease-out",
        fill: "forwards",
      });
      animations.push(fade);
      fade.onfinish = finish;
    };
    const onScroll = () => {
      if (window.scrollY < 30) return;
      skip();
    };
    if (overlay) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener(SKIP_INTRO, skip);
    }

    // Two frames let the browser create compositor layers before movement starts.
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(startTimeline);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SKIP_INTRO, skip);
      window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      timers.forEach(window.clearTimeout);
      if (overlay && html.getAttribute("data-intro") === "playing") {
        html.removeAttribute("data-intro-phase");
        html.removeAttribute("data-intro");
        window.dispatchEvent(new Event(INTRO_DONE));
      }
    };
  }, [overlay]);

  const Cover = ({ position }: { position: "top" | "bottom" }) => (
    <div className={`sf-cover sf-${position}`} aria-hidden="true">
      <div className="sf-intro">
        <h1>{splitChars(studio, true)}</h1>
      </div>

      <div className="sf-number">
        <h1>{splitChars(numeral)}</h1>
      </div>
    </div>
  );

  return (
    <section
      ref={rootRef}
      className={`sf-root${overlay ? " sf-overlay" : ""} ${className}`}
      aria-hidden={overlay || undefined}
    >
      <style>{styles}</style>

      <Cover position="bottom" />
      <Cover position="top" />

      {overlay && (
        <button
          type="button"
          className="sf-skip"
          onClick={() => window.dispatchEvent(new Event(SKIP_INTRO))}
        >
          Skip intro
        </button>
      )}

      <div className="sf-tags" aria-hidden="true">
        {tags.map((tag, index) => (
          <p className={`sf-tag sf-tag-${index + 1}`} key={tag}>
            {splitWords(tag)}
          </p>
        ))}
      </div>

      <div className="sf-scene">
        <img
          className="sf-image"
          src={heroImage}
          alt=""
          draggable={false}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        <div className="sf-shade" />

        {(logo || menuLabel) && (
          <nav className="sf-nav">
            <strong>{logo}</strong>
            <span>{menuLabel}</span>
          </nav>
        )}

        <div className="sf-card">
          <h1>{splitChars(cardTitle)}</h1>
        </div>

        {(footerLeft || footerRight) && (
          <footer className="sf-footer">
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </footer>
        )}
      </div>
    </section>
  );
}

const styles = `
.sf-root,
.sf-root * {
  box-sizing: border-box;
}

.sf-root {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 560px;
  overflow: hidden;
  isolation: isolate;
  /* transparent: the black comes from the two curtain halves alone, so once
     they part, whatever sits behind the root (the ink field) shows through */
  background: transparent;
  color: #fff;
  font-family: var(--font-display), var(--font-sans), Arial, sans-serif;
}

/* overlay mode: fill the hero's sticky stage, above its frame and title */
.sf-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  height: 100%;
  min-height: 0;
}

.sf-root h1,
.sf-root p {
  margin: 0;
  text-transform: uppercase;
}

.sf-cover,
.sf-tags,
.sf-scene {
  position: absolute;
  inset: 0;
}

.sf-cover {
  z-index: 4;
  overflow: hidden;
  background: #0a0a0a;
  backface-visibility: hidden;
  transform: translate3d(0,0,0);
  will-change: transform, clip-path;
  contain: layout paint;
}

.sf-bottom {
  z-index: 3;
}

.sf-top {
  z-index: 4;
}

.sf-tags {
  z-index: 5;
  pointer-events: none;
}

.sf-skip {
  position: absolute;
  z-index: 20;
  top: clamp(16px, 3vw, 28px);
  right: clamp(16px, 3vw, 28px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  padding: 9px 16px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-family: var(--font-sans), Arial, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease;
}

.sf-skip:hover,
.sf-skip:focus-visible {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 560px) {
  .sf-skip {
    padding: 7px 13px;
    font-size: 10px;
  }
}

.sf-intro,
.sf-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%,-50%,0);
}

.sf-intro {
  width: 100%;
  text-align: center;
}

.sf-number {
  left: calc(50% + 10rem);
}

.sf-intro h1,
.sf-number h1 {
  font-size: clamp(2.5rem,6.3vw,6rem);
  font-weight: 600;
  line-height: 1;
}

.sf-char {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  backface-visibility: hidden;
  will-change: transform, font-size;
}

.sf-char > span {
  display: inline-block;
  backface-visibility: hidden;
  will-change: transform;
}

/* Critical first-frame states: prevents the title and number from flashing. */
.sf-cover .sf-intro .sf-char > span,
.sf-cover .sf-number .sf-char > span {
  transform: translate3d(0,-110%,0);
}

.sf-first {
  transform-origin: top left;
}

.sf-tag {
  position: absolute;
  width: max-content;
  overflow: hidden;
  color: #5a5a5a;
  font-size: 13px;
  font-weight: 500;
}

.sf-word {
  display: inline-block;
  transform: translate3d(0,-110%,0);
  backface-visibility: hidden;
  will-change: transform;
}

.sf-tag-1 {
  top: 15%;
  left: 15%;
}

.sf-tag-2 {
  bottom: 15%;
  left: 25%;
}

.sf-tag-3 {
  right: 15%;
  bottom: 30%;
}

.sf-scene {
  z-index: 2;
  overflow: hidden;
  clip-path: polygon(0 48%,0 48%,0 52%,0 52%);
  backface-visibility: hidden;
  transform: translate3d(0,0,0);
  will-change: clip-path;
  contain: layout paint;
}

.sf-image,
.sf-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.sf-image {
  object-fit: cover;
  transform: translate3d(0,0,0) scale(1.001);
  backface-visibility: hidden;
}

.sf-shade {
  background: linear-gradient(
    180deg,
    rgba(0,0,0,.3),
    rgba(0,0,0,.04) 45%,
    rgba(0,0,0,.35)
  );
}

.sf-nav,
.sf-footer {
  position: absolute;
  left: 0;
  z-index: 2;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 500;
}

.sf-nav {
  top: 0;
}

.sf-nav strong {
  font-size: 20px;
}

.sf-footer {
  bottom: 0;
}

.sf-card {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: flex;
  width: min(30%,520px);
  height: 70%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: translate3d(-50%,-50%,0);
  background: #fff;
  clip-path: inset(50% 0);
  backface-visibility: hidden;
  will-change: clip-path;
  contain: layout paint;
}

.sf-card h1 {
  width: 100%;
  text-align: center;
  color: #0a0a0a;
  font-size: clamp(2.2rem,3.2vw,3rem);
  font-weight: 600;
  line-height: 1;
}

.sf-card .sf-char > span {
  transform: translate3d(0,110%,0);
}

@media (max-width: 1000px) {
  .sf-number {
    left: calc(50% + 4rem);
  }

  .sf-card {
    width: 75%;
  }

  .sf-nav,
  .sf-footer {
    padding: 1.4rem;
  }

  .sf-tag-1 {
    left: 8%;
  }

  .sf-tag-2 {
    left: 12%;
  }

  .sf-tag-3 {
    right: 8%;
  }
}

@media (max-width: 560px) {
  .sf-root {
    min-height: 540px;
  }

  .sf-card {
    width: 78%;
    height: 64%;
  }

  .sf-nav,
  .sf-footer {
    padding: 1rem;
    font-size: 11px;
  }

  .sf-nav strong {
    font-size: 17px;
  }

  .sf-tag {
    font-size: 10px;
  }

  .sf-tag-1 {
    top: 18%;
    left: 7%;
  }

  .sf-tag-2 {
    bottom: 18%;
    left: 10%;
  }

  .sf-tag-3 {
    right: 7%;
    bottom: 26%;
  }
}
`;
