/** WhatsApp mark, drawn in the same accent gradient as the Instagram one. */
export function WhatsappGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="wa-accent"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0adeff" />
          <stop offset="1" stopColor="#cb1531" />
        </linearGradient>
      </defs>
      {/* Speech bubble with the tail at the bottom-left, as the mark has it. */}
      <path
        d="M3.2 20.8l1.3-4.7a8.4 8.4 0 1 1 3.4 3.3L3.2 20.8z"
        stroke="url(#wa-accent)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* The handset inside. */}
      <path
        d="M9.1 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3-.1.6.2.5.7 1.2 1.2 1.7.6.5 1.1.8 1.6.9.2.1.4 0 .5-.1l.5-.5c.2-.2.4-.2.6-.1l1.6.8c.3.2.4.3.4.5v.6c-.1.4-.3.8-.7 1-.4.2-.9.3-1.4.2-1.3-.2-2.7-1-3.9-2.2-1.2-1.2-2-2.6-2.3-3.8-.1-.5 0-1.1.2-1.5l.4-1.2z"
        fill="url(#wa-accent)"
      />
    </svg>
  );
}
