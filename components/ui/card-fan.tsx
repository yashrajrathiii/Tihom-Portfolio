"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FanCard {
  /** Undefined renders the empty slot the card is designed around. */
  media?: {
    src: string;
    kind: "photo" | "video";
    poster?: string;
    tone?: "light" | "dark";
  };
  title: string;
  detail?: string;
  meta?: string;
}

/** Cards on screen at once: one centred, one peeking from either side. */
const VISIBLE = 3;
const HALF = (VISIBLE - 1) / 2;

/**
 * Where a card sits, given its signed distance from the centre. One formula
 * for both cases: `d` is a whole number when the fan pages, and fractional
 * when there are too few cards to page and the whole set is spread instead.
 * x and y are percentages of a card's own box, so the fan holds its shape at
 * every card size.
 */
function geometry(d: number) {
  const away = Math.abs(d);
  return {
    // 48% rather than a wider fan: rotation swells a shoulder card's bounding
    // box to ~1.1 card widths, so every point of spread costs card size. A
    // tighter deck also hides more of the shoulders, which is the point.
    x: d * 48,
    y: away * 6,
    rot: d * 14,
    scale: 1 - 0.15 * away,
    // Whole numbers only — equal z on two cards would let paint order decide.
    z: 10 - Math.round(away * 9),
    // The far cards sit back rather than disappearing; the stage mask is what
    // actually cuts their outer edges off.
    opacity: away > HALF ? 0 : d === 0 ? 1 : 0.72,
  };
}

/**
 * A fanned deck showing three cards at a time. Paging is manual only — arrows,
 * the dots, a click on either shoulder card, or the arrow keys. Nothing here
 * advances on a timer.
 */
export function CardFan({
  cards,
  label,
  className,
}: {
  cards: FanCard[];
  label: string;
  className?: string;
}) {
  const total = cards.length;
  const paged = total > VISIBLE;
  const [center, setCenter] = useState(paged ? 0 : (total - 1) / 2);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // Only the centred clip plays; the shoulders hold their poster still. Two
  // or three videos running at once behind a mask is noise, not atmosphere.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (!still && i === Math.round(center)) {
        void v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [center]);

  /** Signed distance from the centre, taking the short way round the loop. */
  const offset = useCallback(
    (index: number) => {
      if (!paged) return index - (total - 1) / 2;
      let d = (((index - center) % total) + total) % total;
      if (d > total / 2) d -= total;
      return d;
    },
    [center, paged, total],
  );

  const step = useCallback(
    (dir: -1 | 1) => setCenter((c) => (c + dir + total) % total),
    [total],
  );

  if (!total) return null;

  const current = cards[Math.round(center)];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={paged ? 0 : -1}
        onKeyDown={(e) => {
          if (!paged) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
        }}
        // The stage is only as tall as the fan needs; --cw drives every
        // dimension below it so one value resizes the whole thing.
        // --cw is the one dial — everything below is sized off it. The dealt
        // fan measures ~2.06 card widths, and the column it has to fit is
        // full-width below lg but a hair under half above it, so the vw term
        // is tuned per regime rather than shared.
        className="fan-stage relative mx-auto h-[calc(var(--cw)*1.55)] w-full outline-none [--cw:clamp(150px,38vw,240px)] focus-visible:ring-2 focus-visible:ring-[rgba(10,222,255,0.6)] lg:[--cw:clamp(190px,19vw,300px)]"
      >
        {cards.map((card, i) => {
          const d = offset(i);
          const g = geometry(d);
          const visible = Math.abs(d) <= HALF;
          // Empty slots are near-black, so they take the light caption too.
          const dark = card.media?.tone === "dark";
          return (
            <button
              key={i}
              type="button"
              tabIndex={visible && d !== 0 ? 0 : -1}
              aria-hidden={!visible}
              aria-label={d === 0 ? undefined : `Show ${card.title}`}
              onClick={() => paged && setCenter(i)}
              style={{
                transform: `translate(-50%, -50%) translate(${g.x}%, ${g.y}%) rotate(${g.rot}deg) scale(${g.scale})`,
                zIndex: g.z,
                opacity: g.opacity,
                pointerEvents: visible ? "auto" : "none",
              }}
              className={cn(
                "fan-card absolute left-1/2 top-1/2 w-[var(--cw)] cursor-pointer overflow-hidden rounded-[20px] text-left",
                d === 0 && "cursor-default",
              )}
            >
              <div className="fan-media relative aspect-3/4 w-full">
                {card.media?.kind === "video" ? (
                  <video
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    src={card.media.src}
                    poster={card.media.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : card.media ? (
                  // Gig photography is user-supplied and unsized; a plain
                  // <img> avoids forcing dimensions we don't know.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.media.src}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // Empty slot — the card is designed to look deliberate
                  // without artwork, since none of it has been shot yet.
                  <span className="absolute inset-4 grid place-items-center rounded-[12px] border border-dashed border-line-strong/70">
                    <ImageIcon
                      className="size-7 text-foreground/15"
                      aria-hidden="true"
                    />
                  </span>
                )}

                {card.media?.kind === "video" && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute right-3 top-3 grid size-8 place-items-center rounded-full backdrop-blur-[6px]",
                      dark
                        ? "bg-[rgba(0,0,0,0.14)] text-[#000000]"
                        : "bg-[rgba(255,255,255,0.18)] text-[#ffffff]",
                    )}
                  >
                    <Play className="size-3.5 fill-current" />
                  </span>
                )}

                {/* Just enough gradient to keep the caption legible over a
                    busy frame — the tone decides which way it leans. Anything
                    heavier and the card stops reading as a photo. */}
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-2/5",
                    dark
                      ? "bg-linear-to-t from-[rgba(255,255,255,0.5)] to-transparent"
                      : "bg-linear-to-t from-[rgba(0,0,0,0.6)] to-transparent",
                  )}
                />

                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-4",
                    dark ? "text-[#000000]" : "text-[#ffffff]",
                  )}
                  style={{
                    textShadow: dark
                      ? "0 1px 2px rgba(255,255,255,0.45)"
                      : "0 1px 3px rgba(0,0,0,0.55)",
                  }}
                >
                  {card.meta && (
                    <p className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
                      {card.meta}
                    </p>
                  )}
                  <p className="m-0 text-[16px] font-semibold leading-tight">
                    {card.title}
                  </p>
                  {card.detail && (
                    <p className="m-0 mt-1 text-[13px] leading-[1.35] opacity-75">
                      {card.detail}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {paged && (
        <>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous gig"
              className="fan-nav"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              {cards.map((card, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCenter(i)}
                  aria-label={`Show ${card.title}`}
                  aria-current={i === center}
                  className="group grid h-6 w-3 place-items-center"
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all duration-300",
                      i === center
                        ? "scale-[1.4] bg-[#0adeff]"
                        : "bg-foreground/20 group-hover:bg-foreground/45",
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next gig"
              className="fan-nav"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <p aria-live="polite" className="sr-only">
            {`${current.title}, ${Math.round(center) + 1} of ${total}`}
          </p>
        </>
      )}
    </div>
  );
}
