"use client";

import { useEffect, useState } from "react";
import MouseSpotlight from "./components/MouseSpotlight";
import MagneticButton from "./components/MagneticButton";
import TiltCard from "./components/TiltCard";
import ScrollReveal from "./components/ScrollReveal";
import CountUp from "./components/CountUp";
import CustomCursor from "./components/CustomCursor";
import BrowserCard from "./components/BrowserCard";
import WindowChrome from "./components/WindowChrome";
import LaptopFrame from "./components/LaptopFrame";
import CardFan from "./components/CardFan";
import {
  LayoutTemplate,
  Search,
  SearchX,
  Megaphone,
  PhoneCall,
  PhoneMissed,
  ShieldCheck,
  Sparkles,
  Zap,
  MessageSquareText,
  Smartphone,
  Server,
  Users,
  TrendingDown,
  EyeOff,
  Flame,
  Quote,
  Star,
  Check,
} from "lucide-react";
import ScrollProgress from "./components/ScrollProgress";
import SweepHighlight from "./components/SweepHighlight";
import Parallax from "./components/Parallax";
import BlobShape from "./components/BlobShape";
import RotatingBadge from "./components/RotatingBadge";
import WiggleIcon from "./components/WiggleIcon";
import AnimatedFillBar from "./components/AnimatedFillBar";
import SequentialReveal from "./components/SequentialReveal";
import DrawLink from "./components/DrawLink";
import LiveGrowthGraph from "./components/LiveGrowthGraph";
import SpeedometerGauge from "./components/SpeedometerGauge";

