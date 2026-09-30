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
  "Built only for trades and home service companies",
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
    body: "They are not better at the work. They just look more legitimate the moment someone lands on the page.",
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
      "Most trades ad budgets are wasted after the click, not before it. The targeting is usually fine. The page is the problem.",
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

/* -------------------------------------------------------------------------- */
/**
 * Real client testimonials and results, grouped by service line. Not yet
 * wired into any component — CLIENT_TESTIMONIALS replaces the placeholder
 * TESTIMONIALS above (via a genericized CircularCardDeck), and CLIENT_RESULTS
 * feeds a new results section built with ScrollSwipeStack.
 */

export type ClientCategory = "Website" | "Marketing" | "AI Automation";

export type ClientTestimonial = {
  quote: string;
  name: string;
  company: string;
  category: ClientCategory;
};

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    quote:
      "We knew our old website was not really doing the business justice. The new one is a night and day difference. It looks clean, professional, and actually feels like it represents the level of work we do. The other big thing is that it was not built just to look nice. Customers can find what they need quickly, it is easy to contact us, and they put a lot of thought into how the site would perform on Google. I am really happy with how it turned out.",
    name: "Eddie Matherwood",
    company: "TheGroundsGuys",
    category: "Website",
  },
  {
    quote:
      "I wanted something simple, professional, and easy for customers to use, and that is pretty much exactly what we got. The site works great on phones, everything is laid out clearly, and people do not have to dig around to figure out what services we offer. They also explained the Google side of things and built the site around actually generating inquiries, which I liked. It has been a big step up from what we had before.",
    name: "Bruno Knight",
    company: "Comprehensive Irrigation",
    category: "Website",
  },
  {
    quote:
      "The website came out really well. With remodeling, people are obviously judging your work visually, so I wanted the site to feel polished without looking too corporate or overdone. They got that balance right. Our projects are presented properly, the site is easy to move around, and there is a clear path for homeowners who want to contact us. It feels much more like our company now, which was important to me.",
    name: "Joshua Anderson",
    company: "AP Remodeling",
    category: "Website",
  },
  {
    quote:
      "The main thing I wanted was for someone to land on our website and immediately feel confident about the company. Before, I did not think we were getting that. The new site looks much more established and professional, and it is straightforward for customers to use. I also liked that they kept bringing the conversation back to how the website could actually help generate business, rather than just talking about colors and design. It came together really nicely.",
    name: "Kamal Rana",
    company: "N & L Remodeling",
    category: "Website",
  },
  {
    quote:
      "We had done marketing before and gotten plenty of inquiries that went nowhere, so I was more interested in lead quality than just seeing a big number on a report. That has been the biggest improvement. We are talking to more homeowners who actually have a project in mind and are serious about getting work done. It has made our sales conversations a lot more worthwhile and given us a more consistent flow of opportunities.",
    name: "Matt Davison",
    company: "Structura Remodeling",
    category: "Marketing",
  },
  {
    quote:
      "I have dealt with marketing companies that promise a lot and then send over leads that are barely worth calling. This has been different. We have been getting in front of people who are genuinely looking for roofing work, and that makes life a lot easier for our team. It has also helped us compete for jobs against some of the bigger names in the area. Overall, it has been money much better spent than some of the things we tried before.",
    name: "Laughton Paperworth",
    company: "Texas Roofers USA",
    category: "Marketing",
  },
  {
    quote:
      "For us, the biggest change has been consistency. We are not just relying on referrals or hoping the phone rings. There is a proper marketing system bringing new people into the business, and the inquiries have generally been much better matched to the work we want. Not every lead turns into a job, obviously, but we are having more conversations with the right type of customer, and that is what matters.",
    name: "Alasdair Field",
    company: "Texas Pro Roofing",
    category: "Marketing",
  },
  {
    quote:
      "We wanted to get more predictable with our lead flow instead of having really busy weeks followed by nothing. The marketing has helped smooth that out quite a bit. We are getting more opportunities to quote jobs, and the leads have been more relevant than what we were used to. I also like that everything feels focused around actual business results rather than just clicks and impressions. That was a big thing for me.",
    name: "James Mahoney",
    company: "Ace Roofing Company",
    category: "Marketing",
  },
  {
    quote:
      "When things get busy, answering every call, text, and email right away is just not realistic. That was the problem we were trying to solve. The automation now handles a lot of the initial back and forth for us, answers common questions, helps customers get scheduled, and keeps things moving until someone on our team needs to step in. It has taken a surprising amount of little day to day work off our plate. We are quicker with customers now without having someone constantly watching the phone.",
    name: "Ravi Shah",
    company: "Central Texas HVAC LLC",
    category: "AI Automation",
  },
  {
    quote:
      "I was a little unsure at first about how automated replies would come across to customers, but it has worked much better than I expected. A lot of the basic questions, follow ups, lead qualification, and booking can happen without us manually going through every conversation. If somebody needs a real person, we can jump in, but we are not wasting time on all the repetitive parts anymore. It has definitely made the office side of the business easier to manage.",
    name: "Michee Wonga",
    company: "Texas Air Tech",
    category: "AI Automation",
  },
];

export type ClientResult = {
  name: string;
  company: string;
  category: ClientCategory;
  stats: string[];
};

export const CLIENT_RESULTS: ClientResult[] = [
  {
    name: "Eddie Matherwood",
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
