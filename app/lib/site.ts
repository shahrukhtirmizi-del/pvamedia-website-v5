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
  title: "PVA Media | Your Growth Partner",
  tagline: "Your growth partner",
  description:
    "PVA Media is a growth partner for service businesses. We bring in new customers with advertising and high-converting websites, then make sure every inquiry is answered, followed up and booked.",
  email: "admin@pvamedia.co.uk",
  phone: "(213) 340-3214",
  phoneHref: "+12133403214",
  company: {
    legalName: "PVA MEDIA LTD",
    number: "16786144",
    address: "163 Argyle Avenue, Whitton, London TW3 2LP",
  },
  /** Live Formspree endpoint carried over from the previous site. */
  formEndpoint: "https://formspree.io/f/mljrldao",
  /** The 30 minute call. */
  calendly: "https://calendly.com/dano-clarke-white-pvamedia/30min",
};

export const NAV = [
  { label: "Packages", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */

/**
 * titleLines splits each title across the stacked card's two lines (the
 * second set in a muted tone); tags are the short labels along its foot.
 */
export const PAIN_POINTS = [
  {
    title: "People can't find you online",
    titleLines: ["People can't", "find you online"],
    tags: ["Google Maps", "Local search", "Reviews", "Business Profile"],
    body: "Someone nearby searches for exactly what you do, and three competitors show up before you.",
  },
  {
    title: "Referrals are drying up",
    titleLines: ["Referrals are", "drying up"],
    tags: ["Word of mouth", "Repeat business", "New customer sources"],
    body: "Word of mouth carried the business for years. When it slows down, there is no steady source of new inquiries underneath it.",
  },
  {
    title: "Inquiries come in waves, then go quiet",
    titleLines: ["Inquiries come in waves,", "then go quiet"],
    tags: ["Seasonality", "Planning", "Pipeline", "Forecasting"],
    body: "Slammed one month, quiet the next. Without a predictable flow of inquiries you cannot plan hiring, capacity or growth.",
  },
  {
    title: "Ad spend disappears with nothing to show for it",
    titleLines: ["Ad spend disappears", "with nothing to show for it"],
    tags: ["Google Ads", "Meta Ads", "Call tracking", "Cost per inquiry"],
    body: "You pay for clicks, but nobody can tell you which ones became customers, or why the rest did not.",
  },
  {
    title: "Inquiries go cold before anyone replies",
    titleLines: ["Inquiries go cold", "before anyone replies"],
    tags: ["Missed calls", "Response time", "Follow-up"],
    body: "The phone rings while you are with a customer. By the time you call back, they have already booked someone else.",
  },
  {
    title: "Visitors leave without calling or booking",
    titleLines: ["Visitors leave", "without calling or booking"],
    tags: ["Conversion", "Trust", "Calls to action"],
    body: "People land on your site, look around and go, because nothing gives them a clear reason to get in touch today.",
  },
] satisfies {
  title: string;
  titleLines: [string, string];
  tags: string[];
  body: string;
}[];

export const PAIN_CLOSER =
  "We fix that with one growth system that keeps working while you work.";

/* -------------------------------------------------------------------------- */

export type Package = {
  name: string;
  /** who the package is for */
  forLine: string;
  /** the package this one builds on, shown as "Everything in X, plus:" */
  builds?: string;
  items: string[];
};

export const PACKAGES: Package[] = [
  {
    name: "Starter",
    forLine: "For businesses getting started",
    items: [
      "A high-converting landing page with live chat",
      "One advertising channel: Google search or Facebook & Instagram",
      "Chat and text replies within 60 seconds, 24/7, that qualify and book inquiries",
      "Missed-call text-back",
      "Follow-up until people book",
      "Two appointment reminders",
      "A review request after every customer",
      "Inquiry pipeline",
      "Monthly report",
      "Quarterly check-in call",
      "A full website is available as an add-on",
    ],
  },
  {
    name: "Lead Engine",
    forLine: "For growing businesses",
    builds: "Starter",
    items: [
      "A full website, replacing the landing page",
      "Google search, Google Verified (where eligible) and Facebook & Instagram ads",
      "24/7 virtual receptionist for after-hours and overflow calls",
      "Quote and consultation follow-up",
      "Call tracking",
      "Won customers fed back to Google and Meta",
      "Monthly strategy call, replacing the quarterly check-in",
    ],
  },
  {
    name: "Market Leader",
    forLine: "For established businesses",
    builds: "Lead Engine",
    items: [
      "A call to every new web inquiry within one minute",
      "A page for every service and area you cover",
      "Monthly SEO",
      "Google Business Profile management",
      "New Facebook & Instagram ads every month",
      "Automatic follow-up of past customers, referrals and previous inquiries",
      "Strategy call every two weeks",
    ],
  },
  {
    name: "Market Dominator",
    forLine: "For larger and multi-location businesses",
    builds: "Market Leader",
    items: [
      "Up to three locations, with more available",
      "YouTube and Google video advertising",
      "Retargeting (where platforms allow)",
      "Microsoft (Bing) advertising",
      "An A/B-tested landing page for each campaign",
      "Seasonal campaigns",
      "Call summaries and scorecards",
      "Extended follow-up for bigger decisions",
      "Repeat-business campaigns",
      "A dedicated account manager",
      "Weekly report and call, replacing strategy calls",
      "Quarterly business review",
      "Priority same-day changes",
      "Connection to your booking or scheduling software where possible",
    ],
  },
];

export const AD_SPEND_NOTE =
  "Ad spend is paid directly to Google and Meta from accounts in your name. We never hold it or mark it up.";

/* -------------------------------------------------------------------------- */

export const STEPS = [
  {
    title: "A free 30-minute call",
    body: "We look at where your customers come from today and where they're slipping away.",
  },
  {
    title: "A plan and onboarding",
    body: "We set up your accounts, pages, replies and follow-up, and send each piece for your approval.",
  },
  {
    title: "Live in about three weeks",
    body: "Your ads launch and every inquiry starts getting answered.",
  },
  {
    title: "Better every month",
    body: "Reports, strategy calls and changes based on what's actually working.",
  },
];

export const PROMISES = [
  "Your ad accounts and data stay in your name, always.",
  "Ad spend goes straight to the platforms. We never mark it up.",
  "Nothing goes live without your approval.",
];

/* -------------------------------------------------------------------------- */

/** No client name is stored here: the deck blurs placeholder text instead. */
export type ClientTestimonial = {
  quote: string;
  package: "Market Dominator" | "Market Leader" | "Lead Engine";
};

/** Quotes are verbatim, grouped by package. Do not tidy the punctuation. */
export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    package: "Market Dominator",
    quote:
      "We've got three locations and before PVA each one was basically doing its own thing with marketing. Now it's all run in one place, I get a report every week and a call to go through it, and if I need something changed it's usually done the same day. Having one person who actually knows our business makes a big difference.",
  },
  {
    package: "Market Dominator",
    quote:
      "Honestly the weekly calls are what sold me. I always know what's working and what they're changing. They tested different landing pages against each other and the one that won is still bringing in more inquiries than our old site ever did.",
  },
  {
    package: "Market Dominator",
    quote:
      "We were spending a lot on ads and never really knew what we were getting back. Now we're on Google, Facebook, YouTube and Bing, and every inquiry is tracked back to where it came from. First time I've felt properly in control of our marketing spend.",
  },
  {
    package: "Market Dominator",
    quote:
      "The follow up is the part I didn't expect. People who reached out months ago and went quiet are coming back and booking. Our account manager is on top of everything and we hear from him every week without having to chase.",
  },
  {
    package: "Market Leader",
    quote:
      "Every new web inquiry gets a call within a minute now. Before, we'd get to them hours later and half of them had already gone somewhere else. That alone has been worth it for us.",
  },
  {
    package: "Market Leader",
    quote:
      "They built out a page for every service and area we cover and look after our Google profile every month. We're showing up for searches we never used to, and the calls we get are from people who actually want what we do.",
  },
  {
    package: "Market Leader",
    quote:
      "I like that they went back to our old customers and people who'd asked about us before. We got bookings out of a list we'd honestly forgotten about. The calls every two weeks keep us on track.",
  },
  {
    package: "Lead Engine",
    quote:
      "We needed a proper website and ads on more than just Facebook. PVA did both and set up a receptionist that picks up after hours, so we're not losing calls at night or on weekends anymore.",
  },
  {
    package: "Lead Engine",
    quote:
      "The call tracking was eye opening. I can see which ads are bringing in calls and which ones aren't, and we go through it all on the monthly strategy call. Simple, and it actually makes sense.",
  },
  {
    package: "Lead Engine",
    quote:
      "Quick to get going and easy to work with. The new site looks great, inquiries get a reply straight away even when we're busy, and anyone who doesn't book gets followed up. We're booking more without adding more work for the office.",
  },
];
