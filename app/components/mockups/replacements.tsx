import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Three concepts drawn from the second round of references: a photograph
 * tilted in space under a serif name, a serif headline set over a landscape
 * framed by foreground blur, and a giant wordmark over a top-down scene with
 * a caption box.
 */

const SANS = "var(--font-sans), system-ui, sans-serif";
const MONO = "var(--font-mono), ui-monospace, monospace";
const SERIF = "var(--font-serif), Georgia, serif";

function Photo({ src, style }: { src: string; style?: CSSProperties }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="(max-width: 768px) 90vw, 720px"
      className="object-cover"
      style={style}
    />
  );
}

const abs = (s: CSSProperties): CSSProperties => ({ position: "absolute", ...s });

function Blur({ children, amount = 0.55 }: { children: ReactNode; amount?: number }) {
  return (
    <span aria-hidden style={{ filter: `blur(${amount}cqw)`, userSelect: "none", display: "inline-block" }}>
      {children}
    </span>
  );
}

/* B ─ serif over landscape: a framed view, a two-line serif headline, one button */
export function SerifLandscape() {
  return (
    <div className="mock" style={{ background: "#1a2028" }}>
      <Photo src="/images/portfolio/t6-featured-960.jpg" style={{ filter: "saturate(0.8) brightness(0.72)" }} />
      {/* the foreground blur that frames the view */}
      <div style={abs({ inset: "-6cqw", background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(12,16,24,0.7) 78%)" })} />
      <div style={abs({ top: 0, bottom: 0, left: "-10cqw", width: "34cqw", background: "linear-gradient(90deg, rgba(10,14,20,0.85), transparent)", filter: "blur(2cqw)" })} />
      <div style={abs({ top: 0, bottom: 0, right: "-10cqw", width: "30cqw", background: "linear-gradient(270deg, rgba(10,14,20,0.8), transparent)", filter: "blur(2cqw)" })} />

      <div style={abs({ top: "3.5cqw", left: "5cqw", right: "5cqw", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontFamily: SANS, fontSize: "1.5cqw" })}>
        <span style={{ display: "flex", alignItems: "center", gap: "1.2cqw", fontWeight: 600 }}>
          <span style={{ width: "2.4cqw", height: "2.4cqw", borderRadius: 999, border: "1px solid rgba(255,255,255,0.7)" }} />
          <Blur>Elena Ruiz Gardens</Blur>
        </span>
        <span style={{ display: "flex", gap: "2.4cqw", opacity: 0.85 }}>
          <span>Projects</span>
          <span>Studio</span>
          <span>Journal</span>
        </span>
        <span style={{ background: "#fff", color: "#111", borderRadius: 999, padding: "0.9cqw 2cqw", fontWeight: 600 }}>Talk to us</span>
      </div>

      <div style={abs({ top: "22cqw", left: 0, right: 0, textAlign: "center", color: "#fff" })}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8cqw",
            fontFamily: MONO,
            fontSize: "1.1cqw",
            letterSpacing: "0.14em",
            padding: "0.6cqw 1.4cqw",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <span style={{ width: "0.7cqw", height: "0.7cqw", borderRadius: 999, background: "#fff" }} />
          NOW BOOKING SUMMER INSTALLS
        </div>
        <div style={{ fontFamily: SERIF, fontSize: "7.6cqw", lineHeight: 1.05, marginTop: "2.4cqw", letterSpacing: "-0.01em", textShadow: "0 4px 40px rgba(0,0,0,0.45)" }}>
          Gardens worth
          <br />
          coming home to.
        </div>
        <div style={{ fontFamily: SANS, fontSize: "1.7cqw", marginTop: "1.8cqw", opacity: 0.85 }}>
          Design, build and care for outdoor spaces across the coast.
        </div>
        <div style={{ display: "inline-block", marginTop: "2.6cqw", background: "#fff", color: "#111", borderRadius: 999, padding: "1.2cqw 2.6cqw", fontFamily: SANS, fontSize: "1.5cqw", fontWeight: 600 }}>
          See the work
        </div>
      </div>
    </div>
  );
}

/* C ─ wordmark and caption: a top-down scene, the name huge in a corner, a note across from it */
export function WordmarkCaption() {
  return (
    <div className="mock" style={{ background: "#2c3a2a" }}>
      <Photo src="/images/portfolio/t10-real-960.jpg" style={{ filter: "saturate(0.9) brightness(0.82) contrast(1.05)" }} />
      <div style={abs({ inset: 0, background: "linear-gradient(180deg, rgba(20,26,18,0.35), transparent 45%, rgba(20,26,18,0.4))" })} />

      <div style={abs({ top: "3.5cqw", left: "5cqw", display: "flex", alignItems: "center", gap: "1cqw" })}>
        <span style={{ width: "0.9cqw", height: "0.9cqw", borderRadius: 999, background: "#fff" }} />
      </div>
      <div style={abs({ top: "3.6cqw", right: "13cqw", display: "flex", gap: "2.4cqw", fontFamily: SANS, fontSize: "1.2cqw", letterSpacing: "0.1em", color: "#fff", fontWeight: 600 })}>
        <span style={{ borderBottom: "1px solid rgba(255,255,255,0.7)", paddingBottom: "0.3cqw" }}>INTRO</span>
        <span>SERVICES</span>
        <span>PROJECTS</span>
        <span>CONTACT</span>
      </div>
      <div style={abs({ top: 0, right: 0, width: "6cqw", height: "22cqw", background: "#f3f1ea", display: "grid", placeItems: "center" })}>
        <span style={{ writingMode: "vertical-rl", fontFamily: SANS, fontSize: "1.1cqw", letterSpacing: "0.12em", fontWeight: 700, color: "#111" }}>
          ● SINCE 2011
        </span>
      </div>

      <div style={abs({ top: "5.5cqw", left: "5cqw", fontFamily: SANS, fontSize: "1.2cqw", letterSpacing: "0.1em", color: "#fff", fontWeight: 600 })}>
        MADE FOR YARDS. BUILT FOR SUMMERS.
      </div>
      <div style={abs({ top: "7cqw", left: "4.4cqw", fontFamily: SANS, fontSize: "14.5cqw", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1, color: "#f5f2e8", textShadow: "0 6px 40px rgba(0,0,0,0.35)" })}>
        <Blur amount={0.5}>MEADOW</Blur>
      </div>

      <div style={abs({ top: "40cqw", right: "9cqw", width: "34cqw", fontFamily: SANS, fontSize: "2.1cqw", fontWeight: 600, lineHeight: 1.35, color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.4)" })}>
        Designed to be lived in, mowed once a week, and looked at every evening. We make the simplest yard feel considered.
      </div>

      <div style={abs({ bottom: "0", left: "5cqw", width: "24cqw", padding: "2.4cqw 2cqw 2cqw", background: "rgba(40,36,30,0.72)", backdropFilter: "blur(6px)", color: "#fff", fontFamily: SANS })}>
        <div style={{ fontSize: "1.55cqw", fontWeight: 700, lineHeight: 1.35, letterSpacing: "0.02em" }}>
          DESIGNED
          <br />
          BY <Blur amount={0.4}>MEADOW</Blur>,
          <br />
          THE FAMILY-RUN
          <br />
          LAWN STUDIO.
        </div>
        <div style={{ marginTop: "1.8cqw", borderTop: "1px dotted rgba(255,255,255,0.5)", paddingTop: "1.2cqw", fontSize: "1.2cqw", opacity: 0.85, textAlign: "right" }}>
          The state{"’"}s most
        </div>
      </div>
    </div>
  );
}

/* D ─ glass card: a centred glass nav, a serif headline over the scene, a frosted panel below */
export function GlassCard() {
  return (
    <div className="mock" style={{ background: "#1f2a1e" }}>
      <Photo src="/images/portfolio/t9-hero-960.jpg" style={{ filter: "saturate(0.95) brightness(0.9)" }} />
      <div style={abs({ inset: 0, background: "linear-gradient(180deg, rgba(10,16,12,0.25), transparent 40%, rgba(10,16,12,0.55))" })} />

      {/* the centred glass pill */}
      <div
        style={abs({
          top: "3cqw",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "2.4cqw",
          padding: "1cqw 1.2cqw 1cqw 2cqw",
          borderRadius: "1.2cqw",
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontFamily: SANS,
          fontSize: "1.45cqw",
          whiteSpace: "nowrap",
        })}
      >
        <span style={{ width: "2cqw", height: "2cqw", borderRadius: "0.5cqw", background: "rgba(255,255,255,0.7)" }} />
        <span style={{ opacity: 0.9 }}>About</span>
        <span style={{ opacity: 0.9 }}>Projects</span>
        <span style={{ opacity: 0.9 }}>Care plans</span>
        <span style={{ background: "#151a15", color: "#fff", borderRadius: "0.7cqw", padding: "0.7cqw 1.6cqw", fontWeight: 600 }}>Get a quote {"->"}</span>
      </div>
      <div style={abs({ top: "3.6cqw", right: "4cqw", fontFamily: MONO, fontSize: "1.1cqw", letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" })}>
        AUSTIN, TX
      </div>

      <div
        style={abs({
          top: "16cqw",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontFamily: SERIF,
          fontSize: "7.4cqw",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          textShadow: "0 4px 40px rgba(0,0,0,0.45)",
        })}
      >
        The <Blur amount={0.5}>Fairmont</Blur> Garden
        <br />
        Company of Austin
      </div>

      <div
        style={abs({
          left: "4cqw",
          bottom: "4cqw",
          width: "40cqw",
          padding: "2.4cqw 2.6cqw",
          borderRadius: "1.4cqw",
          background: "rgba(20,26,20,0.42)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        })}
      >
        <div style={{ fontFamily: SERIF, fontSize: "3.4cqw", lineHeight: 1.12 }}>
          Gardens that run
          <br />
          themselves
        </div>
        <div style={{ fontFamily: SANS, fontSize: "1.4cqw", lineHeight: 1.55, marginTop: "1.4cqw", opacity: 0.85 }}>
          Design, planting and year-round care from one crew, so the garden looks like this every month, not just the first.
        </div>
        <div style={{ fontFamily: SANS, fontSize: "1.35cqw", marginTop: "1.8cqw", fontWeight: 600 }}>
          Get to know us <span style={{ opacity: 0.6 }}>{"->"}</span>
        </div>
      </div>
    </div>
  );
}
