import Image from "next/image";
import Reveal from "../ui/Reveal";
import ScrollWords from "../ui/ScrollWords";
import TiltCard from "../ui/TiltCard";
import { PAIN_POINTS, PAIN_CLOSER } from "../../lib/site";

/** Every cell sits on a photograph, sunk deep into the palette. */
const PHOTO = [
  "/images/portfolio/t2-hero-960.jpg",
  "/images/portfolio/t5-hero-960.jpg",
  "/images/portfolio/t9-hero-960.jpg",
  "/images/portfolio/t10-real-960.jpg",
  "/images/portfolio/t6-gallery-1-960.jpg",
  "/images/portfolio/t6-hero-960.jpg",
];

const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-6",
  "lg:col-span-6",
];

export default function PainPoints() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <Reveal>
        <h2
          className="font-display max-w-[20ch] font-semibold"
          style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1.08 }}
        >
          Most landscapers lose jobs before the phone even rings
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12">
        {PAIN_POINTS.map((point, i) => {
          const photo = PHOTO[i % PHOTO.length];
          return (
            <Reveal key={point.title} delay={(i % 2) * 70} className={SPANS[i]}>
              <TiltCard maxTilt={4} lift={5} className="h-full">
                <article
                  className="surface card-lift relative h-full overflow-hidden p-7 md:p-9"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  {photo && (
                    <>
                      <Image
                        src={photo}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        style={{ opacity: 0.55 }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(150deg, rgba(7, 7, 7,0.94), rgba(7, 7, 7,0.6) 58%, rgba(7, 7, 7,0.86))",
                        }}
                      />
                    </>
                  )}

                  <div className="relative">
                    <h3
                      className="font-display text-[19px] font-semibold md:text-[22px]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {point.title}
                    </h3>
                    <p
                      className="mt-3 max-w-[46ch] text-[15px] leading-relaxed"
                      style={{ color: "var(--ink-60)" }}
                    >
                      {point.body}
                    </p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={120}>
        <ScrollWords
          text={PAIN_CLOSER}
          className="font-display mx-auto mt-16 max-w-[22ch] text-center font-medium md:mt-24"
          style={{ fontSize: "clamp(26px, 4vw, 52px)", lineHeight: 1.14 }}
        />
      </Reveal>
    </section>
  );
}
