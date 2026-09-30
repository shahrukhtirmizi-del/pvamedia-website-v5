import SettleStack, { type SettleStackCard } from "../motion/SettleStack";
import { SERVICES } from "../../lib/site";

/**
 * Sits directly under the services intro: CardStoryScroll names each
 * service, this opens each one up to show what it includes.
 */

/** Stroke paths in a 24 box, one per SERVICES entry by index. */
const ICONS = [
  // marketing: a rising trend line
  "M3 17l6-6 4 4 8-8M15 7h6v6",
  // websites: a browser window
  "M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01",
  // AI receptionist: a phone handset
  "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  // automation agents: a bolt
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

const cards: SettleStackCard[] = SERVICES.map((service, i) => ({
  title: service.name,
  kicker: `0${i + 1}`,
  body: service.includes.join("\n"),
  items: service.includes,
  icon: ICONS[i % ICONS.length],
  ...COLORS[i % COLORS.length],
  ...TILTS[i % TILTS.length],
}));

export default function ServiceIncludes() {
  return (
    <SettleStack
      cards={cards}
      headline="What each service includes"
      frontTitle="What's inside"
      frontTag={`${SERVICES.length} services`}
      frontBody="Keep scrolling to open each service up."
      // the component's own top chrome would sit under the site nav
      markLabel=""
      hintLabel="Scroll to open the stack"
    />
  );
}
