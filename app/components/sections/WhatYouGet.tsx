"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../ui/Reveal";
import ScrollWords from "../ui/ScrollWords";
import { WHAT_YOU_GET, GUARANTEE } from "../../lib/site";

/** one photograph per statement, crossfading in the sticky frame beside it */
const PHOTOS = [
  "/images/portfolio/t6-featured-960.jpg",
  "/images/portfolio/t3-hero-960.jpg",
  "/images/portfolio/t4-hero-960.jpg",
  "/images/portfolio/t7-hero-960.jpg",
  "/images/portfolio/t1-hero-960.jpg",
  "/images/portfolio/t9-hero-960.jpg",
];

/**
 * The heading and a photograph hold still on the left while six statements
 * scroll past on the right. Each statement lights up as it reaches the middle
 * of the screen, and the photograph beside it changes to match. Which one is
 * "current" comes from an IntersectionObserver on a band across the middle of
 * the viewport, never from a scroll listener.
 */
export default function WhatYouGet() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      // a thin band across the middle of the viewport
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-36">
      <div className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2
              className="font-display max-w-[12ch] font-semibold"
              style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1.06 }}
            >
              What you get
            </h2>
            <p
              className="mt-5 max-w-[34ch] text-[15px] leading-relaxed"
              style={{ color: "var(--ink-60)" }}
            >
              Everything a landscaping company needs to be found, trusted and booked, handled by
              one team.
            </p>
          </Reveal>

          {/* the frame: six photographs stacked, the current one shown */}
          <Reveal delay={100}>
            <div
              className="relative mt-9 hidden overflow-hidden lg:block"
              style={{ borderRadius: "var(--radius-card)", aspectRatio: "4 / 3" }}
            >
              {PHOTOS.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 1024px) 0px, 40vw"
                  className="object-cover"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "scale(1)" : "scale(1.06)",
                    transition:
                      "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 1.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              ))}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(5,11,31,0.15), rgba(5,11,31,0.55))",
                }}
              />
              <div
                className="font-mono absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(242,238,223,0.75)" }}
              >
                {String(active + 1).padStart(2, "0")} / {String(WHAT_YOU_GET.length).padStart(2, "0")}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-0">
          {WHAT_YOU_GET.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className={`border-t py-10 md:py-14 ${i === WHAT_YOU_GET.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "var(--line)" }}
            >
              {/* on smaller screens the photograph rides with its statement */}
              <div
                className="relative mb-6 overflow-hidden lg:hidden"
                style={{ borderRadius: "var(--radius-tile)", aspectRatio: "16 / 9" }}
              >
                <Image
                  src={PHOTOS[i]}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 1024px) 100vw, 0px"
                  className="object-cover"
                />
              </div>

              <ScrollWords
                as="h3"
                text={item.title}
                className="font-display font-semibold"
                style={{ fontSize: "clamp(28px, 4.2vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.035em" }}
              />
              <ScrollWords
                text={item.body}
                className="mt-4 max-w-[46ch] text-[16px] leading-relaxed md:text-[18px]"
                style={{ color: "var(--ink-80)" }}
              />
            </div>
          ))}
        </div>
      </div>

      <Reveal delay={100}>
        <div
          className="surface mt-20 flex flex-col items-start gap-8 p-8 md:mt-28 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <p
            className="font-display max-w-[20ch] font-medium"
            style={{ fontSize: "clamp(24px, 3.2vw, 38px)", lineHeight: 1.16 }}
          >
            {GUARANTEE}
          </p>
          <Link href="/bookings" className="btn btn-primary shrink-0">
            Book a free call
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
