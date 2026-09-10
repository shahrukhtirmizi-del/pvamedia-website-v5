import Reveal from "./ui/Reveal";

export type LegalSection = { heading: string; body: string[] };

/** Shared shell for the privacy and terms pages so both read identically. */
export default function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-[820px] px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <h1
          className="font-display font-semibold"
          style={{ fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.06 }}
        >
          {title}
        </h1>
        <p
          className="font-mono mt-6 text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-45)" }}
        >
          Last updated {updated}
        </p>
        <p
          className="mt-8 max-w-[62ch] text-[16px] leading-relaxed"
          style={{ color: "var(--ink-80)" }}
        >
          {intro}
        </p>
      </Reveal>

      <div className="mt-16">
        {sections.map((section, i) => (
          <Reveal key={section.heading} delay={Math.min(i, 4) * 60}>
            <div className="border-t py-9" style={{ borderColor: "var(--line)" }}>
              <h2 className="font-display text-[20px] font-semibold md:text-[23px]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((para, j) => (
                  <p
                    key={j}
                    className="max-w-[62ch] text-[15px] leading-relaxed"
                    style={{ color: "var(--ink-60)" }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
