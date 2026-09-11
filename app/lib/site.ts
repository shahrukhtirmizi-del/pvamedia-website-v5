/**
 * Every string the site renders lives here or in the section that owns it.
 * Copy is the client's, verbatim where they gave it.
 */

export const SITE = {
  name: "PVA Media",
  /**
   * The host that actually serves a 200. The apex 307s to www, so canonical
   * tags and the sitemap have to point at www or every canonical is a redirect.
   */
  domain: "https://www.pvamedia.co.uk",
  tagline:
    "We take landscapers from 3 booked jobs a month to 12, without lifting a finger.",
  email: "admin@pvamedia.co.uk",
  phone: "+44 7782 985932",
  phoneHref: "+447782985932",
  /** Live Formspree endpoint carried over from the previous site. */
  formEndpoint: "https://formspree.io/f/mljrldao",
};

export const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "AI Receptionist", href: "/ai-receptionist" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */

export const HERO_STATS = [
  { value: 200, suffix: "+", label: "Websites built" },
  { value: 5, suffix: "", label: "Days to go live" },
  { value: 60, suffix: "", label: "Day guarantee" },
];

export const TICKER = [
  "60% more enquiries in 90 days, or you don't pay",
  "Live in 5 days",
  "Built only for landscapers",
  "Under 60 second lead response",
  "200+ websites built",
  "Zero missed calls",
  "No templates",
  "Hosting and updates handled",
];

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */

export const PAIN_POINTS = [
  {
    title: "Word of mouth is drying up",
    body: "The referrals that carried the business for years are thinning out, and there is nothing underneath them.",
  },
  {
    title: "You cannot be found on Google",
    body: "Homeowners search, three other companies come up, and your name is not one of them.",
  },
  {
    title: "Competitors win on their website alone",
    body: "They are not better landscapers. They just look more legitimate the moment someone lands on the page.",
  },
  {
    title: "Enquiries go missing while you work",
    body: "The phone rings while you are on a site. By the time you call back, the job is already booked elsewhere.",
  },
  {
    title: "You look smaller than you are",
    body: "A five-person crew doing high-end work reads like a one-man operation online.",
  },
  {
    title: "Ads point at a page that cannot convert",
    body: "You pay for the click and then hand it to a page that gives the homeowner nothing to act on.",
  },
];

export const PAIN_CLOSER =
  "We fix all of that with one thing: a website that works while you work.";

/* -------------------------------------------------------------------------- */

export type Service = {
  slug: string;
  name: string;
  short: string;
  detail: string[];
  includes: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "website-design",
    name: "Website design & build",
    short:
      "A custom site built around your own work, live in five days, fast on a phone.",
    detail: [
      "Every site is designed from scratch for the company it belongs to. No templates, no theme with your logo dropped into the corner.",
      "We build around your photography, your service area, and the jobs you actually want more of. The whole thing is live in five days.",
    ],
    includes: [
      "Custom design, no templates",
      "Live in 5 days",
      "Built mobile-first",
      "Your own project photography",
      "Quote form on every page",
    ],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    short:
      "Rank in the suburbs you want to work in, not just the one you are based in.",
    detail: [
      "Local SEO is what puts you in front of a homeowner three streets away at the moment they start looking.",
      "We build a page for each service in each area you serve, keep your Google Business Profile current, and get the citations consistent so the map results start trusting you.",
    ],
    includes: [
      "Google Business Profile management",
      "Service pages per area",
      "Citation clean-up",
      "Review generation",
      "Monthly ranking reports",
    ],
  },
  {
    slug: "paid-ads",
    name: "Paid ads & landing pages",
    short:
      "Ads that point at a page built to convert, not at your homepage.",
    detail: [
      "Most landscaping ad budgets are wasted after the click, not before it. The targeting is usually fine. The page is the problem.",
      "We build a dedicated landing page for every service you advertise, matched to the ad that feeds it, and keep the two in step as the campaign runs.",
    ],
    includes: [
      "Google and Meta campaigns",
      "One landing page per service",
      "Call and form tracking",
      "Weekly spend review",
      "Creative refreshed monthly",
    ],
  },
  {
    slug: "ai-receptionist",
    name: "AI Receptionist",
    short:
      "Answers every call and web enquiry, qualifies the job, books it in.",
    detail: [
      "It picks up when you cannot, which on a working day is most of the time.",
      "It knows your service area, your pricing bands, and the work you turn down. It qualifies the enquiry, books it into your calendar, and sends you the summary before you are off the site.",
    ],
    includes: [
      "24/7 call answering",
      "Web enquiry replies in under a minute",
      "Job qualification",
      "Calendar booking",
      "Full call transcripts",
    ],
  },
  {
    slug: "hosting-care",
    name: "Hosting & ongoing care",
    short: "Hosting, updates, backups and edits, handled without you asking.",
    detail: [
      "The site does not go stale after launch. Hosting, security, backups and updates are all on us.",
      "When you finish a job worth showing off, send us the photos and we put them on the site.",
    ],
    includes: [
      "Fast managed hosting",
      "SSL and daily backups",
      "Content edits included",
      "New project photos added",
      "Uptime monitoring",
    ],
  },
];

