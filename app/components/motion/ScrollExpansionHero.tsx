"use client"

import {
  type CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { motion } from "framer-motion"

type MediaType = "video" | "image"

interface ScrollExpandMediaProps {
  mediaType?: MediaType
  mediaSrc: string
  posterSrc?: string
  title?: string
  textBlend?: boolean
  /**
   * Rendered over the sticky stage, e.g. the preloader curtain. It shares
   * the stage's box, so it can hand off to the media frame in place.
   */
  intro?: ReactNode
  children?: ReactNode
}

/**
 * The media frame's resting size, before any scroll. It matches the
 * preloader's centre card at every breakpoint (SplitCurtainPreloader's
 * .sf-card), so the curtain can land its image exactly where the hero
 * frame already is.
 */
export function heroFrameStart(vw: number, vh: number) {
  if (vw <= 560) return { w: vw * 0.78, h: vh * 0.64 }
  if (vw <= 1000) return { w: vw * 0.75, h: vh * 0.7 }
  return { w: Math.min(vw * 0.3, 520), h: vh * 0.7 }
}

function getYouTubeEmbedUrl(source: string) {
  try {
    if (source.includes("/embed/")) {
      const separator = source.includes("?") ? "&" : "?"
      const videoId = source.split("/embed/")[1]?.split(/[?&]/)[0]

      return `${source}${separator}autoplay=1&mute=1&loop=1&controls=0&rel=0&disablekb=1&modestbranding=1&playsinline=1${
        videoId ? `&playlist=${videoId}` : ""
      }`
    }

    const url = new URL(source)
    let videoId = url.searchParams.get("v")

    if (!videoId && url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace("/", "")
    }

    if (!videoId) return source

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&rel=0&disablekb=1&modestbranding=1&playsinline=1&playlist=${videoId}`
  } catch {
    return source
  }
}

/** One copy of the split title: first word slides left, the rest right. */
function TitleLayer({
  first,
  rest,
  shift,
  className = "",
  style,
}: {
  first: string
  rest: string
  shift: number
  className?: string
  style?: CSSProperties
}) {
  const word =
    "font-display text-[clamp(2.75rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.05em]"
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-4 text-center ${className}`}
      style={style}
    >
      <span
        className={word}
        style={{ transform: `translateX(-${shift}vw)`, willChange: "transform" }}
      >
        {first}
      </span>
      <span
        className={word}
        style={{ transform: `translateX(${shift}vw)`, willChange: "transform" }}
      >
        {rest}
      </span>
    </div>
  )
}

