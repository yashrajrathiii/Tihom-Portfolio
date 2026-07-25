"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Disc3 } from "lucide-react";

export interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

/**
 * One card in the deck. The veil (`before`) is what makes the stack read as
 * depth on a light ground — the demo greyscales instead, which goes muddy over
 * porcelain. Hover clears the veil and lifts the card out of the pile.
 */
function DisplayCard({
  className,
  icon = <Disc3 className="size-4" />,
  title = "Gig",
  description = "",
  date = "",
  iconClassName,
  titleClassName,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        // Title and description sit together at the top so the sliver of card
        // left uncovered by the one in front still says everything; only the
        // date is down where it gets hidden.
        "tl-card relative flex h-[8rem] w-[15.5rem] -skew-y-[8deg] select-none flex-col rounded-2xl px-5 py-4",
        "shadow-[0_16px_36px_rgba(1,22,56,0.1)] transition-all duration-700",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[rgba(255,253,247,0.62)] before:transition-opacity before:duration-700 before:content-['']",
        // The deck stacks in DOM order, so a lifted card needs to come forward.
        "hover:z-20 hover:before:opacity-0 hover:shadow-[0_26px_54px_rgba(1,22,56,0.16)]",
        "sm:w-[18rem] lg:h-[8.5rem] lg:w-[19rem]",
        className,
      )}
    >
      <div className="relative flex items-center gap-3">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-[#fffdf7]"
          style={{ background: "var(--grad-node)" }}
        >
          <span className={cn("flex", iconClassName)}>{icon}</span>
        </span>
        <p
          className={cn(
            "m-0 text-[17px] font-semibold leading-tight text-foreground",
            titleClassName,
          )}
        >
          {title}
        </p>
      </div>

      <p className="relative m-0 mt-2 text-[14px] leading-[1.4] text-foreground/60">
        {description}
      </p>

      <p className="text-warm relative m-0 mt-auto pr-[0.14em] text-[12px] font-bold uppercase tracking-[0.14em]">
        {date}
      </p>
    </div>
  );
}

/** A fanned-out deck — every card sits in the same grid area and is offset by
 *  its own className, so hovering any one of them pulls it to the front. */
export default function DisplayCards({ cards }: { cards: DisplayCardProps[] }) {
  return (
    // Start-aligned so the fan has room to drift right without running into
    // the edge of its column.
    <div className="grid place-items-start [grid-template-areas:'stack']">
      {cards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
