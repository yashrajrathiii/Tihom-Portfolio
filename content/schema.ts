/**
 * The shape of everything on the page. One document, mirroring the sections
 * top to bottom, so the admin panel edits exactly the tree the page renders
 * and there is no mapping layer to keep in sync.
 */

/**
 * A gig card's artwork. `src` is a URL — a path under /public for the seeded
 * content, or a Supabase Storage public URL once something is uploaded. A clip
 * also takes a `poster` still, which is what shows before it is the centred
 * card and for anyone who asked for reduced motion.
 */
export type GigMedia = {
  src: string;
  kind: "photo" | "video";
  poster?: string;
  /**
   * Which way the caption reads over this particular shot: "light" for white
   * type on a dark frame, "dark" for black type on a bright one. Set it per
   * image — it is the only thing that can't be worked out from the file.
   */
  tone?: "light" | "dark";
};

export type NavItem = { label: string; href: string };

export type Milestone = {
  year: string;
  /** Small label under the year — used to pin the recent months to 2026. */
  sub?: string;
  title: string;
  desc: string;
};

export type Gig = {
  month: string;
  year: string;
  name: string;
  detail: string;
  media?: GigMedia;
};

export type Genre = { name: string; cover?: string };

export type SiteContent = {
  nav: NavItem[];
  hero: {
    name: string;
    tagline: string;
    cta: { label: string; href: string };
  };
  about: {
    headingLead: string;
    headingAccent: string;
    body: string;
  };
  timeline: {
    headingLead: string;
    headingAccent: string;
    milestones: Milestone[];
  };
  journey: {
    headingLead: string;
    headingAccent: string;
    intro: string[];
    gigs: Gig[];
  };
  genres: {
    primary: Genre[];
    open: string;
  };
  contact: {
    headingLead: string;
    headingAccent: string;
    blurb: string;
    phoneDisplay: string;
    phoneHref: string;
    email: string;
    instagram: { handle: string; href: string };
    cta: string;
    location: string;
  };
};

/** The editable sections, used to key the edit modals and the save action. */
export const SECTIONS = [
  "hero",
  "about",
  "timeline",
  "journey",
  "genres",
  "contact",
] as const;

export type SectionKey = (typeof SECTIONS)[number];
