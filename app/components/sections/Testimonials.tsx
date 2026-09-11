import Reveal from "../ui/Reveal";
import LaserBackground from "../fx/LaserBackground";
import Stars from "../ui/Stars";
import { TESTIMONIALS } from "../../lib/site";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y" style={{ borderColor: "var(--line)" }}>
      <div className="absolute inset-0 z-0" aria-hidden>
        <LaserBackground centerX={-1.1} centerY={0.55} opacity={0.38} scale={0.5} />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p
            className="font-mono mb-12 text-[11px] uppercase tracking-[0.2em] md:mb-16"
            style={{ color: "var(--ink-45)" }}
          >
            From our clients
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <figure
                className="surface flex h-full flex-col p-8 md:p-10"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <Stars />

                <blockquote
                  className="font-display mt-7 font-medium"
                  style={{ fontSize: "clamp(20px, 2.3vw, 27px)", lineHeight: 1.34 }}
                >
                  {"“"}
                  {item.quote}
                  {"”"}
                </blockquote>

                <figcaption className="mt-auto pt-8 text-[14px]" style={{ color: "var(--ink-60)" }}>
                  <span style={{ color: "var(--ink)" }}>{item.name}</span>, {item.location}
                  <br />
                  Landscaping company owner
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
