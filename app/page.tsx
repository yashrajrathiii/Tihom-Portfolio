import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Orb } from "@/components/Orb";
import { Journey } from "@/components/Journey";
import { Timeline } from "@/components/Timeline";
import { GenreOrbit } from "@/components/GenreOrbit";
import { InstagramGlyph } from "@/components/InstagramGlyph";
import { WhatsappGlyph } from "@/components/WhatsappGlyph";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { AdminBar } from "@/components/admin/AdminBar";
import { getContent } from "@/lib/content";

/** Shared horizontal padding for every content section. */
const PAD = "px-[clamp(24px,5vw,90px)]";

/**
 * One booking channel. Renders nothing without both a link and a value, so
 * clearing a field in the admin panel retires the card cleanly.
 */
function ContactCard({
  href,
  label,
  value,
  icon,
  size = "sm",
  className = "",
}: {
  href?: string;
  label: string;
  value?: string;
  icon: React.ReactNode;
  /** "lg" is the artist's own card, which carries the section on its own. */
  size?: "sm" | "lg";
  className?: string;
}): React.ReactElement | null {
  if (!href || !value) return null;
  const large = size === "lg";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`panel-card group flex items-center rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${
        large ? "gap-6 p-8" : "gap-4 p-5"
      } ${className}`}
    >
      {icon}
      <div className="flex flex-col">
        <span
          className={`uppercase tracking-[0.14em] text-muted ${
            large ? "text-[13px]" : "text-[12px]"
          }`}
        >
          {label}
        </span>
        <span
          className={`font-semibold text-foreground ${
            large ? "text-[clamp(22px,2.2vw,30px)]" : "text-[19px]"
          }`}
        >
          {value}
        </span>
      </div>
    </a>
  );
}

/** Re-read the document at most once a minute for visitors; a save calls
 *  revalidatePath("/") so the artist sees their own edit immediately. */
export const revalidate = 60;

