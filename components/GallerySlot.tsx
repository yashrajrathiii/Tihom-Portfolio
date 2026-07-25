/**
 * A gallery tile. With `src` it renders the media; without one it renders the
 * styled empty slot from the design, captioned so it's obvious what belongs there.
 */
export function GallerySlot({
  src,
  caption,
  video = false,
}: {
  src?: string;
  caption: string;
  video?: boolean;
}) {
  if (src) {
    return video ? (
      <video
        src={src}
        muted
        loop
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />
    ) : (
      // Gallery art is user-supplied and unsized; plain <img> avoids forcing
      // dimensions we don't know.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={caption} className="h-full w-full object-cover" />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center border border-dashed border-line-strong/70 px-4 text-center">
      <span className="text-[13px] tracking-[0.04em] text-muted">{caption}</span>
    </div>
  );
}
