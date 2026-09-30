"use client"

import {
  type CSSProperties,
  type RefObject,
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

/**
 * One copy of the split title: first word slides left, the rest right. The
 * slide is written straight to the spans by the hero's scroll loop.
 */
function TitleLayer({
  first,
  rest,
  firstRef,
  restRef,
  layerRef,
  className = "",
  style,
}: {
  first: string
  rest: string
  firstRef: (el: HTMLSpanElement | null) => void
  restRef: (el: HTMLSpanElement | null) => void
  layerRef?: RefObject<HTMLDivElement | null>
  className?: string
  style?: CSSProperties
}) {
  const word =
    "font-display text-[clamp(2.75rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.05em]"
  return (
    <div
      ref={layerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-4 text-center ${className}`}
      style={style}
    >
      <span ref={firstRef} className={word} style={{ willChange: "transform" }}>
        {first}
      </span>
      <span ref={restRef} className={word} style={{ willChange: "transform" }}>
        {rest}
      </span>
    </div>
  )
}

/** Height media of aspect `a` (w/h) is drawn at to cover a w×h box. */
const coverScale = (w: number, h: number, a: number) => Math.max(w / a, h)

function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  title = "",
  textBlend = false,
  intro,
  children,
}: ScrollExpandMediaProps) {
  const [hintVisible, setHintVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [viewport, setViewport] = useState({ w: 1440, h: 900 })
  // media aspect (w/h), known once the image or video has loaded
  const [aspect, setAspect] = useState(16 / 9)

  const sceneRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const shadowRef = useRef<HTMLDivElement | null>(null)
  const mediaRef = useRef<HTMLDivElement | null>(null)
  const inkLayerRef = useRef<HTMLDivElement | null>(null)
  const firstWords = useRef<(HTMLSpanElement | null)[]>([])
  const restWords = useRef<(HTMLSpanElement | null)[]>([])
  const progressRef = useRef(0)

  // Sized from the pinned stage (100svh), not window.innerHeight: on phones
  // innerHeight changes every time the address bar slides in or out, which
  // made the frame and the scroll maths twitch mid-scroll. The stage's small-
  // viewport height only changes on a real resize or rotation.
  useEffect(() => {
    const stage = stageRef.current
    const checkViewport = () => {
      const h = stage?.clientHeight || window.innerHeight
      setViewport((v) => (v.w === window.innerWidth && v.h === h ? v : { w: window.innerWidth, h }))
    }

    checkViewport()
    const ro = stage ? new ResizeObserver(checkViewport) : null
    if (stage && ro) ro.observe(stage)
    window.addEventListener("orientationchange", checkViewport)

    return () => {
      ro?.disconnect()
      window.removeEventListener("orientationchange", checkViewport)
    }
  }, [])

  // grows from the preloader card's footprint to nearly the full stage
  const start = heroFrameStart(viewport.w, viewport.h)
  const endW = viewport.w * 0.95
  const endH = viewport.h * 0.85

  /**
   * Writes one frame of the expansion straight to the DOM. Scrolling never
   * re-renders React, and nothing on the stage is re-laid-out or re-painted
   * except the frame's own box: the media sits at its final size and is
   * scaled (a GPU transform, no re-sampling), the shadow is a separate layer
   * scaled with it, and the title words slide on transforms.
   */
  const apply = useCallback(
    (p: number) => {
      const w = start.w + p * Math.max(0, endW - start.w)
      const h = start.h + p * Math.max(0, endH - start.h)

      const frame = frameRef.current
      if (frame) {
        frame.style.width = `${w}px`
        frame.style.height = `${h}px`
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translate(-50%, -50%) scale(${w / start.w}, ${h / start.h})`
      }
      if (mediaRef.current) {
        const k = coverScale(w, h, aspect) / coverScale(endW, endH, aspect)
        mediaRef.current.style.transform = `translate(-50%, -50%) scale(${k})`
      }

      const shift = p * (viewport.w < 768 ? 180 : 150)
      firstWords.current.forEach((el) => el && (el.style.transform = `translate3d(-${shift}vw, 0, 0)`))
      restWords.current.forEach((el) => el && (el.style.transform = `translate3d(${shift}vw, 0, 0)`))

      // everything on the stage except the frame, as an even-odd cut-out
      if (inkLayerRef.current) {
        const l = (viewport.w - w) / 2
        const t = (viewport.h - h) / 2
        const r = l + w
        const b = t + h
        inkLayerRef.current.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px, ${l}px ${t}px)`
      }

      setHintVisible(p < 0.16)
      if (p >= 1) setShowContent(true)
      else if (p < 0.75) setShowContent(false)
    },
    [start.w, start.h, endW, endH, aspect, viewport.w, viewport.h]
  )

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
      const stageHeight = stageRef.current?.clientHeight || window.innerHeight
      const scrollable = rect.height - stageHeight
      const p = Math.min(Math.max(-rect.top / Math.max(scrollable, 1), 0), 1)

      // past the hero there is nothing to update
      if (p === progressRef.current && p === 1) return
      progressRef.current = p
      apply(p)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    progressRef.current = -1
    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [apply])

  const indicatorTop = viewport.h / 2 + start.h / 2 + 28

  // the ink title's cut-out at rest, for the first paint; the loop takes over
  const restL = (viewport.w - start.w) / 2
  const restT = (viewport.h - start.h) / 2
  const restClip = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${restL}px ${restT}px, ${restL + start.w}px ${restT}px, ${restL + start.w}px ${restT + start.h}px, ${restL}px ${restT + start.h}px, ${restL}px ${restT}px)`

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
      <div ref={sceneRef} className="relative h-[250vh] supports-[height:100svh]:h-[250svh]">
        <section ref={stageRef} className="sticky top-0 h-[100vh] w-full overflow-hidden supports-[height:100svh]:h-[100svh]">
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            {/* the frame's shadow, on its own layer and scaled with it,
                so a growing frame never re-paints a 90px blur */}
            <div
              ref={shadowRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-2xl"
              style={{
                width: `${start.w}px`,
                height: `${start.h}px`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 30px 90px -30px rgba(10, 10, 10, 0.35)",
                willChange: "transform",
              }}
            />
            <div
              ref={frameRef}
              data-hero-media
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl"
              style={{
                width: `${start.w}px`,
                height: `${start.h}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* the whole media, at the size that covers the frame's final
                  box, then only scaled: at every step it is exactly as big as
                  a cover-fit of the frame's current size, centred, so the
                  visible crop matches what object-fit: cover would show */}
              <div
                ref={mediaRef}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: `${coverScale(endW, endH, aspect) * aspect}px`,
                  height: `${coverScale(endW, endH, aspect)}px`,
                  transform: `translate(-50%, -50%) scale(${coverScale(start.w, start.h, aspect) / coverScale(endW, endH, aspect)})`,
                  willChange: "transform",
                }}
              >
              {mediaType === "video" ? (
                isYouTubeVideo ? (
                  <div className="relative h-full w-full overflow-hidden">
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
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget
                      if (v.videoWidth && v.videoHeight) setAspect(v.videoWidth / v.videoHeight)
                    }}
                    className="pointer-events-none h-full w-full object-cover"
                  />
                )
              ) : (
                <img
                  src={mediaSrc}
                  alt=""
                  draggable={false}
                  ref={(img) => {
                    // already decoded (cached) images never fire onLoad
                    if (img?.complete && img.naturalWidth) {
                      const a = img.naturalWidth / img.naturalHeight
                      if (Math.abs(a - aspect) > 0.001) setAspect(a)
                    }
                  }}
                  onLoad={(e) => {
                    const img = e.currentTarget
                    if (img.naturalWidth && img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight)
                  }}
                  className="h-full w-full object-cover"
                />
              )}
              </div>
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
              firstRef={(el) => (firstWords.current[0] = el)}
              restRef={(el) => (restWords.current[0] = el)}
              className={`text-white ${textBlend ? "mix-blend-difference" : ""}`}
            />
            {textBlend && (
              <TitleLayer
                first={firstWord}
                rest={remainingTitle}
                firstRef={(el) => (firstWords.current[1] = el)}
                restRef={(el) => (restWords.current[1] = el)}
                layerRef={inkLayerRef}
                className="text-[color:var(--ink)]"
                style={{ clipPath: restClip }}
              />
            )}

            <motion.div
              className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
              style={{
                top: `${indicatorTop}px`,
                color: "var(--ink)",
              }}
              animate={{
                opacity: hintVisible ? 1 : 0,
                y: hintVisible ? 0 : 12,
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
