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
 * A halo tint per record, pulled from the dominant colour of the sleeve it
 * carries, so the glow under each disc echoes its art. Order follows
 * `genres.primary`. The rims stay black — a real record's edge is vinyl, and
 * the covers bring all the colour these need.
 */
const SKINS = [
  // Techno — ARTBAT, the blue portal.
  { glow: "rgba(10, 222, 255, 0.32)" },
  // Hard Tech — Ben Nicky, the acid yellow X.
  { glow: "rgba(214, 224, 40, 0.3)" },
  // Psy — Astrix, the psychedelic jungle.
  { glow: "rgba(88, 190, 70, 0.32)" },
  // BollyTech — Fake Tattoos, the teal rain.
  { glow: "rgba(28, 190, 200, 0.32)" },
  // Afro House — the red extinguisher.
  { glow: "rgba(230, 40, 15, 0.34)" },
  // House — the black-and-white crowd shot.
  { glow: "rgba(237, 239, 243, 0.22)" },
];

/** Genres as records orbiting the one thing that isn't a genre. */
export function GenreOrbit({
  items,
  center,
}: {
  items: { name: string; cover?: string }[];
  center: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLLIElement | null)[]>([]);
  const angleRef = useRef(-90);
  const pausedRef = useRef(false);

  const count = items.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Drop refs left behind by removed genres. React nulls the slot but never
    // shortens the array, so without this a deleted genre keeps its share of
    // the circle and the ring is left with a gap where it used to be.
    nodesRef.current.length = count;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = () => {
      const r = wrap.clientWidth * RADIUS;
      // Spacing comes from how many genres there are, not from how many ref
      // slots happen to exist.
      const n = count || 1;
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
  }, [count]);

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
          className="orbit-halo absolute inset-0 rounded-full border border-[rgba(10,222,255,0.35)]"
        />
        <span
          aria-hidden="true"
          className="orbit-halo absolute inset-0 rounded-full border border-[rgba(203,21,49,0.4)]"
          style={{ animationDelay: "1.8s" }}
        />
        {/* h3 under the section's own h2, now that the orbit shares the bio's
            section rather than heading one of its own. */}
        <h3 className="text-accent relative text-[clamp(16px,1.6vw,23px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
          {center}
        </h3>
      </div>

      <ul className="contents">
        {items.map((g, i) => (
          // The box is the record alone, with the name hung off the bottom, so
          // its centre is the disc's centre — otherwise the depth scale would
          // pull each record off the circle by a different amount.
          <li
            // Keyed by position, not name: a record's identity here *is* its
            // slot on the ring, and two freshly-added genres both start with a
            // blank name, which would collide as keys.
            key={i}
            ref={(el) => {
              nodesRef.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ width: DISC, height: DISC }}
          >
            <VinylRecord
              size="100%"
              cover={g.cover}
              {...SKINS[i % SKINS.length]}
            />
            <h4 className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[clamp(11px,1.05vw,15px)] font-bold uppercase tracking-[0.1em] text-foreground">
              {g.name}
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}
