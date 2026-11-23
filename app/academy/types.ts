/** Shapes shared by the server and the academy UI. Types only, safe to import anywhere. */

export type Method = { label: string; say: string[] };

export type Item = {
  id: string;
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

export type FlowStep = { time: string; label: string; detail: string };

export type Content = {
  /** Goes up by one on every save; a save based on an older revision is refused. */
  revision: number;
  updatedAt: string | null;
  updatedBy: string | null;
  page: { eyebrow: string; title: string; intro: string; footer: string };
  standard: { value: string; text: string };
  flowTitle: string;
  flow: FlowStep[];
  bookingLabel: string;
  bookingLink: string;
  stages: Stage[];
};

export type Role = "admin" | "setter";

/** What the UI is allowed to see about a person. Never includes the password hash. */
export type Member = {
  id: string;
  username: string;
  name: string;
  role: Role;
  /** Still on the password they were given. */
  starter: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type Version = {
  id: string;
  revision: number;
  savedAt: string;
  savedBy: string;
  note: string;
};

export type Viewer = { id: string; name: string; username: string; role: Role; starter: boolean };

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

/* -------------------------------------------------------------- scoreboard */

export type ScoreSettings = {
  /** Qualified bookings expected per working day, per setter. */
  targetPerDay: number;
  /** 0 = Sunday ... 6 = Saturday. */
  workingDays: number[];
  /** A connected call at least this long counts as a conversation. */
  conversationSeconds: number;
  /** A call whose JustCall result contains any of these counts as a booking. */
  bookingWords: string[];
  /** Team member id → the JustCall user ids whose calls are theirs. */
  links: Record<string, string[]>;
};

export type ScoreDay = { date: string; dials: number; conversations: number; talk: number; bookings: number };

export type ScoreRow = {
  memberId: string;
  name: string;
  role: Role;
  dials: number;
  conversations: number;
  /** Seconds. */
  talk: number;
  bookings: number;
  days: ScoreDay[];
};

export type Scoreboard = {
  weekStart: string;
  weekOffset: number;
  days: string[];
  today: string | null;
  updatedAt: string | null;
  error: string | null;
  connected: boolean;
  targetPerDay: number;
  weeklyTarget: number;
  targetSoFar: number;
  workingDays: number[];
  setters: ScoreRow[];
  /** Admins only: non-setters' numbers, JustCall users not linked to anyone, results seen this week. */
  others: ScoreRow[];
  unmatched: { agentId: string; name: string; calls: number }[];
  dispositions: { name: string; count: number }[];
  bookingWords: string[];
};
