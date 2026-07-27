"use client";

import type { SiteContent } from "@/content/schema";
import { SectionEditor } from "./admin/SectionEditor";
import { CardFan } from "./ui/card-fan";
import { Reveal } from "./Reveal";

/** The story in prose, with the gig log — now also the gallery — alongside it. */
export function Journey({ journey }: { journey: SiteContent["journey"] }) {
  return (
    <div className="relative z-[1]">
      <Reveal>
        <div className="flex items-center gap-4 text-[13px] uppercase tracking-[0.16em] text-muted">
          03 — Journey, gigs &amp; photos
          <SectionEditor section="journey" value={journey} />
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="mt-5 max-w-[920px] text-[clamp(34px,5.2vw,60px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
          {journey.headingLead}{" "}
          <span className="text-accent">{journey.headingAccent}</span>
        </h2>
      </Reveal>

      {/* Gallery left, story right. The prose stays first in the DOM so it
          still reads first once the two stack, and the 0.95fr track moves to
          the front with the fan — its card sizing is tuned to that width. */}
      {/* Two columns only from lg — the fan needs a little over two card
          widths to deal itself out, which a half-width column can't give it
          below that. */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-8 lg:order-2">
          {journey.intro.map((p, i) => (
            <Reveal key={i} delay={100 + i * 80}>
              <p className="text-[clamp(17px,1.55vw,25px)] leading-[1.55] text-foreground/75">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="lg:order-1">
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
