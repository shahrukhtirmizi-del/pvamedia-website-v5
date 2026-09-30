"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterImages?: string[];
}

export function RevealText({
  text = "Okara",
  textColor = "text-white",
  overlayColor = "text-purple-500",
  fontSize = "text-[clamp(70px,16vw,250px)]",
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  letterImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80",
  ],
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(
    null
  );

  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    setShowOverlayText(false);

    const lastLetterDelay = Math.max(0, text.length - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = window.setTimeout(() => {
      setShowOverlayText(true);
    }, totalDelay);

    return () => window.clearTimeout(timer);
  }, [text, letterDelay, springDuration]);

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden py-24" style={{ background: "var(--bg)" }}>
      <div className="relative flex items-center justify-center px-4">
        <div className="flex">
          {text.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                ${fontSize}
                relative
                inline-block
                cursor-pointer
                overflow-hidden
                font-black
                leading-[0.82]
                tracking-[-0.09em]
              `}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: index * letterDelay,
                type: "spring",
                damping: 8,
                stiffness: 200,
                mass: 0.8,
              }}
            >
              {/* Invisible sizing layer */}
              <span className="invisible">{letter}</span>

              {/* White base text */}
              <motion.span
                className={`absolute inset-0 ${textColor}`}
                animate={{
                  opacity: hoveredIndex === index ? 0 : 1,
                }}
                transition={{
                  duration: 0.12,
                  ease: "easeOut",
                }}
              >
                {letter}
              </motion.span>

              {/* Image-filled hover layer */}
              <motion.span
                className="absolute inset-0 bg-cover bg-no-repeat text-transparent"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  backgroundPosition:
                    hoveredIndex === index
                      ? "80% center"
                      : "10% center",
                }}
                transition={{
                  opacity: {
                    duration: 0.12,
                    ease: "easeOut",
                  },
                  backgroundPosition: {
                    duration: 3,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  backgroundImage: `url("${
                    letterImages[index % letterImages.length]
                  }")`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter}
              </motion.span>

              {/* Purple sweep after entrance */}
              {showOverlayText && (
                <motion.span
                  className={`
                    ${overlayColor}
                    pointer-events-none
                    absolute
                    inset-0
                  `}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: index * overlayDelay,
                    duration: overlayDuration,
                    times: [0, 0.1, 0.7, 1],
                    ease: "easeInOut",
                  }}
                >
                  {letter}
                </motion.span>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RevealText;
