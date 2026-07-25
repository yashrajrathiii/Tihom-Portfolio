"use client";

import { Disc3, PartyPopper } from "lucide-react";
import { journey } from "@/content/site";
import DisplayCards from "./ui/display-cards";
import { Reveal } from "./Reveal";

/** Fan offsets for the gig deck, back of the pile first. Each card clears the
 *  one behind it by exactly its heading + description, and hover nudges a card
 *  up by a hair rather than pulling it out of the stack. Kept as whole classes
 *  so Tailwind can see them. */
const STACK = [
  "[grid-area:stack] hover:-translate-y-3",
  "[grid-area:stack] translate-x-[1.4rem] translate-y-[4.25rem] hover:translate-y-[3.5rem] sm:translate-x-7",
  "[grid-area:stack] translate-x-[2.8rem] translate-y-[8.5rem] hover:translate-y-[7.75rem] sm:translate-x-14",
  // Front of the fan — nothing covers it, so it drops the veil.
  "[grid-area:stack] translate-x-[4.2rem] translate-y-[12.75rem] before:hidden hover:translate-y-[12rem] sm:translate-x-21",
];

/** The story in prose, with the gig log alongside it. */
export function Journey() {
  return (
    <div className="relative z-[1]">
      <Reveal>
        <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
          03 — Journey &amp; experience
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="mt-5 max-w-[920px] text-[clamp(34px,5.2vw,60px)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
          {journey.headingLead}{" "}
          <span className="text-warm">{journey.headingAccent}</span>
        </h2>
      </Reveal>

      {/* The prose spreads to the full height of the deck beside it, so the
          column doesn't trail off into dead space. */}
      {/* Two columns only from lg — at md the 0.9fr column is narrower than
          the fanned deck, which pushed the front card off the section. */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20 xl:gap-28">
        <div className="flex flex-col justify-between gap-8">
          {journey.intro.map((p, i) => (
            <Reveal key={i} delay={100 + i * 80}>
              <p className="text-[clamp(17px,1.55vw,25px)] leading-[1.55] text-foreground/75">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Nudged further right where there's room for it — the deck fans
            rightward, so it needs the slack on that side, not the left. */}
        <Reveal delay={160} className="xl:pl-12 2xl:pl-20">
          <h3 className="m-0 mb-6 text-[clamp(20px,1.6vw,26px)] font-semibold text-foreground">
            Gigs so far
          </h3>
          <div className="pb-[13.5rem] pl-1 pt-4">
            <DisplayCards
              cards={journey.gigs.map((g, i) => ({
                className: STACK[i],
                icon: g.name.startsWith("Private") ? (
                  <PartyPopper className="size-3.5" />
                ) : (
                  <Disc3 className="size-3.5" />
                ),
                title: g.name,
                description: g.detail,
                date: `${g.month} ${g.year}`,
              }))}
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
