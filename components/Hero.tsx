"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroRipple } from "@/components/HeroRipple";
import type { SiteContent } from "@/content/schema";

/** Distance the wordmark sits below its natural baseline, in px. */
const LOGO_SHIFT_Y = 30;
const LOGO_COLOR = "#EDEFF3";

export function Hero({
  hero,
  nav,
}: {
  hero: SiteContent["hero"];
  nav: SiteContent["nav"];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Background zooms and foreground lifts/fades as the hero scrolls away.
  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const inner = innerRef.current;
    if (!root || !bg || !inner) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const h = root.offsetHeight || window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / h));
      bg.style.transform = `scale(${1 + p * 0.28})`;
      inner.style.transform = `translateY(${-p * 90}px)`;
      inner.style.opacity = String(1 - p * 0.85);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          transformOrigin: "center 40%",
          // Cinematic grade: firm the contrast, warm the saturation, drop the
          // brightness a touch so the AI footage reads as shot, not stock.
          filter: "contrast(1.06) saturate(1.08) brightness(0.96)",
        }}
      >
        <HeroRipple />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.78))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(circle at 30% 18%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      {/* Cinematic vignette — pulls the eye to the subject (~42% down, matching
          the video's focal point) and hides the flat frame corners. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 105% at 50% 42%, transparent 52%, rgba(0,0,0,0.28) 82%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Hero-local dither — breaks up the banding the dark bottom gradient
          leaves on 8-bit displays behind the wordmark. */}
      <div className="hero-dither pointer-events-none absolute inset-0" />

      <nav className="absolute left-1/2 top-0 z-3 -translate-x-1/2">
        <div
          className="flex items-center gap-5 rounded-b-[22px] border border-t-0 border-white/18 px-5 py-3.5 backdrop-blur-[18px] backdrop-saturate-[160%] sm:gap-[38px] sm:px-[34px]"
          style={{
            background: "rgba(255,255,255,0.12)",
            boxShadow:
              "inset 0 -1px 0 rgba(255,255,255,0.22), 0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] tracking-[0.01em] text-[rgba(237,239,243,0.78)] sm:text-[14px]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div
        ref={innerRef}
        className="absolute inset-x-0 bottom-0 z-2 px-[clamp(24px,4vw,64px)] pb-10 will-change-[transform,opacity]"
      >
        <div className="grid items-end gap-11 md:grid-cols-[1.35fr_1fr]">
          <div>
            <div
              role="img"
              aria-label={hero.name}
              className="tihom-rise"
              style={{
                width: "min(800px, 54vw)",
                aspectRatio: "885 / 267",
                // Bleed the wordmark past the container padding to the viewport
                // left edge.
                marginLeft: "calc(0px - clamp(24px, 4vw, 64px))",
                marginBottom: `${-LOGO_SHIFT_Y}px`,
                background: LOGO_COLOR,
                WebkitMaskImage: "url('/assets/tihom-logo.png')",
                maskImage: "url('/assets/tihom-logo.png')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
                filter: "drop-shadow(0 4px 30px rgba(0,0,0,0.6))",
              }}
            />
          </div>

          <div className="flex flex-col gap-6 pb-[26px]">
            <p
              className="tihom-rise m-0 text-[clamp(15px,1.15vw,18px)] leading-[1.35] text-[rgba(237,239,243,0.82)]"
              style={{ animationDelay: "0.15s" }}
            >
              {hero.tagline}
            </p>
            <Button
              asChild
              style={{
                animationDelay: "0.28s",
                // Inline background/shadow override the shadcn variant's solid
                // fill (and its hover) with the hero's glass treatment.
                background: "rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.3)",
              }}
              className="tihom-rise group relative h-12 w-fit cursor-pointer self-start overflow-hidden rounded-full border border-white/22 p-1 ps-6 pe-14 text-sm font-medium text-foreground backdrop-blur-[18px] backdrop-saturate-[160%] transition-all duration-500 hover:ps-14 hover:pe-6"
            >
              <a href={hero.cta.href}>
                <span className="relative z-10 transition-all duration-500">
                  {hero.cta.label}
                </span>
                <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/18 text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </div>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