/* -------------------------------------------------------------------------- */

export type Tier = {
  slug: string;
  name: string;
  monthly: string;
  setup: string;
  popular?: boolean;
  summary: string;
  headline: string[];
  full: string[];
};

export const TIERS: Tier[] = [
  {
    slug: "standard",
    name: "Standard",
    monthly: "$647",
    setup: "$1,200 setup",
    summary: "Every call answered, every enquiry qualified and booked in.",
    headline: [
      "24/7 call answering",
      "Job qualification and booking",
      "Calendar sync",
      "Call transcripts and summaries",
    ],
    full: [
      "24/7 call answering",
      "Web enquiry replies in under a minute",
      "Job qualification against your criteria",
      "Direct calendar booking",
      "Call transcripts and summaries",
      "Service area and pricing awareness",
      "Voicemail and after-hours capture",
      "Monthly performance report",
      "Email support",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    monthly: "$797",
    setup: "$1,500 setup",
    popular: true,
    summary:
      "Everything in Standard, plus follow-up, quoting and a custom voice.",
    headline: [
      "Everything in Standard",
      "Automatic lead follow-up",
      "Quote collection on the call",
      "Custom voice and script",
    ],
    full: [
      "Everything in Standard",
      "Automatic follow-up on unbooked leads",
      "Quote details collected on the call",
      "Custom voice and script",
      "SMS follow-up sequences",
      "Priority routing for high-value jobs",
      "CRM integration",
      "Seasonal campaign scripts",
      "Weekly performance report",
      "Priority support",
    ],
  },
];

/* -------------------------------------------------------------------------- */

export const WHAT_YOU_GET = [
  {
    title: "A custom website",
    body: "Designed for your company from scratch. No templates.",
  },
  {
    title: "Live in 5 days",
    body: "From kickoff call to a site homeowners can find and use.",
  },
  {
    title: "You show up on Google",
    body: "Local SEO built in from day one, not sold to you later.",
  },
  {
    title: "24/7 lead capture",
    body: "Enquiries get answered whether you are on site or asleep.",
  },
  {
    title: "Looks right on every device",
    body: "Most of your homeowners are on a phone. It is built for them first.",
  },
  {
    title: "Hosting and maintenance",
    body: "Updates, backups and edits handled. You never touch it.",
  },
];

export const GUARANTEE = "60% more enquiries in 90 days, or you don't pay.";

/* -------------------------------------------------------------------------- */

export const TESTIMONIALS = [
  {
    quote:
      "The site paid for itself in the first fortnight. We stopped chasing work and started picking it.",
    name: "James",
    location: "Texas",
  },
  {
    quote:
      "Every call gets answered now, even when the whole crew is out. That alone changed the month.",
    name: "Ryan",
    location: "California",
  },
];

export const CASE_STUDY = {
  name: "Marco",
  detail: "5-man crew, San Diego",
  quote:
    "Homeowners find us on Google now. By the time they call, they're already half sold. My close rate has more than doubled.",
  image: "/images/portfolio/t7-hero.jpg",
  stats: [
    { value: 4, suffix: "x", label: "More jobs per month", percent: 100 },
    { value: 64, suffix: "%", label: "More enquiries", percent: 64 },
    { value: 2, suffix: "x", label: "Better close rate", percent: 50 },
  ],
};
