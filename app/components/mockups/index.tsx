import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Eight hero concepts for landscaping companies. Each is a self-contained
 * composition sized in container units (cqw), so the same markup reads
 * correctly at 300px in the rail and at 700px in the modal.
 *
 * These are concepts, and the site says so where they appear. The company
 * names are invented. The photography is real.
 */

const SANS = "var(--font-sans), system-ui, sans-serif";
const MONO = "var(--font-mono), ui-monospace, monospace";
const SERIF = "var(--font-serif), Georgia, serif";

export type Mockup = {
  slug: string;
  /** shown on the card: the client's first name and their state */
  client: string;
  state: string;
  direction: string;
  note: string;
  cover: string;
  Component: () => ReactNode;
};

function Photo({
  src,
  style,
  className = "",
  priority = false,
}: {
  src: string;
  style?: CSSProperties;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="(max-width: 768px) 90vw, 720px"
      priority={priority}
      className={`object-cover ${className}`}
      style={style}
    />
  );
}

const abs = (s: CSSProperties): CSSProperties => ({ position: "absolute", ...s });

/** Company and personal names are softened out of every concept for privacy. */
function Blur({ children, amount = 0.55 }: { children: ReactNode; amount?: number }) {
  return (
    <span aria-hidden style={{ filter: `blur(${amount}cqw)`, userSelect: "none", display: "inline-block" }}>
      {children}
    </span>
  );
}

