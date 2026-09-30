"use client";

import React, { CSSProperties, useEffect, useRef } from "react";
import { SERVICES } from "../../lib/site";

const CSS = `
.kex-scroll-page,
.kex-scroll-page * {
  box-sizing: border-box;
}

.kex-scroll-page {
  width: 100%;
  background: #0A0A0A;
  font-family: var(--font-sans), system-ui, sans-serif;
}

.kex-hero-title,
.kex-card-title,
.kex-card-number {
  font-family: var(--font-display), var(--font-sans), system-ui, sans-serif;
}

.kex-scroll-scene {
  position: relative;
  height: 560vh;
  height: 560svh;
  background: #0A0A0A;
}

.kex-sticky-stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #0A0A0A;
}

/* HERO */

.kex-hero-content {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: clamp(24px, 4vw, 72px);
  color: #ffffff;
}

.kex-hero-title {
  margin: 0;
  max-width: 1200px;
  font-size: clamp(76px, 12vw, 210px);
  font-weight: 950;
  line-height: 0.86;
  letter-spacing: -0.075em;
  text-transform: uppercase;
}


/* CARD LAYER */

.kex-card-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.kex-scroll-card {
  position: absolute;
  left: 0;
  top: 0;

  width: 100%;
  height: 100vh;
  height: 100svh;

  background: var(--card-bg);
  color: var(--card-text);

  transform-origin: 14% 0%;
  will-change: transform, opacity, filter;

  overflow: hidden;
}

/* Card texture */
.kex-scroll-card::before {
  content: "";
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at 18% 18%,
      rgba(255, 255, 255, 0.16),
      transparent 34%
    ),
    radial-gradient(
      circle at 88% 78%,
      rgba(255, 255, 255, 0.08),
      transparent 38%
    );

  opacity: 0.42;
  pointer-events: none;
}

.kex-scroll-card::after {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.05),
      transparent 22%,
      transparent 70%,
      rgba(0,0,0,0.12)
    );

  pointer-events: none;
}

.kex-card-inner {
  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;

  padding: clamp(38px, 4vw, 72px);
}

.kex-card-kicker {
  margin: 0 0 clamp(100px, 16svh, 170px);

  color: var(--card-muted);

  font-size: clamp(13px, 1.2vw, 22px);
  font-weight: 850;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.kex-card-title {
  margin: 0;
  max-width: 1080px;

  font-size: clamp(76px, 10vw, 185px);
  font-weight: 950;
  line-height: 0.84;
  letter-spacing: -0.075em;
  text-transform: uppercase;
}

.kex-card-description {
  position: absolute;
  right: clamp(30px, 6vw, 100px);
  bottom: clamp(36px, 5vw, 80px);

  display: flex;
  flex-direction: column;
  gap: 0.4em;
  max-width: 460px;
}

.kex-card-description p {
  margin: 0;
  font-size: clamp(18px, 1.6vw, 28px);
  line-height: 1.3;
  letter-spacing: -0.035em;
}

.kex-card-description p:first-child {
  color: var(--card-text);
  font-weight: 600;
}

.kex-card-description p:last-child {
  color: var(--card-muted);
  font-weight: 400;
}

.kex-card-number {
  position: absolute;
  right: clamp(28px, 4vw, 70px);
  top: clamp(28px, 4vw, 70px);

  color: var(--card-number);

  font-size: clamp(44px, 7vw, 120px);
  font-weight: 950;
  letter-spacing: -0.08em;
}

/*
  PHONES AND TABLETS: native sticky stacking instead of the scripted flight.
  The title panel and each card are full-screen sticky panels in normal flow,
  so every card slides up over the last one at exactly the speed of the
  finger, in either direction, with nothing computed per frame. (The
  scripted version lagged the finger and fought fast flicks on phones.)
*/
@media (max-width: 800px), (pointer: coarse) {
  .kex-scroll-scene {
    height: auto;
  }

  .kex-sticky-stage {
    position: relative;
    height: auto;
    overflow: visible;
  }

  .kex-hero-content {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    display: flex;
    align-items: center;
  }

  .kex-card-layer {
    position: relative;
    inset: auto;
  }

  .kex-scroll-card {
    position: sticky;
    top: 0;
    left: auto;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
    will-change: auto;
    border-radius: 22px 22px 0 0;
    box-shadow: 0 -24px 48px -20px rgba(0, 0, 0, 0.35);
  }

  /* text in flow, top to bottom, so the description can never be pushed
     off the card; the top padding clears the site nav */
  .kex-card-inner {
    display: flex;
    flex-direction: column;
    padding: 104px clamp(24px, 6vw, 56px) clamp(32px, 6svh, 56px);
  }

  .kex-card-kicker {
    margin: 0 0 clamp(20px, 5svh, 48px);
  }

  .kex-card-number {
    top: 96px;
  }

  .kex-card-description {
    position: static;
    margin-top: auto;
    max-width: 34rem;
  }
}

@media (max-width: 800px) {
  .kex-hero-title {
    font-size: clamp(58px, 17vw, 120px);
  }

  .kex-card-kicker {
    /* clear of the card number in the top-right corner */
    max-width: calc(100% - 72px);
    font-size: 11px;
    letter-spacing: 0.22em;
    line-height: 1.6;
  }

  .kex-card-title {
    /* long single words (RECEPTIONIST, AUTOMATION) have to fit a phone */
    font-size: clamp(34px, 10.5vw, 108px);
    overflow-wrap: anywhere;
  }

  .kex-card-number {
    right: 24px;
    font-size: 44px;
  }

  .kex-card-description p {
    font-size: clamp(16px, 4.6vw, 19px);
  }
}

/* short phones (SE and similar): tighten so everything still fits */
@media (max-width: 800px) and (max-height: 700px) {
  .kex-card-inner {
    padding-top: 92px;
  }
  .kex-card-number {
    top: 84px;
    font-size: 36px;
  }
  .kex-card-description p {
    font-size: 15.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kex-scroll-card {
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }
}
`;

