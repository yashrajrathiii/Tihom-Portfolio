import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Orb } from "@/components/Orb";
import { Journey } from "@/components/Journey";
import { Timeline } from "@/components/Timeline";
import { GenreOrbit } from "@/components/GenreOrbit";
import { InstagramGlyph } from "@/components/InstagramGlyph";
import { about, contact, genres, timeline } from "@/content/site";

/** Shared horizontal padding for every content section. */
const PAD = "px-[clamp(24px,5vw,90px)]";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />

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
                <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                  01 — Bio &amp; genres
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
              <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                02 — Timeline
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
          <Journey />
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
              <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
                04 — Contact &amp; booking
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

            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:max-w-[820px]">
              <Reveal delay={120} className="flex flex-col gap-6">
                <a href={contact.phoneHref} className="group flex flex-col gap-1">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                    Bookings
                  </span>
                  <span className="text-[clamp(24px,3vw,34px)] font-semibold text-foreground group-hover:text-[color:var(--accent-hover)]">
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
                  <span className="break-all text-[clamp(18px,2vw,24px)] font-semibold text-foreground group-hover:text-[color:var(--accent-hover)]">
                    {contact.email}
                  </span>
                </a>
              </Reveal>

              <Reveal delay={180} className="flex flex-col gap-5">
                <a
                  href={contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-card group flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
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
                  className="inline-flex items-center justify-center gap-2 self-start rounded-full px-7 py-4 text-[16px] font-semibold text-[#000500] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ background: "var(--grad-cta)" }}
                >
                  {contact.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