/* 1 ─ split screen, two photographs meeting at the seam, type across both */
function Northline() {
  return (
    <div className="mock" style={{ background: "#07101f" }}>
      <div style={abs({ inset: 0, width: "50%" })}>
        <Photo src="/images/portfolio/t6-featured-960.jpg" style={{ filter: "brightness(0.62) saturate(0.85)" }} />
      </div>
      <div style={abs({ inset: 0, left: "50%" })}>
        <Photo src="/images/portfolio/t4-hero-960.jpg" style={{ filter: "brightness(1.05) saturate(0.7)" }} />
        <div style={abs({ inset: 0, background: "rgba(205,224,214,0.55)", mixBlendMode: "screen" })} />
      </div>
      <div
        style={abs({
          inset: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3.4cqw 4cqw",
          height: "10cqw",
          fontFamily: SANS,
          color: "#fff",
          fontSize: "1.9cqw",
          letterSpacing: "0.22em",
        })}
      >
        <Blur><span style={{ fontWeight: 600 }}>NORTHLINE</span></Blur>
        <span style={{ display: "flex", gap: "3cqw", fontSize: "1.6cqw", letterSpacing: "0.08em", color: "#0b1220", fontWeight: 600 }}>
          <span>Work</span>
          <span>Services</span>
          <span>Contact</span>
        </span>
      </div>
      <div
        style={abs({
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: SANS,
          textShadow: "0 2px 40px rgba(0,0,0,0.45)",
        })}
      >
        <span style={{ fontSize: "1.9cqw", letterSpacing: "0.32em", marginBottom: "3cqw", opacity: 0.9 }}>
          LANDSCAPE DESIGN + BUILD
        </span>
        {["Design", "Build", "Maintain"].map((w) => (
          <span key={w} style={{ fontSize: "10.5cqw", lineHeight: 1.08, fontWeight: 500, letterSpacing: "-0.02em" }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 2 ─ editorial index: pale ground, mono meta, one tilted plate, a big number */
function SableStone() {
  const meta: CSSProperties = { fontFamily: MONO, fontSize: "1.35cqw", letterSpacing: "0.04em", lineHeight: 1.6, color: "#141414" };
  return (
    <div className="mock" style={{ background: "#ecebe6" }}>
      <div style={abs({ top: "3cqw", left: "3.5cqw", fontFamily: SANS, fontSize: "3.2cqw", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.05em", color: "#111" })}>
        <Blur amount={0.9}>S&amp;S</Blur>
        <br />
        26
      </div>
      <div style={abs({ top: "3cqw", left: "18cqw", ...meta })}>
        TAKING PROJECTS FOR SPRING
        <br />
        <Blur amount={0.4}><u>HELLO@SABLEANDSTONE.CO</u></Blur>
        <br />
        <u>+1 512 555 0148</u>
      </div>
      <div style={abs({ top: "3cqw", left: "52cqw", ...meta })}>
        HARDSCAPE / PLANTING
        <br />
        POOLS / OUTDOOR ROOMS
        <br />
        LIGHTING
      </div>
      <div style={abs({ top: "3cqw", right: "3.5cqw", textAlign: "right", ...meta })}>
        {"->"} WRK
        <br />
        ABT
      </div>

      <div
        style={abs({
          top: "19cqw",
          left: "30cqw",
          width: "33cqw",
          height: "33cqw",
          transform: "rotate(-1.6deg)",
          boxShadow: "0 30px 60px -30px rgba(0,0,0,0.45)",
        })}
      >
        <Photo src="/images/portfolio/t3-hero-960.jpg" />
      </div>
      <div
        style={abs({
          top: "29cqw",
          left: "58cqw",
          fontFamily: SANS,
          fontSize: "12.5cqw",
          fontWeight: 700,
          lineHeight: 0.88,
          letterSpacing: "-0.06em",
          color: "#111",
        })}
      >
        NO.01
        <br />
        <span style={{ paddingLeft: "3cqw" }}>/08</span>
      </div>
      <div style={abs({ top: "56cqw", left: "66cqw", fontFamily: SANS, fontSize: "1.9cqw", fontWeight: 600, lineHeight: 1.2, color: "#111" })}>
        Cedar Court,
        <br />
        Westlake Hills
      </div>
      <div style={abs({ bottom: "3cqw", left: "18cqw", ...meta })}>
        © <Blur amount={0.4}>SABLE &amp; STONE</Blur>
        <br />
        LANDSCAPE CO.
      </div>
      <div style={abs({ bottom: "3cqw", right: "3.5cqw", textAlign: "right", ...meta })}>
        LIC. 07186749
        <br />
        AUSTIN, TX
      </div>
    </div>
  );
}

/* 3 ─ letterboxed cinema: night garden, one title, one caption */
function Verdant() {
  return (
    <div className="mock" style={{ background: "#000" }}>
      <div style={abs({ top: "10cqw", bottom: "10cqw", left: "9cqw", right: "9cqw" })}>
        <Photo src="/images/portfolio/t7-hero-960.jpg" style={{ filter: "brightness(0.9)" }} />
        <div style={abs({ inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.75))" })} />
      </div>
      <div style={abs({ top: "3.2cqw", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "8cqw", alignItems: "baseline", color: "#fff" })}>
        <Blur><span style={{ fontFamily: SANS, fontSize: "3cqw", fontWeight: 600, letterSpacing: "-0.03em" }}>Verdant</span></Blur>
        <span style={{ fontFamily: MONO, fontSize: "1.5cqw", letterSpacing: "0.06em", opacity: 0.9 }}>SAN DIEGO CA 08:42:02 PM</span>
      </div>
      <div style={abs({ bottom: "13cqw", left: "9cqw", fontFamily: SANS, fontSize: "5.4cqw", fontWeight: 600, letterSpacing: "-0.035em", color: "#fff", textShadow: "0 2px 30px rgba(0,0,0,0.5)" })}>
        Canyon Ridge Residence
      </div>
      <div style={abs({ bottom: "13.4cqw", right: "9cqw", textAlign: "right", fontFamily: MONO, fontSize: "1.55cqw", letterSpacing: "0.08em", lineHeight: 1.7, color: "#fff" })}>
        LA JOLLA, CA
        <br />
        <span style={{ opacity: 0.6 }}>NIGHT GARDEN, 2026</span>
      </div>
    </div>
  );
}

/* 4 ─ hexagon: white ground, a cut photograph, a side note */
function Ridgeway() {
  return (
    <div className="mock" style={{ background: "#ffffff" }}>
      <div style={abs({ top: "4cqw", left: "5cqw", right: "5cqw", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SANS, color: "#1c1c1c" })}>
        <span style={{ display: "flex", alignItems: "center", gap: "1.2cqw", fontSize: "2.3cqw", fontWeight: 500 }}>
          <span style={{ width: "3cqw", height: "3cqw", background: "#1c1c1c", clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)" }} />
          <Blur>Ridgeway</Blur>
        </span>
        <span style={{ display: "flex", gap: "3.4cqw", fontSize: "1.75cqw", opacity: 0.8 }}>
          <span>Work</span>
          <span>Studio</span>
          <span>Services</span>
          <span>Journal</span>
          <span>Contact</span>
        </span>
      </div>
      <div
        style={abs({
          top: "12cqw",
          left: "27cqw",
          width: "40cqw",
          height: "46cqw",
          clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
        })}
      >
        <Photo src="/images/portfolio/t4-hero-960.jpg" style={{ filter: "saturate(0.6) brightness(0.8)" }} />
        <div style={abs({ inset: 0, background: "rgba(20,30,20,0.25)" })} />
        <div style={abs({ inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontSize: "4.6cqw", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", textAlign: "center" })}>
          <span>
            <span style={{ display: "inline-block", width: "6cqw", height: "0.35cqw", background: "#fff", verticalAlign: "middle", marginRight: "1.6cqw" }} />
            The garden
            <br />
            legacy.
          </span>
        </div>
      </div>
      <div style={abs({ top: "30cqw", right: "5cqw", width: "20cqw", fontFamily: SANS, color: "#1c1c1c" })}>
        <div style={{ fontSize: "1.6cqw", opacity: 0.55, marginBottom: "2cqw" }}>News</div>
        <div style={{ fontSize: "2.1cqw", fontWeight: 600, lineHeight: 1.25 }}>Barton Creek pool house.</div>
        <div style={{ fontSize: "1.55cqw", opacity: 0.6, lineHeight: 1.5, marginTop: "1.4cqw" }}>
          The studio completes a two acre hill country garden with a spring fed pool.
        </div>
      </div>
    </div>
  );
}

/* 5 ─ collage: overlapping plates on a dusty ground, a serif headline over all */
function Halcyon() {
  const plate = (src: string, s: CSSProperties) => (
    <div style={abs({ boxShadow: "0 24px 50px -24px rgba(20,10,10,0.5)", ...s })}>
      <Photo src={src} />
    </div>
  );
  return (
    <div className="mock" style={{ background: "#b1a5a0" }}>
      <div style={abs({ top: "4cqw", left: "6cqw", right: "6cqw", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontFamily: SERIF })}>
        <Blur amount={0.8}><span style={{ fontSize: "3.6cqw", letterSpacing: "0.5em" }}>HALCYON</span></Blur>
        <span style={{ display: "flex", gap: "3cqw", fontFamily: SANS, fontSize: "1.45cqw", letterSpacing: "0.3em" }}>
          <span>ABOUT</span>
          <span>PORTFOLIO</span>
          <span>JOURNAL</span>
          <span>CONTACT</span>
        </span>
      </div>
      {plate("/images/portfolio/t6-gallery-1-960.jpg", { top: "18cqw", left: "14cqw", width: "22cqw", height: "30cqw" })}
      {plate("/images/portfolio/t6-hero-960.jpg", { top: "13cqw", left: "58cqw", width: "16cqw", height: "24cqw" })}
      {plate("/images/portfolio/t6-gallery-2-960.jpg", { top: "36cqw", left: "22cqw", width: "12cqw", height: "16cqw" })}
      {plate("/images/portfolio/t1-hero-960.jpg", { top: "30cqw", left: "66cqw", width: "20cqw", height: "26cqw" })}
      <div style={abs({ top: "22cqw", left: "0", right: "0", textAlign: "center", color: "#fff", fontFamily: SERIF, fontSize: "9.2cqw", lineHeight: 0.98, fontWeight: 500, textShadow: "0 2px 30px rgba(60,30,30,0.35)" })}>
        Making
        <br />
        Outdoor
        <br />
        Rooms
      </div>
      <div style={abs({ top: "52cqw", left: "0", right: "0", textAlign: "center", color: "#fff", fontFamily: SANS, fontSize: "1.45cqw", letterSpacing: "0.42em", lineHeight: 1.9 })}>
        <Blur amount={0.4}>LEONA MARCH</Blur>
        <br />
        &amp; <Blur amount={0.4}>TOBIAS HALE</Blur>
      </div>
    </div>
  );
}

/* 6 ─ dark stills: pill nav, serif title, a stack of rounded frames */
function TerraForma() {
  const pill: CSSProperties = { border: "1px solid rgba(255,255,255,0.45)", borderRadius: 999, padding: "0.5cqw 1.5cqw", fontSize: "1.25cqw", letterSpacing: "0.08em" };
  const frame = (src: string, s: CSSProperties) => (
    <div style={abs({ borderRadius: "2cqw", overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)", ...s })}>
      <Photo src={src} />
    </div>
  );
  return (
    <div className="mock" style={{ background: "#0f1215" }}>
      <div style={abs({ top: "3cqw", left: "4cqw", right: "4cqw", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontFamily: SANS })}>
        <span style={{ display: "flex", gap: "0.8cqw" }}>
          <span style={pill}>WORK</span>
          <span style={pill}>PROCESS</span>
          <span style={pill}>ABOUT</span>
        </span>
        <Blur><span style={{ fontFamily: SERIF, fontSize: "3.2cqw", letterSpacing: "-0.01em" }}>Terra Forma</span></Blur>
        <span style={{ display: "flex", gap: "0.8cqw" }}>
          <span style={pill}>INSTAGRAM</span>
          <span style={pill}>EMAIL</span>
        </span>
      </div>
      <div style={abs({ top: "15cqw", left: "0", right: "0", textAlign: "center", color: "#fff" })}>
        <div style={{ fontFamily: MONO, fontSize: "1.35cqw", letterSpacing: "0.12em", opacity: 0.8 }}>SPRING 2026 {"->"} RANCHO SANTA FE</div>
        <div style={{ fontFamily: SERIF, fontSize: "9cqw", lineHeight: 1, marginTop: "1cqw", letterSpacing: "-0.02em" }}>Estancia</div>
      </div>
      {frame("/images/portfolio/t1-hero-960.jpg", { top: "31cqw", left: "27cqw", width: "46cqw", height: "27cqw" })}
      {frame("/images/portfolio/t5-hero-960.jpg", { top: "27cqw", left: "68cqw", width: "16cqw", height: "12cqw" })}
      {frame("/images/portfolio/t9-hero-960.jpg", { top: "46cqw", left: "62cqw", width: "16cqw", height: "12cqw" })}
      {frame("/images/portfolio/t6-gallery-2-960.jpg", { top: "38cqw", left: "18cqw", width: "16cqw", height: "12cqw" })}
      <div style={abs({ top: "40.5cqw", left: "46cqw", width: "8cqw", height: "8cqw", borderRadius: 999, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center" })}>
        <span style={{ width: 0, height: 0, borderLeft: "2.2cqw solid #fff", borderTop: "1.3cqw solid transparent", borderBottom: "1.3cqw solid transparent", marginLeft: "0.6cqw" }} />
      </div>
    </div>
  );
}

/* 7 ─ loud: motion-blurred ground, three-line shout, one hot colour */
function BluffCreek() {
  const green = "#21d35b";
  return (
    <div className="mock" style={{ background: "#0a0c0a" }}>
      <Photo src="/images/portfolio/t2-hero-480.jpg" style={{ filter: "blur(7px) brightness(0.42) saturate(1.2)", transform: "scale(1.15)" }} />
      <div style={abs({ inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.55), transparent 50%, rgba(0,0,0,0.4))" })} />
      <div style={abs({ top: "3.5cqw", left: "4cqw", right: "4cqw", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" })}>
        <Blur amount={0.8}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "4.4cqw" }}>Bluff Creek</span></Blur>
        <span style={{ background: "#f4f4f0", color: "#111", borderRadius: "0.6cqw", padding: "1.2cqw 2cqw", width: "22cqw", display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: "1.5cqw", fontWeight: 700 }}>
          <span>Menu</span>
          <span>≡</span>
        </span>
        <span style={{ fontFamily: SANS, fontSize: "1.3cqw", letterSpacing: "0.22em", fontWeight: 700 }}>START A CONVERSATION</span>
      </div>
      <div style={abs({ top: "21cqw", left: "0", right: "0", textAlign: "center", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: "8.2cqw", lineHeight: 1, letterSpacing: "-0.02em" })}>
        WE BUILD
        <br />
        <span style={{ color: green }}>LAWNS PEOPLE</span>
        <br />
        REMEMBER.
      </div>
      <div style={abs({ bottom: "6cqw", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "1.5cqw", fontFamily: SANS, fontSize: "1.3cqw", letterSpacing: "0.2em", fontWeight: 700 })}>
        <span style={{ background: green, color: "#062", padding: "1.6cqw 3cqw" }}>VIEW SELECTED WORK {"->"}</span>
        <span style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff", padding: "1.6cqw 3cqw" }}>START A CONVERSATION</span>
      </div>
    </div>
  );
}

/* 8 ─ warm and lowercase: one photograph, one soft sentence */
function Oakhaven() {
  return (
    <div className="mock" style={{ background: "#2a1e12" }}>
      <Photo src="/images/portfolio/t10-real-960.jpg" style={{ filter: "brightness(0.78) saturate(0.9)" }} />
      <div style={abs({ inset: 0, background: "linear-gradient(180deg, rgba(40,26,14,0.35), rgba(40,26,14,0.15) 50%, rgba(40,26,14,0.55))" })} />
      <div style={abs({ top: "4cqw", left: "5cqw", right: "5cqw", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontFamily: SANS })}>
        <span style={{ fontSize: "2.4cqw" }}>
          <Blur><b>oakhaven</b></Blur> landscapes
        </span>
        <span style={{ display: "flex", gap: "3cqw", fontSize: "2cqw", opacity: 0.9 }}>
          <span>projects</span>
          <span>studio</span>
          <span>office</span>
        </span>
      </div>
      <div style={abs({ top: "34cqw", left: "0", right: "0", textAlign: "center", color: "#fff", fontFamily: SANS, fontSize: "7.6cqw", lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 500, textShadow: "0 2px 30px rgba(0,0,0,0.35)" })}>
        designing gardens
        <br />
        connecting people
      </div>
      <div style={abs({ bottom: "4cqw", left: "5cqw", color: "#fff", fontFamily: SANS, fontSize: "1.6cqw", lineHeight: 1.6, display: "flex", gap: "4cqw" })}>
        <span>
          <Blur amount={0.4}>hello@oakhaven.co</Blur>
          <br />
          +1 619 555 0193
        </span>
        <span>
          2130 Fern Street
          <br />
          San Diego, CA
        </span>
      </div>
    </div>
  );
}

export const MOCKUPS: Mockup[] = [
  {
    slug: "northline",
    client: "Daniel",
    state: "TX",
    direction: "Split screen",
    note: "Two photographs meet at a seam, with the three things the company does set across both. Built for a design and build firm with strong before and after work.",
    cover: "/images/portfolio/t6-featured-960.jpg",
    Component: Northline,
  },
  {
    slug: "sable-stone",
    client: "Marcus",
    state: "TX",
    direction: "Editorial index",
    note: "A pale ground, monospaced details, one tilted plate and a large project number. Reads like a print portfolio and suits a high-end hardscape studio.",
    cover: "/images/portfolio/t3-hero-960.jpg",
    Component: SableStone,
  },
  {
    slug: "verdant",
    client: "Elena",
    state: "CA",
    direction: "Cinema letterbox",
    note: "One night photograph, one project title, one caption. Everything else is dark. For a company whose lighting work speaks for itself.",
    cover: "/images/portfolio/t7-hero-960.jpg",
    Component: Verdant,
  },
  {
    slug: "ridgeway",
    client: "Tom",
    state: "TX",
    direction: "Cut photograph",
    note: "A hexagon cut out of a bright ground with a headline across it and a news column beside. Clean, corporate, trusted by architects.",
    cover: "/images/portfolio/t4-hero-960.jpg",
    Component: Ridgeway,
  },
  {
    slug: "halcyon",
    client: "Sarah",
    state: "NC",
    direction: "Collage",
    note: "Overlapping plates on a dusty ground with a serif headline laid over the lot. Warm and personal, for a husband and wife garden design practice.",
    cover: "/images/portfolio/t6-gallery-1-960.jpg",
    Component: Halcyon,
  },
  {
    slug: "terra-forma",
    client: "Javier",
    state: "CA",
    direction: "Dark stills",
    note: "Pill navigation, a serif title, and a stack of rounded frames with a play button. For a firm that films its builds.",
    cover: "/images/portfolio/t1-hero-960.jpg",
    Component: TerraForma,
  },
  {
    slug: "bluff-creek",
    client: "Cody",
    state: "GA",
    direction: "Loud",
    note: "A blurred ground, a three line shout and one hot colour. For a lawn care company that wants to own the neighbourhood.",
    cover: "/images/portfolio/t2-hero-960.jpg",
    Component: BluffCreek,
  },
  {
    slug: "oakhaven",
    client: "Priya",
    state: "CA",
    direction: "Warm and lowercase",
    note: "One golden hour photograph and one soft sentence in lowercase. For a studio selling calm rather than scale.",
    cover: "/images/portfolio/t10-real-960.jpg",
    Component: Oakhaven,
  },
];
