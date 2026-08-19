"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import CustomCursor from "../components/CustomCursor";
import ScrollProgress from "../components/ScrollProgress";
import MagneticButton from "../components/MagneticButton";
import ScrollReveal from "../components/ScrollReveal";
import MouseSpotlight from "../components/MouseSpotlight";
import Logo from "../components/Logo";

// Kept in sync with app/page.tsx's current theme -- this file has its own
// copy of these constants (separate route, separate file) and was missed
// during the original Glacier + Silver Sage theme swap, which is why it
// was still showing the old light-theme colors.
const INK = "#F0F4F2";
const PAPER = "#14191C";
const GREEN = "#3ED9B8";
const SURFACE = "#1E2528";

export default function BookingsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("https://formspree.io/f/mljrldao", {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error("failed");
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: PAPER, color: INK }}>
      <CustomCursor />
      <ScrollProgress color={GREEN} />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ borderColor: `${INK}12`, background: `${PAPER}E6` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
          <a href="/" className="flex items-center"><Logo invert /></a>
          <a href="/" className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: `${INK}70` }}>&larr; Back to site</a>
        </div>
      </nav>

      {/* hero + form */}
      <section className="relative overflow-hidden">
        <MouseSpotlight color={GREEN} />
        <div className="relative z-10 max-w-2xl mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 text-center">
          <ScrollReveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-6 flex items-center justify-center gap-2" style={{ color: `${INK}70` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
              Book your free call
            </div>
            <h1 className="font-display font-bold uppercase leading-[1.02] tracking-tight" style={{ fontSize: "clamp(28px, 5.5vw, 52px)" }}>
              Takes 30 seconds.<br />
              <span className="font-em normal-case" style={{ color: GREEN }}>Could change everything.</span>
            </h1>
            <p className="text-[15px] mt-6 mb-10" style={{ color: `${INK}80` }}>
              Leave your details and we&apos;ll get you straight to booking a free, no-pressure call.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-2xl overflow-hidden text-left" style={{ background: SURFACE, border: `1px solid ${INK}14`, boxShadow: `0 30px 60px -30px rgba(0,0,0,0.6)` }}>
              <div className="px-7 py-6 border-b text-center" style={{ borderColor: `${INK}12` }}>
                <div className="font-display font-bold text-[17px]">Let&apos;s get you booked in</div>
                <div className="text-[13px] mt-1" style={{ color: `${INK}70` }}>Free call &middot; No obligation &middot; 20 minutes max</div>
              </div>

              <div className="p-7 md:p-8">
                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="mb-4 text-[13px] px-3.5 py-2.5 rounded-[10px]" style={{ background: "#3D1B1B", color: "#FF8A80" }}>
                        Something went wrong submitting your details. Please try again, or call us directly.
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.1em] mb-1.5" style={{ color: `${INK}70` }}>Full name</label>
                      <input required name="Full name" type="text" placeholder="Your full name" className="w-full rounded-[10px] px-3.5 py-2.5 text-[14.5px] outline-none border" style={{ borderColor: `${INK}22`, background: PAPER, color: INK }} />
                    </div>
                    <div className="mb-4">
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.1em] mb-1.5" style={{ color: `${INK}70` }}>Phone number</label>
                      <input required name="Phone number" type="tel" placeholder="(555) 123-4567" className="w-full rounded-[10px] px-3.5 py-2.5 text-[14.5px] outline-none border" style={{ borderColor: `${INK}22`, background: PAPER, color: INK }} />
                    </div>
                    <div className="mb-6">
                      <label className="block font-mono text-[10.5px] uppercase tracking-[0.1em] mb-1.5" style={{ color: `${INK}70` }}>Email address</label>
                      <input required name="Email" type="email" placeholder="you@example.com" className="w-full rounded-[10px] px-3.5 py-2.5 text-[14.5px] outline-none border" style={{ borderColor: `${INK}22`, background: PAPER, color: INK }} />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full font-mono text-[12px] uppercase tracking-[0.1em] px-6 py-4 rounded-full"
                      style={{ background: GREEN, color: PAPER, opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? "Submitting..." : "Confirm & continue"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${GREEN}1A` }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-[18px] mb-2">You&apos;re all set &mdash; pick your time.</h3>
                    <p className="text-[13.5px] mb-6" style={{ color: `${INK}80` }}>
                      Click below to choose a time that works for you &mdash; the call is free, 30 minutes, and completely no-pressure.
                    </p>
                    <MagneticButton
                      href="https://calendly.com/admin-pvamedia/30min"
                      className="inline-block font-mono text-[12px] uppercase tracking-[0.1em] px-7 py-4 rounded-full"
                      style={{ background: GREEN, color: PAPER }}
                    >
                      Book your call now
                    </MagneticButton>
                    <p className="text-[11.5px] mt-4" style={{ color: `${INK}60` }}>Takes 30 seconds &middot; Free &middot; No obligation</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: `${INK}55` }}>
              <span>No credit card required</span>
              <span>60-day money back</span>
              <span>Typically respond in under 2h</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t py-8" style={{ borderColor: `${INK}14` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: `${INK}55` }}>
          <span>&copy; 2026 PVA Media Ltd. All rights reserved.</span>
          <a href="/" style={{ color: `${INK}55` }}>pvamedia.co.uk</a>
        </div>
      </footer>
    </div>
  );
}
