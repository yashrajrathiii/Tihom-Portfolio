/**
 * All site copy lives here. Sourced from Monty's press kit + the content brief.
 * Only the gallery is intentionally left as placeholders.
 */

export const nav = [
  { label: "Story", href: "#about" },
  { label: "Journey", href: "#timeline" },
  { label: "Genres", href: "#genres" },
  { label: "Gallery", href: "#gallery" },
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

export const journey = {
  headingLead: "Still learning —",
  headingAccent: "already flirting with the floor.",
  intro: [
    "A self-taught artist, DJ Tihom began this journey hoping to make a name for himself and build something big — and he's proudly still in his learning phase. His biggest influence is the wild party life of Goa, where people don't just swing with the beats but genuinely appreciate the art that music is.",
    "His first gig came not long ago — a small open-air set in March, in collaboration with The Local. Since then more offers have followed: private parties spinning Psy, BollyTech and Techno, and another night with The Local. Still exploring, he approaches music like he's flirting with the dance floor — crafting ease, fun, and a slow slide into a musical trance.",
  ],
  /** Ordered as they're stacked in the deck: March first, then April. */
  gigs: [
    {
      month: "March",
      year: "2026",
      name: "Local Flea Market",
      detail: "with The Local",
    },
    { month: "March", year: "2026", name: "Private parties", detail: "×2" },
    {
      month: "April",
      year: "2026",
      name: "Local Flea",
      detail: "with The Local",
    },
    {
      month: "April",
      year: "2026",
      name: "Private parties",
      detail: "Psy · BollyTech · Techno",
    },
  ],
};

export const genres = {
  primary: ["Techno", "Hard Techno", "Psy", "BollyTech", "Afro House", "House"],
  open: "Open to explore",
};

/**
 * Gallery tiles — the only placeholder section. Set `src` to a path under
 * /public to drop real media in; leave undefined for the styled empty slot.
 */
export const gallery = {
  feature: {
    caption: "Performance reel / live set",
    src: undefined as string | undefined,
  },
  tall: { caption: "Promo poster", src: undefined as string | undefined },
  row: [
    { caption: "Live photo", src: undefined as string | undefined },
    { caption: "Promo shot", src: undefined as string | undefined },
    { caption: "Reel", src: undefined as string | undefined },
  ],
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