function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  title = "",
  textBlend = false,
  intro,
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [viewport, setViewport] = useState({ w: 1440, h: 900 })

  const sceneRef = useRef<HTMLDivElement | null>(null)

  const updateProgress = useCallback((nextProgress: number) => {
    const clampedProgress = Math.min(
      Math.max(nextProgress, 0),
      1
    )

    setScrollProgress(clampedProgress)

    if (clampedProgress >= 1) {
      setShowContent(true)
    } else if (clampedProgress < 0.75) {
      setShowContent(false)
    }
  }, [])

  useEffect(() => {
    const checkViewport = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    }

    checkViewport()
    window.addEventListener("resize", checkViewport)

    return () => {
      window.removeEventListener("resize", checkViewport)
    }
  }, [])

  // Progress follows the page's own scroll through a tall scene with a
  // sticky stage, so the section never locks scrolling or pulls the page
  // back to the top. Keyboard, deep links and the section router all work.
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const scene = sceneRef.current
      if (!scene) return

      const rect = scene.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight

      updateProgress(-rect.top / Math.max(scrollable, 1))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [updateProgress])

  // grows from the preloader card's footprint to nearly the full stage
  const start = heroFrameStart(viewport.w, viewport.h)
  const endW = viewport.w * 0.95
  const endH = viewport.h * 0.85
  const mediaWidth = start.w + scrollProgress * Math.max(0, endW - start.w)
  const mediaHeight = start.h + scrollProgress * Math.max(0, endH - start.h)

  const indicatorTop = viewport.h / 2 + mediaHeight / 2 + 28

  const textTranslateX =
    scrollProgress * (viewport.w < 768 ? 180 : 150)

  // everything on the stage except the frame, as an even-odd cut-out
  const frameL = (viewport.w - mediaWidth) / 2
  const frameT = (viewport.h - mediaHeight) / 2
  const frameR = frameL + mediaWidth
  const frameB = frameT + mediaHeight
  const outsideFrame = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${frameL}px ${frameT}px, ${frameR}px ${frameT}px, ${frameR}px ${frameB}px, ${frameL}px ${frameB}px, ${frameL}px ${frameT}px)`

  const titleWords = title.trim().split(/\s+/)
  const firstWord = titleWords[0] ?? ""
  const remainingTitle = titleWords.slice(1).join(" ")

  const isYouTubeVideo =
    mediaType === "video" &&
    (mediaSrc.includes("youtube.com") ||
      mediaSrc.includes("youtu.be"))

  return (
    // transparent all the way through so the fixed ink field behind the page
    // shows around the frame. Pulled up under the sticky nav so the stage
    // fills the whole viewport: the nav's box is its height plus 14px of fade,
    // and this margin collapses with the nav's own -14px rather than adding
    // to it, so it has to cover the whole box
    <div
      id="top"
      className="relative -mt-[78px] overflow-x-clip md:-mt-[86px]"
      style={{ background: "transparent" }}
    >
      <div ref={sceneRef} className="relative" style={{ height: "250vh" }}>
        <section className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <div
              data-hero-media
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 30px 90px -30px rgba(10, 10, 10, 0.35)",
                willChange: "width, height",
              }}
            >
              {mediaType === "video" ? (
                isYouTubeVideo ? (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <iframe
                      src={getYouTubeEmbedUrl(mediaSrc)}
                      title={title || "Featured video"}
                      className="pointer-events-none h-full w-full scale-[1.02]"
                      frameBorder="0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <video
                      key={mediaSrc}
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  </div>
                )
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <img
                    src={mediaSrc}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            <h1 className="sr-only">{title}</h1>

            {/* The stage is its own stacking context, so a difference blend
                only ever sees the frame, never the page around it. Two
                copies of the title, perfectly aligned: a white one that
                inverts against the media inside the frame, and an ink one
                clipped to everything outside it. */}
            <TitleLayer
              first={firstWord}
              rest={remainingTitle}
              shift={textTranslateX}
              className={`text-white ${textBlend ? "mix-blend-difference" : ""}`}
            />
            {textBlend && (
              <TitleLayer
                first={firstWord}
                rest={remainingTitle}
                shift={textTranslateX}
                className="text-[color:var(--ink)]"
                style={{ clipPath: outsideFrame }}
              />
            )}

            <motion.div
              className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
              style={{
                top: `${indicatorTop}px`,
                color: "var(--ink)",
              }}
              animate={{
                opacity: scrollProgress < 0.16 ? 1 : 0,
                y: scrollProgress < 0.16 ? 0 : 12,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-center text-[11px] font-semibold uppercase tracking-[0.32em]">
                  Scroll
                </span>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--ink)" }}
                  animate={{
                    y: [0, 6, 0],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {intro}
        </section>
      </div>

      {/* nothing after the stage unless there is something to show, so the
          next section follows the hero directly */}
      {children && (
      <div className="mx-auto w-full max-w-[1240px]">
        <motion.div
          className="w-full px-5 py-12 md:px-8 lg:py-20"
          initial={false}
          animate={{
            opacity: showContent ? 1 : 0,
            y: showContent ? 0 : 40,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            pointerEvents: showContent ? "auto" : "none",
          }}
        >
          {children}
        </motion.div>
      </div>
      )}
    </div>
  )
}

export default ScrollExpandMedia
