/** Instagram mark drawn in the warm accent gradient. */
export function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="ig-warm"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#005200" />
          <stop offset="1" stopColor="#deb72b" />
        </linearGradient>
      </defs>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="url(#ig-warm)"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.2" stroke="url(#ig-warm)" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.25" fill="url(#ig-warm)" />
    </svg>
  );
}
