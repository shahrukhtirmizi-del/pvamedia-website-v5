import ParticleField from "../fx/ParticleField";

/**
 * The page-wide ground. A fixed particle field sits at z-index -1, between
 * the html background and the content, so every section drifts in the same
 * air instead of sitting on a flat block. Sections keep transparent
 * backgrounds and separate with hairlines only.
 */
export default function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1]">
      <ParticleField density={0.6} fixed maxDpr={1} />
      {/* a soft vignette so the middle of the page reads a shade deeper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(199,206,220,0.05), transparent 60%)",
        }}
      />
    </div>
  );
}
