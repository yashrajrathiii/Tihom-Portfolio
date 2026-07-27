/**
 * All site copy lives here. Sourced from Monty's press kit + the content brief.
 * Only the gig photography is intentionally left as placeholders.
 */

export const nav = [
  { label: "Story", href: "#about" },
  { label: "Journey", href: "#timeline" },
  { label: "Genres", href: "#genres" },
  { label: "Gigs", href: "#journey" },
  { label: "Book", href: "#contact" },
];

export const hero = {
  name: "Tihom",
  tagline:
    "Raipur-born selector mixing Techno, Psy, BollyTech and Afro — anything built on brilliant percussion. He plays like he's flirting with the dance floor, until the room slips into a trance.",
  cta: { label: "Get in touch", href: "#contact" },
};

export const about = {
  headingLead: "Techno at heart.",
  headingAccent: "Open to everything.",
  body: "Born and brought up in Raipur, Chhattisgarh, DJ Tihom plays extravagant beats, mixing every genre — Techno, Psy, BollyTech, Afro, House and anything else you might guess. He picked up drumming classes in 2022 and instantly knew music was his passion. A while after stepping away, a turning point hit in 2023: he heard a set that made him fall in love with music all over again, and DJing took a place in his heart. Techno and Psy are his personal favourites, but he'll mix-match anything built on brilliant percussion.",
};

export const timeline = {
  headingLead: "From drum lessons",
  headingAccent: "to the dance floor.",
  milestones: [
    {
      year: "2022",
      title: "Picked up the drums",
      desc: "Started drumming classes — and instantly knew music was the thing.",
    },
    {
      year: "2023",
      title: "Fell for DJing",
      desc: "Heard a set that reignited everything. DJing took hold and never let go.",
    },
    {
      year: "March",
      sub: "2026",
      title: "First gig",
      desc: "Debut behind the decks — a small open-air set at the Local Flea Market with The Local.",
    },
    {
      year: "April",
      sub: "2026",
      title: "The run begins",
      desc: "Back at Local Flea, plus a string of private parties across Psy, BollyTech and Techno.",
    },
    {
      year: "Now",
      sub: "2026",
      title: "Exploring, always",
      desc: "Deep in the learning phase and loving it — chasing new genre combinations every set.",
    },
  ],
};

/**
 * A gig card's artwork. `src` is a path under /public; a clip also takes a
 * `poster` still, which is what shows before it is the centred card and for
 * anyone who asked for reduced motion.
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

export const journey = {
  headingLead: "Still learning —",
  headingAccent: "already flirting with the floor.",
  intro: [
    "A self-taught artist, DJ Tihom began this journey hoping to make a name for himself and build something big — and he's proudly still in his learning phase. His biggest influence is the wild party life of Goa, where people don't just swing with the beats but genuinely appreciate the art that music is.",
    "His first gig came not long ago — a small open-air set in March, in collaboration with The Local. Since then more offers have followed: private parties spinning Psy, BollyTech and Techno, and another night with The Local. Still exploring, he approaches music like he's flirting with the dance floor — crafting ease, fun, and a slow slide into a musical trance.",
  ],
  /**
   * The gig log and the gallery are the same thing now — one card per night,
   * carrying its own photo or clip. Ordered oldest first: March, then April.
   * `media` is the only placeholder left on the site: fill it in and the card
   * swaps its empty slot for the real thing.
   */
  gigs: [
    {
      month: "March",
      year: "2026",
      name: "Local Flea Market",
      detail: "with The Local",
      media: undefined as GigMedia | undefined,
    },
    {
      month: "March",
      year: "2026",
      name: "Private parties",
      detail: "×2",
      media: undefined as GigMedia | undefined,
    },
    {
      month: "April",
      year: "2026",
      name: "Local Flea",
      detail: "with The Local",
      media: undefined as GigMedia | undefined,
    },
    {
      month: "April",
      year: "2026",
      name: "Private parties",
      detail: "Psy · BollyTech · Techno",
      media: undefined as GigMedia | undefined,
    },
  ],
};

/**
 * Each genre rides a record, and each record wears a sleeve that stands for
 * the sound. Covers are pre-scaled to 320px squares — the label renders at
 * roughly 56px, so that is 3x DPR with room over.
 */
export const genres = {
  primary: [
    { name: "Techno", cover: "/assets/covers/techno.webp" },
    { name: "Hard Tech", cover: "/assets/covers/hard-tech.webp" },
    { name: "Psy", cover: "/assets/covers/psy.webp" },
    { name: "BollyTech", cover: "/assets/covers/bollytech.webp" },
    { name: "Afro House", cover: "/assets/covers/afro-house.webp" },
    { name: "House", cover: "/assets/covers/house.webp" },
  ],
  open: "Open to explore",
};

export const contact = {
  headingLead: "Book",
  headingAccent: "Tihom.",
  blurb:
    "To collaborate and craft a memorable night, reach out for bookings — he's always up for a new room to read.",
  phoneDisplay: "+91 62642 57124",
  phoneHref: "tel:+916264257124",
  email: "mohitchandani706@gmail.com",
  instagram: { handle: "@i.tihom", href: "https://instagram.com/i.tihom" },
  cta: "Send a message",
  location: "Raipur, India",
};
