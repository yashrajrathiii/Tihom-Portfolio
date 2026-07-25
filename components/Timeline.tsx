"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";

export type Milestone = {
  year: string;
  /** Small label under the year — used to pin the recent months to 2026. */
  sub?: string;
  title: string;
  desc: string;
};

/** Where the head of the rail sits in the viewport, as a fraction of its
 *  height. Lower = the rail draws earlier as the list comes up the screen. */
const HEAD_LINE = 0.72;

/** Fades the rail out at both ends so it never stops on a hard edge. */
const RAIL_MASK =
  "linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)";

/** Comet trail: bright gold head at the growing edge, fading up the rail. */
const RAIL_FILL =
  "linear-gradient(to top, #deb72b 0%, #005200 12%, rgba(0,82,0,0) 100%)";

/** Sized so the longest milestone still fits on one line at every width — a
 *  wrap would break out of the fixed-height rolling window. */
const TITLE =
  "whitespace-nowrap text-[clamp(18px,3.2vw,52px)] font-extrabold uppercase leading-none tracking-[-0.035em]";

/** Milestones as rolling headlines, on a rail that draws itself on scroll. */
export function Timeline({ items }: { items: Milestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    if (!container || !fill) return;

    // No scroll choreography for readers who asked for less motion — show the
    // rail already drawn.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.height = "100%";
      fill.style.opacity = "1";
      nodesRef.current.forEach((node) => {
        if (node) node.dataset.lit = "true";
      });
      return;
    }

    let frame = 0;
    const apply = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // The head tracks a fixed reading line in the viewport, so the rail
      // starts drawing the moment the list crosses it on the way up and is
      // fully drawn while the last milestone is still on screen.
      const filled = Math.min(
        rect.height,
        Math.max(0, vh * HEAD_LINE - rect.top),
      );
      fill.style.height = `${filled}px`;
      fill.style.opacity = String(Math.min(1, filled / 36));

      // A node lights up once the head of the rail has passed its centre.
      const head = rect.top + filled;
      nodesRef.current.forEach((node) => {
        if (!node) return;
        const n = node.getBoundingClientRect();
        node.dataset.lit = n.top + n.height / 2 <= head + 6 ? "true" : "false";
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="pointer-events-none absolute bottom-0 left-[3px] top-0 w-px -translate-x-1/2 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--line-strong), transparent)",
          WebkitMaskImage: RAIL_MASK,
          maskImage: RAIL_MASK,
        }}
      >
        <div
          ref={fillRef}
          className="absolute inset-x-0 top-0 rounded-full"
          style={{ height: 0, opacity: 0, background: RAIL_FILL }}
        />
      </div>

      {items.map((m, i) => (
        <Reveal key={i} delay={i * 70}>
          <div className="group relative border-b border-line py-6 pl-8 last:border-b-0 md:pl-12 lg:pr-[352px] xl:pr-[448px] 2xl:pr-[496px]">
            <span
              ref={(el) => {
                nodesRef.current[i] = el;
              }}
              data-lit="false"
              className="tl-node absolute left-[3px] top-1/2 h-3 w-3 rounded-full"
              style={{ background: "var(--grad-node)" }}
            />

            <div className="flex items-center gap-5 md:gap-10">
              <div className="w-[clamp(56px,7vw,96px)] shrink-0 text-right">
                <div className="text-warm text-[clamp(15px,1.4vw,21px)] font-bold leading-none tracking-[-0.02em]">
                  {m.year}
                </div>
                {m.sub && (
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {m.sub}
                  </div>
                )}
              </div>

              {/* Rolling headline: the plain cut rolls up to an italic accent
                  cut on hover. The second copy is decorative. */}
              <div className="relative h-[46px] flex-1 overflow-hidden lg:h-[76px]">
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
                  <div className="flex h-[46px] items-center lg:h-[76px]">
                    <h3 className={`${TITLE} text-foreground`}>{m.title}</h3>
                  </div>
                  <div
                    aria-hidden="true"
                    className="flex h-[46px] items-center lg:h-[76px]"
                  >
                    {/* The trailing padding is load-bearing: background-clip
                        paints only inside the box, so an italic glyph's
                        overhang would otherwise render transparent and clip
                        the last letter. */}
                    <span className={`${TITLE} text-warm pr-[0.14em] italic`}>
                      {m.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description — always on at narrow widths, where there is no
                hover and no room for the card. */}
            <p className="mt-3 text-[16px] leading-[1.55] text-foreground/60 lg:hidden">
              {m.desc}
            </p>

            {/* …and swinging in from the right on hover above it. */}
            <div
              aria-hidden="true"
              className="tl-card pointer-events-none absolute right-0 top-1/2 z-20 hidden w-[320px] translate-x-4 -translate-y-1/2 rotate-2 scale-95 rounded-[22px] p-6 opacity-0 shadow-[0_22px_54px_rgba(1,22,56,0.14)] transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 lg:block xl:w-[416px] xl:p-8 2xl:w-[456px]"
            >
              <div
                className="mb-4 h-1 w-12 rounded-full"
                style={{ background: "var(--grad-node)" }}
              />
              <p className="text-[clamp(16px,1.35vw,21px)] leading-[1.5] text-foreground/80">
                {m.desc}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
