"use client";

import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, type PanInfo } from "framer-motion";

export interface SwipeStackSlide {
  id: string;
  image: string;
  alt: string;
  category: string;
  title: string;
  objectPosition?: string;
}

interface ScrollSwipeStackProps {
  slides?: SwipeStackSlide[];

  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;

  swipeThreshold?: number;
  wheelThreshold?: number;
  wheelCooldown?: number;

  tiltStart?: number;
  tiltEnd?: number;
  horizontalOffset?: number;
  verticalOffset?: number;
  depthSpacing?: number;
  scaleStep?: number;

  enableDrag?: boolean;
  enableWheel?: boolean;
  enableKeyboard?: boolean;

  showContent?: boolean;
  showHint?: boolean;

  background?: string;
  className?: string;
  style?: CSSProperties;

  onActiveChange?: (
    slide: SwipeStackSlide,
    index: number
  ) => void;
}

type StackCard = {
  instanceId: string;
  slideIndex: number;
};

const DEFAULT_SLIDES: SwipeStackSlide[] = [
  {
    id: "electric-editorial",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=88",
    alt: "Editorial fashion portrait",
    category: "New Editorial",
    title: "Electric\nIdentity",
    objectPosition: "center",
  },
  {
    id: "fabric-culture",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=88",
    alt: "Modern clothing collection",
    category: "Fabric Culture",
    title: "Future\nUniform",
    objectPosition: "center",
  },
  {
    id: "minimal-form",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=88",
    alt: "Minimal fashion portrait",
    category: "Visual Form",
    title: "Quiet\nConfidence",
    objectPosition: "center",
  },
  {
    id: "retail-rhythm",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=88",
    alt: "Contemporary fashion store",
    category: "Retail Rhythm",
    title: "Style\nArchive",
    objectPosition: "center",
  },
  {
    id: "modern-silhouette",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=88",
    alt: "Fashion model in a modern outfit",
    category: "Modern Silhouette",
    title: "Soft\nRebellion",
    objectPosition: "center",
  },
  {
    id: "essential-object",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=88",
    alt: "Minimal clothing product",
    category: "Essential Object",
    title: "Daily\nForm",
    objectPosition: "center",
  },
];

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

