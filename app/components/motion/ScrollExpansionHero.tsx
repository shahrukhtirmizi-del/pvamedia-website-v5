"use client"

import {
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
  bgImageSrc: string
  title?: string
  textBlend?: boolean
  children?: ReactNode
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

function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title = "",
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(900)

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
      setIsMobile(window.innerWidth < 768)
      setViewportHeight(window.innerHeight)
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

  const mediaWidth =
    300 + scrollProgress * (isMobile ? 650 : 1250)

  const mediaHeight =
    400 + scrollProgress * (isMobile ? 200 : 400)

  const displayedMediaHeight = Math.min(
    mediaHeight,
    viewportHeight * 0.85
  )

  const indicatorTop =
    viewportHeight / 2 + displayedMediaHeight / 2 + 34

  const textTranslateX =
    scrollProgress * (isMobile ? 180 : 150)

  const titleWords = title.trim().split(/\s+/)
  const firstWord = titleWords[0] ?? ""
  const remainingTitle = titleWords.slice(1).join(" ")

  const isYouTubeVideo =
    mediaType === "video" &&
    (mediaSrc.includes("youtube.com") ||
      mediaSrc.includes("youtu.be"))

  return (
    <main className="overflow-x-clip" style={{ background: "var(--bg)" }}>
      <div ref={sceneRef} className="relative" style={{ height: "250vh" }}>
        <section className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              opacity: 1 - scrollProgress,
              scale: 1 + scrollProgress * 0.05,
            }}
            transition={{
              duration: 0.1,
              ease: "linear",
            }}
          >
            <img
              src={bgImageSrc}
              alt=""
              draggable={false}
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1800px] flex-col items-center">
            <div className="relative flex min-h-[100dvh] w-full items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  transform: "translate(-50%, -50%)",
                  boxShadow:
                    "0 30px 100px rgba(0, 0, 0, 0.42)",
                  willChange: "width, height",
                }}
              >
                {mediaType === "video" ? (
                  isYouTubeVideo ? (
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      <iframe
                        src={getYouTubeEmbedUrl(mediaSrc)}
                        title={title || "Space video"}
                        className="pointer-events-none h-full w-full scale-[1.02]"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />

                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-black"
                        animate={{
                          opacity:
                            0.45 - scrollProgress * 0.28,
                        }}
                        transition={{
                          duration: 0.1,
                          ease: "linear",
                        }}
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

                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-black"
                        animate={{
                          opacity:
                            0.42 - scrollProgress * 0.26,
                        }}
                        transition={{
                          duration: 0.1,
                          ease: "linear",
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={mediaSrc}
                      alt={title || "Featured visual"}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />

                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black"
                      animate={{
                        opacity:
                          0.5 - scrollProgress * 0.28,
                      }}
                      transition={{
                        duration: 0.1,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}
              </div>

              <div
                className={`pointer-events-none relative z-20 flex w-full flex-col items-center justify-center gap-2 px-4 text-center ${
                  textBlend
                    ? "mix-blend-difference"
                    : "mix-blend-normal"
                }`}
              >
                <h1
                  className="text-[clamp(2.5rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.06em] text-blue-100"
                  style={{
                    transform: `translateX(-${textTranslateX}vw)`,
                    willChange: "transform",
                  }}
                >
                  {firstWord}
                </h1>

                <h1
                  className="text-[clamp(2.5rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.06em] text-blue-100"
                  style={{
                    transform: `translateX(${textTranslateX}vw)`,
                    willChange: "transform",
                  }}
                >
                  {remainingTitle}
                </h1>
              </div>

              <motion.div
                className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
                style={{
                  top: `${indicatorTop}px`,
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
                <div className="flex flex-col items-center justify-center gap-3 text-white">
                  <span className="text-center text-[11px] font-semibold uppercase tracking-[0.32em]">
                    Scroll
                  </span>

                  <div className="flex h-11 w-7 justify-center rounded-full border border-white/50 p-1.5">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-white"
                      animate={{
                        y: [0, 20, 0],
                        opacity: [0.35, 1, 0.35],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto w-full max-w-[1800px]">
        <motion.section
          className="w-full px-8 py-12 md:px-16 lg:py-24"
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
        </motion.section>
      </div>
    </main>
  )
}

export default ScrollExpandMedia
