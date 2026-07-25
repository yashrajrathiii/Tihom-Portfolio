/** A soft, blurred gradient orb — decorative section glow. */
export function Orb({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-[90px] ${className}`}
      style={style}
    />
  );
}
