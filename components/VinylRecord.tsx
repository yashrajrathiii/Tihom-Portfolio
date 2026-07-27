import type { CSSProperties } from "react";

/**
 * A 12" record, drawn in CSS: grooved black disc wrapped around a centre label
 * carrying the sleeve art. The disc spins; the sheen stays put, so the
 * highlight reads as a fixed light source rather than turning with the record.
 *
 * `ring`, `label` and `glow` ride in as custom properties so each record in the
 * orbit can wear its own colourway without a class per genre.
 */
export function VinylRecord({
  size,
  cover,
  ring,
  label,
  glow,
  className = "",
}: {
  /** Any CSS length — usually a clamp() so the disc scales with the orbit. */
  size: string;
  /** Sleeve art for the centre label. Without one the label falls back to
   *  its gradient and the spindle hole shows through. */
  cover?: string;
  /** Gradient for the outer rim. Defaults to the dark vinyl edge. */
  ring?: string;
  /** Gradient for the centre label, used when there is no cover. */
  label?: string;
  /** Colour of the drop shadow, tinted per genre. */
  glow?: string;
  className?: string;
}) {
  return (
    <div
      className={`vinyl-ring ${className}`}
      style={
        {
          width: size,
          height: size,
          "--ring-grad": ring,
          "--label-grad": label,
          "--ring-glow": glow,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="vinyl-gap">
        <div className="vinyl">
          <div className="vinyl-label">
            {cover && (
              // Decorative: the genre name is already a heading beneath the
              // record, so alt would only repeat it.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="vinyl-art" />
            )}
          </div>
          {!cover && <div className="vinyl-hole" />}
        </div>
        <div className="vinyl-sheen" />
      </div>
    </div>
  );
}