type Card = {
  number: string;
  kicker: string;
  title: string;
  descriptionLines: [string, string];
  bg: string;
  text: string;
  muted: string;
  numberColor: string;
};

type CardStyle = CSSProperties & {
  "--card-bg": string;
  "--card-text": string;
  "--card-muted": string;
  "--card-number": string;
};

/**
 * One colour set per SERVICES entry, by index. Alternating light and dark so
 * each card reads clearly as it lands over the one before it.
 */
const CARD_COLORS: Array<Pick<Card, "bg" | "text" | "muted" | "numberColor">> = [
  {
    bg: "#FFFFFF",
    text: "#0A0A0A",
    muted: "rgba(10, 10, 10, 0.62)",
    numberColor: "rgba(10, 10, 10, 0.14)",
  },
  {
    bg: "#161616",
    text: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.7)",
    numberColor: "rgba(255, 255, 255, 0.2)",
  },
  {
    bg: "#F4F4F2",
    text: "#0A0A0A",
    muted: "rgba(10, 10, 10, 0.62)",
    numberColor: "rgba(10, 10, 10, 0.14)",
  },
  {
    bg: "#0A0A0A",
    text: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.7)",
    numberColor: "rgba(255, 255, 255, 0.2)",
  },
];

const cards: Card[] = SERVICES.map((service, index) => ({
  number: `0${index + 1}`,
  // the big number and title already name the service; the line above
  // them says what we specialise in
  kicker: service.specialism,
  title: service.name,
  descriptionLines: service.shortLines,
  ...CARD_COLORS[index],
}));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export default function CardStoryScroll() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  const currentProgress = useRef(0);
  const targetProgress = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // phones and tablets use the CSS sticky stack; see the stylesheet
    const stackedQuery = window.matchMedia("(max-width: 800px), (pointer: coarse)");

    const updateTargetProgress = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const rect = scene.getBoundingClientRect();
      // measured against the pinned stage (100svh), not window.innerHeight,
      // which changes as a phone's address bar slides in and out mid-scroll
      const stageHeight = stageRef.current?.offsetHeight || window.innerHeight;
      const scrollable = rect.height - stageHeight;

      targetProgress.current = clamp(
        -rect.top / Math.max(scrollable, 1),
        0,
        1,
      );
      wake();
    };

    const clearInline = () => {
      if (heroTitleRef.current) {
        heroTitleRef.current.style.transform = "";
        heroTitleRef.current.style.opacity = "";
      }
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "";
        card.style.opacity = "";
        card.style.filter = "";
        card.style.zIndex = "";
      });
    };

    const render = () => {
      frameRef.current = null;
      if (stackedQuery.matches) return;

      currentProgress.current = lerp(
        currentProgress.current,
        targetProgress.current,
        0.085,
      );
      // close enough: land exactly and let the loop sleep until next scroll
      if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
        currentProgress.current = targetProgress.current;
      }

      const progress = currentProgress.current;

      if (heroTitleRef.current) {
        const heroLift = clamp(progress / 0.24, 0, 1);

        heroTitleRef.current.style.transform = `
          translate3d(0, ${lerp(0, -110, heroLift)}px, 0)
        `;

        heroTitleRef.current.style.opacity = `${lerp(1, 0.58, heroLift)}`;
      }

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        /*
          Each card enters as a full-screen panel.
          The first card fully covers the dark hero.
          Each next card fully covers the previous card.
        */
        const start = 0.08 + index * 0.215;
        const end = start + 0.22;

        const raw = clamp((progress - start) / (end - start), 0, 1);
        const eased = easeOutCubic(raw);
        const settle = easeInOutCubic(raw);

        const y = lerp(112, 0, eased);
        const x = lerp(10, 0, eased);
        const rotate = lerp(-7.5, 0, settle);
        const scale = lerp(1.05, 1, eased);

        const opacity = raw <= 0 ? 0 : lerp(0.4, 1, eased);
        const blur = lerp(3, 0, eased);

        card.style.transform = `
          translate3d(${x}vw, ${y}vh, 0)
          rotate(${rotate}deg)
          scale(${scale})
        `;

        card.style.opacity = `${opacity}`;
        card.style.filter = blur > 0.01 ? `blur(${blur}px)` : "none";

        /*
          Higher cards sit above lower cards,
          so the next card comes fully over the previous one.
        */
        card.style.zIndex = `${20 + index}`;
      });

      if (currentProgress.current !== targetProgress.current) wake();
    };

    // the loop only runs while the eased progress is still catching up
    function wake() {
      if (frameRef.current === null && !stackedQuery.matches) {
        frameRef.current = requestAnimationFrame(render);
      }
    }

    const onModeChange = () => {
      if (stackedQuery.matches) clearInline();
      else updateTargetProgress();
    };

    if (stackedQuery.matches) clearInline();
    else {
      updateTargetProgress();
      currentProgress.current = targetProgress.current;
      render();
    }

    window.addEventListener("scroll", updateTargetProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateTargetProgress);
    stackedQuery.addEventListener("change", onModeChange);

    return () => {
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", updateTargetProgress);
      stackedQuery.removeEventListener("change", onModeChange);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <div className="kex-scroll-page">
        <section id="services" ref={sceneRef} className="kex-scroll-scene">
          <div ref={stageRef} className="kex-sticky-stage">
            <div className="kex-hero-content">
              <h1 ref={heroTitleRef} className="kex-hero-title">
                OUR
                <br />
                SERVICES
              </h1>
            </div>

            <div className="kex-card-layer">
              {cards.map((card, index) => {
                const style: CardStyle = {
                  "--card-bg": card.bg,
                  "--card-text": card.text,
                  "--card-muted": card.muted,
                  "--card-number": card.numberColor,
                };

                return (
                  <article
                    key={card.number}
                    ref={(element) => {
                      cardRefs.current[index] = element;
                    }}
                    className="kex-scroll-card"
                    style={style}
                  >
                    <div className="kex-card-inner">
                      <div className="kex-card-number">{card.number}</div>

                      <p className="kex-card-kicker">{card.kicker}</p>

                      <h2 className="kex-card-title">{card.title}</h2>

                      <div className="kex-card-description">
                        <p>{card.descriptionLines[0]}</p>
                        <p>{card.descriptionLines[1]}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