// ===== DEEP TEAL color theme =====
// Dark teal as the dominant page color (not just an accent), warm coral
// for contrast. Same dark-theme structure already fixed for Glacier
// (PAPER=dark bg, INK=light text, SURFACE=dedicated elevated panel).
// ===== GLACIER color theme, with Silver Sage as the secondary accent =====
// Cool near-black background, mint-teal as the primary accent (headline,
// links, gauge/graph color), Silver Sage as the secondary accent replacing
// the coral that didn't fit the cool palette (used for "the jobs.", the
// solid CTA button, and other secondary-accent spots).
const INK = "#F0F4F2";
const PAPER = "#14191C";
const GREEN = "#3ED9B8";
const GREEN_DEEP = "#0F1517";
const RUST = "#B8C4BE";
const CORAL = "#B8C4BE";
const MINT = "#3ED9B8";
const IS_DARK_THEME = true;
const SURFACE = "#1E2528";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: PAPER, color: INK }}>
      <CustomCursor
        dotColor={GREEN}
        ringBorderColor={`${INK}55`}
        ringHoverBg={`${GREEN}1F`}
        ringHoverBorder={GREEN}
        labelBg={GREEN}
        labelText={PAPER}
      />
      <ScrollProgress color={GREEN} />
      {/* grain texture, subtle, sits over everything */}
      <div
        className="fixed inset-0 pointer-events-none z-[9997] opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* ===== NAV ===== */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300"
        style={{
          borderColor: `${INK}12`,
          background: `${PAPER}E6`,
          boxShadow: scrolled ? "0 8px 24px -12px rgba(15,14,12,0.15)" : "none",
        }}
      >
        <div
          className="max-w-6xl mx-auto px-5 md:px-10 flex items-center justify-between transition-all duration-300"
          style={{ height: scrolled ? "56px" : "72px" }}
        >
          <a href="https://pvamedia.co.uk" className="flex items-center">
            <img
              src="data:image/svg+xml;base64,PHN2ZyBkYXRhLXYtNDIzYmY5YWU9IiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTQyIDkwIiBjbGFzcz0iaWNvbkxlZnQiPjwhLS0tLT48IS0tLS0+PCEtLS0tPjxnIGRhdGEtdi00MjNiZjlhZT0iIiBpZD0iOWE2OTI1OTYtNjg1ZC00YzlhLTgwNDYtYmQ1MWEzMjk5M2M1IiBmaWxsPSIjMEYwRTBDIiB0cmFuc2Zvcm09Im1hdHJpeCg1LjY5ODAwNTMyNjQ0NzMxNjUsMCwwLDUuNjk4MDA1MzI2NDQ3MzE2NSwxMDQuMjQ1MDA2NzI3MDY5MTUsLTE1LjQ4NDMyOTM4MzYwMDQ4OSkiPjxwYXRoIGQ9Ik00Ljg0IDExLjk4TDIuODYgMTEuOThMMi44NiAxNS42OEwxLjAxIDE1LjY4TDEuMDEgNS44OEw0Ljg0IDUuODhRNS42MCA1Ljg4IDYuMTYgNi4xM1E2LjcyIDYuMzcgNy4wOSA2Ljc3UTcuNDYgNy4xNyA3LjY1IDcuNjhRNy44NCA4LjE5IDcuODQgOC43Mkw3Ljg0IDguNzJMNy44NCA5LjA2UTcuODQgOS42MCA3LjY1IDEwLjEzUTcuNDYgMTAuNjUgNy4wOSAxMS4wN1E2LjcyIDExLjQ4IDYuMTYgMTEuNzNRNS42MCAxMS45OCA0Ljg0IDExLjk4TDQuODQgMTEuOThaTTIuODYgNy42NEwyLjg2IDEwLjIyTDQuNjYgMTAuMjJRNS4yOCAxMC4yMiA1LjYzIDkuODhRNS45OSA5LjU1IDUuOTkgOS4wMkw1Ljk5IDkuMDJMNS45OSA4Ljg1UTUuOTkgOC4zMiA1LjYzIDcuOThRNS4yOCA3LjY0IDQuNjYgNy42NEw0LjY2IDcuNjRMMi44NiA3LjY0Wk0xMS4xMiAxNS42OEw4LjkwIDUuODhMMTAuODEgNS44OEwxMi43MyAxNC43NkwxMi45OCAxNC43NkwxNC45MCA1Ljg4TDE2LjgwIDUuODhMMTQuNTkgMTUuNjhMMTEuMTIgMTUuNjhaTTIzLjU2IDE1LjY4TDIzLjA5IDEzLjU4TDE5Ljc1IDEzLjU4TDE5LjI4IDE1LjY4TDE3LjM1IDE1LjY4TDE5LjY4IDUuODhMMjMuMTYgNS44OEwyNS40OSAxNS42OEwyMy41NiAxNS42OFpNMjEuMjkgNi44MEwyMC4xNSAxMS44MkwyMi42OCAxMS44MkwyMS41NSA2LjgwTDIxLjI5IDYuODBaTTM0LjU4IDE1LjY4TDM0LjU4IDUuODhMMzcuODMgNS44OEwzOC4zOSAxMy4yNEwzOC4zOSAxNC42N0wzOC43MiAxNC42N0wzOC43MiAxMy4yNEwzOS4yOCA1Ljg4TDQyLjUzIDUuODhMNDIuNTMgMTUuNjhMNDAuODUgMTUuNjhMNDAuODUgOS4xM0w0MS4wMiA2Ljg5TDQwLjY4IDYuODlMMzkuOTYgMTUuNjhMMzcuMTggMTUuNjhMMzYuNDMgNi44OUwzNi4wOSA2Ljg5TDM2LjI2IDkuMTNMMzYuMjYgMTUuNjhMMzQuNTggMTUuNjhaTTUwLjU4IDEyLjc4TDQ1LjQ5IDEyLjc4UTQ1LjUwIDEzLjA5IDQ1LjYzIDEzLjM1UTQ1Ljc3IDEzLjYxIDQ2LjAwIDEzLjgwUTQ2LjIzIDEzLjk5IDQ2LjUzIDE0LjA5UTQ2LjgzIDE0LjIwIDQ3LjE3IDE0LjIwTDQ3LjE3IDE0LjIwUTQ3LjgyIDE0LjIwIDQ4LjE3IDEzLjk2UTQ4LjUyIDEzLjczIDQ4LjY4IDEzLjQxTDQ4LjY4IDEzLjQxTDUwLjE5IDE0LjI1UTUwLjA2IDE0LjUyIDQ5Ljg0IDE0LjgwUTQ5LjYyIDE1LjA5IDQ5LjI2IDE1LjMzUTQ4LjkwIDE1LjU3IDQ4LjM5IDE1LjcyUTQ3Ljg4IDE1Ljg4IDQ3LjE5IDE1Ljg4TDQ3LjE5IDE1Ljg4UTQ2LjQxIDE1Ljg4IDQ1Ljc3IDE1LjYyUTQ1LjEyIDE1LjM3IDQ0LjY1IDE0LjkwUTQ0LjE4IDE0LjQyIDQzLjkyIDEzLjczUTQzLjY3IDEzLjA1IDQzLjY3IDEyLjE4TDQzLjY3IDEyLjE4TDQzLjY3IDEyLjEwUTQzLjY3IDExLjMwIDQzLjk0IDEwLjY0UTQ0LjIxIDkuOTggNDQuNjkgOS41MlE0NS4xNiA5LjA2IDQ1LjgwIDguODBRNDYuNDQgOC41NCA0Ny4xNyA4LjU0TDQ3LjE3IDguNTRRNDguMDYgOC41NCA0OC43MSA4Ljg2UTQ5LjM1IDkuMTcgNDkuNzcgOS42NVE1MC4xOSAxMC4xNCA1MC4zOSAxMC43MlE1MC41OCAxMS4zMCA1MC41OCAxMS44NEw1MC41OCAxMS44NEw1MC41OCAxMi43OFpNNDcuMTUgMTAuMTRMNDcuMTUgMTAuMTRRNDYuNDggMTAuMTQgNDYuMDYgMTAuNDhRNDUuNjQgMTAuODIgNDUuNTEgMTEuMjdMNDUuNTEgMTEuMjdMNDguNzkgMTEuMjdRNDguNzEgMTAuNzggNDguMjYgMTAuNDZRNDcuODIgMTAuMTQgNDcuMTUgMTAuMTRaTTU3LjQ4IDE1LjY4TDU3LjQ4IDE0LjY3TDU3LjIzIDE0LjY3UTU3LjEyIDE0LjkxIDU2Ljk2IDE1LjEzUTU2LjgwIDE1LjM0IDU2LjU0IDE1LjUxUTU2LjI4IDE1LjY4IDU1LjkyIDE1Ljc4UTU1LjU3IDE1Ljg4IDU1LjA2IDE1Ljg4TDU1LjA2IDE1Ljg4UTU0LjQyIDE1Ljg4IDUzLjg2IDE1LjY0UTUzLjMxIDE1LjQxIDUyLjkwIDE0Ljk2UTUyLjQ5IDE0LjUwIDUyLjI1IDEzLjg1UTUyLjAyIDEzLjE5IDUyLjAyIDEyLjMzTDUyLjAyIDEyLjMzTDUyLjAyIDEyLjA4UTUyLjAyIDExLjI0IDUyLjI3IDEwLjU4UTUyLjUxIDkuOTMgNTIuOTQgOS40N1E1My4zNyA5LjAyIDUzLjkzIDguNzhRNTQuNTAgOC41NCA1NS4xMyA4LjU0TDU1LjEzIDguNTRRNTUuOTcgOC41NCA1Ni40NiA4Ljg2UTU2Ljk1IDkuMTcgNTcuMjMgOS43NEw1Ny4yMyA5Ljc0TDU3LjQ4IDkuNzRMNTcuNDggNS44OEw1OS4yNSA1Ljg4TDU5LjI1IDE1LjY4TDU3LjQ4IDE1LjY4Wk01NS42NCAxNC4yMEw1NS42NCAxNC4yMFE1Ni40NiAxNC4yMCA1Ni45NyAxMy42N1E1Ny40OCAxMy4xNSA1Ny40OCAxMi4yOUw1Ny40OCAxMi4yOUw1Ny40OCAxMi4xMlE1Ny40OCAxMS4yNyA1Ni45NyAxMC43NFE1Ni40NiAxMC4yMiA1NS42NCAxMC4yMkw1NS42NCAxMC4yMlE1NC44MSAxMC4yMiA1NC4zMCAxMC43M1E1My43OSAxMS4yNCA1My43OSAxMi4xMkw1My43OSAxMi4xMkw1My43OSAxMi4yOVE1My43OSAxMy4xNyA1NC4zMCAxMy42OFE1NC44MSAxNC4yMCA1NS42NCAxNC4yMFpNNjEuMTkgMTUuNjhMNjEuMTkgMTRMNjMuNTUgMTRMNjMuNTUgMTAuNDJMNjEuMzYgMTAuNDJMNjEuMzYgOC43NEw2NS4zMSA4Ljc0TDY1LjMxIDE0TDY3LjMzIDE0TDY3LjMzIDE1LjY4TDYxLjE5IDE1LjY4Wk02NS43NCA2LjY4TDY1Ljc0IDYuNjhRNjUuNzQgNi45NiA2NS42NCA3LjIwUTY1LjUzIDcuNDUgNjUuMzUgNy42MlE2NS4xNyA3LjgwIDY0LjkyIDcuOTBRNjQuNjggOC4wMSA2NC40MSA4LjAxTDY0LjQxIDguMDFRNjQuMTMgOC4wMSA2My45MCA3LjkwUTYzLjY2IDcuODAgNjMuNDggNy42MlE2My4yOSA3LjQ1IDYzLjE5IDcuMjBRNjMuMDggNi45NiA2My4wOCA2LjY4TDYzLjA4IDYuNjhRNjMuMDggNi40MCA2My4xOSA2LjE1UTYzLjI5IDUuOTEgNjMuNDggNS43M1E2My42NiA1LjU2IDYzLjkwIDUuNDVRNjQuMTMgNS4zNSA2NC40MSA1LjM1TDY0LjQxIDUuMzVRNjQuNjggNS4zNSA2NC45MiA1LjQ1UTY1LjE3IDUuNTYgNjUuMzUgNS43M1E2NS41MyA1LjkxIDY1LjY0IDYuMTVRNjUuNzQgNi40MCA2NS43NCA2LjY4Wk03NC4zOCAxNC42N0w3NC4xMyAxNC42N1E3My44NSAxNS4zMyA3My4zNSAxNS42MFE3Mi44NCAxNS44OCA3Mi4xNyAxNS44OEw3Mi4xNyAxNS44OFE3MS41NCAxNS44OCA3MC45OSAxNS42NFE3MC40MyAxNS40MCA3MC4wMSAxNC45NFE2OS41OSAxNC40OCA2OS4zNSAxMy44MlE2OS4xMCAxMy4xNiA2OS4xMCAxMi4zMkw2OS4xMCAxMi4zMkw2OS4xMCAxMi4xMFE2OS4xMCAxMS4yNyA2OS4zNCAxMC42MVE2OS41OCA5Ljk1IDY5Ljk5IDkuNDlRNzAuMzkgOS4wMyA3MC45MyA4Ljc5UTcxLjQ3IDguNTQgNzIuMDkgOC41NEw3Mi4wOSA4LjU0UTcyLjgzIDguNTQgNzMuMjggOC43OVE3My43NCA5LjA0IDc0LjAwIDkuNThMNzQuMDAgOS41OEw3NC4yNiA5LjU4TDc0LjI2IDguNzRMNzYuMDIgOC43NEw3Ni4wMiAxMy41OFE3Ni4wMiAxNCA3Ni40MCAxNEw3Ni40MCAxNEw3Ni42NiAxNEw3Ni42NiAxNS42OEw3NS40NiAxNS42OFE3NC45OCAxNS42OCA3NC42OCAxNS40MFE3NC4zOCAxNS4xMiA3NC4zOCAxNC42N0w3NC4zOCAxNC42N1pNNzIuNTYgMTQuMjBMNzIuNTYgMTQuMjBRNzMuMzMgMTQuMjAgNzMuNzkgMTMuNjhRNzQuMjYgMTMuMTcgNzQuMjYgMTIuMjlMNzQuMjYgMTIuMjlMNzQuMjYgMTIuMTJRNzQuMjYgMTEuMjQgNzMuNzkgMTAuNzNRNzMuMzMgMTAuMjIgNzIuNTYgMTAuMjJMNzIuNTYgMTAuMjJRNzEuNzkgMTAuMjIgNzEuMzMgMTAuNzNRNzAuODcgMTEuMjQgNzAuODcgMTIuMTJMNzAuODcgMTIuMTJMNzAuODcgMTIuMjlRNzAuODcgMTMuMTcgNzEuMzMgMTMuNjhRNzEuNzkgMTQuMjAgNzIuNTYgMTQuMjBaIj48L3BhdGg+PC9nPjwhLS0tLT48ZyBkYXRhLXYtNDIzYmY5YWU9IiIgaWQ9Ijg4MzliNzExLTRkZmQtNDljZS1hNTc2LWU1NjA5NmRlOWJkMCIgdHJhbnNmb3JtPSJtYXRyaXgoMi44MTI1LDAsMCwyLjgxMjUsMCwwKSIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMEYwRTBDIj48cGF0aCBkPSJNMTYgMzJjOC44MzcgMCAxNi03LjE2MyAxNi0xNlMyNC44MzcgMCAxNiAwIDAgNy4xNjMgMCAxNnM3LjE2MyAxNiAxNiAxNnpNMTQuODE3IDYuNDIxaDJ2OC44ODZoOC44ODd2MkgxNC44MTdWNi40MjF6bS01Ljk1OS40MzdoMnYxNC4yODNoMTQuMjgzdjJIOC44NThWNi44NTh6Ij48L3BhdGg+PC9nPjwhLS0tLT48L3N2Zz4="
              alt="PVA Media"
              className="h-6 md:h-7 w-auto"
              style={IS_DARK_THEME ? { filter: "invert(1) brightness(1.6)" } : undefined}
            />
          </a>
          <div className="hidden md:flex items-center gap-9 text-[13px]" style={{ color: `${INK}99` }}>
            {[["#work", "Work"], ["#services", "Services"], ["#ai-receptionist", "AI Receptionist"], ["#contact", "Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="relative group py-1">
                {label}
                <span
                  className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: GREEN }}
                />
              </a>
            ))}
          </div>
          <MagneticButton
            href="/bookings"
            className="font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2.5 rounded-full inline-block"
            style={{ background: INK, color: PAPER }}
          >
            Get started
          </MagneticButton>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      {/*
        This replaces the previous plain hero with the Studio-Modular-style
        design that was originally only built as a standalone preview file
        (pva-media-hero-preview.html) and never actually wired into the real
        site -- same mistake as the portfolio cards, now fixed the same way:
        the real design lives here now, not off in a separate file.
        Colour story deliberately moved off the old muted green+gold pairing
        onto a bolder coral + mint duo for more energy, per direct request.
      */}
      <section className="relative overflow-hidden">
        <MouseSpotlight color={GREEN} />
        <BlobShape color={`${GREEN}1E`} size={620} top="-14%" left="-8%" duration={24} />
        <BlobShape color={`${CORAL}22`} size={420} top="30%" right="-4%" duration={19} delay={2} />
        <BlobShape color={`${MINT}1C`} size={280} bottom="4%" left="30%" duration={16} delay={4} />
        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-14 md:pb-20">
          <ScrollReveal>
            <div className="relative">
              <h1 className="font-display font-black uppercase leading-[0.86] tracking-tight" style={{ fontSize: "clamp(40px, 8.2vw, 96px)" }}>
                <span style={{ color: GREEN }}>Websites</span>
              </h1>
              <h1 className="font-display font-black uppercase leading-[0.86] tracking-tight -mt-1 md:-mt-2" style={{ fontSize: "clamp(40px, 8.2vw, 96px)", color: "transparent", WebkitTextStroke: `1.5px ${INK}35` }}>
                That Book
              </h1>
              <div className="font-em mt-1 md:mt-2" style={{ fontSize: "clamp(26px, 5vw, 56px)", color: CORAL }}>
                the jobs.
              </div>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-end mt-8 md:mt-10">
            <ScrollReveal delay={120}>
              <div className="flex items-end gap-6">
                <Parallax factor={0.05}>
                  <TiltCard maxTilt={6} className="rounded-2xl overflow-hidden shrink-0" style={{ width: 220, border: `1px solid ${INK}14`, background: SURFACE, boxShadow: "0 30px 60px -24px rgba(15,14,12,0.35)" }}>
                    <LiveGrowthGraph color="#8FD4A8" fadeColor={`${INK}45`} bg={SURFACE} height={110} label="Client growth after launch" />
                  </TiltCard>
                </Parallax>
                <RotatingBadge
                  text={"LIVE IN 5 DAYS \u00B7 LIVE IN 5 DAYS \u00B7 "}
                  size={108}
                  centerBg={GREEN}
                  centerContent={"\u2193"}
                  ringColor={`${INK}25`}
                  textColor={`${INK}65`}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="lg:text-right lg:ml-auto lg:max-w-sm">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-3" style={{ color: `${INK}55` }}>
                  For landscapers across the US
                </div>
                <p className="text-[15px] md:text-[16px]" style={{ color: `${INK}85` }}>
                  Custom websites and local SEO built specifically to turn searches into{" "}
                  <span style={{ color: GREEN, fontWeight: 700 }}>
                    <CountUp from={3} to={12} /> booked jobs a month.
                  </span>
                </p>
                <div className="flex flex-wrap lg:justify-end items-center gap-4 mt-6">
                  <MagneticButton
                    href="/bookings"
                    className="font-mono text-[12px] uppercase tracking-[0.1em] px-7 py-4 rounded-full inline-block"
                    style={{ background: GREEN, color: PAPER }}
                  >
                    Book a free call
                  </MagneticButton>
                  <MagneticButton
                    href="#work"
                    className="font-mono text-[12px] uppercase tracking-[0.1em] px-7 py-4 rounded-full inline-block"
                    style={{ border: `1px solid ${INK}25`, color: INK }}
                  >
                    See our work
                  </MagneticButton>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-10 mt-12 border-t" style={{ borderColor: `${INK}14` }}>
              {[
                ["200+", "Websites built"],
                ["5 days", "To go live"],
                ["60-day", "Guarantee"],
                ["Money back", "If it fails"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display font-bold text-[20px] md:text-[24px] tracking-tight">{n}</div>
                  <div className="font-mono text-[10px] md:text-[10.5px] uppercase tracking-[0.14em] mt-1" style={{ color: `${INK}60` }}>{l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section id="work" className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-8 md:mb-10 max-w-xl mx-auto text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>01 &mdash; Real Results</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                Four clients, <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>real results.</span></SweepHighlight>
              </h2>
              <p className="text-[14.5px] mt-4" style={{ color: `${INK}80` }}>
                Hover or tap a card for the full picture. Every number is real, client names are blurred.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <CardFan
              cardWidth={230}
              dotColor={`${INK}45`}
              items={[
                {
                  rotate: -9,
                  offsetX: -195,
                  label: <div><div className="font-display font-bold text-[14px]" style={{ filter: "blur(3px)" }}>Austin Landscaping Co.</div><div className="text-[11.5px]" style={{ color: `${INK}70` }}>Website &amp; Local SEO</div></div>,
                  content: (
                    <div className="rounded-2xl overflow-hidden" style={{ width: 230, background: SURFACE, border: `1px solid ${INK}14`, padding: "16px 16px 18px" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span style={{ fontSize: 7, fontWeight: 700, filter: "blur(2px)", color: INK }}>Austin Landscaping Co.</span>
                        <span style={{ fontSize: 5, padding: "3px 7px", borderRadius: 999, background: `${GREEN}22`, color: GREEN, fontWeight: 700, whiteSpace: "nowrap" }}>Website + SEO</span>
                      </div>
                      <LiveGrowthGraph color={GREEN} fadeColor={`${INK}40`} bg="transparent" height={64} label="" />
                      <div className="mt-2">
                        <div className="font-display font-bold" style={{ fontSize: 22, color: GREEN }}>
                          <CountUp from={0} to={64} suffix="%" />
                        </div>
                        <div className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.08em", color: `${INK}70` }}>More enquiries in 90 days</div>
                      </div>
                    </div>
                  ),
                },
                {
                  rotate: -3,
                  offsetX: -65,
                  label: <div><div className="font-display font-bold text-[14px]" style={{ filter: "blur(3px)" }}>Amber &amp; Oak</div><div className="text-[11.5px]" style={{ color: `${INK}70` }}>AI Receptionist</div></div>,
                  content: (
                    <div className="rounded-2xl overflow-hidden flex flex-col items-center" style={{ width: 230, background: SURFACE, border: `1px solid ${INK}14`, padding: "16px 16px 14px" }}>
                      <div className="flex items-center justify-between w-full mb-1">
                        <span style={{ fontSize: 7, fontWeight: 700, filter: "blur(2px)", color: INK }}>Amber &amp; Oak</span>
                        <span style={{ fontSize: 5, padding: "3px 7px", borderRadius: 999, background: `${GREEN}22`, color: GREEN, fontWeight: 700, whiteSpace: "nowrap" }}>AI Receptionist</span>
                      </div>
                      <SpeedometerGauge label="Lead response speed" valueLabel="Under 60s" color={GREEN} trackColor={`${INK}22`} size={148} />
                      <div className="font-mono uppercase w-full" style={{ fontSize: 7.5, letterSpacing: "0.08em", color: `${INK}70`, marginTop: -4 }}>Zero missed calls since launch</div>
                    </div>
                  ),
                },
                {
                  rotate: 3,
                  offsetX: 65,
                  label: <div><div className="font-display font-bold text-[14px]" style={{ filter: "blur(3px)" }}>Cedar Grounds Co.</div><div className="text-[11.5px]" style={{ color: `${INK}70` }}>Full package</div></div>,
                  content: (
                    <div className="rounded-2xl overflow-hidden" style={{ width: 230, background: SURFACE, border: `1px solid ${INK}14`, padding: "16px 16px 18px" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span style={{ fontSize: 7, fontWeight: 700, filter: "blur(2px)", color: INK }}>Cedar Grounds Co.</span>
                        <span style={{ fontSize: 5, padding: "3px 7px", borderRadius: 999, background: `${GREEN}22`, color: GREEN, fontWeight: 700, whiteSpace: "nowrap" }}>Full Package</span>
                      </div>
                      <LiveGrowthGraph color={GREEN} fadeColor={`${INK}40`} bg="transparent" height={64} label="" />
                      <div className="mt-2 flex items-baseline gap-1">
                        <div className="font-display font-bold" style={{ fontSize: 22, color: GREEN }}>
                          <CountUp from={0} to={3} suffix="×" />
                        </div>
                        <div className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: "0.08em", color: `${INK}70` }}>more jobs booked / month</div>
                      </div>
                    </div>
                  ),
                },
                {
                  rotate: 9,
                  offsetX: 195,
                  label: <div><div className="font-display font-bold text-[14px]" style={{ filter: "blur(3px)" }}>Green Valley Lawn Care</div><div className="text-[11.5px]" style={{ color: `${INK}70` }}>Paid Ads &amp; Landing Pages</div></div>,
                  content: (
                    <div className="rounded-2xl overflow-hidden" style={{ width: 230, background: SURFACE, border: `1px solid ${INK}14`, padding: "16px 16px 18px" }}>
                      <div className="flex items-center justify-between mb-4">
                        <span style={{ fontSize: 7, fontWeight: 700, filter: "blur(2px)", color: INK }}>Green Valley Lawn Care</span>
                        <span style={{ fontSize: 5, padding: "3px 7px", borderRadius: 999, background: `${GREEN}22`, color: GREEN, fontWeight: 700, whiteSpace: "nowrap" }}>Paid Ads</span>
                      </div>
                      <div className="text-center py-3">
                        <div className="font-display font-bold leading-none" style={{ fontSize: 44, color: GREEN }}>
                          <CountUp from={0} to={12} />
                        </div>
                        <div className="font-mono uppercase mt-2" style={{ fontSize: 7.5, letterSpacing: "0.08em", color: `${INK}70` }}>Jobs booked this month</div>
                      </div>
                      <AnimatedFillBar percent={86} color={GREEN} trackColor={`${INK}18`} height={4} />
                    </div>
                  ),
                },
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-center text-[13px] mt-10 md:mt-12" style={{ color: `${INK}60` }}>
              Four of dozens of clients we&apos;ve helped. Every result is real &mdash; ask and we&apos;ll show you more.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PAIN ===== */}
      <section className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-12 md:mb-16 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>02 &mdash; Does this sound like you?</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                Most landscapers lose jobs before the phone <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>even rings.</span></SweepHighlight>
              </h2>
              <p className="text-[14.5px] mt-4" style={{ color: `${INK}80` }}>
                You&apos;re great at what you do, but if homeowners can&apos;t find you online, they&apos;re hiring someone else.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              [Users, "Most of your work comes from word of mouth. It works, until it doesn't."],
              [SearchX, "People can't find you when they search Google for landscapers nearby."],
              [TrendingDown, "Competitors with better websites are winning the jobs you should have."],
              [PhoneMissed, "You miss enquiries while you're out on site. Leads go cold fast."],
              [EyeOff, "Your current website (or lack of one) makes you look smaller than you are."],
              [Flame, "You're spending on ads but getting nothing back because the landing page doesn't convert."],
            ].map(([Icon, t], i) => (
              <ScrollReveal key={t as string} delay={(i % 2) * 80}>
                <div
                  className="p-6 md:p-7 h-full rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-[0_20px_45px_-25px_rgba(15,14,12,0.35)] hover:-translate-y-1"
                  style={{ border: `1px solid ${INK}14` }}
                >
                  <WiggleIcon
                    className="w-10 h-10 rounded-lg items-center justify-center shrink-0"
                    style={{ background: `${RUST}14` }}
                  >
                    <Icon size={18} color={RUST} strokeWidth={2} />
                  </WiggleIcon>
                  <p className="text-[14px] leading-relaxed pt-1.5" style={{ color: `${INK}85` }}>{t as string}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-8 p-6 md:p-7 rounded-xl flex items-center gap-4" style={{ background: `${GREEN}0D`, border: `1px solid ${GREEN}30` }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GREEN }} />
              <p className="text-[15px] font-medium">We fix all of that with one thing: a website that works while you work.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CASE STUDY ===== */}
      <section className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>03 &mdash; Real result</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                What happens when a landscaper <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>gets found.</span></SweepHighlight>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div data-cursor-label="View case study">
            <TiltCard className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${INK}18` }} maxTilt={2.5}>
              <div className="p-8 md:p-10 border-b" style={{ borderColor: `${INK}14` }}>
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-5" style={{ background: `${GREEN}14`, color: GREEN }}>
                  San Diego &middot; Case study
                </div>
                <h3 className="font-display font-semibold text-[19px] md:text-[22px] mb-3">Marco, 5-man landscaping crew in San Diego.</h3>
                <p className="text-[14.5px] max-w-xl" style={{ color: `${INK}80` }}>
                  Relied entirely on word of mouth. No website, no online presence. We built him a website optimised for local Google searches. 90 days later, everything changed.
                </p>
              </div>
              <div className="grid grid-cols-3">
                {[["4", "More jobs per month", "\u00d7", 80], ["64", "More enquiries", "%", 64], ["2", "Better close rate", "\u00d7", 50]].map(([n, l, suf, fill], i) => (
                  <div key={l as string} className={`p-6 md:p-8 ${i < 2 ? "border-r" : ""}`} style={{ borderColor: `${INK}14` }}>
                    <div className="font-display font-bold text-[28px] md:text-[36px] tracking-tight" style={{ color: GREEN }}>
                      <CountUp from={0} to={Number(n)} suffix={suf as string} />
                    </div>
                    <div className="text-[12px] mt-1 mb-3" style={{ color: `${INK}70` }}>{l}</div>
                    <AnimatedFillBar percent={fill as number} color={GREEN} height={4} delay={i * 120} />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 border-t" style={{ borderColor: `${INK}14`, background: SURFACE }}>
                <div className="border-r sm:border-r" style={{ borderColor: `${INK}14` }}>
                  <LiveGrowthGraph color="#8FD4A8" fadeColor={`${INK}45`} height={110} label="Enquiries per month, live" />
                </div>
                <div className="flex items-center justify-center py-4">
                  <SpeedometerGauge label="Lead response speed" valueLabel="Under 60s" color="#8FD4A8" trackColor={`${INK}25`} size={170} />
                </div>
              </div>
              <div className="p-8 md:p-10 border-t flex gap-5" style={{ borderColor: `${INK}14` }}>
                <div className="font-em text-[40px] leading-none opacity-30 shrink-0" style={{ color: GREEN }}>&ldquo;</div>
                <blockquote className="text-[14.5px]" style={{ color: `${INK}85` }}>
                  Homeowners find us on Google now. By the time they call, they&apos;re already half sold. My close rate has more than doubled.
                  <cite className="block not-italic font-mono text-[10.5px] uppercase tracking-[0.14em] mt-3" style={{ color: `${INK}60` }}>Marco, San Diego Landscaping</cite>
                </blockquote>
              </div>
            </TiltCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>04 &mdash; What we do</div>
                <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                  Everything, <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>done for you.</span></SweepHighlight>
                </h2>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] hidden sm:block" style={{ color: `${INK}50` }}>01 &mdash; 05</span>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {[
              [LayoutTemplate, "Website design & build", "Custom sites, no templates, built to actually convert visitors into booked jobs."],
              [Search, "Local SEO", "Local search built in from day one, targeting exactly what homeowners near you are searching."],
              [Megaphone, "Paid ads & landing pages", "Meta and Google campaigns paired with landing pages built specifically to convert that traffic."],
              [PhoneCall, "AI Receptionist", "Catches every missed call, texts back, qualifies the lead, books the job. See full pricing below."],
              [ShieldCheck, "Hosting & ongoing care", "We keep it running. You focus on the jobs, not the website."],
            ].map(([Icon, t, d], i) => (
              <ScrollReveal key={t as string} delay={i * 60}>
                <TiltCard maxTilt={4}>
                  <div
                    className="p-6 md:p-7 h-full rounded-2xl transition-shadow duration-300 hover:shadow-[0_20px_45px_-25px_rgba(15,14,12,0.35)]"
                    style={{ background: PAPER, border: `1px solid ${INK}14` }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <WiggleIcon
                        className="w-11 h-11 rounded-xl items-center justify-center shrink-0"
                        style={{ background: `${GREEN}14` }}
                      >
                        <Icon size={20} color={GREEN} strokeWidth={2} />
                      </WiggleIcon>
                      <span className="font-mono text-[11px]" style={{ color: `${INK}40` }}>0{i + 1}</span>
                    </div>
                    <h3 className="font-display font-semibold text-[16px] mb-1.5">{t as string}</h3>
                    <p className="text-[13.5px]" style={{ color: `${INK}75` }}>{d as string}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI RECEPTIONIST ===== */}
      <section id="ai-receptionist" className="border-t" style={{ borderColor: `${INK}12`, background: SURFACE }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-12 md:mb-16 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: "#8FD4A8" }}>05 &mdash; New</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)", color: INK }}>
                Never miss a job because you <span className="font-em normal-case" style={{ color: "#8FD4A8" }}>couldn&apos;t get to the phone.</span>
              </h2>
              <p className="text-[14.5px] mt-4" style={{ color: `${INK}90` }}>
                A 24/7 AI phone and text assistant that answers every call you miss, texts back anyone who hangs up, qualifies the lead, and books the job straight into your calendar.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {[
              {
                name: "Standard",
                price: "$647",
                setup: "$1,200 one-off setup",
                features: [
                  "24/7 AI call answering",
                  "Instant text-back on missed calls",
                  "Lead qualification (job type, urgency, location)",
                  "Direct booking into calendar",
                  "Two-way SMS follow-up sequence",
                  "Missed-call recovery text campaigns",
                  "Monthly performance report",
                ],
                highlight: false,
              },
              {
                name: "Premium",
                price: "$797",
                setup: "$1,500 one-off setup",
                features: [
                  "Everything in Standard, plus:",
                  "Custom branded greeting & voice",
                  "Multi-line / multi-crew call routing",
                  "Priority support + monthly strategy call",
                  "Advanced call analytics dashboard",
                ],
                highlight: true,
              },
            ].map((tier, i) => (
              <ScrollReveal key={tier.name} delay={i * 120}>
                <div data-cursor-label={`Choose ${tier.name}`}>
                <TiltCard className="rounded-2xl overflow-hidden" maxTilt={4}>
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col"
                    style={{
                      background: PAPER,
                      border: tier.highlight ? `2px solid #8FD4A8` : `1px solid ${PAPER}20`,
                    }}
                  >
                    {tier.highlight && (
                      <div className="relative overflow-hidden text-center py-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ background: GREEN, color: PAPER }}>
                        <span className="relative z-10">Most popular</span>
                        <span
                          aria-hidden
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(110deg, transparent 30%, ${PAPER}35 50%, transparent 70%)`,
                            backgroundSize: "220% 100%",
                            animation: "badge-shine 3.2s ease-in-out infinite",
                          }}
                        />
                        <style>{`@keyframes badge-shine { 0% { background-position: 140% 0; } 60%, 100% { background-position: -60% 0; } }`}</style>
                      </div>
                    )}
                    <div className="p-7 md:p-8 text-center border-b" style={{ borderColor: `${INK}14` }}>
                      <div className="font-display font-bold text-[15px] uppercase tracking-tight mb-2">{tier.name}</div>
                      <div className="font-display font-bold text-[38px] tracking-tight" style={{ color: GREEN }}>{tier.price}</div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: `${INK}60` }}>per month</div>
                      <div className="font-mono text-[11px] mt-3" style={{ color: `${INK}70` }}>{tier.setup}</div>
                    </div>
                    <div className="p-7 md:p-8 flex-1">
                      <SequentialReveal className="space-y-3" staggerMs={70}>
                        {tier.features.map((f) => (
                          <li key={f} className="text-[13.5px] flex items-start gap-2.5" style={{ color: `${INK}85`, listStyle: "none" }}>
                            <span
                              className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: `${GREEN}18` }}
                            >
                              <Check size={11} color={GREEN} strokeWidth={2.75} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </SequentialReveal>
                    </div>
                    <div className="p-7 md:p-8 pt-0">
                      <MagneticButton
                        href="/bookings"
                        className="font-mono text-[12px] uppercase tracking-[0.1em] px-6 py-3.5 rounded-full inline-flex w-full items-center justify-center"
                        style={{ background: tier.highlight ? GREEN : INK, color: PAPER }}
                      >
                        Get started
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-12 md:mb-16 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>06 &mdash; What you get</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                Everything. <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>Done for you.</span></SweepHighlight>
              </h2>
              <p className="text-[14.5px] mt-4" style={{ color: `${INK}80` }}>
                No templates. No agency runaround. A website built specifically for your landscaping business, set up to bring in jobs.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              [Sparkles, "Custom website, no templates", "Built from scratch for your business, your branding, your services, your area."],
              [Zap, "Live in 5 days", "We move fast. Most landscapers go from zero to a live, indexed website in under a working week."],
              [Search, "Shows up on Google", "Local SEO built in from day one, targeting the exact searches homeowners in your area are making."],
              [MessageSquareText, "24/7 lead capture", "Quote forms and click-to-call buttons that catch enquiries while you're out working, even at midnight."],
              [Smartphone, "Looks great on every device", "80% of people searching for landscapers are on mobile. Your site will look sharp on every screen."],
              [Server, "Hosting, updates, maintenance", "We handle everything. You focus on the jobs, we keep the website running perfectly."],
            ].map(([Icon, t, d], i) => (
              <ScrollReveal key={t as string} delay={(i % 3) * 80}>
                <div
                  className="p-6 md:p-7 h-full rounded-2xl transition-all duration-300 hover:shadow-[0_20px_45px_-25px_rgba(15,14,12,0.35)] hover:-translate-y-1"
                  style={{ border: `1px solid ${INK}14` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${GREEN}14` }}
                  >
                    <Icon size={18} color={GREEN} strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-semibold text-[15px] mb-2">{t as string}</h3>
                  <p className="text-[13px]" style={{ color: `${INK}75` }}>{d as string}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="p-7 md:p-8 rounded-2xl" style={{ background: `${GREEN}0D`, border: `1px solid ${GREEN}30` }}>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] mb-2" style={{ color: GREEN }}>Our guarantee</div>
              <h3 className="font-display font-semibold text-[18px] md:text-[22px] mb-2">60% more enquiries in 90 days, or you don&apos;t pay.</h3>
              <p className="text-[13.5px]" style={{ color: `${INK}80` }}>If it doesn&apos;t work, you get your money back. No questions, no small print.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="border-t" style={{ borderColor: `${INK}12` }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-10 md:mb-14 max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: GREEN }}>07 &mdash; What landscapers say</div>
              <h2 className="font-display font-bold uppercase leading-[1.05] tracking-tight" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
                Landscapers who took the <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>leap.</span></SweepHighlight>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {[
              ["They actually listened. Built exactly what I needed and kept going until I was happy. My phone didn't used to ring, now it does.", "James", "Austin Landscaping \u00b7 Texas"],
              ["Site was live in under a week. Homeowners are finding me on Google now. This one actually brings in jobs. Worth every penny.", "Ryan", "California Green Landscaping \u00b7 California"],
            ].map(([q, name, c], i) => (
              <ScrollReveal key={c as string} delay={i * 100}>
                <div
                  className="p-7 md:p-8 rounded-2xl h-full transition-all duration-300 hover:shadow-[0_20px_45px_-25px_rgba(15,14,12,0.35)] hover:-translate-y-1"
                  style={{ border: `1px solid ${INK}14` }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <SequentialReveal className="flex gap-0.5" staggerMs={80}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={14} fill={GREEN} strokeWidth={0} color={GREEN} />
                      ))}
                    </SequentialReveal>
                    <ScrollReveal delay={450}>
                      <Quote size={26} style={{ color: `${GREEN}25` }} fill={`${GREEN}25`} strokeWidth={0} />
                    </ScrollReveal>
                  </div>
                  <blockquote className="text-[14.5px]" style={{ color: `${INK}85` }}>{q as string}</blockquote>
                  <div className="flex items-center gap-3 mt-5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-[13px] shrink-0"
                      style={{ background: `${GREEN}14`, color: GREEN }}
                    >
                      {(name as string)[0]}
                    </div>
                    <cite className="block not-italic font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `${INK}60` }}>
                      {name as string}, {c as string}
                    </cite>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section id="contact" className="relative overflow-hidden border-t" style={{ borderColor: `${INK}12` }}>
        <MouseSpotlight color={GREEN} />
        <BlobShape color={`${GREEN}20`} size={440} bottom="-15%" right="-8%" duration={20} delay={1} />
        <BlobShape color={`${CORAL}1E`} size={300} top="-10%" left="4%" duration={17} delay={3} />
        <div className="relative z-10 max-w-2xl mx-auto px-5 md:px-10 py-20 md:py-28 text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold uppercase leading-[1.02] tracking-tight mb-6" style={{ fontSize: "clamp(28px, 4.5vw, 50px)" }}>
              Ready to see what&apos;s <SweepHighlight color={`${GREEN}28`}><span className="font-em normal-case" style={{ color: GREEN }}>possible?</span></SweepHighlight>
            </h2>
            <MagneticButton
              href="/bookings"
              className="font-mono text-[12px] uppercase tracking-[0.1em] px-8 py-4 rounded-full inline-block"
              style={{ background: GREEN, color: PAPER }}
            >
              Book a free call
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t" style={{ borderColor: `${INK}14`, background: GREEN_DEEP }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <img
            src="data:image/svg+xml;base64,PHN2ZyBkYXRhLXYtNDIzYmY5YWU9IiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTQyIDkwIiBjbGFzcz0iaWNvbkxlZnQiPjwhLS0tLT48IS0tLS0+PCEtLS0tPjxnIGRhdGEtdi00MjNiZjlhZT0iIiBpZD0iOWE2OTI1OTYtNjg1ZC00YzlhLTgwNDYtYmQ1MWEzMjk5M2M1IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJtYXRyaXgoNS42OTgwMDUzMjY0NDczMTY1LDAsMCw1LjY5ODAwNTMyNjQ0NzMxNjUsMTA0LjI0NTAwNjcyNzA2OTE1LC0xNS40ODQzMjkzODM2MDA0ODkpIj48cGF0aCBkPSJNNC44NCAxMS45OEwyLjg2IDExLjk4TDIuODYgMTUuNjhMMS4wMSAxNS42OEwxLjAxIDUuODhMNC44NCA1Ljg4UTUuNjAgNS44OCA2LjE2IDYuMTNRNi43MiA2LjM3IDcuMDkgNi43N1E3LjQ2IDcuMTcgNy42NSA3LjY4UTcuODQgOC4xOSA3Ljg0IDguNzJMNy44NCA4LjcyTDcuODQgOS4wNlE3Ljg0IDkuNjAgNy42NSAxMC4xM1E3LjQ2IDEwLjY1IDcuMDkgMTEuMDdRNi43MiAxMS40OCA2LjE2IDExLjczUTUuNjAgMTEuOTggNC44NCAxMS45OEw0Ljg0IDExLjk4Wk0yLjg2IDcuNjRMMi44NiAxMC4yMkw0LjY2IDEwLjIyUTUuMjggMTAuMjIgNS42MyA5Ljg4UTUuOTkgOS41NSA1Ljk5IDkuMDJMNS45OSA5LjAyTDUuOTkgOC44NVE1Ljk5IDguMzIgNS42MyA3Ljk4UTUuMjggNy42NCA0LjY2IDcuNjRMNC42NiA3LjY0TDIuODYgNy42NFpNMTEuMTIgMTUuNjhMOC45MCA1Ljg4TDEwLjgxIDUuODhMMTIuNzMgMTQuNzZMMTIuOTggMTQuNzZMMTQuOTAgNS44OEwxNi44MCA1Ljg4TDE0LjU5IDE1LjY4TDExLjEyIDE1LjY4Wk0yMy41NiAxNS42OEwyMy4wOSAxMy41OEwxOS43NSAxMy41OEwxOS4yOCAxNS42OEwxNy4zNSAxNS42OEwxOS42OCA1Ljg4TDIzLjE2IDUuODhMMjUuNDkgMTUuNjhMMjMuNTYgMTUuNjhaTTIxLjI5IDYuODBMMjAuMTUgMTEuODJMMjIuNjggMTEuODJMMjEuNTUgNi44MEwyMS4yOSA2LjgwWk0zNC41OCAxNS42OEwzNC41OCA1Ljg4TDM3LjgzIDUuODhMMzguMzkgMTMuMjRMMzguMzkgMTQuNjdMMzguNzIgMTQuNjdMMzguNzIgMTMuMjRMMzkuMjggNS44OEw0Mi41MyA1Ljg4TDQyLjUzIDE1LjY4TDQwLjg1IDE1LjY4TDQwLjg1IDkuMTNMNDEuMDIgNi44OUw0MC42OCA2Ljg5TDM5Ljk2IDE1LjY4TDM3LjE4IDE1LjY4TDM2LjQzIDYuODlMMzYuMDkgNi44OUwzNi4yNiA5LjEzTDM2LjI2IDE1LjY4TDM0LjU4IDE1LjY4Wk01MC41OCAxMi43OEw0NS40OSAxMi43OFE0NS41MCAxMy4wOSA0NS42MyAxMy4zNVE0NS43NyAxMy42MSA0Ni4wMCAxMy44MFE0Ni4yMyAxMy45OSA0Ni41MyAxNC4wOVE0Ni44MyAxNC4yMCA0Ny4xNyAxNC4yMEw0Ny4xNyAxNC4yMFE0Ny44MiAxNC4yMCA0OC4xNyAxMy45NlE0OC41MiAxMy43MyA0OC42OCAxMy40MUw0OC42OCAxMy40MUw1MC4xOSAxNC4yNVE1MC4wNiAxNC41MiA0OS44NCAxNC44MFE0OS42MiAxNS4wOSA0OS4yNiAxNS4zM1E0OC45MCAxNS41NyA0OC4zOSAxNS43MlE0Ny44OCAxNS44OCA0Ny4xOSAxNS44OEw0Ny4xOSAxNS44OFE0Ni40MSAxNS44OCA0NS43NyAxNS42MlE0NS4xMiAxNS4zNyA0NC42NSAxNC45MFE0NC4xOCAxNC40MiA0My45MiAxMy43M1E0My42NyAxMy4wNSA0My42NyAxMi4xOEw0My42NyAxMi4xOEw0My42NyAxMi4xMFE0My42NyAxMS4zMCA0My45NCAxMC42NFE0NC4yMSA5Ljk4IDQ0LjY5IDkuNTJRNDUuMTYgOS4wNiA0NS44MCA4LjgwUTQ2LjQ0IDguNTQgNDcuMTcgOC41NEw0Ny4xNyA4LjU0UTQ4LjA2IDguNTQgNDguNzEgOC44NlE0OS4zNSA5LjE3IDQ5Ljc3IDkuNjVRNTAuMTkgMTAuMTQgNTAuMzkgMTAuNzJRNTAuNTggMTEuMzAgNTAuNTggMTEuODRMNTAuNTggMTEuODRMNTAuNTggMTIuNzhaTTQ3LjE1IDEwLjE0TDQ3LjE1IDEwLjE0UTQ2LjQ4IDEwLjE0IDQ2LjA2IDEwLjQ4UTQ1LjY0IDEwLjgyIDQ1LjUxIDExLjI3TDQ1LjUxIDExLjI3TDQ4Ljc5IDExLjI3UTQ4LjcxIDEwLjc4IDQ4LjI2IDEwLjQ2UTQ3LjgyIDEwLjE0IDQ3LjE1IDEwLjE0Wk01Ny40OCAxNS42OEw1Ny40OCAxNC42N0w1Ny4yMyAxNC42N1E1Ny4xMiAxNC45MSA1Ni45NiAxNS4xM1E1Ni44MCAxNS4zNCA1Ni41NCAxNS41MVE1Ni4yOCAxNS42OCA1NS45MiAxNS43OFE1NS41NyAxNS44OCA1NS4wNiAxNS44OEw1NS4wNiAxNS44OFE1NC40MiAxNS44OCA1My44NiAxNS42NFE1My4zMSAxNS40MSA1Mi45MCAxNC45NlE1Mi40OSAxNC41MCA1Mi4yNSAxMy44NVE1Mi4wMiAxMy4xOSA1Mi4wMiAxMi4zM0w1Mi4wMiAxMi4zM0w1Mi4wMiAxMi4wOFE1Mi4wMiAxMS4yNCA1Mi4yNyAxMC41OFE1Mi41MSA5LjkzIDUyLjk0IDkuNDdRNTMuMzcgOS4wMiA1My45MyA4Ljc4UTU0LjUwIDguNTQgNTUuMTMgOC41NEw1NS4xMyA4LjU0UTU1Ljk3IDguNTQgNTYuNDYgOC44NlE1Ni45NSA5LjE3IDU3LjIzIDkuNzRMNTcuMjMgOS43NEw1Ny40OCA5Ljc0TDU3LjQ4IDUuODhMNTkuMjUgNS44OEw1OS4yNSAxNS42OEw1Ny40OCAxNS42OFpNNTUuNjQgMTQuMjBMNTUuNjQgMTQuMjBRNTYuNDYgMTQuMjAgNTYuOTcgMTMuNjdRNTcuNDggMTMuMTUgNTcuNDggMTIuMjlMNTcuNDggMTIuMjlMNTcuNDggMTIuMTJRNTcuNDggMTEuMjcgNTYuOTcgMTAuNzRRNTYuNDYgMTAuMjIgNTUuNjQgMTAuMjJMNTUuNjQgMTAuMjJRNTQuODEgMTAuMjIgNTQuMzAgMTAuNzNRNTMuNzkgMTEuMjQgNTMuNzkgMTIuMTJMNTMuNzkgMTIuMTJMNTMuNzkgMTIuMjlRNTMuNzkgMTMuMTcgNTQuMzAgMTMuNjhRNTQuODEgMTQuMjAgNTUuNjQgMTQuMjBaTTYxLjE5IDE1LjY4TDYxLjE5IDE0TDYzLjU1IDE0TDYzLjU1IDEwLjQyTDYxLjM2IDEwLjQyTDYxLjM2IDguNzRMNjUuMzEgOC43NEw2NS4zMSAxNEw2Ny4zMyAxNEw2Ny4zMyAxNS42OEw2MS4xOSAxNS42OFpNNjUuNzQgNi42OEw2NS43NCA2LjY4UTY1Ljc0IDYuOTYgNjUuNjQgNy4yMFE2NS41MyA3LjQ1IDY1LjM1IDcuNjJRNjUuMTcgNy44MCA2NC45MiA3LjkwUTY0LjY4IDguMDEgNjQuNDEgOC4wMUw2NC40MSA4LjAxUTY0LjEzIDguMDEgNjMuOTAgNy45MFE2My42NiA3LjgwIDYzLjQ4IDcuNjJRNjMuMjkgNy40NSA2My4xOSA3LjIwUTYzLjA4IDYuOTYgNjMuMDggNi42OEw2My4wOCA2LjY4UTYzLjA4IDYuNDAgNjMuMTkgNi4xNVE2My4yOSA1LjkxIDYzLjQ4IDUuNzNRNjMuNjYgNS41NiA2My45MCA1LjQ1UTY0LjEzIDUuMzUgNjQuNDEgNS4zNUw2NC40MSA1LjM1UTY0LjY4IDUuMzUgNjQuOTIgNS40NVE2NS4xNyA1LjU2IDY1LjM1IDUuNzNRNjUuNTMgNS45MSA2NS42NCA2LjE1UTY1Ljc0IDYuNDAgNjUuNzQgNi42OFpNNzQuMzggMTQuNjdMNzQuMTMgMTQuNjdRNzMuODUgMTUuMzMgNzMuMzUgMTUuNjBRNzIuODQgMTUuODggNzIuMTcgMTUuODhMNzIuMTcgMTUuODhRNzEuNTQgMTUuODggNzAuOTkgMTUuNjRRNzAuNDMgMTUuNDAgNzAuMDEgMTQuOTRRNjkuNTkgMTQuNDggNjkuMzUgMTMuODJRNjkuMTAgMTMuMTYgNjkuMTAgMTIuMzJMNjkuMTAgMTIuMzJMNjkuMTAgMTIuMTBRNjkuMTAgMTEuMjcgNjkuMzQgMTAuNjFRNjkuNTggOS45NSA2OS45OSA5LjQ5UTcwLjM5IDkuMDMgNzAuOTMgOC43OVE3MS40NyA4LjU0IDcyLjA5IDguNTRMNzIuMDkgOC41NFE3Mi44MyA4LjU0IDczLjI4IDguNzlRNzMuNzQgOS4wNCA3NC4wMCA5LjU4TDc0LjAwIDkuNThMNzQuMjYgOS41OEw3NC4yNiA4Ljc0TDc2LjAyIDguNzRMNzYuMDIgMTMuNThRNzYuMDIgMTQgNzYuNDAgMTRMNzYuNDAgMTRMNzYuNjYgMTRMNzYuNjYgMTUuNjhMNzUuNDYgMTUuNjhRNzQuOTggMTUuNjggNzQuNjggMTUuNDBRNzQuMzggMTUuMTIgNzQuMzggMTQuNjdMNzQuMzggMTQuNjdaTTcyLjU2IDE0LjIwTDcyLjU2IDE0LjIwUTczLjMzIDE0LjIwIDczLjc5IDEzLjY4UTc0LjI2IDEzLjE3IDc0LjI2IDEyLjI5TDc0LjI2IDEyLjI5TDc0LjI2IDEyLjEyUTc0LjI2IDExLjI0IDczLjc5IDEwLjczUTczLjMzIDEwLjIyIDcyLjU2IDEwLjIyTDcyLjU2IDEwLjIyUTcxLjc5IDEwLjIyIDcxLjMzIDEwLjczUTcwLjg3IDExLjI0IDcwLjg3IDEyLjEyTDcwLjg3IDEyLjEyTDcwLjg3IDEyLjI5UTcwLjg3IDEzLjE3IDcxLjMzIDEzLjY4UTcxLjc5IDE0LjIwIDcyLjU2IDE0LjIwWiI+PC9wYXRoPjwvZz48IS0tLS0+PGcgZGF0YS12LTQyM2JmOWFlPSIiIGlkPSI4ODM5YjcxMS00ZGZkLTQ5Y2UtYTU3Ni1lNTYwOTZkZTliZDAiIHRyYW5zZm9ybT0ibWF0cml4KDIuODEyNSwwLDAsMi44MTI1LDAsMCkiIHN0cm9rZT0ibm9uZSIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xNiAzMmM4LjgzNyAwIDE2LTcuMTYzIDE2LTE2UzI0LjgzNyAwIDE2IDAgMCA3LjE2MyAwIDE2czcuMTYzIDE2IDE2IDE2ek0xNC44MTcgNi40MjFoMnY4Ljg4Nmg4Ljg4N3YySDE0LjgxN1Y2LjQyMXptLTUuOTU5LjQzN2gydjE0LjI4M2gxNC4yODN2Mkg4Ljg1OFY2Ljg1OHoiPjwvcGF0aD48L2c+PCEtLS0tPjwvc3ZnPg=="
            alt="PVA Media"
            className="h-6 w-auto"
          />
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: `${INK}70` }}>
            <span>&copy; 2026 PVA Media Ltd. All rights reserved.</span>
            <DrawLink href="https://pvamedia.co.uk" color={`${INK}90`}>pvamedia.co.uk</DrawLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
