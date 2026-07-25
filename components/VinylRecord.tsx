import type { CSSProperties } from "react";

/**
 * A 12" record, drawn in CSS: grooved black disc, gradient centre label and a
 * spindle hole, wrapped in a story-style gradient ring. The disc spins; the
 * ring and the sheen stay put, so the highlight reads as a fixed light source.
 *
 * `ring`, `label` and `glow` ride in as custom properties so each record in the
 * orbit can wear its own colourway without a class per genre.
 */
export function VinylRecord({
  size,
  ring,
  label,
  glow,
  className = "",
}: {
  /** Any CSS length — usually a clamp() so the disc scales with the orbit. */
  size: string;
  /** Gradient for the outer ring. Defaults to the brand accent sweep. */
  ring?: string;
  /** Gradient for the centre label. Defaults to the brand node gradient. */
  label?: string;
  /** Colour of the drop shadow, tinted to match the ring. */
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
          <div className="vinyl-label" />
          <div className="vinyl-hole" />
        </div>
        <div className="vinyl-sheen" />
      </div>
    </div>
  );
}