export default async function Home() {
  const { about, contact, genres, timeline, journey, hero, nav } =
    await getContent();

  return (
    <div className="bg-background">
      <Hero hero={hero} nav={nav} />

      {/* Sections alternate between the two bands below — black, carbon,
          black … — so each one reads as its own room. */}
      <div className="relative z-[1] overflow-hidden bg-[#000500]">
        {/* ===== 01 · Bio + genres ===== */}
        <section
          id="about"
          className={`${PAD} band-black relative overflow-hidden pb-24 pt-28`}
        >
          <Orb
            className="left-[-140px] top-10 h-[360px] w-[360px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-blue), transparent 70%)",
            }}
          />
          {/* Story left, orbit right. The prose comes first in the DOM, which
              is both the column order here and the order it should read in
              when the two stack on narrow screens — so no order overrides. */}
          <div className="relative z-[1] grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-4 text-[13px] uppercase tracking-[0.16em] text-muted">
                  01 — Bio &amp; genres
                  <SectionEditor section="about" value={about} />
                  <SectionEditor section="genres" value={genres} />
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="m-0 mb-7 mt-5 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                  {about.headingLead}{" "}
                  <span className="text-accent">{about.headingAccent}</span>
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
          className={`${PAD} band-carbon relative overflow-hidden py-28`}
        >
          <Orb
            className="right-[-160px] top-20 h-[440px] w-[440px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-cherry), transparent 70%)",
            }}
          />
          <div className="relative z-[1]">
            <Reveal>
              <div className="flex items-center gap-4 text-[13px] uppercase tracking-[0.16em] text-muted">
                02 — Timeline
                <SectionEditor section="timeline" value={timeline} />
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mb-14 mt-5 max-w-[920px] text-[clamp(34px,5.2vw,60px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
                {timeline.headingLead}{" "}
                <span className="text-accent">{timeline.headingAccent}</span>
              </h2>
            </Reveal>
            <Timeline items={timeline.milestones} />
          </div>
        </section>

        {/* ===== 03 · Journey ===== */}
        <section
          id="journey"
          className={`${PAD} band-black relative overflow-hidden py-28`}
        >
          <Orb
            className="bottom-0 left-[-120px] h-[320px] w-[320px] float-y"
            style={{
              background:
                "radial-gradient(circle, var(--glow-blue), transparent 70%)",
            }}
          />
          <Journey journey={journey} />
        </section>

        {/* ===== 04 · Contact ===== */}
        <section
          id="contact"
          className={`${PAD} band-carbon relative overflow-hidden pb-24 pt-28`}
        >
          <Orb
            className="right-[-120px] top-[-60px] h-[400px] w-[400px] drift"
            style={{
              background:
                "radial-gradient(circle, var(--glow-cherry), transparent 70%)",
            }}
          />
          <div className="relative z-[1]">
            <Reveal>
              <div className="flex items-center gap-4 text-[13px] uppercase tracking-[0.16em] text-muted">
                04 — Contact &amp; booking
                <SectionEditor section="contact" value={contact} />
                <SectionEditor section="hero" value={hero} />
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-5 text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
                {contact.headingLead}{" "}
                <span className="text-accent">{contact.headingAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-[520px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-foreground/70">
                {contact.blurb}
              </p>
            </Reveal>

            {/* Explicit rows rather than two stacked columns: it lets the
                artist's card occupy the same row as the two channel cards, so
                it stretches to exactly their combined height and lines up top
                and bottom with them. Each card is optional — blanking its
                handle or link in the admin panel removes it rather than
                leaving a dead link. */}
            <div className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2 md:max-w-[820px]">
              <Reveal delay={120} className="sm:col-start-1 sm:row-start-1">
                <a href={contact.phoneHref} className="group flex flex-col gap-1">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                    Bookings
                  </span>
                  <span className="text-[clamp(24px,3vw,34px)] font-semibold text-foreground group-hover:text-[color:var(--accent-hover)]">
                    {contact.phoneDisplay}
                  </span>
                </a>
              </Reveal>

              <Reveal
                delay={150}
                className="flex flex-col gap-5 sm:col-start-1 sm:row-start-2"
              >
                <ContactCard
                  href={contact.managerInstagram?.href}
                  label="Management"
                  value={contact.managerInstagram?.handle}
                  icon={<InstagramGlyph className="h-9 w-9 transition-transform duration-500 group-hover:rotate-6" />}
                />
                <ContactCard
                  href={contact.whatsapp?.href}
                  label="WhatsApp"
                  value={contact.whatsapp?.display}
                  icon={<WhatsappGlyph className="h-9 w-9 transition-transform duration-500 group-hover:rotate-6" />}
                />
              </Reveal>

              {/* The artist's own account, alone and larger — the one a
                  visitor is most likely to want. The min-height keeps it from
                  collapsing if both cards beside it are ever blanked out. */}
              <Reveal
                delay={180}
                className="sm:col-start-2 sm:row-start-2 sm:h-full"
              >
                <ContactCard
                  size="lg"
                  className="h-full min-h-[9rem]"
                  href={contact.instagram.href}
                  label="Follow"
                  value={contact.instagram.handle}
                  icon={<InstagramGlyph className="h-14 w-14 transition-transform duration-500 group-hover:rotate-6" />}
                />
              </Reveal>

              <Reveal delay={210} className="sm:col-start-1 sm:row-start-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                    Email
                  </span>
                  <span className="break-all text-[clamp(18px,2vw,24px)] font-semibold text-foreground group-hover:text-[color:var(--accent-hover)]">
                    {contact.email}
                  </span>
                </a>
              </Reveal>
            </div>

            <div className="mt-20 border-t border-line pt-8 text-[13px] text-footer">
              <div className="flex items-center justify-between">
                <span>© Tihom {new Date().getFullYear()}</span>
                <span>{contact.location}</span>
              </div>
              {/* Admin entry point lives down here rather than floating over
                  the page — it's for one person, and a visitor never needs it
                  in their eyeline. */}
              <div className="mt-5 flex justify-end">
                <AdminBar />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
