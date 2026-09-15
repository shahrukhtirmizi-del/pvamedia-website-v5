import type { Metadata } from "next";
import OnboardingForm from "../components/OnboardingForm";
import Reveal from "../components/ui/Reveal";

/**
 * Client onboarding. Reached by direct link only: it is not in the nav, the
 * footer or the sitemap, and search engines are told to leave it alone.
 */
export const metadata: Metadata = {
  title: "Onboarding",
  description: "Tell us about your business so we can set up your site and receptionist.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingPage() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[820px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--ink-45)" }}>
            Client onboarding
          </p>
          <h1
            className="font-display mt-6 max-w-[16ch] font-semibold"
            style={{ fontSize: "clamp(34px, 5.4vw, 60px)", lineHeight: 1.05 }}
          >
            Tell us how your business runs
          </h1>
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed md:text-[17px]" style={{ color: "var(--ink-60)" }}>
            Eight short sections. The more you give us here, the less we have to ask on the call, and
            the faster your site and receptionist go live. Nothing is locked in; we confirm it all
            with you before anything ships.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <OnboardingForm />
        </Reveal>
      </div>
    </section>
  );
}
