import { Hero } from "@/components/Hero";
import { GallerySlot } from "@/components/GallerySlot";
import { Reveal } from "@/components/Reveal";
import { Orb } from "@/components/Orb";
import { Journey } from "@/components/Journey";
import { Timeline } from "@/components/Timeline";
import { GenreOrbit } from "@/components/GenreOrbit";
import { InstagramGlyph } from "@/components/InstagramGlyph";
import { about, contact, gallery, genres, timeline } from "@/content/site";

/** Shared horizontal padding for every content section. */
const PAD = "px-[clamp(24px,5vw,90px)]";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />

      {/* Sections alternate between the two bands below — porcelain, sand,
          porcelain … — so each one reads as its own room. */}
      <div className="theme-light relative z-[1] overflow-hidden bg-[#fffdf7]">
        {/* ===== 01 · Bio + genres ===== */}
        <section
          id="about"
          className={`${PAD} band-cream relative overflow-hidden pb-24 pt-28`}
        >
          <Orb
            className="left-[-140px] top-10 h-[360px] w-[360px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-green), transparent 70%)",
            }}
          />
          {/* Orbit left, story right — the prose is second in the DOM so it
              still reads first when the two stack on narrow screens. */}
          <div className="relative z-[1] grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="lg:order-2">
              <Reveal>
                <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                  01 — Bio &amp; genres
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="m-0 mb-7 mt-5 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                  {about.headingLead}{" "}
                  <span className="text-warm">{about.headingAccent}</span>
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="m-0 max-w-[660px] text-[clamp(17px,1.35vw,22px)] leading-[1.6] text-foreground/75">
                  {about.body}
                </p>
              </Reveal>
            </div>

            <div id="genres" className="lg:order-1">
              <Reveal delay={140}>
                <GenreOrbit items={genres.primary} center={genres.open} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== 02 · Timeline (showpiece) ===== */}
        <section
          id="timeline"
          className={`${PAD} band-sand relative overflow-hidden py-28`}
        >
          <Orb
            className="right-[-160px] top-20 h-[440px] w-[440px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-brown), transparent 70%)",
            }}
          />
          <div className="relative z-[1]">
            <Reveal>
              <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                02 — Timeline
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mb-14 mt-5 max-w-[920px] text-[clamp(34px,5.2vw,60px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
                {timeline.headingLead}{" "}
                <span className="text-warm">{timeline.headingAccent}</span>
              </h2>
            </Reveal>
            <Timeline items={timeline.milestones} />
          </div>
        </section>

        {/* ===== 03 · Journey ===== */}
        <section
          id="journey"
          className={`${PAD} band-cream relative overflow-hidden py-28`}
        >
          <Orb
            className="bottom-0 left-[-120px] h-[320px] w-[320px] float-y"
            style={{
              background:
                "radial-gradient(circle, var(--glow-green), transparent 70%)",
            }}
          />
          <Journey />
        </section>

        {/* ===== 04 · Gallery (placeholders) ===== */}
        <section
          id="gallery"
          className={`${PAD} band-sand relative overflow-hidden py-24`}
        >
          <Reveal>
            <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
              04 — Photos &amp; videos
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-4 max-w-[520px] text-[15px] text-foreground/55">
              Posters, promo shots and performance reels — dropping in soon.
            </p>
          </Reveal>

          <Reveal delay={100} className="relative z-[1]">
            <div className="mb-[18px] mt-8 grid gap-[18px] md:grid-cols-[2fr_1fr]">
              <div className="warm-card relative flex aspect-video items-center justify-center overflow-hidden rounded-[20px]">
                <div className="absolute inset-0 opacity-45">
                  <GallerySlot
                    src={gallery.feature.src}
                    caption={gallery.feature.caption}
                    video
                  />
                </div>
                <div
                  className="pointer-events-none relative flex h-[72px] w-[72px] items-center justify-center rounded-full"
                  style={{ background: "var(--grad-node)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0a0a0a" aria-hidden="true">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </div>
              </div>
              <div className="warm-card relative aspect-video overflow-hidden rounded-[20px] md:aspect-auto">
                <GallerySlot src={gallery.tall.src} caption={gallery.tall.caption} />
              </div>
            </div>
            <div className="grid gap-[18px] sm:grid-cols-3">
              {gallery.row.map((tile, i) => (
                <div
                  key={i}
                  className="warm-card relative aspect-4/3 overflow-hidden rounded-[20px]"
                >
                  <GallerySlot src={tile.src} caption={tile.caption} />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ===== 05 · Contact ===== */}
        <section
          id="contact"
          className={`${PAD} band-cream relative overflow-hidden pb-24 pt-28`}
        >
          <Orb
            className="right-[-120px] top-[-60px] h-[400px] w-[400px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-green), transparent 70%)",
            }}
          />
          <div className="relative z-[1]">
            <Reveal>
              <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                05 — Contact &amp; booking
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
                {contact.headingLead}{" "}
                <span className="text-warm">{contact.headingAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-[520px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-foreground/70">
                {contact.blurb}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:max-w-[820px]">
              <Reveal delay={120} className="flex flex-col gap-6">
                <a href={contact.phoneHref} className="group flex flex-col gap-1">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                    Bookings
                  </span>
                  <span className="text-[clamp(24px,3vw,34px)] font-semibold text-foreground group-hover:text-[color:var(--accent-green-deep)]">
                    {contact.phoneDisplay}
                  </span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                    Email
                  </span>
                  <span className="break-all text-[clamp(18px,2vw,24px)] font-semibold text-foreground group-hover:text-[color:var(--accent-green-deep)]">
                    {contact.email}
                  </span>
                </a>
              </Reveal>

              <Reveal delay={180} className="flex flex-col gap-5">
                <a
                  href={contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="warm-card group flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <InstagramGlyph className="h-9 w-9 transition-transform duration-500 group-hover:rotate-6" />
                  <div className="flex flex-col">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                      Follow
                    </span>
                    <span className="text-[19px] font-semibold text-foreground">
                      {contact.instagram.handle}
                    </span>
                  </div>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full px-7 py-4 text-[16px] font-semibold text-[#011638] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ background: "var(--grad-cta)" }}
                >
                  {contact.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#011638" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </Reveal>
            </div>

            <div className="mt-20 flex items-center justify-between border-t border-line pt-8 text-[13px] text-footer">
              <span>© Tihom {new Date().getFullYear()}</span>
              <span>{contact.location}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
