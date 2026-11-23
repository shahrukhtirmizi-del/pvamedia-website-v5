/**
 * Setter Academy training content.
 *
 * Server-only in practice: page.tsx imports this and hands it to the client
 * component only once a setter has logged in, so none of it ships to a
 * visitor who hasn't. Never import it from a "use client" file.
 *
 * Built from Dano's original academy, checked against how PVA sells today
 * (US prospects, prices in dollars, 30-minute calls on Dano's calendar).
 *
 * Script lines can start with a speaker ("Setter:", "Prospect:", "Owner:",
 * "You:", "Then:"); the page sets the speaker in bold.
 */

export type Method = { label: string; say: string[] };

export type Item = {
  title: string;
  /** Short category shown on the card: SOP, Mindset, Objections... */
  tag: string;
  when?: string;
  say?: string[];
  methods?: Method[];
  points?: string[];
  deeper?: string;
  note?: string;
};

export type Stage = {
  id: string;
  title: string;
  /** When in the call this stage applies. */
  when: string;
  items: Item[];
};

export const DAILY_STANDARD = {
  value: 3,
  text: "qualified bookings per working day is the minimum. Quality counts: decision-maker, real need, confirmed time.",
};

/** The 2 to 4 minute call at a glance. */
export const CALL_FLOW = [
  { time: "0:00", label: "Open", detail: "Who you are, why you called, permission for one question" },
  { time: "0:50", label: "Diagnose", detail: "Two or three questions, then reflect what you heard" },
  { time: "1:45", label: "Qualify", detail: "Need, decision-maker, capacity, timing" },
  { time: "2:15", label: "Book", detail: "Two real times, confirm details, send the invite" },
];

export const BOOKING_LINK = "https://calendly.com/dano-clarke-white-pvamedia/30min";

