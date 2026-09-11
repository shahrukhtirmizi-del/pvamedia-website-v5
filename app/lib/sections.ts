/**
 * The home page's sections each have a real address. The path is what the
 * address bar shows, the id is the element it scrolls to.
 *
 * Every one of these routes renders the whole home page and scrolls to its
 * section, so a link to /pricing opens the page at pricing, and scrolling
 * from there updates the address as other sections pass.
 */
export const SECTION_ROUTES = [
  { path: "/", id: "top", label: "Home" },
  { path: "/work", id: "work", label: "Work" },
  { path: "/services", id: "services", label: "Services" },
  { path: "/ai-receptionist", id: "ai-receptionist", label: "AI Receptionist" },
  { path: "/pricing", id: "pricing", label: "Pricing" },
  { path: "/contact", id: "contact", label: "Contact" },
] as const;

export type SectionPath = (typeof SECTION_ROUTES)[number]["path"];

export function sectionForPath(path: string) {
  const clean = path.replace(/\/+$/, "") || "/";
  return SECTION_ROUTES.find((r) => r.path === clean) ?? null;
}

