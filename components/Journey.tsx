"use client";

import { journey } from "@/content/site";
import { CardFan } from "./ui/card-fan";
import { Reveal } from "./Reveal";

/** The story in prose, with the gig log — now also the gallery — alongside it. */
export function Journey() {
  return (
    <div className="relative z-[1]">
      <Reveal>
        <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
          03 — Journey, gigs &amp; photos
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="mt-5 max-w-[920px] text-[clamp(34px,5.2vw,60px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
          {journey.headingLead}{" "}
          <span className="text-accent">{journey.headingAccent}</span>
        </h2>
      </Reveal>

      {/* Two columns only from lg — the fan needs a little over two card
          widths to deal itself out, which a half-width column can't give it
          below that. */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-8">
          {journey.intro.map((p, i) => (
            <Reveal key={i} delay={100 + i * 80}>
              <p className="text-[clamp(17px,1.55vw,25px)] leading-[1.55] text-foreground/75">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <CardFan
            label="Gigs, photos and clips"
            cards={journey.gigs.map((g) => ({
              media: g.media,
              title: g.name,
              detail: g.detail,
              meta: `${g.month} ${g.year}`,
            }))}
          />
        </Reveal>
      </div>
    </div>
  );
}