export const STAGES: Stage[] = [
  {
    id: "know-pva",
    title: "Know PVA",
    when: "Before you dial",
    items: [
      {
        title: "What PVA Media does",
        tag: "SOP",
        points: [
          "PVA Media builds a done-for-you system that gets established businesses more customers, and makes sure the enquiries they already pay for don't slip through.",
          "The system: Google and Meta (Facebook and Instagram) ads, a website or landing page built to convert, an instant reply to every enquiry, a 24/7 receptionist that answers calls, follow-up until booked, review requests and full tracking.",
          "You don't sell the system. You create interest, find a real need, qualify, and book the prospect in with our Lead Advisor, Dano.",
        ],
        note: "Talk about more customers and what happens to their enquiries, not technology. Never pitch it as \"AI this, AI that\".",
      },
      {
        title: "Your tools",
        tag: "SOP",
        points: [
          "JustCall is your dialler. Your leads are loaded into your own campaign.",
          "HubSpot holds every contact under your name. Log the outcome and your handoff notes on the contact after every call.",
          "Book straight into Dano's calendar, in the prospect's own time zone.",
          "Calls aren't recorded, so your notes are the only record of what was said.",
        ],
        deeper: "Dano's calendar: calendly.com/dano-clarke-white-pvamedia/30min",
      },
      {
        title: "Pricing (don't lead with it)",
        tag: "SOP",
        when: "Only if they ask directly. Answer honestly, then move on.",
        points: [
          "Packages start at $1,500 a month (Starter), then $3,000 (Lead Engine), $6,000 (Market Leader) and $12,000 (Market Dominator).",
          "Ad spend is separate. The client pays Google and Meta directly; PVA never holds it or marks it up.",
          "A website on its own starts from $1,500, one-off.",
        ],
        note: "Price comes after the prospect understands the problem and Dano has established fit. Don't turn the call into a package presentation, and don't recommend a package. Dano does that.",
      },
      {
        title: "Who to call",
        tag: "SOP",
        points: [
          "Home care and senior care agencies (owners and directors). Our strongest niche so far.",
          "Private dental clinics, cosmetic surgery and medical aesthetics clinics, and other high-value service businesses.",
          "Not roofing, plumbing, HVAC, landscaping or irrigation unless management says so.",
          "Good signs: wants more clients or patients, already spends on marketing, has capacity, the decision-maker is reachable, understands what one new client is worth.",
        ],
        note: "Skip businesses with no capacity, people who can't make the decision, anyone who wants free work, and long explanations to people with zero interest.",
      },
      {
        title: "Guarantees and territory",
        tag: "SOP",
        when: "Only if they ask.",
        say: [
          "We do have guarantee options under our standard terms. Dano will walk you through exactly how they work on the call.",
        ],
        note: "Never bring up a guarantee yourself, describe its terms, promise results, or claim a territory is reserved unless management has confirmed it.",
      },
    ],
  },
  {
    id: "mindset",
    title: "Mindset",
    when: "Before you dial and between calls",
    items: [
      {
        title: "The 10-second reset",
        tag: "Mindset",
        points: [
          "Release: end the call and don't take the no personally.",
          "Review: make one useful note. What would you change?",
          "Restart: reset posture and tone, then dial with fresh energy.",
        ],
        note: "The next call deserves your best, not the mood the last one left you in.",
      },
      {
        title: "Five commitments of a winning setter",
        tag: "Mindset",
        points: [
          "I own my activity.",
          "I stay professional when people say no.",
          "I ask better questions instead of pitching harder.",
          "I learn from every call.",
          "I finish the block I committed to.",
        ],
      },
      {
        title: "The reality of sales",
        tag: "Mindset",
        points: [
          "Rejection: a no is part of the job, not a verdict on you.",
          "Uncertainty: you can't predict which conversation becomes an opportunity.",
          "Responsibility: your preparation, effort and follow-up are yours to own.",
        ],
        note: "You can't control every answer. You can control the person making the call.",
      },
      {
        title: "Winners vs average",
        tag: "Mindset",
        points: [
          "Average says: “They were rude.” “These leads are bad.” “I’m not feeling it.”",
          "Winner says: “What can I learn?” “What can I improve?” “Next call, fresh start.”",
        ],
        note: "Same market, same objections, different response.",
      },
      {
        title: "Detach from the outcome",
        tag: "Mindset",
        points: [
          "Run the process well and never force a yes.",
          "Control the inputs: calls made, quality conversations, questions asked, follow-ups completed.",
        ],
        deeper: "Ask yourself: what makes a call successful even when they say no?",
      },
      {
        title: "Discipline beats motivation",
        tag: "Mindset",
        points: [
          "Before the block: set your target, prepare your list, remove distractions.",
          "During the block: stay present, keep your voice alive, don't hide in admin.",
          "After the block: review results, pick one weakness, practise it.",
        ],
      },
      {
        title: "Confidence is earned",
        tag: "Mindset",
        points: [
          "Prepare, repeat, review, improve, then believe.",
          "You don't need to be perfect. You need to know why the conversation matters.",
        ],
      },
      {
        title: "Rejection is information",
        tag: "Mindset",
        points: [
          "“Not interested”: did we give them a clear reason to listen?",
          "“We’re busy”: did we explore what growth or capacity looks like?",
          "“Send an email”: did we earn a real next step?",
        ],
        note: "Separate the objection from your emotional reaction.",
      },
      {
        title: "Own the scoreboard",
        tag: "Mindset",
        points: [
          "Activity: dials, connections and meaningful conversations.",
          "Quality: useful questions, qualified leads and clear next steps.",
          "Learning: review one call and improve one skill every day.",
        ],
      },
      {
        title: "Your next 7 days",
        tag: "Mindset",
        points: [
          "Choose one daily behaviour you won't negotiate on.",
          "Track completion and one lesson from each calling block.",
          "Bring one improved call and one lesson to the next session.",
        ],
      },
    ],
  },
  {
    id: "read-the-buyer",
    title: "Read the buyer",
    when: "Learn it early, use it at any point in the call",
    items: [
      {
        title: "How to read a buyer",
        tag: "Profiles",
        points: [
          "Observe pace, questions, interruptions, detail and concerns.",
          "Verify by asking what matters instead of guessing.",
          "Adapt your pace and proof. Keep the discovery process intact.",
        ],
        note: "Profiles describe behaviour on this call, not permanent labels. Never exaggerate to suit a personality.",
      },
      {
        title: "Four prospect behaviours",
        tag: "Profiles",
        points: [
          "Driver: wants a clear result. Lead with the outcome and the next step.",
          "Sceptic: tests claims. Offer evidence and welcome questions.",
          "Analytical: tests assumptions. Show numbers and trade-offs.",
          "Relationship buyer: tests trust. Explain the people and the process.",
        ],
        note: "Match their pace and level of detail.",
      },
      {
        title: "Fast-moving (Type A)",
        tag: "Profiles",
        points: ["Direct, impatient, asks about results, time and price. Keep it short and recommend the next step clearly."],
        say: ["What result matters most, and by when?"],
      },
      {
        title: "Detail-driven",
        tag: "Profiles",
        points: ["Checks details, wants process and evidence. Slow down, be specific, give a step-by-step plan."],
        say: ["What would you need to verify to feel confident?"],
        note: "Avoid vague promises or figures you can't back up.",
      },
      {
        title: "Steamroller",
        tag: "Profiles",
        points: ["Takes control, jumps between topics, challenges answers. Acknowledge briefly, set boundaries calmly."],
        say: ["I can answer that. First, one question so it’s relevant."],
        note: "Don't match their aggression.",
      },
      {
        title: "Sceptic",
        tag: "Profiles",
        points: ["Questions claims, mentions a bad past experience. Offer evidence they can check and realistic outcomes."],
        say: ["What happened last time that made you cautious?"],
        note: "No guaranteed results.",
      },
      {
        title: "Budget-conscious",
        tag: "Profiles",
        points: ["Asks about fees, affordability and timing."],
        say: ["Is the issue cash flow, or confidence in the return?"],
        note: "Never shame their budget.",
      },
      {
        title: "Comparison shopper",
        tag: "Profiles",
        points: ["Mentions competitors and asks for comparisons."],
        say: ["What three things will decide your choice?"],
        note: "Don't attack competitors or invent exclusivity.",
      },
      {
        title: "Relationship-driven",
        tag: "Profiles",
        points: ["Wants to know the team and the ongoing support."],
        say: ["What does a strong partnership look like to you?"],
        note: "Don't confuse friendliness with commitment.",
      },
      {
        title: "Overthinker",
        tag: "Profiles",
        points: ["Returns to earlier concerns, asks what-ifs. Summarise and find the single unresolved risk."],
        say: ["Which unanswered question is holding you back?"],
        note: "Don't pile on more information.",
      },
      {
        title: "Procrastinator",
        tag: "Profiles",
        points: ["Says yes in principle but keeps moving the timeline."],
        say: ["What will be different next month?"],
        note: "No false urgency or invented deadlines.",
      },
      {
        title: "Guarded",
        tag: "Profiles",
        points: ["Short answers, won't share numbers. Lower the pressure and explain why you're asking."],
        say: ["What would make this call useful for you?"],
        note: "Don't demand sensitive figures.",
      },
      {
        title: "Buying signals",
        tag: "Signals",
        points: [
          "Implementation: “How quickly can we start?” Explore timing.",
          "Financial: “How does payment work?” Explore budget fit.",
          "Ownership: “Will my team need training?” Explore readiness.",
          "Comparison: “How are you different?” Explore their criteria.",
          "Future: “Could this work across locations?” Explore scale.",
        ],
        note: "A signal is an invitation to dig, not proof they're ready. A friendly “sounds great” can just be politeness.",
      },
      {
        title: "Signal or politeness? (exercise)",
        tag: "Signals",
        points: [
          "“That sounds interesting.” Ask: “Which part feels most relevant?”",
          "“Could we have this running before December?” Ask: “What happens in December?”",
          "“Who would manage onboarding?” Ask: “Who owns rollout on your side?”",
        ],
      },
      {
        title: "Why good calls still fail",
        tag: "Signals",
        points: [
          "Rapport: they enjoy speaking to you.",
          "Interest: they can see a possible benefit.",
          "Intent: they're considering an actual decision.",
          "Commitment: they agree to a specific action.",
        ],
        note: "Only the last one is a booking. Ask what would need to happen next.",
      },
      {
        title: "Don't jump ahead",
        tag: "Signals",
        when: "They ask “How quickly could we get started?”",
        say: ["Is there a particular date you’re working towards?"],
        deeper: "If yes: “What’s driving that date?” If no: “What would need to be in place before starting?”",
        note: "Don't promise start dates or go-live times; that's Dano's job. Use the answer to book the audit, and put the date in your handoff notes.",
      },
      {
        title: "Behind “that’s expensive”",
        tag: "Signals",
        points: [
          "It usually means one of four things: a real budget gap, value they can't see yet, a competing priority, or someone else has to approve.",
          "Acknowledge, clarify (“Is the issue budget, or confidence in the return?”), explore, then check nothing else is outstanding.",
          "Fast-moving buyer: “What result would make it worthwhile?”",
          "Sceptic: “Which part of the value isn’t proven yet?”",
          "Budget-conscious: “Is the amount unaffordable, or the return unclear?”",
        ],
        note: "Same objection, different approach. Don't abandon the process.",
      },
      {
        title: "Role-play: sceptical director",
        tag: "Role-play",
        say: [
          "Prospect: I’ve heard all this before. Why should I believe you?",
          "You: What specifically went wrong last time?",
          "You: What proof would make this different?",
        ],
        note: "Investigate before you defend. Score listening, precision and checking.",
      },
      {
        title: "Role-play: hesitant buyer",
        tag: "Role-play",
        say: [
          "Prospect: Looks good. Just send me the details.",
          "You: What would you want to review before deciding?",
          "You: Who else will be involved in the decision?",
        ],
        note: "Find the real approval path and agree a clear next step.",
      },
      {
        title: "Role-play: “Just tell me the price”",
        tag: "Role-play",
        say: ["Prospect: I’ve heard all this before. Just tell me the price."],
        deeper: "Answer the question honestly, then ask one relevant diagnostic question.",
        note: "Stay composed, avoid a power struggle, and earn permission to carry on.",
      },
      {
        title: "Assignment for your next three calls",
        tag: "Practice",
        points: [
          "Record one possible buying signal and what you asked next.",
          "Record one hesitation and the concern you uncovered.",
          "Record one moment you adapted your delivery.",
          "Share the exact question that improved the conversation.",
        ],
      },
    ],
  },
  {
    id: "open",
    title: "Open",
    when: "First 20 to 50 seconds",
    items: [
      {
        title: "Core opener",
        tag: "SOP",
        when: "Your default cold open.",
        say: [
          "Hi [Name], it’s [Setter] from PVA Media. I’ll keep it brief. We help established businesses bring in more clients and make sure the enquiries they already get turn into bookings. Are you actively looking to increase the number of clients, patients or qualified enquiries coming in at the moment?",
        ],
      },
      {
        title: "Permission-based opening",
        tag: "Cold calling",
        when: "Acknowledge the interruption and ask for 20 seconds.",
        say: ["Hi Sarah, [Setter] from PVA Media. I know this is unexpected. Can I take 20 seconds to explain why I called?"],
        note: "Be calm. Don't spend the whole opening apologising.",
      },
      {
        title: "Pattern interrupt + relevance",
        tag: "Cold calling",
        when: "You know something true about their business.",
        say: [
          "Your clinic offers implants. How are you currently turning website enquiries into booked consultations?",
          "You offer 24-hour care. What happens when a family calls after the office has closed?",
        ],
        note: "Never invent website faults, research findings or business problems.",
      },
      {
        title: "Specific opener for a clinic",
        tag: "Rapport & frame",
        say: [
          "Hi Dr Patel, it’s Alex at PVA Media. This is a cold call, so I’ll be brief. We help private clinics improve how patient enquiries turn into booked consultations. Could I ask one question to see if that’s relevant to you?",
        ],
        deeper: "Who you are, why you called, and permission for one question.",
      },
      {
        title: "Audit-led opener",
        tag: "SOP",
        say: [
          "The reason for the call is simple: we offer a short growth audit where we look at how you’re currently winning business, where opportunities may be leaking, and whether there’s a commercial case for us to help. Worst case, you leave with useful information. Would it be unreasonable to take 30 minutes with our Lead Advisor?",
        ],
      },
      {
        title: "The rushed pitch",
        tag: "Psychology",
        when: "They sound distracted or about to hang up.",
        say: [
          "James, quick one: PVA Media. We look at where businesses lose enquiries between first contact and sale. If it’s relevant, jot down PVA Media; happy to leave it there.",
        ],
        deeper: "If they ask what you mean: “Missed calls, slow replies or follow-up gaps. Which is most relevant to you?”",
        note: "Don't fake urgency or demand they take notes.",
      },
      {
        title: "“I’m busy. What do you want?”",
        tag: "Psychology",
        say: [
          "Understood. We help businesses see where enquiries are lost between first contact and sale. Is that a problem you’re actively looking at?",
        ],
        deeper: "If no: “Fair enough. I won’t take more of your time.” If yes: “Where’s the main gap?”",
      },
      {
        title: "“I have no time”: the two-minute test",
        tag: "Rapport & frame",
        say: ["Understood. Give me two minutes to see whether there’s even a reason for an audit. If there isn’t, I’ll leave it there."],
      },
      {
        title: "Reception: the decision-chain detour",
        tag: "Rapport & frame",
        say: ["Fair enough. Who normally reviews growth opportunities before they reach the owner?"],
        note: "Don't pretend you've been put through, or that an appointment already exists.",
      },
      {
        title: "Voice and frame",
        tag: "Rapport & frame",
        points: [
          "Match the prospect's pace. Fast but not frantic for an impatient owner.",
          "Acknowledge a sceptic's frustration without exaggerated promises.",
          "Be specific with analytical people: enquiries, response time, booked consultations.",
          "One question, then two silent beats, then respond to the answer.",
        ],
      },
      {
        title: "The operating principle",
        tag: "Psychology",
        points: [
          "Control the next question, not the person. The question decides what you learn next.",
          "Attention, then relevance, then disclosure, then diagnosis, then the meeting.",
          "A cold call earns permission to investigate. It doesn't need to prove the whole business case.",
        ],
        note: "No fake urgency, no fake familiarity. Psychology is not a substitute for relevance.",
      },
      {
        title: "Quick replies to common resistance",
        tag: "Cold calling",
        points: [
          "“Send me an email.” Absolutely. Is your priority more enquiries, or converting more of them?",
          "“We already have an agency.” Understood. Do they cover both winning enquiries and turning them into bookings?",
          "“I’m busy.” Of course. Is there a better time, or would you prefer I leave it?",
          "“Not interested.” Understood. Thanks for your time.",
        ],
        deeper: "Fuller answers are in Handle objections.",
      },
      {
        title: "“I’m not interested” straight away",
        tag: "Psychology",
        when: "A rejection straight out of the gate.",
        say: [
          "I completely understand. Can I ask, is bringing in more clients a priority, or is it improving what happens to the enquiries you already get?",
        ],
        note: "Say it once, then ask a relevant question. If they decline again, respect it and end the call.",
      },
    ],
  },
  {
    id: "diagnose",
    title: "Diagnose",
    when: "Roughly 0:50 to 2:15",
    items: [
      {
        title: "Five discovery questions",
        tag: "Cold calling",
        points: [
          "Process: What happens between a new enquiry and a confirmed booking?",
          "Impact: Which services would you most like to grow?",
          "Speed: How quickly do you usually respond to enquiries?",
          "Measurement: Do you track how many enquiries become consultations?",
          "Decision: Who would need to approve an improvement?",
        ],
        note: "One question at a time. Listen, then probe for impact.",
      },
      {
        title: "Rapport is a transition",
        tag: "Rapport & frame",
        say: [
          "That makes sense. It sounds like your front desk is handling a lot of enquiries.",
          "To see whether we could actually help, I only need to understand two things: how quickly leads are contacted, and what happens if they don’t book.",
        ],
        deeper: "Acknowledge, narrow the issue, ask the next commercial question. Warmth on its own is not progress.",
      },
      {
        title: "Commercial discovery ladder",
        tag: "Rapport & frame",
        points: [
          "Priority: Which service are you looking to grow?",
          "Process: What normally happens when someone enquires?",
          "Gap: Roughly how many of those turn into consultations?",
          "Impact: If that improved, what would it change for you?",
        ],
        say: ["So the demand is coming in, but the follow-up is inconsistent. Is that fair?"],
        note: "Only put numbers on it using the prospect's own figures.",
      },
      {
        title: "Problem-first and gap questions",
        tag: "Cold calling",
        say: [
          "When someone enquires but doesn’t book, what usually happens next?",
          "How many qualified consultations do you book each week, and what would you ideally want?",
        ],
        note: "Don't manufacture a gap.",
      },
      {
        title: "The third-door fork",
        tag: "Psychology",
        when: "A broad question would get a one-word answer.",
        say: ["Is the bigger focus getting more enquiries, converting the ones you have, or neither?"],
        deeper: "What makes that the priority?",
        note: "Always leave the third door open. Never force a false either/or.",
      },
      {
        title: "The unmeasured number",
        tag: "Psychology",
        when: "They say lead flow is healthy.",
        say: ["Out of ten enquiries, do you know how many actually become clients?"],
        deeper: "What normally happens to the others?",
        note: "Don't imply a loss is proven.",
      },
      {
        title: "The success contradiction",
        tag: "Psychology",
        when: "They say their marketing works.",
        say: ["Great. Is your conversion as strong as your enquiry volume?"],
        deeper: "What would you change about the journey from enquiry to sale?",
        note: "If both are strong, accept it.",
      },
      {
        title: "The outside-consultant test",
        tag: "Psychology",
        when: "The owner says nothing needs improving.",
        say: ["If you were hired to find one leak in your own sales process, where would you look first?"],
        deeper: "Why that part rather than the others?",
        note: "Don't manufacture a flaw.",
      },
      {
        title: "The last-time question",
        tag: "Psychology",
        when: "They say it happens “sometimes”.",
        say: ["When was the last time a good enquiry slipped through?"],
        deeper: "What happened after that, and is that typical?",
        note: "One story is not a trend.",
      },
      {
        title: "The standard–reality gap",
        tag: "Psychology",
        when: "They care about service quality.",
        say: ["What’s the longest you’d want a new lead waiting for a response?"],
        deeper: "How often do you hit that today?",
        note: "No shaming.",
      },
      {
        title: "The owner-absence test",
        tag: "Psychology",
        when: "They say the business runs smoothly.",
        say: ["If you took a week completely off, would enquiries still be followed up the same way?"],
        deeper: "Which part would worry you most?",
      },
      {
        title: "The two-word mirror",
        tag: "Psychology",
        when: "They reveal something meaningful.",
        say: ["Prospect: It’s inconsistent.", "You: Inconsistent?"],
        deeper: "Where does that show up most?",
        note: "Don't parrot every sentence.",
      },
      {
        title: "Vague answer: “Yeah, could be better”",
        tag: "Psychology",
        say: ["Which part specifically?", "When was the last time a promising enquiry wasn’t followed up quickly?"],
        deeper: "Is that a one-off, or does it keep happening?",
      },
    ],
  },
  {
    id: "qualify",
    title: "Qualify",
    when: "Connect their answer to PVA, then confirm fit",
    items: [
      {
        title: "Qualification questions",
        tag: "SOP",
        points: [
          "Growth: Are you actively trying to bring in more clients or consultations at the moment?",
          "Current source: Where does most of your new business come from now?",
          "Problem: What's the biggest frustration with your current marketing or lead flow?",
          "Capacity: If we increased qualified enquiries, could the business handle them?",
          "Decision: Would you make the final decision on growth and marketing?",
          "Priority: If the numbers made sense, is this something you'd move on this month?",
        ],
        note: "Use as few as you need. Don't interrogate.",
      },
      {
        title: "What a qualified appointment looks like",
        tag: "SOP",
        points: [
          "A real desire to grow, or an acquisition problem to fix.",
          "The decision-maker, or the decision-maker will be on the call.",
          "Capacity to take on more clients.",
          "They understand it's a business growth conversation, not a free website consultation.",
          "A firm date and time, booked and confirmed.",
        ],
      },
      {
        title: "Why now?",
        tag: "Psychology",
        when: "They agree there's an issue.",
        say: ["Is this something you’re trying to fix this quarter, or just an irritation you’ve learned to live with?"],
        deeper: "What would have to happen for it to move up the list?",
        note: "Don't manufacture urgency.",
      },
      {
        title: "The recoverable leak",
        tag: "Psychology",
        when: "They admit they miss opportunities.",
        say: ["Of the enquiries that don’t convert, which ones do you think could realistically have been saved?"],
        deeper: "What makes you think those were recoverable?",
        note: "Use their estimates, never invented losses.",
      },
      {
        title: "The respectful challenge",
        tag: "Psychology",
        when: "They name the wrong bottleneck.",
        say: ["Can I challenge one assumption? You said lead volume, but could follow-up be the bigger constraint?"],
        deeper: "What would tell us which is true?",
        note: "Challenge the claim, not their competence.",
      },
      {
        title: "The six-month split",
        tag: "Psychology",
        when: "They don't have a clear outcome in mind.",
        say: ["If this process stays the same for six months, what happens? And what would you want to be different?"],
        deeper: "Which outcome matters enough to act on?",
        note: "Don't catastrophise.",
      },
      {
        title: "Frame the call",
        tag: "Rapport & frame",
        points: [
          "Time: “Give me 30 seconds, then you can tell me if this is worth discussing.”",
          "Relevance: “Is adding more high-value clients a priority this quarter?”",
          "Destination: “If there’s a gap worth looking at, the next step is an audit with our Lead Advisor.”",
        ],
        note: "The frame explains what the call is for. It never claims a meeting already exists.",
      },
      {
        title: "Permission ladder",
        tag: "Rapport & frame",
        points: [
          "Permission: Could I ask one quick question?",
          "Priority: Is growing [service] a focus right now?",
          "Bottleneck: What happens to enquiries that don't book?",
          "Impact: Would improving that matter commercially?",
          "Audit: Worth reviewing with our Lead Advisor?",
        ],
        note: "Permission to answer a question is not agreement to a meeting. Earn each step.",
      },
      {
        title: "Insight-led meeting offer",
        tag: "Cold calling",
        say: ["We can map your enquiry-to-booking journey and show you where people are dropping off."],
        note: "Say exactly what the audit covers and what they'll come away with.",
      },
    ],
  },
  {
    id: "objections",
    title: "Handle objections",
    when: "Acknowledge, question, book",
    items: [
      {
        title: "The framework",
        tag: "Objections",
        points: [
          "Acknowledge: lower resistance and stay composed.",
          "Question: expose the gap or test relevance with one commercially relevant question.",
          "Book: connect the gap to the audit, only when there's a real reason to meet.",
        ],
        note: "Don't debate. Diagnose. Respect a clear no and leave professionally.",
      },
      {
        title: "“I’m not interested”",
        tag: "Objections",
        methods: [
          {
            label: "Method A",
            say: [
              "Fair enough. Are you completely happy with how many enquiries become paying clients?",
              "Then: If there’s room to improve, let’s review it properly. 30 minutes, Tuesday or Thursday?",
            ],
          },
          { label: "Method B", say: ["Understood. Is bringing in more qualified clients even a priority this quarter?"] },
          {
            label: "SOP version",
            say: [
              "Understood. Just so I don’t keep bothering you, is that because growth isn’t a priority right now, or because you’re already happy with the number of clients you’re winning?",
            ],
          },
        ],
        deeper: "Say it once, then ask one relevant question. If they decline again, end the call respectfully.",
      },
      {
        title: "“Send me some information”",
        tag: "Objections",
        methods: [
          { label: "Method A", say: ["Absolutely. Should I focus on bringing in more enquiries, or converting more of the ones you already get?"] },
          { label: "Method B", say: ["Of course. What would you need to see in it to make a conversation worthwhile?"] },
          {
            label: "SOP version",
            say: [
              "Happy to. Without understanding how you win clients, anything I send will be generic. Would it be more useful to give Dano 30 minutes? Is tomorrow or Thursday better?",
            ],
          },
        ],
        deeper: "If they push back again, ask what result the information needs to show them.",
      },
      {
        title: "“We already have someone for marketing”",
        tag: "Objections",
        methods: [
          { label: "Method A", say: ["Good. Are they measured on leads delivered, or on actual clients and revenue?"] },
          {
            label: "Method B",
            say: [
              "Understood. Do they also handle missed enquiries and follow-up, or mainly lead generation?",
              "Then: If that part isn’t covered, we can look at it without replacing your provider.",
            ],
          },
        ],
        deeper: "Never attack their provider. If it's genuinely covered: “Sounds like you’ve got it handled. Thanks for your time.”",
      },
      {
        title: "“We don’t have the budget”",
        tag: "Objections",
        methods: [
          { label: "Method A", say: ["Understood. Is the money genuinely not there, or has the return just not been proven?"] },
          { label: "Method B", say: ["What is one extra long-term client worth to your business?"] },
        ],
        deeper: "Then: “Let’s look at the numbers before talking about any investment.”",
      },
      {
        title: "“I’m too busy, call me later”",
        tag: "Objections",
        methods: [
          { label: "Method A", say: ["Of course. Is getting more qualified bookings a priority right now, or should I leave it for now?"] },
          { label: "Method B", say: ["Understood. Would tomorrow morning or Thursday afternoon be less disruptive?"] },
        ],
        note: "Avoid “But it’s free, it only takes a few minutes.” Ask whether looking at this is relevant this quarter instead.",
      },
      {
        title: "“How much is it?”",
        tag: "SOP",
        say: [
          "It depends on the level of support and what the audit shows you actually need. Our packages start from $1,500 a month, with ad spend paid separately to Google and Meta. Dano will only recommend something if the numbers make sense for your business.",
        ],
      },
      {
        title: "Price, then pivot",
        tag: "Psychology",
        when: "They demand a price straight away.",
        say: ["Packages start from $1,500 a month, with ad spend separate. Can I ask what result you’d need for that to make sense?"],
        deeper: "How would you measure success?",
        note: "Never dodge the price. Being straight keeps your credibility and earns more discovery.",
      },
      {
        title: "“We had a bad agency before”",
        tag: "SOP",
        say: [
          "I completely understand why you’d be cautious. That’s exactly why the first conversation is an audit, not a hard pitch. We want to understand what went wrong, what would need to be different, and whether we can realistically improve things.",
          "Was the main problem lead quality, or that enquiries never became actual bookings?",
        ],
        deeper: "“What were you promised before, and what actually happened? What would you need to see before taking another provider seriously?”",
      },
      {
        title: "“Every agency says that”",
        tag: "Psychology",
        say: ["That’s fair. What were you promised before, and what actually happened?", "If we can’t show you something different, there’s no reason to meet."],
      },
      {
        title: "“Our marketing is already working”",
        tag: "Rapport & frame",
        say: ["Good, I’m not suggesting you replace it. Are you measuring how many of those enquiries turn into booked clients?"],
      },
      {
        title: "If the first answer fails, change the angle",
        tag: "Objections",
        points: [
          "Don't repeat yourself.",
          "A second objection often shows a different priority (no budget, then too busy).",
          "Ask a new question about priority, result or how they decide.",
        ],
      },
      {
        title: "P.A.C.E. and R.I.R.A.",
        tag: "Rapport & frame",
        points: [
          "P.A.C.E.: Pause and let them explain. Assess what's really behind it (timing, value, trust, capacity or authority). Clarify with one question. Execute: deal with the real factor and agree a sensible next step.",
          "R.I.R.A.: Recognise, Isolate the real issue, Resolve the relevant gap, Advance only when they agree there's a reason to.",
        ],
        say: ["Prospect: We should wait a few months.", "You: What do you expect to change in a few months?"],
        note: "Urgency has to come from real consequences, never invented deadlines.",
      },
    ],
  },
  {
    id: "book",
    title: "Book",
    when: "Last 2 minutes",
    items: [
      {
        title: "Preferred close",
        tag: "SOP",
        say: [
          "Based on what you’ve told me, I think it’s worth getting you in front of Dano, our Lead Advisor. He’ll look at the business properly, find the opportunity and tell you honestly whether we can help. I’ve got [time A] or [time B]. Which works better?",
        ],
        note: "Once they show interest, stop selling and go to the calendar.",
      },
      {
        title: "Summarise, then earn the meeting",
        tag: "Rapport & frame",
        say: [
          "So the demand is there, but follow-up depends on who’s available. Is that a fair summary?",
          "Then a 30-minute audit could be useful. Our Lead Advisor would map how your enquiries turn into bookings and see whether there’s an improvement worth making. Would Tuesday at 2 or Thursday at 11 suit you?",
        ],
      },
      {
        title: "The earned two-choice",
        tag: "Psychology",
        say: ["Would a 30-minute audit be useful, or is this not a priority?"],
        deeper: "If yes: “Would Tuesday at 11 or Thursday at 2 suit?”",
        note: "Only offer times that are actually free on Dano's calendar.",
      },
      {
        title: "Sell the purpose, not the call",
        tag: "Objections",
        points: [
          "Weak: “Can we jump on a quick call sometime?”",
          "Strong: “Let’s look at where enquiries are being lost and whether fixing that would pay for itself. Tuesday or Thursday?”",
        ],
      },
      {
        title: "Micro-commitment",
        tag: "Cold calling",
        say: ["If we could find two areas worth improving, would a short walkthrough be useful?"],
        note: "Every yes has to be genuine. No empty yes-ladders.",
      },
      {
        title: "Appointment standards",
        tag: "SOP",
        points: [
          "Offer two specific times, never “when are you free?”",
          "Book it on Dano's calendar while they're still on the line.",
          "Confirm email, phone, business name, location and website.",
          "Confirm who will attend, and that every decision-maker will be there.",
          "Repeat the date, time and their time zone.",
          "Make sure the calendar invite goes out straight away.",
          "If they can't make a time, reschedule there and then. Never leave it open.",
        ],
      },
    ],
  },
  {
    id: "handoff",
    title: "Handoff & follow-up",
    when: "After the call",
    items: [
      {
        title: "Handoff notes for Dano",
        tag: "SOP",
        when: "Every booked call, logged on the contact in HubSpot. Dano must never go in blind.",
        points: [
          "Current situation (e.g. running ads, lead quality all over the place)",
          "Main pain (e.g. slow follow-up, enquiries being lost)",
          "Goal (e.g. 10 to 15 more qualified enquiries a month)",
          "Decision-maker, and anyone else involved in the money decision",
          "Urgency, and any date they're working towards",
          "Existing provider (e.g. contract ending)",
          "Anything personal or useful (e.g. burned by an agency before)",
        ],
        note: "Write down the prospect's exact words and every objection they raised.",
      },
      {
        title: "After booking",
        tag: "SOP",
        points: [
          "Check the calendar invite has gone out.",
          "Send a short confirmation: what the audit is, who they're meeting and why it's relevant to them.",
          "Remind them on the day where appropriate.",
          "If they reply with questions, answer briefly and keep the meeting in place.",
        ],
      },
      {
        title: "No-show recovery",
        tag: "SOP",
        when: "Same day wherever possible.",
        say: [
          "Hi [Name], I saw we missed each other for the PVA Media audit. No problem, I know things get busy. Dano had prepared for the conversation from the notes of our call, so I’d rather not waste that. I can move it to [time A] or [time B]. Which is easier?",
        ],
        note: "A missed call doesn't mean they've lost interest.",
      },
      {
        title: "Follow-up cadence",
        tag: "SOP",
        points: [
          "Day 0: call, book if you can, send the confirmation.",
          "Day 1 to 2: if not booked, a short call or email about the specific problem they mentioned.",
          "Day 3 to 5: a clear commercial reason to speak, never “just checking in”.",
          "Day 7+: one last direct follow-up. Book it or close the loop.",
        ],
      },
    ],
  },
  {
    id: "practise",
    title: "Practise & score",
    when: "Drills, scorecards, standards",
    items: [
      {
        title: "Non-negotiables",
        tag: "SOP",
        points: [
          "Don't lie to create urgency or scarcity.",
          "Don't guarantee revenue or results.",
          "Don't invent client results, case studies or relationships.",
          "Don't argue with prospects.",
          "Don't over-explain the service before the audit.",
          "Don't book people who can't buy, can't decide or have no relevant need.",
          "Do represent PVA Media as selective, commercially serious and focused on measurable growth.",
        ],
      },
      {
        title: "Daily scoreboard",
        tag: "SOP",
        points: [
          "Qualified appointments booked: minimum 3",
          "Appointments confirmed: 100%",
          "No-shows: same-day recovery attempt",
          "Handoff notes completed: 100%",
          "Track daily: decision-makers reached, calls and conversations, appointments attended, deals from your bookings",
        ],
      },
      {
        title: "The 2 to 4 minute call",
        tag: "Cold calling",
        points: [
          "0:00 to 0:50: open and show relevance.",
          "0:50 to 2:15: ask two or three questions, reflect back, explain what the audit gives them.",
          "2:15 to 4:00: book, confirm, make sure the invite goes out.",
        ],
      },
      {
        title: "The 90-second stack",
        tag: "Psychology",
        points: [
          "Rushed pitch: “Quick one, PVA Media. We find the gaps between enquiry and sale.”",
          "Fork: “More leads, better conversion, or neither?”",
          "Contrast: “And is that side performing as well as you’d like?”",
          "Last time: “When did that last happen?”",
          "Why now: “Is fixing it a priority this quarter?”",
          "Bridge: “Worth a short audit to test that properly?”",
        ],
        note: "Don't recite techniques. Pick the next one based on their answer.",
      },
      {
        title: "Full call example 1: from interruption to relevance",
        tag: "Example call",
        when: "Private cosmetic dentistry clinic offering Invisalign.",
        say: [
          "Setter: Hi Dr Reyes, Maya from PVA Media. Cold call, I’ll be quick. I noticed you offer Invisalign. Can I ask one question about how those enquiries are handled?",
          "Owner: Okay, but we’re already doing marketing.",
          "Setter: Good. I’m not calling to replace it. Are you measuring success in leads generated, or actual consultations booked?",
          "Owner: Mostly the leads. Reception takes it from there.",
          "Setter: Understood. When someone enquires but doesn’t book straight away, is there a consistent follow-up process?",
        ],
        deeper: "Permission, specific relevance, the success contradiction, then the first diagnostic question.",
      },
      {
        title: "Full call example 2: from diagnosis to booked audit",
        tag: "Example call",
        say: [
          "Owner: Not consistently. It depends who’s on reception.",
          "Setter: So the demand is there, but follow-up depends on who’s available. Is that a fair summary?",
          "Owner: Yes, that’s about right.",
          "Setter: Then a 30-minute audit could be useful. Our Lead Advisor would map how your enquiries turn into bookings and see whether there’s an improvement worth making. Would Tuesday at 2 or Thursday at 11 suit you?",
          "Owner: Thursday at 11. Send the invite.",
        ],
        deeper: "Handoff notes: cosmetic treatments are the priority, leads are tracked but bookings aren't, follow-up depends on who's at reception, Thursday 11am their time.",
      },
      {
        title: "20-minute coaching drill",
        tag: "Training",
        points: [
          "3 min: trainer demonstrates a good and a bad opening.",
          "6 min: paired role-play, then swap roles.",
          "6 min: resistance drills (send an email, already have an agency, busy, not interested).",
          "5 min: feedback, then repeat each rep's weakest 30 seconds.",
        ],
      },
      {
        title: "Live drills",
        tag: "Training",
        points: [
          "Reset drill: the prospect shuts you down, you reset and open the next call, your partner gives one improvement.",
          "Double-objection drill: 60 seconds, two objections, one clean recovery.",
          "Switchboard: the coach changes the prospect's behaviour mid-call and you change technique.",
          "Team drill: 2-minute call, 1 minute of feedback, swap. Score the diagnosis, not just the booking.",
        ],
      },
      {
        title: "Switchboard rounds",
        tag: "Training",
        points: [
          "Round 1: “Not interested”: acknowledge and check relevance.",
          "Round 2: guarded: rushed pitch and the third-door fork.",
          "Round 3: proud: success contradiction and the standard–reality gap.",
          "Round 4: burned before: the last-time question and what proof they'd need.",
          "Round 5: rushed: direct relevance and a respectful exit.",
        ],
        deeper: "Debrief: what did the prospect actually reveal? What was assumed? Did the meeting earn itself?",
      },
      {
        title: "Rep scorecard (0 to 2 each, 12 total)",
        tag: "Scoring",
        points: [
          "Opening",
          "Truthful relevance",
          "Discovery",
          "Listening",
          "Objection response",
          "Clear next step",
        ],
      },
      {
        title: "Coaching scorecard: grade the thinking",
        tag: "Scoring",
        points: [
          "Did they earn permission to continue?",
          "Was the question relevant to this business?",
          "Did they uncover a concrete example or measurable gap?",
          "Did they check rather than assume?",
          "Did they respect resistance and boundaries?",
          "Was the meeting a logical next step?",
        ],
      },
      {
        title: "Team drill checklist",
        tag: "Scoring",
        points: [
          "Open: clear company name, genuine relevance and a time frame.",
          "Rapport and tone: match pace, name their concern, pause after questions.",
          "Frame: steer toward a precise commercial question.",
          "Gap: find a real problem and earn permission for the next step.",
          "Book and qualify: need, decision-maker, capacity, agenda and time zone.",
          "Handoff: the prospect's exact words and every objection.",
        ],
      },
      {
        title: "KPIs and the full funnel",
        tag: "Scoring",
        points: [
          "Connect rate, qualified conversation rate, booking rate, show rate, close rate.",
          "Revenue per 100 dials = revenue collected from your bookings ÷ dials × 100.",
          "No single script wins everywhere. Test by audience, offer and channel.",
        ],
      },
      {
        title: "Psychology is not a substitute for relevance",
        tag: "Psychology",
        points: [
          "These techniques draw on research ideas (reactance, loss framing, motivational interviewing, choice framing), but none of these exact scripts is proven to raise booking rates.",
          "Treat every opener as a test. Measure conversations, qualified meetings and show rate, not just bookings.",
          "Make the prospect think. Never make them feel tricked.",
        ],
      },
    ],
  },
];
