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
