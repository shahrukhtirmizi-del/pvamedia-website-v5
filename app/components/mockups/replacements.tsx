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

/* A ─ tilted plate: one photograph turned in space, the studio's name across it */
export function TiltedPlate() {
  return (
    <div className="mock" style={{ background: "#08090c", perspective: "120cqw" }}>
      <div
        style={abs({
          top: "4cqw",
          left: "4cqw",
          right: "4cqw",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: SANS,
          fontSize: "1.45cqw",
          lineHeight: 1.5,
          color: "#fff",
        })}
      >
        <span>
          <Blur amount={0.4}>Marcus Delgado</Blur>
          <br />
          <span style={{ opacity: 0.6 }}>Landscape design and build</span>
        </span>
        <span style={{ display: "flex", gap: "2cqw" }}>
          <span>Index</span>
          <span style={{ opacity: 0.5 }}>About</span>
        </span>
      </div>

      <div
        style={abs({
          top: "14cqw",
          left: "17cqw",
          width: "66cqw",
          height: "42cqw",
          transform: "rotateY(-14deg) rotateX(8deg) rotateZ(-3deg)",
          transformStyle: "preserve-3d",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
          overflow: "hidden",
          borderRadius: "0.6cqw",
        })}
      >
        <Photo src="/images/portfolio/t6-gallery-2-960.jpg" style={{ filter: "saturate(0.85) brightness(0.8)" }} />
        <div style={abs({ inset: 0, background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.05), rgba(0,0,0,0.5))" })} />
      </div>

      <div
        style={abs({
          top: "22cqw",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          textShadow: "0 4px 40px rgba(0,0,0,0.6)",
        })}
      >
        <div style={{ fontFamily: SANS, fontSize: "1.5cqw", fontWeight: 600, letterSpacing: "0.02em" }}>Landscape Design Studio</div>
        <div style={{ fontFamily: SERIF, fontSize: "13cqw", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: "0.6cqw" }}>
          <Blur amount={0.45}>Stonefield</Blur>
        </div>
      </div>

      <div
        style={abs({
          top: "36cqw",
          left: "47.5cqw",
          width: "5cqw",
          height: "5cqw",
          borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          display: "grid",
          placeItems: "center",
          color: "#fff",
          fontSize: "2.2cqw",
          fontFamily: SANS,
        })}
      >
        {"->"}
      </div>

      <div style={abs({ bottom: "4cqw", left: "4cqw", fontFamily: SANS, fontSize: "1.45cqw", lineHeight: 1.5, color: "#fff" })}>
        Taking projects
        <br />
        <span style={{ opacity: 0.6 }}>Spring 2026 {"↗"}</span>
      </div>
      <div style={abs({ bottom: "4cqw", right: "4cqw", display: "flex", flexDirection: "column", gap: "0.5cqw" })}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: "1.8cqw", height: "1.2cqw", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "0.2cqw", background: i === 0 ? "rgba(255,255,255,0.6)" : "transparent" }} />
        ))}
      </div>
    </div>
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