export default function ScrollSwipeStack({
  slides = DEFAULT_SLIDES,

  cardWidth = 320,
  cardHeight = 430,
  cardRadius = 24,

  swipeThreshold = 80,
  wheelThreshold = 42,
  wheelCooldown = 480,

  tiltStart = 0,
  tiltEnd = -28,
  horizontalOffset = 150,
  verticalOffset = 11,
  depthSpacing = 22,
  scaleStep = 0.055,

  enableDrag = true,
  enableWheel = true,
  enableKeyboard = true,

  showContent = true,
  showHint = true,

  background = "#09090c",
  className = "",
  style,

  onActiveChange,
}: ScrollSwipeStackProps) {
  const sourceSlides =
    slides.length > 0
      ? slides
      : DEFAULT_SLIDES;

  const sourceKey = useMemo(
    () =>
      sourceSlides
        .map(
          (slide) =>
            `${slide.id}:${slide.image}`
        )
        .join("|"),
    [sourceSlides]
  );

  const createCards = useCallback(
    (): StackCard[] =>
      sourceSlides.map((slide, index) => ({
        instanceId: `${slide.id}-${index}`,
        slideIndex: index,
      })),
    [sourceSlides]
  );

  const [cards, setCards] =
    useState<StackCard[]>(createCards);

  const [isPressed, setIsPressed] =
    useState(false);

  const [containerSize, setContainerSize] =
    useState({
      width: 1000,
      height: 700,
    });

  const rootRef =
    useRef<HTMLElement | null>(null);

  const wheelAccumulatorRef = useRef(0);
  const wheelLockedRef = useRef(false);

  const wheelUnlockTimerRef =
    useRef<number | null>(null);

  const wheelResetTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    setCards(createCards());
  }, [createCards, sourceKey]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const measure = () => {
      const bounds =
        root.getBoundingClientRect();

      setContainerSize({
        width: bounds.width,
        height: bounds.height,
      });
    };

    measure();

    const observer =
      new ResizeObserver(measure);

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    sourceSlides.forEach((slide) => {
      const image = new Image();
      image.src = slide.image;
    });
  }, [sourceKey, sourceSlides]);

  useEffect(() => {
    return () => {
      if (
        wheelUnlockTimerRef.current !== null
      ) {
        window.clearTimeout(
          wheelUnlockTimerRef.current
        );
      }

      if (
        wheelResetTimerRef.current !== null
      ) {
        window.clearTimeout(
          wheelResetTimerRef.current
        );
      }
    };
  }, []);

  const notifyActiveSlide = useCallback(
    (nextCards: StackCard[]) => {
      const firstCard = nextCards[0];

      if (!firstCard) return;

      const activeSlide =
        sourceSlides[firstCard.slideIndex];

      if (activeSlide) {
        onActiveChange?.(
          activeSlide,
          firstCard.slideIndex
        );
      }
    },
    [onActiveChange, sourceSlides]
  );

  const moveNext = useCallback(() => {
    setCards((currentCards) => {
      if (currentCards.length <= 1) {
        return currentCards;
      }

      const [
        firstCard,
        ...remainingCards
      ] = currentCards;

      const nextCards = [
        ...remainingCards,
        firstCard,
      ];

      notifyActiveSlide(nextCards);

      return nextCards;
    });
  }, [notifyActiveSlide]);

  const movePrevious = useCallback(() => {
    setCards((currentCards) => {
      if (currentCards.length <= 1) {
        return currentCards;
      }

      const lastCard =
        currentCards[
          currentCards.length - 1
        ];

      const remainingCards =
        currentCards.slice(0, -1);

      const nextCards = [
        lastCard,
        ...remainingCards,
      ];

      notifyActiveSlide(nextCards);

      return nextCards;
    });
  }, [notifyActiveSlide]);

  const moveInDirection = useCallback(
    (direction: 1 | -1) => {
      if (direction === 1) {
        moveNext();
      } else {
        movePrevious();
      }
    },
    [moveNext, movePrevious]
  );

  const handleDragEnd = useCallback(
    (info: PanInfo) => {
      setIsPressed(false);

      const horizontalMovement =
        info.offset.x;

      const verticalMovement =
        info.offset.y;

      const distance = Math.hypot(
        horizontalMovement,
        verticalMovement
      );

      if (distance < swipeThreshold) {
        return;
      }

      const dominantMovement =
        Math.abs(horizontalMovement) >=
        Math.abs(verticalMovement)
          ? horizontalMovement
          : verticalMovement;

      /*
       * Swipe left/up:
       * current card moves to the back.
       *
       * Swipe right/down:
       * previous card moves to the front.
       */
      moveInDirection(
        dominantMovement < 0 ? 1 : -1
      );
    },
    [moveInDirection, swipeThreshold]
  );

  const handleWheel = useCallback(
    (
      event: React.WheelEvent<HTMLElement>
    ) => {
      if (
        !enableWheel ||
        wheelLockedRef.current ||
        cards.length <= 1
      ) {
        return;
      }

      const dominantDelta =
        Math.abs(event.deltaY) >=
        Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (Math.abs(dominantDelta) < 1) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      wheelAccumulatorRef.current +=
        dominantDelta;

      if (
        wheelResetTimerRef.current !== null
      ) {
        window.clearTimeout(
          wheelResetTimerRef.current
        );
      }

      wheelResetTimerRef.current =
        window.setTimeout(() => {
          wheelAccumulatorRef.current = 0;
        }, 160);

      if (
        Math.abs(
          wheelAccumulatorRef.current
        ) < wheelThreshold
      ) {
        return;
      }

      const direction: 1 | -1 =
        wheelAccumulatorRef.current > 0
          ? 1
          : -1;

      wheelAccumulatorRef.current = 0;
      wheelLockedRef.current = true;

      moveInDirection(direction);

      if (
        wheelUnlockTimerRef.current !== null
      ) {
        window.clearTimeout(
          wheelUnlockTimerRef.current
        );
      }

      wheelUnlockTimerRef.current =
        window.setTimeout(() => {
          wheelLockedRef.current = false;
        }, wheelCooldown);
    },
    [
      cards.length,
      enableWheel,
      moveInDirection,
      wheelCooldown,
      wheelThreshold,
    ]
  );

  const handleKeyboard = useCallback(
    (
      event: React.KeyboardEvent<HTMLElement>
    ) => {
      if (
        !enableKeyboard ||
        cards.length <= 1
      ) {
        return;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        moveNext();
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
        movePrevious();
      }
    },
    [
      cards.length,
      enableKeyboard,
      moveNext,
      movePrevious,
    ]
  );

  const cardCount = cards.length;

  const stackWidth =
    cardWidth + horizontalOffset;

  const stackHeight =
    cardHeight +
    Math.abs(tiltEnd) * 1.7 +
    verticalOffset *
      Math.max(0, cardCount - 1);

  const responsiveScale = clamp(
    Math.min(
      (containerSize.width - 44) /
        Math.max(1, stackWidth),

      (containerSize.height - 110) /
        Math.max(1, stackHeight)
    ),
    0.48,
    1
  );

  const getCardPose = (
    index: number
  ) => {
    const progress =
      cardCount > 1
        ? index / (cardCount - 1)
        : 0;

    return {
      x:
        progress * horizontalOffset -
        horizontalOffset / 2,

      y: -index * verticalOffset,

      z: -index * depthSpacing,

      rotate:
        tiltStart +
        progress *
          (tiltEnd - tiltStart),

      scale: Math.max(
        0.64,
        1 - index * scaleStep
      ),

      opacity: Math.max(
        0.48,
        1 - index * 0.065
      ),

      filter: `brightness(${Math.max(
        0.58,
        1 - index * 0.07
      )}) saturate(${Math.max(
        0.72,
        1 - index * 0.045
      )})`,
    };
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 290,
    damping: 29,
    mass: 0.86,
  };

  const rootStyle = {
    ...style,

    "--stack-background": background,
    "--stack-radius": `${cardRadius}px`,
  } as CSSProperties;

  return (
    <>
      <style>{`
        .scroll-swipe-stack {
          position: relative;
          width: 100%;
          height: 100%;
          min-width: 280px;
          min-height: 580px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          outline: none;
          user-select: none;
          background: var(--stack-background);
          overscroll-behavior: contain;
        }

        .scroll-swipe-stack::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1000;
          pointer-events: none;
          background:
            radial-gradient(
              circle at center,
              transparent 39%,
              rgba(0, 0, 0, 0.07) 70%,
              rgba(0, 0, 0, 0.52) 120%
            );
        }

        .scroll-swipe-stack__stage {
          position: relative;
          z-index: 10;
          transform-origin: center;
          transform-style: preserve-3d;
          perspective: 1100px;
        }

        .scroll-swipe-stack__card {
          position: absolute;
          display: block;
          padding: 0;
          border: 0;
          overflow: hidden;
          appearance: none;
          color: #ffffff;
          background: #17181d;
          border-radius:
            var(--stack-radius);
          box-shadow:
            0 32px 90px
              rgba(0, 0, 0, 0.52),
            0 10px 25px
              rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px
              rgba(255, 255, 255, 0.1);
          transform-origin: center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change:
            transform,
            filter,
            opacity;
          -webkit-tap-highlight-color:
            transparent;
        }

        .scroll-swipe-stack__card--active {
          cursor: grab;
        }

        .scroll-swipe-stack__card--pressed {
          cursor: grabbing;
        }

        .scroll-swipe-stack__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          transform: scale(1.025);
          transition:
            transform 700ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            filter 400ms ease;
        }

        .scroll-swipe-stack__card--active:hover
          .scroll-swipe-stack__image {
          transform: scale(1.065);
          filter:
            brightness(1.04)
            saturate(1.04);
        }

        .scroll-swipe-stack__shade {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.02) 28%,
              rgba(0, 0, 0, 0.84) 100%
            );
        }

        .scroll-swipe-stack__content {
          position: absolute;
          left: 25px;
          right: 25px;
          bottom: 24px;
          z-index: 4;
          display: block;
          color: #ffffff;
          text-align: left;
          pointer-events: none;
          text-shadow:
            0 5px 22px
              rgba(0, 0, 0, 0.5);
        }

        .scroll-swipe-stack__category {
          display: block;
          margin-bottom: 10px;
          overflow: hidden;
          font-size: 9px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.18em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.68;
        }

        .scroll-swipe-stack__title {
          display: block;
          white-space: pre-line;
          font-size:
            clamp(30px, 4vw, 46px);
          font-weight: 900;
          line-height: 0.91;
          letter-spacing: -0.02em;
        }

        .scroll-swipe-stack__number {
          position: absolute;
          top: 18px;
          right: 19px;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid
            rgba(255, 255, 255, 0.17);
          border-radius: 50%;
          color:
            rgba(255, 255, 255, 0.76);
          background:
            rgba(9, 10, 13, 0.3);
          backdrop-filter: blur(12px);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          pointer-events: none;
        }

        .scroll-swipe-stack__hint {
          position: absolute;
          left: 50%;
          bottom: 24px;
          z-index: 1100;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color:
            rgba(255, 255, 255, 0.66);
          background:
            rgba(12, 13, 16, 0.58);
          backdrop-filter: blur(15px);
          box-shadow:
            0 12px 34px
              rgba(0, 0, 0, 0.26);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          pointer-events: none;
          transform: translateX(-50%);
        }

        .scroll-swipe-stack__hint-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background:
            rgba(255, 255, 255, 0.94);
          box-shadow:
            0 0 14px
              rgba(255, 255, 255, 0.62);
        }

        @media (max-width: 680px) {
          .scroll-swipe-stack {
            min-height: 520px;
          }

          .scroll-swipe-stack__content {
            left: 20px;
            right: 20px;
            bottom: 19px;
          }

          .scroll-swipe-stack__hint {
            bottom: 15px;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .scroll-swipe-stack__image {
            transition-duration:
              1ms !important;
          }
        }
      `}</style>

      <section
        ref={rootRef}
        className={`scroll-swipe-stack ${className}`}
        style={rootStyle}
        tabIndex={0}
        role="region"
        aria-roledescription="card stack"
        aria-label="Scrollable and swipeable image stack"
        onWheel={handleWheel}
        onKeyDown={handleKeyboard}
      >
        <div
          className="scroll-swipe-stack__stage"
          style={{
            width: stackWidth,
            height: stackHeight,
            transform: `scale(${responsiveScale})`,
          }}
        >
          {cards.map((card, index) => {
            const slide =
              sourceSlides[card.slideIndex];

            const isTopCard = index === 0;
            const pose = getCardPose(index);

            return (
              <motion.article
                key={card.instanceId}
                className={[
                  "scroll-swipe-stack__card",
                  isTopCard
                    ? "scroll-swipe-stack__card--active"
                    : "",
                  isTopCard && isPressed
                    ? "scroll-swipe-stack__card--pressed"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                drag={
                  isTopCard && enableDrag
                }
                dragConstraints={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                dragElastic={0.78}
                dragMomentum={false}
                onPointerDown={() => {
                  if (isTopCard) {
                    setIsPressed(true);
                  }
                }}
                onPointerUp={() => {
                  setIsPressed(false);
                }}
                onPointerCancel={() => {
                  setIsPressed(false);
                }}
                onDragEnd={(_, info) => {
                  if (isTopCard) {
                    handleDragEnd(info);
                  }
                }}
                animate={pose}
                whileDrag={{
                  scale: 1.045,
                  rotate: 0,
                  z: 42,
                  filter:
                    "brightness(1.05) saturate(1.04)",
                }}
                transition={{
                  x: springTransition,
                  y: springTransition,
                  z: springTransition,
                  rotate: springTransition,
                  scale: springTransition,
                  opacity: {
                    duration: 0.32,
                    ease: "easeOut",
                  },
                  filter: {
                    duration: 0.35,
                    ease: "easeOut",
                  },
                }}
                style={{
                  left: horizontalOffset / 2,
                  top: 46,
                  width: cardWidth,
                  height: cardHeight,
                  zIndex:
                    cardCount - index,
                  pointerEvents:
                    isTopCard
                      ? "auto"
                      : "none",
                }}
                aria-hidden={!isTopCard}
              >
                <img
                  className="scroll-swipe-stack__image"
                  src={slide.image}
                  alt={slide.alt}
                  draggable={false}
                  style={{
                    objectPosition:
                      slide.objectPosition ||
                      "center",
                  }}
                />

                <span className="scroll-swipe-stack__shade" />

                {showContent && (
                  <span className="scroll-swipe-stack__content">
                    <span className="scroll-swipe-stack__category">
                      {slide.category}
                    </span>

                    <span className="scroll-swipe-stack__title">
                      {slide.title}
                    </span>
                  </span>
                )}

                <span className="scroll-swipe-stack__number">
                  {String(
                    card.slideIndex + 1
                  ).padStart(2, "0")}
                </span>
              </motion.article>
            );
          })}
        </div>

        {showHint && (
          <div
            className="scroll-swipe-stack__hint"
            aria-hidden="true"
          >
            <span className="scroll-swipe-stack__hint-dot" />
            Scroll, drag or swipe
          </div>
        )}
      </section>
    </>
  );
}
