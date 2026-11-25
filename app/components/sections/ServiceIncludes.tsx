import SettleStack, { type SettleStackCard } from "../motion/SettleStack";
import Reveal from "../ui/Reveal";
import { PACKAGES, AD_SPEND_NOTE } from "../../lib/site";

/**
 * Sits directly under the hero and opens each package up to show what it
 * includes. The /services address lands here.
 */

/** Stroke paths in a 24 box, one per PACKAGES entry by index. */
const ICONS = [
  // a rising trend line
  "M3 17l6-6 4 4 8-8M15 7h6v6",
  // a browser window
  "M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01",
  // a phone handset
  "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  // a bolt
  "M13 2L4 14h7l-1 8 9-12h-7z",
];

const COLORS = [
  { bg: "#F4F4F2", fg: "#0A0A0A" },
  { bg: "#0A0A0A", fg: "#FFFFFF" },
  { bg: "#FFFFFF", fg: "#0A0A0A" },
  { bg: "#1C1C1C", fg: "#FFFFFF" },
];

const TILTS = [
  { flipTilt: -5, dismissTilt: -14 },
  { flipTilt: 4, dismissTilt: 12 },
  { flipTilt: -2, dismissTilt: -10 },
  { flipTilt: 6, dismissTilt: 16 },
];

const cards: SettleStackCard[] = PACKAGES.map((pkg, i) => ({
  title: pkg.name,
  kicker: `0${i + 1}`,
  lead: pkg.forLine,
  listLabel: pkg.builds ? `Everything in ${pkg.builds}, plus:` : undefined,
  body: pkg.items.join("\n"),
  items: pkg.items,
  icon: ICONS[i % ICONS.length],
  ...COLORS[i % COLORS.length],
  ...TILTS[i % TILTS.length],
}));

export default function ServiceIncludes() {
  return (
    <div id="services">
      <SettleStack
        cards={cards}
        headline="What each package includes"
        frontTitle="What's inside"
        frontTag={`${PACKAGES.length} packages`}
        frontBody="Four packages, one system. Each one includes everything in the one before. Keep scrolling to open each one up."
        // the component's own top chrome would sit under the site nav
        markLabel=""
        hintLabel="Scroll to open the stack"
      />
      <Reveal>
        <p
          className="mx-auto max-w-[52ch] px-5 pt-16 text-center text-[16px] leading-relaxed md:px-8 md:text-[18px]"
          style={{ color: "var(--ink-60)" }}
        >
          {AD_SPEND_NOTE}
        </p>
      </Reveal>
    </div>
  );
}
