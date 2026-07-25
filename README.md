# Tihom Portfolio

Single-page DJ portfolio built from the Claude Design handoff
(`dj-portfolio-website-design/project/Tihom Portfolio.dc.html`).

Next.js 16 (app router) + Tailwind v4. Statically prerendered.

```bash
npm run dev
```

## Editing content

All copy lives in [content/site.ts](content/site.ts) — bio, timeline, genres,
socials, and the bookings email. Nothing text-related needs a component edit.
Anything still marked `[Placeholder]` is filler carried over from the design.

## Gallery

The six tiles in section 04 render styled empty slots with captions. To drop in
real media, put the file under `public/` and set the tile's `src` in
`content/site.ts`:

```ts
feature: { caption: "Set video / live recording", src: "/assets/set-2025.mp4" },
```

The feature tile renders as a looping muted video; the rest render as images.

## Structure

- [app/page.tsx](app/page.tsx) — all six content sections
- [components/Hero.tsx](components/Hero.tsx) — video background, masked
  wordmark, and the scroll parallax (background zooms, foreground lifts and fades)
- [app/globals.css](app/globals.css) — palette and the entrance animation

Design assets (`hero-bg.mp4`, the wordmark) live in `public/assets/`.
