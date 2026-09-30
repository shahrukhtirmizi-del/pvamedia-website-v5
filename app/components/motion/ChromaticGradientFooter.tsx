"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type GradientStop = {
  offset: number;
  color: string;
};

const VIEW_WIDTH = 1440;
const VIEW_HEIGHT = 620;

// monochrome: ink at the base, greying out to nothing as the glow rises
const GRADIENT_STOPS: GradientStop[] = [
  { offset: 0, color: "#0a0a0a" },
  { offset: 0.17, color: "#1c1c1c" },
  { offset: 0.34, color: "#3d3d3d" },
  { offset: 0.5, color: "#767676" },
  { offset: 0.66, color: "#b4b4b4" },
  { offset: 0.82, color: "#e2e2e2" },
  { offset: 1, color: "#ffffff00" },
];

const navigation = [
  {
    title: "Platform",
    links: ["Workspace", "Automation", "Collaboration", "Releases"],
  },
  {
    title: "Explore",
    links: ["Journal", "Playbooks", "Templates", "Community"],
  },
  {
    title: "Studio",
    links: ["Our story", "Careers", "Partners", "Contact"],
  },
  {
    title: "Policies",
    links: ["Privacy", "Terms", "Accessibility", "Security"],
  },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function createGlowProfile(
  count: number,
  peak: number,
  edgeHeight: number,
) {
  return Array.from({ length: count }, (_, index) => {
    const position = count === 1 ? 0.5 : index / (count - 1);
    const distance = Math.abs(position - 0.5) * 2;
    const dome = Math.cos((distance * Math.PI) / 2);
    const curve = Math.pow(Math.max(0, dome), 0.72);
    const variation = 0.97 + Math.cos(index * 1.9) * 0.03;

    return (
      VIEW_HEIGHT *
      peak *
      (edgeHeight + (1 - edgeHeight) * curve) *
      variation
    );
  });
}

interface ChromaticFooterProps {
  children: ReactNode;
  glowHeight?: string;
  restingScale?: number;
  columns?: number;
  blur?: number;
  className?: string;
  style?: CSSProperties;
}

function ChromaticFooter({
  children,
  glowHeight = "clamp(270px, 44svh, 520px)",
  restingScale = 0.035,
  columns = 11,
  blur = 20,
  className,
  style,
}: ChromaticFooterProps) {
  const id = useId().replace(/:/g, "");
  const glowRef = useRef<HTMLDivElement>(null);
  const safeColumns = Math.max(3, Math.floor(columns));
  const columnWidth = VIEW_WIDTH / safeColumns;

  const profile = useMemo(
    () => createGlowProfile(safeColumns, 0.98, 0.42),
    [safeColumns],
  );

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const doc = glow.ownerDocument;
    const win = doc.defaultView ?? window;
    const reducedMotion = win.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let animationFrame = 0;

    const updateGlow = () => {
      animationFrame = 0;

      if (reducedMotion.matches) {
        glow.style.transform = "translateZ(0) scaleY(1)";
        return;
      }

      const scrollingElement =
        doc.scrollingElement ?? doc.documentElement;

      const glowHeightPixels = glow.offsetHeight || 1;
      const scrollTop = win.scrollY || scrollingElement.scrollTop;
      const maxScroll = Math.max(
        0,
        scrollingElement.scrollHeight - win.innerHeight,
      );

      const remainingScroll = Math.max(0, maxScroll - scrollTop);
      const reveal = clamp(
        (glowHeightPixels - remainingScroll) / glowHeightPixels,
      );

      const scale =
        clamp(restingScale) + (1 - clamp(restingScale)) * reveal;

      glow.style.transform = `translateZ(0) scaleY(${scale})`;
    };

    const scheduleUpdate = () => {
      if (!animationFrame) {
        animationFrame = win.requestAnimationFrame(updateGlow);
      }
    };

    scheduleUpdate();

    win.addEventListener("scroll", scheduleUpdate, { passive: true });
    win.addEventListener("resize", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener?.("change", scheduleUpdate);

    return () => {
      if (animationFrame) {
        win.cancelAnimationFrame(animationFrame);
      }

      win.removeEventListener("scroll", scheduleUpdate);
      win.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener?.("change", scheduleUpdate);
    };
  }, [restingScale]);

  return (
    <footer
      className={className}
      style={{
        position: "relative",
        isolation: "isolate",
        paddingBottom: glowHeight,
        ...style,
      }}
    >
      <div className="relative z-10">{children}</div>

      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0"
        style={{
          height: glowHeight,
          transform: `translateZ(0) scaleY(${clamp(restingScale)})`,
          transformOrigin: "bottom center",
          willChange: "transform",
        }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block size-full"
        >
          <defs>
            <linearGradient
              id={`gradient-${id}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={VIEW_HEIGHT}
              x2="0"
              y2="0"
            >
              {GRADIENT_STOPS.map((stop, index) => (
                <stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>

            <filter
              id={`blur-${id}`}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>

          <g filter={`url(#blur-${id})`}>
            {profile.map((height, index) => (
              <rect
                key={index}
                x={index * columnWidth - columnWidth * 0.09}
                y={VIEW_HEIGHT - height}
                width={columnWidth * 1.18}
                height={height + blur}
                rx={columnWidth * 0.24}
                fill={`url(#gradient-${id})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </footer>
  );
}

// Reference usage — PVA Media's real footer content (nav links, newsletter
// copy, socials) should replace this markup; the glow effect above is the
// reusable part.
function FooterContentExample() {
  return (
    <ChromaticFooter>
      <div className="mx-auto w-full max-w-6xl px-5 pt-14 sm:px-8 lg:pt-20">
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative block size-9 rounded-full border border-zinc-950/20">
                <span className="absolute inset-[8px] rounded-full bg-zinc-950" />
              </span>

              <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                Northstar
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-600">
              Thoughtful digital tools created for ambitious teams building
              meaningful products.
            </p>

            <form
              className="mt-7 flex max-w-sm gap-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                className="h-11 min-w-0 flex-1 rounded-full border border-zinc-950/15 bg-white/60 px-4 text-sm outline-none backdrop-blur-md transition focus:border-zinc-950/45"
              />

              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-zinc-950 px-5 text-xs font-semibold uppercase tracking-wider text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Subscribe
              </button>
            </form>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {navigation.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {group.title}
                </h2>

                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-zinc-950/10 py-7 text-xs uppercase tracking-[0.15em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Northstar</span>

          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            Systems operational
          </span>

          <span>Independent · Worldwide</span>
        </div>
      </div>
    </ChromaticFooter>
  );
}

export { FooterContentExample };
export default ChromaticFooter;
