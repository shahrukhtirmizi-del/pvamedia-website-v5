import type { Metadata } from "next";
import { Check } from "lucide-react";
import BookingForm from "../components/BookingForm";
import ParticleField from "../components/fx/ParticleField";
import Reveal from "../components/ui/Reveal";

export const metadata: Metadata = {
  title: "Book a free call",
  description:
    "Book a free 30 minute call with PVA Media. We look at what you rank for now and what your site would need to fill next month.",
  alternates: { canonical: "/bookings" },
};

const REASSURANCE = [
  "Thirty minutes, no pitch",
  "We look at your current search visibility live",
  "You leave with the plan whether you hire us or not",
];

export default function BookingsPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <ParticleField />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <Reveal>
            <h1
              className="font-display max-w-[13ch] font-semibold"
              style={{ fontSize: "clamp(36px, 5.6vw, 64px)", lineHeight: 1.05 }}
            >
              Let{"’"}s fill next month
            </h1>
            <p
              className="mt-7 max-w-[40ch] text-[16px] leading-relaxed md:text-[18px]"
              style={{ color: "var(--ink-60)" }}
            >
              Tell us where the business is now. We will tell you honestly whether we can get you
              from 3 booked jobs a month to 12.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-11 space-y-4">
              {REASSURANCE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="mt-1 shrink-0"
                    style={{ color: "var(--accent)" }}
                  />
                  <span style={{ color: "var(--ink-80)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div
            className="surface p-6 md:p-10"
            style={{
              borderRadius: "var(--radius-card)",
              background: "rgba(8,17,43,0.9)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <h2 className="font-display text-[21px] font-semibold">Book your call</h2>
            <BookingForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
