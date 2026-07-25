"use client";

import { useEffect, useRef } from "react";
import { VinylRecord } from "./VinylRecord";

/** Ring radius as a fraction of the container width. */
const RADIUS = 0.35;
/** Degrees per second — one lap takes just under a minute. */
const SPEED = 7;
/** Record diameter. */
const DISC = "clamp(50px, 9vw, 112px)";
/** Diameter of the centre disc. */
const CORE = "clamp(112px, 17vw, 168px)";

/**
 * A colourway per record — ring, centre label and shadow tint. Every stop is
 * mixed from the brand palette (Prussian, Forest, Ash Brown, Gold), pushed a
 * little warmer or cooler so no two records read the same. Order follows
 * `genres.primary`, so each one is tuned to its genre.
 */
const SKINS = [
  // Techno — cold steel blue into gold.
  {
    ring: "linear-gradient(140deg, #011638 0%, #17516e 52%, #deb72b 100%)",
    label: "linear-gradient(135deg, #011638, #3d8ba8)",
    glow: "rgba(1, 22, 56, 0.3)",
  },
  // Hard Techno — the darkest of the set, plum through Prussian.
  {
    ring: "linear-gradient(140deg, #3f2555 0%, #011638 55%, #b98ad6 100%)",
    label: "linear-gradient(135deg, #3f2555, #9a72c4)",
    glow: "rgba(63, 37, 85, 0.32)",
  },
  // Psy — acid green, the loudest colourway.
  {
    ring: "linear-gradient(140deg, #005200 0%, #4f9a1e 50%, #cfe36a 100%)",
    label: "linear-gradient(135deg, #005200, #a3d54a)",
    glow: "rgba(0, 82, 0, 0.3)",
  },
  // BollyTech — marigold and rose, the most ornamental.
  {
    ring: "linear-gradient(140deg, #b8341f 0%, #deb72b 55%, #f0d98a 100%)",
    label: "linear-gradient(135deg, #b8341f, #deb72b)",
    glow: "rgba(184, 52, 31, 0.28)",
  },
  // Afro House — clay and amber, straight off the Ash Brown token.
  {
    ring: "linear-gradient(140deg, #766153 0%, #c98a3c 52%, #deb72b 100%)",
    label: "linear-gradient(135deg, #8a5a2b, #e6c15a)",
    glow: "rgba(118, 97, 83, 0.32)",
  },
  // House — the house pairing: forest into gold.
  {
    ring: "linear-gradient(140deg, #deb72b 0%, #8a9c2f 48%, #005200 100%)",
    label: "linear-gradient(135deg, #005200, #deb72b)",
    glow: "rgba(0, 82, 0, 0.26)",
  },
];

/** Genres as records orbiting the one thing that isn't a genre. */
export function GenreOrbit({
  items,
  center,
}: {
  items: string[];
  center: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLLIElement | null)[]>([]);
  const angleRef = useRef(-90);
  const pausedRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = () => {
      const r = wrap.clientWidth * RADIUS;
      const n = nodesRef.current.length || 1;
      nodesRef.current.forEach((el, i) => {
        if (!el) return;
        const rad = (((i / n) * 360 + angleRef.current) * Math.PI) / 180;
        const sin = Math.sin(rad);
        // Just enough size and opacity drift to keep the ring from reading as
        // a flat sticker — the lower half is the near side.
        const depth = (sin + 1) / 2;
        el.style.transform =
          `translate(-50%, -50%) translate(${(Math.cos(rad) * r).toFixed(2)}px, ` +
          `${(sin * r).toFixed(2)}px) scale(${(0.95 + depth * 0.1).toFixed(3)})`;
        el.style.zIndex = String(Math.round(100 + 60 * sin));
        el.style.opacity = (0.85 + depth * 0.15).toFixed(3);
      });
    };

    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      const dt = last ? t - last : 0;
      last = t;
      if (!pausedRef.current) {
        angleRef.current = (angleRef.current + (dt / 1000) * SPEED) % 360;
      }
      place();
      raf = requestAnimationFrame(frame);
    };

    place();
    if (!reduce) raf = requestAnimationFrame(frame);
    window.addEventListener("resize", place);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
    };
  }, [items.length]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[720px]"
      onPointerEnter={() => {
        pausedRef.current = true;
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* The path the records travel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line-strong"
        style={{ width: `${RADIUS * 200}%`, height: `${RADIUS * 200}%` }}
      />

      <div
        className="orbit-core absolute left-1/2 top-1/2 z-[120] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-5 text-center"
        style={{ width: CORE, height: CORE }}
      >
        {/* Light sweeping around the disc, the way it would across lacquer. */}
        <span aria-hidden="true" className="orbit-core-sweep" />
        <span
          aria-hidden="true"
          className="orbit-halo absolute inset-0 rounded-full border border-[rgba(0,82,0,0.35)]"
        />
        <span
          aria-hidden="true"
          className="orbit-halo absolute inset-0 rounded-full border border-[rgba(222,183,43,0.35)]"
          style={{ animationDelay: "1.8s" }}
        />
        {/* h3 under the section's own h2, now that the orbit shares the bio's
            section rather than heading one of its own. */}
        <h3 className="text-warm relative text-[clamp(16px,1.6vw,23px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
          {center}
        </h3>
      </div>

      <ul className="contents">
        {items.map((g, i) => (
          // The box is the record alone, with the name hung off the bottom, so
          // its centre is the disc's centre — otherwise the depth scale would
          // pull each record off the circle by a different amount.
          <li
            key={g}
            ref={(el) => {
              nodesRef.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ width: DISC, height: DISC }}
          >
            <VinylRecord size="100%" {...SKINS[i % SKINS.length]} />
            <h4 className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[clamp(11px,1.05vw,15px)] font-bold uppercase tracking-[0.1em] text-foreground">
              {g}
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}
