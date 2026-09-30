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
    "We take trades and home service companies from 3 booked jobs a month to 12, without lifting a finger.",
  email: "admin@pvamedia.co.uk",
  phone: "+44 7782 985932",
  phoneHref: "+447782985932",
  /** Live Formspree endpoint carried over from the previous site. */
  formEndpoint: "https://formspree.io/f/mljrldao",
  /** The 30 minute call. */
  calendly: "https://calendly.com/admin-pvamedia/30min",
};

export const NAV = [
  { label: "Services", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */

export const HERO_STATS = [
  { value: 60, prefix: "", suffix: "%", label: "More enquiries in 90 days", note: "Guaranteed, or you don't pay." },
  { value: 60, prefix: "<", suffix: "s", label: "Lead response time", note: "" },
  { value: 200, prefix: "", suffix: "+", label: "Websites built", note: "" },
];

export const TICKER = [
  "60% more enquiries in 90 days, or you don't pay",
  "Local SEO and paid ads that book jobs",
  "Built only for trades and home service companies",
  "Under 60 second lead response",
  "AI agents that follow up every lead",
  "Zero missed calls",
  "Reporting on booked jobs, not clicks",
  "200+ websites built",
];

/* -------------------------------------------------------------------------- */

/**
 * titleLines splits each title across the stacked card's two lines (the
 * second set in a muted tone); tags are the short labels along its foot.
 */
export const PAIN_POINTS = [
  {
    title: "Homeowners can't find you",
    titleLines: ["Homeowners", "can't find you"],
    tags: ["Google Maps", "Local search", "Reviews", "Business Profile"],
    body: "Someone nearby searches for exactly what you do, and three competitors show up on the map before you.",
  },
  {
    title: "Referrals are drying up",
    titleLines: ["Referrals are", "drying up"],
    tags: ["Word of mouth", "Repeat work", "New lead sources"],
    body: "Word of mouth carried the business for years. When it slows down, there is no steady source of new enquiries underneath it.",
  },
  {
    title: "Lead flow is feast or famine",
    titleLines: ["Lead flow is", "feast or famine"],
    tags: ["Seasonality", "Crew planning", "Pipeline", "Forecasting"],
    body: "Slammed one month, quiet the next. Without a predictable flow of enquiries you cannot plan crews, hiring or growth.",
  },
  {
    title: "Ad spend disappears",
    titleLines: ["Ad spend", "disappears"],
    tags: ["Google Ads", "Meta Ads", "Call tracking", "Cost per lead"],
    body: "You pay for clicks, but nobody can tell you which ones became booked jobs, or why the rest did not.",
  },
  {
    title: "Enquiries go cold before you reply",
    titleLines: ["Enquiries go cold", "before you reply"],
    tags: ["Missed calls", "Response time", "Follow-up"],
    body: "The phone rings while you are on a job. By the time you call back, they have already booked someone else.",
  },
  {
    title: "Visitors leave without calling",
    titleLines: ["Visitors leave", "without calling"],
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
  "We fix that with one marketing system that keeps working while you work.";

/* -------------------------------------------------------------------------- */

export type Service = {
  slug: string;
  name: string;
  short: string;
  /** Same claim as `short`, split into two scannable lines instead of one
   *  dense sentence — what CardStoryScroll renders. */
  shortLines: [string, string];
  detail: string[];
  includes: string[];
};

/**
 * Marketing leads: it is what the business sells first. Websites, the AI
 * receptionist and the automation agents all support it.
 */
export const SERVICES: Service[] = [
  {
    slug: "marketing",
    name: "Marketing",
    short:
      "Local SEO and paid ads that put you in front of homeowners ready to book, and turn clicks into jobs.",
    shortLines: [
      "Local SEO and paid ads that put you in front of homeowners ready to book.",
      "Turns clicks into jobs, not just traffic.",
    ],
    detail: [
      "Local SEO puts you in front of homeowners in the areas you want to work, at the moment they start looking. We build out service-area pages, keep your Google Business Profile active and clean up your citations so the map results start trusting you.",
      "Paid ads fill the gaps search cannot cover yet. Every Google and Meta campaign points at a landing page built for that service, with call and form tracking, so you can see which spend becomes booked work.",
    ],
    includes: [
      "Google Business Profile management",
      "Service-area pages and citation clean-up",
      "Review generation",
      "Google and Meta ad campaigns",
      "A landing page for every advertised service",
      "Reporting on leads and booked jobs, not clicks",
    ],
  },
  {
    slug: "websites",
    name: "Websites",
    short:
      "A fast, custom site built to turn the traffic we send you into calls and quote requests.",
    shortLines: [
      "A fast, custom site built for conversion.",
      "Turns the traffic we send you into calls and quote requests.",
    ],
    detail: [
      "Your website is where the marketing pays off, so we build it to convert: clear services, your own project photos and a quote path on every page. No templates, and live in five days.",
      "Hosting, security, backups and edits are handled for you, and new project photos go up whenever you send them.",
    ],
    includes: [
      "Custom design, no templates",
      "Built mobile-first, live in 5 days",
      "Quote form on every page",
      "Fast managed hosting",
      "SSL and daily backups",
      "Content edits and new project photos",
    ],
  },
  {
    slug: "ai-receptionist",
    name: "AI Receptionist",
    short:
      "Answers every call and web enquiry, qualifies the job and books it in, day or night.",
    shortLines: [
      "Answers every call and web enquiry, day or night.",
      "Qualifies the job and books it straight into your calendar.",
    ],
    detail: [
      "One of the automations we run for clients. It picks up when you cannot, which on a working day is most of the time.",
      "It knows your service area, your pricing bands and the work you turn down, so it qualifies each enquiry, books it into your calendar and sends you the summary before you are off the site.",
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
    slug: "ai-automation",
    name: "AI Automation Agents",
    short:
      "Agents that confirm bookings, chase unbooked leads and answer routine questions for you.",
    shortLines: [
      "Agents that confirm bookings and chase unbooked leads.",
      "Answer routine questions so you don't have to.",
    ],
    detail: [
      "Most of the work between an enquiry and a booked job is repetitive admin. Our AI agents take it off your plate, so every lead hears back in minutes, not hours.",
      "They confirm bookings, follow up with leads that have not booked yet, reply to email and text enquiries, and hand the conversation to your team when a person is needed.",
    ],
    includes: [
      "Automatic booking confirmations and reminders",
      "Follow-up emails and texts on unbooked leads",
      "Instant replies to email and text enquiries",
      "Routine query handling",
      "Hand-off to your team when a person is needed",
    ],
  },
];

/* -------------------------------------------------------------------------- */

export const WHAT_YOU_GET = [
  {
    title: "More people find you",
    body: "Local SEO and ads that put you in front of homeowners searching in your area.",
  },
  {
    title: "A steady flow of enquiries",
    body: "Campaigns built around booked jobs, so busy weeks stop being followed by quiet ones.",
  },
  {
    title: "Every lead answered",
    body: "Calls and messages get a reply in under a minute, whether you are on site or asleep.",
  },
  {
    title: "Follow-up that never slips",
    body: "AI agents chase unbooked leads and confirm bookings, so nothing falls through the cracks.",
  },
  {
    title: "Reporting on jobs, not clicks",
    body: "You see which spend turns into enquiries and booked work, every month.",
  },
  {
    title: "A website that converts",
    body: "Fast, custom and hosted for you, built to turn visits into calls. You never touch it.",
  },
];

export const GUARANTEE = "60% more enquiries in 90 days, or you don't pay.";

/* -------------------------------------------------------------------------- */

/**
 * Real client testimonials and results, grouped by service line.
 * CLIENT_TESTIMONIALS feeds the CircularCardDeck 3D coverflow and
 * CLIENT_RESULTS feeds the Results section's conversion-metrics bento grid.
 */

export type ClientCategory = "Website" | "Marketing" | "AI Automation";

export type ClientTestimonial = {
  quote: string;
  /** Full name, kept for our own records — never render this publicly. */
  name: string;
  /** First name + surname initial, e.g. "Ravi S." — this is the one to render. */
  displayName: string;
  company: string;
  category: ClientCategory;
};

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    quote:
      "We knew our old website was not really doing the business justice. The new one is a night and day difference. It looks clean, professional, and actually feels like it represents the level of work we do. The other big thing is that it was not built just to look nice. Customers can find what they need quickly, it is easy to contact us, and they put a lot of thought into how the site would perform on Google. I am really happy with how it turned out.",
    name: "Eddie Matherwood",
    displayName: "Eddie M.",
    company: "TheGroundsGuys",
    category: "Website",
  },
  {
    quote:
      "I wanted something simple, professional, and easy for customers to use, and that is pretty much exactly what we got. The site works great on phones, everything is laid out clearly, and people do not have to dig around to figure out what services we offer. They also explained the Google side of things and built the site around actually generating inquiries, which I liked. It has been a big step up from what we had before.",
    name: "Bruno Knight",
    displayName: "Bruno K.",
    company: "Comprehensive Irrigation",
    category: "Website",
  },
  {
    quote:
      "The website came out really well. With remodeling, people are obviously judging your work visually, so I wanted the site to feel polished without looking too corporate or overdone. They got that balance right. Our projects are presented properly, the site is easy to move around, and there is a clear path for homeowners who want to contact us. It feels much more like our company now, which was important to me.",
    name: "Joshua Anderson",
    displayName: "Joshua A.",
    company: "AP Remodeling",
    category: "Website",
  },
  {
    quote:
      "The main thing I wanted was for someone to land on our website and immediately feel confident about the company. Before, I did not think we were getting that. The new site looks much more established and professional, and it is straightforward for customers to use. I also liked that they kept bringing the conversation back to how the website could actually help generate business, rather than just talking about colors and design. It came together really nicely.",
    name: "Kamal Rana",
    displayName: "Kamal R.",
    company: "N & L Remodeling",
    category: "Website",
  },
  {
    quote:
      "We had done marketing before and gotten plenty of inquiries that went nowhere, so I was more interested in lead quality than just seeing a big number on a report. That has been the biggest improvement. We are talking to more homeowners who actually have a project in mind and are serious about getting work done. It has made our sales conversations a lot more worthwhile and given us a more consistent flow of opportunities.",
    name: "Matt Davison",
    displayName: "Matt D.",
    company: "Structura Remodeling",
    category: "Marketing",
  },
  {
    quote:
      "I have dealt with marketing companies that promise a lot and then send over leads that are barely worth calling. This has been different. We have been getting in front of people who are genuinely looking for roofing work, and that makes life a lot easier for our team. It has also helped us compete for jobs against some of the bigger names in the area. Overall, it has been money much better spent than some of the things we tried before.",
    name: "Laughton Paperworth",
    displayName: "Laughton P.",
    company: "Texas Roofers USA",
    category: "Marketing",
  },
  {
    quote:
      "For us, the biggest change has been consistency. We are not just relying on referrals or hoping the phone rings. There is a proper marketing system bringing new people into the business, and the inquiries have generally been much better matched to the work we want. Not every lead turns into a job, obviously, but we are having more conversations with the right type of customer, and that is what matters.",
    name: "Alasdair Field",
    displayName: "Alasdair F.",
    company: "Texas Pro Roofing",
    category: "Marketing",
  },
  {
    quote:
      "We wanted to get more predictable with our lead flow instead of having really busy weeks followed by nothing. The marketing has helped smooth that out quite a bit. We are getting more opportunities to quote jobs, and the leads have been more relevant than what we were used to. I also like that everything feels focused around actual business results rather than just clicks and impressions. That was a big thing for me.",
    name: "James Mahoney",
    displayName: "James M.",
    company: "Ace Roofing Company",
    category: "Marketing",
  },
  {
    quote:
      "When things get busy, answering every call, text, and email right away is just not realistic. That was the problem we were trying to solve. The automation now handles a lot of the initial back and forth for us, answers common questions, helps customers get scheduled, and keeps things moving until someone on our team needs to step in. It has taken a surprising amount of little day to day work off our plate. We are quicker with customers now without having someone constantly watching the phone.",
    name: "Ravi Shah",
    displayName: "Ravi S.",
    company: "Central Texas HVAC LLC",
    category: "AI Automation",
  },
  {
    quote:
      "I was a little unsure at first about how automated replies would come across to customers, but it has worked much better than I expected. A lot of the basic questions, follow ups, lead qualification, and booking can happen without us manually going through every conversation. If somebody needs a real person, we can jump in, but we are not wasting time on all the repetitive parts anymore. It has definitely made the office side of the business easier to manage.",
    name: "Michee Wonga",
    displayName: "Michee W.",
    company: "Texas Air Tech",
    category: "AI Automation",
  },
];

export type ClientResult = {
  /** Full name, kept for our own records — never render this publicly. */
  name: string;
  /** First name + surname initial, e.g. "Ravi S." — this is the one to render. */
  displayName: string;
  company: string;
  category: ClientCategory;
  stats: string[];
};

export const CLIENT_RESULTS: ClientResult[] = [
  {
    name: "Eddie Matherwood",
    displayName: "Eddie M.",
    company: "TheGroundsGuys",
    category: "Website",
    stats: [
      "+58% website conversion rate",
      "+43% organic traffic",
      "+71% Google search impressions",
    ],
  },
  {
    name: "Bruno Knight",
    displayName: "Bruno K.",
    company: "Comprehensive Irrigation",
    category: "Website",
    stats: [
      "+46% website inquiries",
      "+37% organic traffic",
      "+64% Google search impressions",
    ],
  },
  {
    name: "Joshua Anderson",
    displayName: "Joshua A.",
    company: "AP Remodeling",
    category: "Website",
    stats: [
      "+67% website conversion rate",
      "+52% qualified website inquiries",
      "+41% organic traffic",
    ],
  },
  {
    name: "Kamal Rana",
    displayName: "Kamal R.",
    company: "N & L Remodeling",
    category: "Website",
    stats: [
      "+49% website conversion rate",
      "+44% contact form submissions",
      "+36% organic traffic",
    ],
  },
  {
    name: "Matt Davison",
    displayName: "Matt D.",
    company: "Structura Remodeling",
    category: "Marketing",
    stats: [
      "+41% qualified leads",
      "+34% booked consultations",
      "23% lower cost per qualified lead",
    ],
  },
  {
    name: "Laughton Paperworth",
    displayName: "Laughton P.",
    company: "Texas Roofers USA",
    category: "Marketing",
    stats: [
      "+63% qualified leads",
      "+39% booked inspections",
      "27% lower cost per lead",
    ],
  },
  {
    name: "Alasdair Field",
    displayName: "Alasdair F.",
    company: "Texas Pro Roofing",
    category: "Marketing",
    stats: [
      "+44% qualified leads",
      "+35% booked appointments",
      "28% lower cost per qualified lead",
    ],
  },
  {
    name: "James Mahoney",
    displayName: "James M.",
    company: "Ace Roofing Company",
    category: "Marketing",
    stats: [
      "+36% qualified inquiries",
      "+29% booked estimates",
      "21% lower acquisition cost",
    ],
  },
  {
    name: "Ravi Shah",
    displayName: "Ravi S.",
    company: "Central Texas HVAC LLC",
    category: "AI Automation",
    stats: [
      "84% of routine inquiries handled automatically",
      "Average response time reduced from 18 minutes to under 2 minutes",
      "Approximately 21 hours of admin work saved per month",
      "32% increase in booked appointments",
    ],
  },
  {
    name: "Michee Wonga",
    displayName: "Michee W.",
    company: "Texas Air Tech",
    category: "AI Automation",
    stats: [
      "76% of new leads automatically qualified",
      "91% of inquiries receiving an immediate response",
      "54% fewer leads left without follow-up",
      "Approximately 17 hours of manual work saved per month",
    ],
  },
];
